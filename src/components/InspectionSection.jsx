import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import {
  Sparkles,
  RotateCw,
  Heart,
  Ruler,
  ScanFace,
  Camera,
  Check,
  ShoppingBag,
  Layers
} from 'lucide-react';
import { formatYen } from '../data/products';
import Garment3DModel from './Garment3DModel';

/**
 * Palco 3D interativo de inspeção + exposição de snapshot PNG real da peça 3D
 */
function InspectableSculptedGarment({
  product,
  targetRotationY,
  autoSpin,
  zoomFabric,
  onRegisterCapture
}) {
  const { gl, scene, camera } = useThree();
  const groupRef = useRef();
  const isDraggingRef = useRef(false);
  const prevPointerXRef = useRef(0);
  const manualRotRef = useRef(0);

  useEffect(() => {
    manualRotRef.current = targetRotationY;
  }, [targetRotationY, product.id]);

  // Registra função que captura um PNG limpo de alta resolução da peça 3D ativa
  useEffect(() => {
    if (!onRegisterCapture) return;
    onRegisterCapture(() => {
      try {
        // Renderiza o frame atual com fundo branco limpo para máxima clareza no Gemini
        const prevBg = scene.background;
        const prevRot = groupRef.current ? groupRef.current.rotation.y : 0;
        if (groupRef.current) {
          groupRef.current.rotation.y = 0.14; // ângulo frontal leve em 3/4 mostrando volume 3D
        }
        scene.background = new THREE.Color('#FAF7F3');
        gl.render(scene, camera);
        const dataUrl = gl.domElement.toDataURL('image/png');
        scene.background = prevBg;
        if (groupRef.current) {
          groupRef.current.rotation.y = prevRot;
        }
        gl.render(scene, camera);
        return dataUrl;
      } catch {
        return null;
      }
    });
  }, [gl, scene, camera, onRegisterCapture, product.id]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    if (autoSpin && !isDraggingRef.current) {
      manualRotRef.current += delta * 0.95;
    }

    const desiredRotY = manualRotRef.current + (autoSpin ? 0 : Math.sin(t * 0.75) * 0.12);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      desiredRotY,
      Math.min(1, delta * 6.5)
    );
    groupRef.current.position.y = Math.sin(t * 1.4) * 0.06;

    const targetScale = zoomFabric ? 1.32 : 1.08;
    const s = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      targetScale,
      Math.min(1, delta * 5.5)
    );
    groupRef.current.scale.setScalar(s);
  });

  return (
    <>
      <ambientLight intensity={0.82} />
      <directionalLight position={[4, 7, 6]} intensity={1.7} color="#FFFBF4" castShadow />
      <directionalLight position={[-5, 3, -4]} intensity={1.05} color="#F3E2D0" />
      <spotLight position={[0, 6, -6]} intensity={1.1} angle={0.6} penumbra={0.8} />
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={2.4}
          position={[0, 5, 4]}
          scale={[8, 4, 1]}
          color="#FFF9F0"
        />
        <Lightformer
          form="ring"
          intensity={1.6}
          position={[-4, 2, 2]}
          scale={4}
          color="#F7DFC6"
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          position={[4, 0, -4]}
          scale={[5, 5, 1]}
          color="#FFFFFF"
        />
      </Environment>

      <group
        ref={groupRef}
        onPointerDown={(e) => {
          e.stopPropagation();
          isDraggingRef.current = true;
          prevPointerXRef.current = e.clientX;
        }}
        onPointerMove={(e) => {
          if (!isDraggingRef.current) return;
          const dx = e.clientX - prevPointerXRef.current;
          prevPointerXRef.current = e.clientX;
          manualRotRef.current += dx * 0.014;
        }}
        onPointerUp={() => {
          isDraggingRef.current = false;
        }}
        onPointerLeave={() => {
          isDraggingRef.current = false;
        }}
      >
        <Garment3DModel product={product} animateBreathe={false} />
      </group>

      <ContactShadows
        position={[0, -1.65, 0]}
        opacity={0.34}
        scale={7}
        blur={2.2}
        far={4}
        color="#181615"
      />
    </>
  );
}

