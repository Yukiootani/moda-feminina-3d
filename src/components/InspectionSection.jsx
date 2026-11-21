import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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
import { formatYen, getProductImageUrl } from '../data/products';

function InspectableGarment3D({ product, targetRotationY, autoSpin, zoomFabric }) {
  const groupRef = useRef();
  const isDraggingRef = useRef(false);
  const prevPointerXRef = useRef(0);
  const manualRotRef = useRef(0);

  const geometry = useMemo(() => new THREE.PlaneGeometry(2.65, 3.62, 28, 38), []);
  const basePositions = useMemo(
    () => Float32Array.from(geometry.attributes.position.array),
    [geometry]
  );

  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const frontTex = loader.load(getProductImageUrl(product, 'front'));
    const backTex = loader.load(getProductImageUrl(product, 'back'));
    [frontTex, backTex].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
    });
    return { frontTex, backTex };
  }, [product]);

  useEffect(() => {
    manualRotRef.current = targetRotationY;
  }, [targetRotationY, product.id]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    if (autoSpin && !isDraggingRef.current) {
      manualRotRef.current += delta * 0.85;
    }

    const desiredRotY = manualRotRef.current + (autoSpin ? 0 : Math.sin(t * 0.8) * 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      desiredRotY,
      Math.min(1, delta * 6.5)
    );
    groupRef.current.position.y = Math.sin(t * 1.45) * 0.08;

    const targetScale = zoomFabric ? 1.24 : 1.02;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, Math.min(1, delta * 5.5));
    groupRef.current.scale.setScalar(s);

    // Caimento suave de tecido
    const posAttr = geometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const curve = -0.095 * (bx * bx);
      const wave =
        Math.sin(by * 1.6 - t * 2.0 + bx * 1.2) *
        0.045 *
        (0.4 + Math.max(0, (1.8 - by) / 3.6));
      posAttr.setZ(i, curve + wave);
    }
    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  const { materialProps } = product;

  return (
    <>
      <ambientLight intensity={1.08} />
      <directionalLight position={[4, 6, 6]} intensity={1.55} color="#FFFBF5" />
      <directionalLight position={[-4, 3, -5]} intensity={0.95} color="#F3E1CC" />
      <pointLight position={[0, -2.5, 4]} intensity={0.6} color="#FFFFFF" />

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
          manualRotRef.current += dx * 0.012;
        }}
        onPointerUp={() => {
          isDraggingRef.current = false;
        }}
        onPointerLeave={() => {
          isDraggingRef.current = false;
        }}
      >
        {/* Frente */}
        <mesh geometry={geometry} position={[0, 0, 0.01]}>
          <meshPhysicalMaterial
            map={textures.frontTex}
            roughness={materialProps.roughness}
            metalness={materialProps.metalness}
            sheen={materialProps.sheen}
            sheenRoughness={materialProps.sheenRoughness}
            sheenColor={materialProps.sheenColor}
            clearcoat={materialProps.clearcoat}
          />
        </mesh>

        {/* Verso com costas & etiqueta Harumi Modas */}
        <mesh geometry={geometry} position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
          <meshPhysicalMaterial
            map={textures.backTex}
            roughness={materialProps.roughness}
            metalness={materialProps.metalness}
            sheen={materialProps.sheen}
            sheenRoughness={materialProps.sheenRoughness}
            sheenColor={materialProps.sheenColor}
            clearcoat={materialProps.clearcoat}
          />
        </mesh>
      </group>
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
  onOpenTryOn
}) {
  const [activeTab, setActiveTab] = useState('fabric'); // 'fabric' | 'spin' | 'sizes'
  const [rotationY, setRotationY] = useState(0);
  const [autoSpin, setAutoSpin] = useState(false);
  const [zoomFabric, setZoomFabric] = useState(false);

  // Ao trocar de peça, volta suavemente para a frente
  useEffect(() => {
    setRotationY(0);
    setAutoSpin(false);
    setZoomFabric(false);
  }, [product.id]);

  const handleFabricClick = () => {
    setActiveTab('fabric');
    setAutoSpin(false);
    setRotationY(0);
    setZoomFabric((z) => !z);
  };

  const handleSpin360Click = () => {
    setActiveTab('spin');
    setZoomFabric(false);
    // Alterna entre mostrar as costas (180°), giro 360° contínuo e frente
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

  const showingBack = Math.round(Math.abs(rotationY / Math.PI)) % 2 === 1 && !autoSpin;

  return (
    <section
      id="detalhes"
      className="relative min-h-screen w-full overflow-hidden py-24 sm:py-32 transition-colors duration-700"
      style={{
        background: `linear-gradient(180deg, ${product.colorSoft} 0%, #F7F4F0 45%, #F7F4F0 100%)`
      }}
    >
      {/* Tipografia Gigante Vazada ao Fundo ("TOQUE DE SEDA", "CORTE PERFEITO 04") */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between overflow-hidden py-14 select-none">
        <div className="whitespace-nowrap font-display text-[15vw] sm:text-[11vw] font-extrabold uppercase leading-none tracking-[-0.04em] text-outline-accent -ml-6">
          {product.hollowBgTop}
        </div>
        <div className="whitespace-nowrap text-right font-display text-[14vw] sm:text-[10.5vw] font-extrabold uppercase leading-none tracking-[-0.04em] text-outline-accent -mr-6">
          {product.hollowBgBottom}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Cabeçalho sutil */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8C7554]">
              Inspeção 3D em Alta Definição • {product.sku}
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl font-medium text-[#181615]">
              {product.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
              {formatYen(product.price)}
            </span>
            <span className="rounded-full border border-[#181615]/15 bg-white/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#181615]/70">
              Pronta Entrega JP
            </span>
          </div>
        </div>

        {/* Grade Principal: Palco 3D à esquerda + 5 Botões Interativos & Painel à direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Palco de Inspeção 3D */}
          <div className="lg:col-span-6 relative">
            <div
              className="relative h-[470px] sm:h-[580px] w-full rounded-[2rem] border border-white/80 shadow-[0_28px_70px_-28px_rgba(24,22,21,0.22)] overflow-hidden cursor-grab active:cursor-grabbing"
              style={{
                background: `radial-gradient(circle at 50% 42%, #FFFFFF 0%, ${product.colorSoft} 68%, ${product.bgTint} 100%)`
              }}
            >
              {/* Etiqueta de estado do ângulo */}
              <div className="pointer-events-none absolute top-5 left-5 z-10 flex items-center gap-2 rounded-full bg-[#F7F4F0]/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#181615]/75 backdrop-blur-md">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: product.color }}
                />
                <span>
                  {autoSpin
                    ? 'Rotação 360° Ativa'
                    : showingBack
                    ? 'Verso • Costas & Etiqueta'
                    : zoomFabric
                    ? 'Zoom • Trama & Brilho'
                    : 'Frente • Arraste para girar 360°'}
                </span>
              </div>

              <Canvas
                camera={{ position: [0, 0, 5.4], fov: 40 }}
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true }}
              >
                <InspectableGarment3D
                  product={product}
                  targetRotationY={rotationY}
                  autoSpin={autoSpin}
                  zoomFabric={zoomFabric}
                />
              </Canvas>

              {/* Atalho rápido Frente / Costas na base do canvas */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full border border-[#181615]/10 bg-[#F7F4F0]/85 p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => {
                    setAutoSpin(false);
                    setRotationY(0);
                  }}
                  className={`rounded-full px-3.5 py-1 text-[11px] font-medium transition-all ${
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
                    setRotationY(Math.PI);
                  }}
                  className={`rounded-full px-3.5 py-1 text-[11px] font-medium transition-all ${
                    showingBack
                      ? 'bg-[#181615] text-[#F7F4F0]'
                      : 'text-[#181615]/70 hover:text-[#181615]'
                  }`}
                >
                  Costas & Etiqueta
                </button>
                <button
                  type="button"
                  onClick={() => setAutoSpin((s) => !s)}
                  className={`rounded-full px-3.5 py-1 text-[11px] font-medium transition-all ${
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

          {/* Painel Interativo à Direita com os 5 Botões */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Cartão Editorial Dinâmico (Tecido ou Guia de Tamanhos) */}
            <div className="glass-panel rounded-[1.75rem] p-6 sm:p-7 shadow-[0_20px_55px_-28px_rgba(24,22,21,0.16)]">
              {activeTab === 'sizes' ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8C7554]">
                        Modelagem Atelier Harumi
                      </span>
                      <h3 className="font-serif text-2xl font-semibold text-[#181615]">
                        Guia de Tamanhos (P, M, G, GG)
                      </h3>
                    </div>
                    <span className="rounded-full bg-[#181615] px-3 py-1 text-xs font-semibold text-[#F7F4F0]">
                      Selecionado: {selectedSize}
                    </span>
                  </div>

                  {/* Seletor rápido P, M, G, GG */}
                  <div className="mb-4 grid grid-cols-4 gap-2">
                    {['P', 'M', 'G', 'GG'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => onSelectSize(sz)}
                        className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
                          selectedSize === sz
                            ? 'bg-[#181615] text-[#F7F4F0] shadow-md'
                            : 'border border-[#181615]/15 bg-white/75 text-[#181615] hover:border-[#181615]/40'
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
                                active ? 'bg-[#181615]/8 font-semibold' : 'hover:bg-white/60'
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
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#181615]/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#181615]">
                    <Sparkles className="h-3 w-3 text-[#C88A75]" />
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
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8C7554]">
                        Composição
                      </span>
                      <span className="mt-0.5 block font-medium text-[#181615]/85">
                        {product.composition}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8C7554]">
                        Cuidados do Atelier
                      </span>
                      <span className="mt-0.5 block font-medium text-[#181615]/85">
                        {product.care}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4 Botões de Inspeção em Grid 2x2 */}
            <div className="grid grid-cols-2 gap-3">
              {/* 1) Tecido & Textura */}
              <button
                type="button"
                onClick={handleFabricClick}
                className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  activeTab === 'fabric'
                    ? 'border-[#181615] bg-[#181615] text-[#F7F4F0] shadow-md'
                    : 'border-[#181615]/12 bg-white/75 text-[#181615] hover:border-[#181615]/40'
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
                    {zoomFabric ? 'Zoom ativo • Clique p/ sair' : 'Ver trama e composição'}
                  </span>
                </div>
              </button>

              {/* 2) Caimento / 360° */}
              <button
                type="button"
                onClick={handleSpin360Click}
                className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  activeTab === 'spin' || showingBack || autoSpin
                    ? 'border-[#181615] bg-[#181615] text-[#F7F4F0] shadow-md'
                    : 'border-[#181615]/12 bg-white/75 text-[#181615] hover:border-[#181615]/40'
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
                    Girar costas & costura
                  </span>
                </div>
              </button>

              {/* 3) Favoritar Peça */}
              <button
                type="button"
                onClick={() => onToggleFavorite(product.id)}
                className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  isFavorite
                    ? 'border-[#C88A75] bg-[#C88A75]/15 text-[#181615]'
                    : 'border-[#181615]/12 bg-white/75 text-[#181615] hover:border-[#181615]/40'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isFavorite ? 'bg-[#C88A75] text-white' : 'bg-[#F7F4F0] text-[#181615]'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </span>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-[0.12em]">
                    {isFavorite ? 'Peça Favoritada' : 'Favoritar Peça'}
                  </span>
                  <span className="block text-[11px] text-[#181615]/55">
                    {isFavorite ? 'Salva na sua wishlist' : 'Salvar na curadoria'}
                  </span>
                </div>
              </button>

              {/* 4) Guia de Tamanhos */}
              <button
                type="button"
                onClick={handleSizesClick}
                className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  activeTab === 'sizes'
                    ? 'border-[#181615] bg-[#181615] text-[#F7F4F0] shadow-md'
                    : 'border-[#181615]/12 bg-white/75 text-[#181615] hover:border-[#181615]/40'
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
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#D8C7B4] to-[#C88A75] text-[#181615] shadow-inner">
                  <ScanFace className="h-6 w-6" />
                </span>
                <div>
                  <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D8C7B4]">
                    <Camera className="h-3.5 w-3.5" />
                    Tecnologia Google Gemini IA
                  </span>
                  <span className="mt-0.5 block font-display text-sm sm:text-base font-extrabold uppercase tracking-[0.06em]">
                    PROVAR EM MIM (IA) — PROVADOR VIRTUAL
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center rounded-full border border-[#D8C7B4]/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D8C7B4] transition-transform group-hover:translate-x-1">
                Experimentar
              </span>
            </button>

            {/* Barra de compra direta rápida */}
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#181615]/10 bg-white/65 px-5 py-3.5">
              <div className="flex items-center gap-2 text-xs text-[#181615]/75">
                <Check className="h-4 w-4 text-[#617869]" />
                <span>
                  Tamanho <strong className="text-[#181615]">{selectedSize}</strong> pronto para envio
                </span>
              </div>
              <button
                type="button"
                onClick={() => onAddToCart(product, selectedSize)}
                className="inline-flex items-center gap-2 rounded-full bg-[#181615] px-4 py-2 text-xs font-semibold text-[#F7F4F0] transition-all hover:bg-[#312B27]"
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
