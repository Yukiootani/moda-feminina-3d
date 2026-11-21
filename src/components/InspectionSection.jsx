import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  OrbitControls
} from '@react-three/drei';
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
  Layers,
  Tag
} from 'lucide-react';
import { formatYen, getProductImageUrl } from '../data/products';
import EditorialGarment3D from './EditorialGarment3D';

function RunwayInspectStage({
  product,
  frontUrl,
  backUrl,
  autoSpin,
  zoomFabric,
  parallax
}) {
  const stageRef = useRef();

  useFrame((state, delta) => {
    if (!stageRef.current) return;
    if (autoSpin) {
      stageRef.current.rotation.y += delta * 0.72;
    } else {
      stageRef.current.rotation.y = THREE.MathUtils.lerp(
        stageRef.current.rotation.y,
        (parallax?.x || 0) * 0.14,
        Math.min(1, delta * 4.5)
      );
    }

    const targetScale = zoomFabric ? 1.24 : 1.02;
    const s = THREE.MathUtils.lerp(
      stageRef.current.scale.x,
      targetScale,
      Math.min(1, delta * 5)
    );
    stageRef.current.scale.setScalar(s);
  });

  return (
    <>
      <ambientLight intensity={0.78} />
      <spotLight
        position={[0, 7.2, 5.5]}
        angle={0.5}
        penumbra={0.85}
        intensity={1.55}
        color="#FFF9F0"
        castShadow
      />
      <directionalLight position={[4, 5, 5]} intensity={0.55} color="#FFFBF4" />
      <directionalLight position={[-4, 3, -4]} intensity={0.4} color={product.colorSoft} />

      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={0.85}
          position={[0, 5, 4]}
          scale={[8, 4, 1]}
          color="#FFF9F0"
        />
        <Lightformer
          form="ring"
          intensity={0.55}
          position={[-4, 2, 2]}
          scale={4}
          color="#F7DFC6"
        />
      </Environment>

      {/* Modelo de corpo inteiro em relevo 3D + pedestal circular */}
      <group ref={stageRef} position={[0, 0.12, 0]}>
        <EditorialGarment3D
          frontUrl={frontUrl}
          backUrl={backUrl}
          accentColor={product.color}
          width={2.55}
          height={3.4}
          showPedestal={true}
          isHighlighted={true}
          parallax={parallax}
        />
      </group>

      {/* Piso reflexivo do palco de inspeção */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.78, 0]}
        receiveShadow
      >
        <planeGeometry args={[18, 18]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={0.9}
          mixStrength={0.44}
          roughness={0.8}
          depthScale={0.4}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={product.colorSoft}
          metalness={0.08}
          mirror={0.34}
        />
      </mesh>

      <ContactShadows
        position={[0, -1.76, 0]}
        opacity={0.4}
        scale={7.5}
        blur={2.1}
        far={4.5}
        color="#181615"
      />

      {/* OrbitControls 3D suave para girar e dar zoom no look */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3.3}
        maxDistance={6.6}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 2.02}
        dampingFactor={0.06}
        enableDamping
      />
    </>
  );
}