export default function InspectionSection({
  product,
  isFavorite,
  onToggleFavorite,
  selectedSize,
  onSelectSize,
  onAddToCart,
  onOpenTryOn,
  onRegisterSnapshot
}) {
  const [activeTab, setActiveTab] = useState('fabric');
  const [rotationY, setRotationY] = useState(0);
  const [autoSpin, setAutoSpin] = useState(false);
  const [zoomFabric, setZoomFabric] = useState(false);

  useEffect(() => {
    setRotationY(0);
    setAutoSpin(false);
    setZoomFabric(false);
  }, [product.id]);

  const handleFabricClick = () => {
    setActiveTab('fabric');
    setAutoSpin(false);
    setRotationY(0.28);
    setZoomFabric((z) => !z);
  };

  const handleSpin360Click = () => {
    setActiveTab('spin');
    setZoomFabric(false);
    if (!autoSpin && Math.abs(rotationY % (Math.PI * 2)) < 0.5) {
      setRotationY((r) => r + Math.PI);
    } else if (!autoSpin) {
      setAutoSpin(true);
    } else {
      setAutoSpin(false);
      setRotationY(0);
    }
  };

  const handleSizesClick = () => {
    setActiveTab('sizes');
    setZoomFabric(false);
  };

  const showingBack =
    Math.round(Math.abs(rotationY / Math.PI)) % 2 === 1 && !autoSpin;

  return (
    <section
      id="detalhes"
      className="relative min-h-screen w-full overflow-hidden py-24 sm:py-32 transition-colors duration-700"
      style={{
        background: `linear-gradient(180deg, ${product.colorSoft} 0%, #F7F4F0 46%, #F7F4F0 100%)`
      }}
    >
      {/* Tipografia Gigante Vazada Jovem Urbana ("NEW DROP", "STREET LUXE", "FIT CHECK", "ZARA VIBES") */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between overflow-hidden py-14 select-none">
        <div className="whitespace-nowrap font-display text-[15vw] sm:text-[11vw] font-extrabold uppercase leading-none tracking-[-0.04em] text-outline-accent -ml-6">
          {product.hollowBgTop}
        </div>
        <div className="whitespace-nowrap text-right font-display text-[14vw] sm:text-[10.5vw] font-extrabold uppercase leading-none tracking-[-0.04em] text-outline-accent -mr-6">
          {product.hollowBgBottom}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-[#8C7554]">
              FIT CHECK 360° • ESCULTURA 3D REAL • {product.sku}
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.02em] text-[#181615]">
              {product.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#181615]">
              {formatYen(product.price)}
            </span>
            <span className="rounded-full border border-[#181615]/15 bg-white/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#181615]/75">
              Drop Limitado JP
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Palco 3D Esculpido — Apenas a peça flutuando limpa no espaço */}
          <div className="lg:col-span-6 relative">
            <div
              className="relative h-[470px] sm:h-[580px] w-full rounded-[2rem] border border-white/80 shadow-[0_28px_70px_-28px_rgba(24,22,21,0.22)] overflow-hidden cursor-grab active:cursor-grabbing"
              style={{
                background: `radial-gradient(circle at 50% 44%, #FFFFFF 0%, ${product.colorSoft} 68%, ${product.bgTint} 100%)`
              }}
            >
              <div className="pointer-events-none absolute top-5 left-5 z-10 flex items-center gap-2 rounded-full bg-[#F7F4F0]/85 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#181615]/80 backdrop-blur-md">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: product.color }}
                />
                <span>
                  {autoSpin
                    ? 'Rotação 360° Ativa'
                    : showingBack
                    ? 'Costas • Costura & Etiqueta'
                    : zoomFabric
                    ? 'Close • Textura & Relevo'
                    : 'Arraste para girar 360°'}
                </span>
              </div>

              <Canvas
                shadows
                camera={{ position: [0, 0.08, 4.4], fov: 40 }}
                dpr={[1, 2]}
                gl={{
                  alpha: true,
                  antialias: true,
                  preserveDrawingBuffer: true
                }}
              >
                <InspectableSculptedGarment
                  product={product}
                  targetRotationY={rotationY}
                  autoSpin={autoSpin}
                  zoomFabric={zoomFabric}
                  onRegisterCapture={onRegisterSnapshot}
                />
              </Canvas>

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full border border-[#181615]/10 bg-[#F7F4F0]/90 p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => {
                    setAutoSpin(false);
                    setRotationY(0);
                  }}
                  className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition-all ${
                    !showingBack && !autoSpin
                      ? 'bg-[#181615] text-[#F7F4F0]'
                      : 'text-[#181615]/70 hover:text-[#181615]'
                  }`}
                >
                  Frente
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAutoSpin(false);
                    setRotationY(Math.PI * 0.5);
                  }}
                  className="rounded-full px-3 py-1 text-[11px] font-bold text-[#181615]/70 hover:text-[#181615]"
                >
                  Perfil
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAutoSpin(false);
                    setRotationY(Math.PI);
                  }}
                  className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition-all ${
                    showingBack
                      ? 'bg-[#181615] text-[#F7F4F0]'
                      : 'text-[#181615]/70 hover:text-[#181615]'
                  }`}
                >
                  Costas
                </button>
                <button
                  type="button"
                  onClick={() => setAutoSpin((s) => !s)}
                  className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition-all ${
                    autoSpin
                      ? 'bg-[#181615] text-[#F7F4F0]'
                      : 'text-[#181615]/70 hover:text-[#181615]'
                  }`}
                >
                  360°
                </button>
              </div>
            </div>
          </div>

          {/* Controles à Direita */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="glass-panel rounded-[1.75rem] p-6 sm:p-7 shadow-[0_20px_55px_-28px_rgba(24,22,21,0.16)]">
              {activeTab === 'sizes' ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8C7554]">
                        FIT CHECK • MODELAGEM URBANA
                      </span>
                      <h3 className="font-display text-2xl font-extrabold uppercase text-[#181615]">
                        Guia de Tamanhos
                      </h3>
                    </div>
                    <span className="rounded-full bg-[#181615] px-3 py-1 text-xs font-bold text-[#F7F4F0]">
                      Tam. {selectedSize}
                    </span>
                  </div>

                  <div className="mb-4 grid grid-cols-4 gap-2">
                    {['P', 'M', 'G', 'GG'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => onSelectSize(sz)}
                        className={`rounded-xl py-2.5 text-sm font-bold transition-all ${
                          selectedSize === sz
                            ? 'bg-[#181615] text-[#F7F4F0] shadow-md'
                            : 'border border-[#181615]/15 bg-white/80 text-[#181615] hover:border-[#181615]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#181615]/10 text-[10px] uppercase tracking-[0.2em] text-[#181615]/55">
                          <th className="py-2">Tam.</th>
                          <th className="py-2">Busto</th>
                          <th className="py-2">Cintura</th>
                          <th className="py-2">Quadril</th>
                          <th className="py-2">Comp.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#181615]/8">
                        {product.sizeGuide.map((row) => {
                          const active = row.size === selectedSize;
                          return (
                            <tr
                              key={row.size}
                              onClick={() => onSelectSize(row.size)}
                              className={`cursor-pointer transition-colors ${
                                active ? 'bg-[#181615]/8 font-bold' : 'hover:bg-white/60'
                              }`}
                            >
                              <td className="py-2.5 pl-1">{row.size}</td>
                              <td className="py-2.5">{row.bust}</td>
                              <td className="py-2.5">{row.waist}</td>
                              <td className="py-2.5">{row.hip}</td>
                              <td className="py-2.5">{row.length}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#181615]/8 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#181615]">
                    <Sparkles className="h-3 w-3 text-[#D47A6A]" />
                    {product.fabricTitle}
                  </span>

                  <h3 className="mt-3 font-display text-xl sm:text-2xl font-extrabold uppercase tracking-[-0.02em] text-[#181615]">
                    {product.fabricHeadline}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[#181615]/75">
                    {product.fabricDescription}
                  </p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#181615]/10 pt-4 text-xs">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#8C7554]">
                        Composição
                      </span>
                      <span className="mt-0.5 block font-medium text-[#181615]/85">
                        {product.composition}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#8C7554]">
                        Cuidados
                      </span>
                      <span className="mt-0.5 block font-medium text-[#181615]/85">
                        {product.care}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4 Botões de Inspeção */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleFabricClick}
                className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  activeTab === 'fabric'
                    ? 'border-[#181615] bg-[#181615] text-[#F7F4F0] shadow-md'
                    : 'border-[#181615]/12 bg-white/80 text-[#181615] hover:border-[#181615]/40'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    activeTab === 'fabric'
                      ? 'bg-white/15 text-[#D8C7B4]'
                      : 'bg-[#F7F4F0] text-[#181615]'
                  }`}
                >
                  <Layers className="h-5 w-5" />
                </span>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-[0.12em]">
                    Tecido & Textura
                  </span>
                  <span
                    className={`block text-[11px] ${
                      activeTab === 'fabric' ? 'text-[#F7F4F0]/70' : 'text-[#181615]/55'
                    }`}
                  >
                    {zoomFabric ? 'Close ativo • Clique p/ sair' : 'Ver caimento & relevo'}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleSpin360Click}
                className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  activeTab === 'spin' || showingBack || autoSpin
                    ? 'border-[#181615] bg-[#181615] text-[#F7F4F0] shadow-md'
                    : 'border-[#181615]/12 bg-white/80 text-[#181615] hover:border-[#181615]/40'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    activeTab === 'spin' || showingBack || autoSpin
                      ? 'bg-white/15 text-[#D8C7B4]'
                      : 'bg-[#F7F4F0] text-[#181615]'
                  }`}
                >
                  <RotateCw className={`h-5 w-5 ${autoSpin ? 'animate-spin' : ''}`} />
                </span>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-[0.12em]">
                    Caimento / 360°
                  </span>
                  <span
                    className={`block text-[11px] ${
                      activeTab === 'spin' || showingBack || autoSpin
                        ? 'text-[#F7F4F0]/70'
                        : 'text-[#181615]/55'
                    }`}
                  >
                    Frente, perfil e costas
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onToggleFavorite(product.id)}
                className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  isFavorite
                    ? 'border-[#D47A6A] bg-[#D47A6A]/15 text-[#181615]'
                    : 'border-[#181615]/12 bg-white/80 text-[#181615] hover:border-[#181615]/40'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isFavorite ? 'bg-[#D47A6A] text-white' : 'bg-[#F7F4F0] text-[#181615]'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </span>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-[0.12em]">
                    {isFavorite ? 'Salvo na Wishlist' : 'Favoritar Peça'}
                  </span>
                  <span className="block text-[11px] text-[#181615]/55">
                    {isFavorite ? 'Peça favoritada' : 'Guardar no seu drop'}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleSizesClick}
                className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  activeTab === 'sizes'
                    ? 'border-[#181615] bg-[#181615] text-[#F7F4F0] shadow-md'
                    : 'border-[#181615]/12 bg-white/80 text-[#181615] hover:border-[#181615]/40'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    activeTab === 'sizes'
                      ? 'bg-white/15 text-[#D8C7B4]'
                      : 'bg-[#F7F4F0] text-[#181615]'
                  }`}
                >
                  <Ruler className="h-5 w-5" />
                </span>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-[0.12em]">
                    Guia de Tamanhos
                  </span>
                  <span
                    className={`block text-[11px] ${
                      activeTab === 'sizes' ? 'text-[#F7F4F0]/70' : 'text-[#181615]/55'
                    }`}
                  >
                    P, M, G, GG • Tam. {selectedSize}
                  </span>
                </div>
              </button>
            </div>

            {/* 5) BOTÃO DE DESTAQUE: PROVAR EM MIM (IA) - PROVADOR VIRTUAL */}
            <button
              type="button"
              onClick={onOpenTryOn}
              className="btn-shimmer group relative flex w-full items-center justify-between gap-4 rounded-2xl border border-[#C9B290]/60 bg-[#181615] px-6 py-5 text-left text-[#F7F4F0] shadow-[0_22px_50px_-18px_rgba(24,22,21,0.55)] transition-all hover:-translate-y-0.5 hover:bg-[#24201E]"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#E295A8] via-[#D47A6A] to-[#D5C7B2] text-[#181615] shadow-inner">
                  <ScanFace className="h-6 w-6" />
                </span>
                <div>
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#D8C7B4]">
                    <Camera className="h-3.5 w-3.5" />
                    Gemini 2.5 Flash Image • Try-On Real
                  </span>
                  <span className="mt-0.5 block font-display text-sm sm:text-base font-extrabold uppercase tracking-[0.06em]">
                    PROVAR EM MIM (IA) — PROVADOR VIRTUAL
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center rounded-full border border-[#D8C7B4]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8C7B4] transition-transform group-hover:translate-x-1">
                Fit Check IA
              </span>
            </button>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#181615]/10 bg-white/70 px-5 py-3.5">
              <div className="flex items-center gap-2 text-xs text-[#181615]/75">
                <Check className="h-4 w-4 text-[#516858]" />
                <span>
                  Tamanho <strong className="text-[#181615]">{selectedSize}</strong> disponível no Drop
                </span>
              </div>
              <button
                type="button"
                onClick={() => onAddToCart(product, selectedSize)}
                className="inline-flex items-center gap-2 rounded-full bg-[#181615] px-4 py-2 text-xs font-bold text-[#F7F4F0] transition-all hover:bg-[#312B27]"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Adicionar • {formatYen(product.price)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