export default function InspectionSection({
  product,
  customPhotos,
  isFavorite,
  onToggleFavorite,
  selectedSize,
  onSelectSize,
  onAddToCart,
  onOpenTryOn
}) {
  // 'fabric' | 'sizes' | 'label' (Costas & Etiqueta apenas como aba secundária limpa)
  const [activeTab, setActiveTab] = useState('fabric');
  const [autoSpin, setAutoSpin] = useState(false);
  const [zoomFabric, setZoomFabric] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setAutoSpin(false);
    setZoomFabric(false);
  }, [product.id]);

  const frontUrl = getProductImageUrl(product, 'front', customPhotos);
  const backUrl = getProductImageUrl(product, 'back', customPhotos);

  const handleFabricClick = () => {
    setActiveTab('fabric');
    setAutoSpin(false);
    setZoomFabric((z) => !z);
  };

  const handleSpin360Click = () => {
    setZoomFabric(false);
    setAutoSpin((s) => !s);
  };

  const handleSizesClick = () => {
    setActiveTab('sizes');
    setZoomFabric(false);
  };

  return (
    <section
      id="detalhes"
      onPointerMove={(e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        setParallax({ x: nx, y: ny });
      }}
      className="relative min-h-screen w-full overflow-hidden py-24 sm:py-32 transition-colors duration-700"
      style={{
        background: `linear-gradient(180deg, ${product.colorSoft} 0%, #F7F4F0 46%, #F7F4F0 100%)`
      }}
    >
      {/* Tipografia Gigante Vazada */}
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
              FIT CHECK 3D • PASSARELA INTERATIVA • {product.sku}
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
          {/* Palco 3D Real com OrbitControls, Piso Reflexivo e Pedestal Luminoso */}
          <div className="lg:col-span-6 relative">
            <div
              className="relative h-[500px] sm:h-[620px] w-full rounded-[2rem] border border-white/80 shadow-[0_28px_70px_-28px_rgba(24,22,21,0.22)] overflow-hidden cursor-grab active:cursor-grabbing"
              style={{
                background: `radial-gradient(circle at 50% 38%, #FFFFFF 0%, ${product.colorSoft} 66%, ${product.bgTint} 100%)`
              }}
            >
              <div className="pointer-events-none absolute top-5 left-5 z-10 flex items-center gap-2 rounded-full bg-[#F7F4F0]/88 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#181615]/80 backdrop-blur-md">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: product.color }}
                />
                <span>
                  {autoSpin
                    ? 'Passarela 360° Ativa'
                    : zoomFabric
                    ? 'Zoom nos Detalhes do Tecido'
                    : 'Arraste para Orbitar 3D • Scroll para Zoom'}
                </span>
              </div>

              <Canvas
                shadows
                camera={{ position: [0, 0.25, 5.15], fov: 40 }}
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true }}
              >
                <RunwayInspectStage
                  product={product}
                  frontUrl={frontUrl}
                  backUrl={backUrl}
                  autoSpin={autoSpin}
                  zoomFabric={zoomFabric}
                  parallax={parallax}
                />
              </Canvas>

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full border border-[#181615]/10 bg-[#F7F4F0]/90 p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => {
                    setAutoSpin(false);
                    setZoomFabric(false);
                  }}
                  className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition-all ${
                    !zoomFabric && !autoSpin
                      ? 'bg-[#181615] text-[#F7F4F0]'
                      : 'text-[#181615]/70 hover:text-[#181615]'
                  }`}
                >
                  Look Completo
                </button>
                <button
                  type="button"
                  onClick={() => setZoomFabric((z) => !z)}
                  className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition-all ${
                    zoomFabric
                      ? 'bg-[#181615] text-[#F7F4F0]'
                      : 'text-[#181615]/70 hover:text-[#181615]'
                  }`}
                >
                  Zoom Tecido
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
                  Girar 360°
                </button>
              </div>
            </div>
          </div>

          {/* Painel Interativo à Direita */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Cartão Editorial com Abas Limpas (Tecido | Tamanhos | Costas & Etiqueta) */}
            <div className="glass-panel rounded-[1.75rem] p-6 sm:p-7 shadow-[0_20px_55px_-28px_rgba(24,22,21,0.16)]">
              <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-[#181615]/10 pb-3">
                {[
                  { id: 'fabric', label: 'Tecido & Caimento' },
                  { id: 'sizes', label: 'Guia de Tamanhos' },
                  { id: 'label', label: 'Costas & Etiqueta' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#181615] text-[#F7F4F0]'
                        : 'bg-white/65 text-[#181615]/65 hover:text-[#181615]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'sizes' ? (
                <div>
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
              ) : activeTab === 'label' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-[#C9B290]/60 bg-[#FAF7F2] px-5 py-4">
                    <div>
                      <span className="block font-display text-base font-extrabold uppercase tracking-[0.18em] text-[#181615]">
                        HARUMI MODAS
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#8C7554]">
                        TOKYO • STREET LUXE • {product.sku}
                      </span>
                    </div>
                    <Tag className="h-5 w-5 text-[#8C7554]" />
                  </div>

                  <p className="text-sm leading-relaxed text-[#181615]/80">
                    {product.backDetails}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#181615]/10 pt-3 text-xs">
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
                  zoomFabric
                    ? 'border-[#181615] bg-[#181615] text-[#F7F4F0] shadow-md'
                    : 'border-[#181615]/12 bg-white/80 text-[#181615] hover:border-[#181615]/40'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    zoomFabric
                      ? 'bg-white/15 text-[#D8C7B4]'
                      : 'bg-[#F7F4F0] text-[#181615]'
                  }`}
                >
                  <Layers className="h-5 w-5" />
                </span>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-[0.12em]">
                    Tecido & Zoom
                  </span>
                  <span
                    className={`block text-[11px] ${
                      zoomFabric ? 'text-[#F7F4F0]/70' : 'text-[#181615]/55'
                    }`}
                  >
                    {zoomFabric ? 'Zoom ativo • Clique p/ sair' : 'Aproximar detalhes'}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleSpin360Click}
                className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  autoSpin
                    ? 'border-[#181615] bg-[#181615] text-[#F7F4F0] shadow-md'
                    : 'border-[#181615]/12 bg-white/80 text-[#181615] hover:border-[#181615]/40'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    autoSpin
                      ? 'bg-white/15 text-[#D8C7B4]'
                      : 'bg-[#F7F4F0] text-[#181615]'
                  }`}
                >
                  <RotateCw className={`h-5 w-5 ${autoSpin ? 'animate-spin' : ''}`} />
                </span>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-[0.12em]">
                    Passarela 360°
                  </span>
                  <span
                    className={`block text-[11px] ${
                      autoSpin ? 'text-[#F7F4F0]/70' : 'text-[#181615]/55'
                    }`}
                  >
                    {autoSpin ? 'Girando no pedestal' : 'Rotação espacial 3D'}
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

            {/* BOTÃO DE DESTAQUE: PROVAR EM MIM (IA) */}
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
                    IDM-VTON + CatVTON • Virtual Try-On Gratuito
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
