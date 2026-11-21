import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  ArrowDownRight
} from 'lucide-react';
import { PRODUCTS, formatYen, getProductImageUrl } from '../data/products';

function useProductTextures() {
  return useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    return PRODUCTS.map((product) => {
      const frontSrc = getProductImageUrl(product, 'front');
      const backSrc = getProductImageUrl(product, 'back');

      const frontTex = loader.load(frontSrc);
      const backTex = loader.load(backSrc);

      [frontTex, backTex].forEach((tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.needsUpdate = true;
      });

      return { frontTex, backTex };
    });
  }, []);
}

/**
 * Peça individual em 3D com volume sutil de tecido e caimento animado
 */
function GarmentCard3D({
  product,
  textures,
  slotOffset,
  visualDelta,
  isCenter,
  onSelect
}) {
  const groupRef = useRef();
  const frontMeshRef = useRef();
  const backMeshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Geometria subdividida para caimento/ondulação suave do tecido
  const geometry = useMemo(() => new THREE.PlaneGeometry(2.35, 3.25, 22, 30), []);
  const basePositions = useMemo(
    () => Float32Array.from(geometry.attributes.position.array),
    [geometry]
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const posOffset = slotOffset - visualDelta;
    const absPos = Math.abs(posOffset);

    // Arco horizontal 3D elegante (5 a 7 peças visíveis)
    const targetX = posOffset * 2.52;
    const targetZ = 1.15 - Math.pow(absPos, 1.38) * 1.05;
    const targetY =
      (isCenter ? 0.14 : -absPos * 0.08) +
      Math.sin(t * 1.4 + slotOffset * 1.1) * (isCenter ? 0.065 : 0.03);
    const targetRotY = -posOffset * 0.34 + (isCenter ? Math.sin(t * 0.6) * 0.06 : 0);
    const targetRotZ = -posOffset * 0.035;
    const baseScale = Math.max(0.68, 1.14 - absPos * 0.145);
    const targetScale = baseScale * (hovered ? 1.04 : 1.0);

    if (groupRef.current) {
      const k = Math.min(1, delta * 9);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, k);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, k);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, k);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, k);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, k);
      const nextScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, k);
      groupRef.current.scale.setScalar(nextScale);
    }

    // Ondulação sutil de tecido vivo (silk/linen drape)
    const posAttr = geometry.attributes.position;
    const waveAmp = isCenter ? 0.055 : 0.025;
    for (let i = 0; i < posAttr.count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      // Curvatura suave tipo tecido suspenso + brisa diagonal
      const drapeCurve = -0.08 * (bx * bx);
      const breeze =
        Math.sin(by * 1.65 - t * 1.85 + bx * 1.15 + slotOffset) *
        waveAmp *
        (0.45 + Math.max(0, (1.6 - by) / 3.2));
      posAttr.setZ(i, drapeCurve + breeze);
    }
    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  const { materialProps } = product;

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Frente da peça */}
      <mesh ref={frontMeshRef} geometry={geometry} position={[0, 0, 0.008]} castShadow>
        <meshPhysicalMaterial
          map={textures.frontTex}
          roughness={materialProps.roughness}
          metalness={materialProps.metalness}
          sheen={materialProps.sheen}
          sheenRoughness={materialProps.sheenRoughness}
          sheenColor={materialProps.sheenColor}
          clearcoat={materialProps.clearcoat}
          clearcoatRoughness={0.25}
        />
      </mesh>

      {/* Verso da peça */}
      <mesh
        ref={backMeshRef}
        geometry={geometry}
        position={[0, 0, -0.008]}
        rotation={[0, Math.PI, 0]}
      >
        <meshPhysicalMaterial
          map={textures.backTex}
          roughness={materialProps.roughness}
          metalness={materialProps.metalness}
          sheen={materialProps.sheen}
          sheenRoughness={materialProps.sheenRoughness}
          sheenColor={materialProps.sheenColor}
        />
      </mesh>
    </group>
  );
}

function ArcCarouselScene({ scrollFloatRef, onSelectOffset }) {
  const textures = useProductTextures();
  const [centerInt, setCenterInt] = useState(0);
  const [visualDelta, setVisualDelta] = useState(0);

  useFrame(() => {
    const val = scrollFloatRef.current;
    const nearest = Math.round(val);
    if (nearest !== centerInt) {
      setCenterInt(nearest);
    }
    setVisualDelta(val - nearest);
  });

  const slots = [-3, -2, -1, 0, 1, 2, 3];
  const total = PRODUCTS.length;

  return (
    <>
      <ambientLight intensity={1.05} />
      <directionalLight position={[4, 6, 7]} intensity={1.45} color="#FFFBF4" />
      <directionalLight position={[-5, 2, 4]} intensity={0.7} color="#F2DFC9" />
      <pointLight position={[0, -3, 4]} intensity={0.65} color="#FFFFFF" />

      <group position={[0, 0.05, 0]}>
        {slots.map((slotOffset) => {
          const virtualIndex = centerInt + slotOffset;
          const productIndex = ((virtualIndex % total) + total) % total;
          const product = PRODUCTS[productIndex];
          return (
            <GarmentCard3D
              key={virtualIndex}
              product={product}
              textures={textures[productIndex]}
              slotOffset={slotOffset}
              visualDelta={visualDelta}
              isCenter={slotOffset === 0}
              onSelect={() => onSelectOffset(slotOffset)}
            />
          );
        })}
      </group>
    </>
  );
}

export default function HeroCarousel3D({
  activeIndex,
  onChangeIndex,
  onOpenTryOn
}) {
  const total = PRODUCTS.length;
  const activeProduct = PRODUCTS[activeIndex];

  // Controle contínuo com inércia (drag & momentum)
  const targetIndexRef = useRef(0);
  const scrollFloatRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const dragDistanceRef = useRef(0);

  const [autoplay, setAutoplay] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [bgLayers, setBgLayers] = useState({
    prevColor: PRODUCTS[0].bgTint,
    currColor: PRODUCTS[0].bgTint,
    key: 0
  });

  // Revelação radial suave sempre que a peça muda
  useEffect(() => {
    setBgLayers((prev) => {
      if (prev.currColor === activeProduct.bgTint) return prev;
      return {
        prevColor: prev.currColor,
        currColor: activeProduct.bgTint,
        key: prev.key + 1
      };
    });
  }, [activeProduct.bgTint]);

  // Sincroniza quando activeIndex muda externamente (ex: clique no Shop/Look)
  useEffect(() => {
    const currentMod =
      ((Math.round(targetIndexRef.current) % total) + total) % total;
    if (currentMod !== activeIndex) {
      let diff = activeIndex - currentMod;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      targetIndexRef.current = Math.round(targetIndexRef.current) + diff;
    }
  }, [activeIndex, total]);

  // Loop de física com inércia e snap suave
  useEffect(() => {
    let rafId;
    const tick = () => {
      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.0015) {
          scrollFloatRef.current += velocityRef.current;
          velocityRef.current *= 0.91;
          targetIndexRef.current = Math.round(scrollFloatRef.current);
        } else {
          velocityRef.current = 0;
          scrollFloatRef.current +=
            (targetIndexRef.current - scrollFloatRef.current) * 0.11;
        }
      }

      const nearest = Math.round(scrollFloatRef.current);
      const normalized = ((nearest % total) + total) % total;
      if (normalized !== activeIndex) {
        onChangeIndex(normalized);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [activeIndex, onChangeIndex, total]);

  // Autoplay suave
  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      if (!isDraggingRef.current) {
        targetIndexRef.current += 1;
      }
    }, 3400);
    return () => clearInterval(id);
  }, [autoplay]);

  // Setas do teclado
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        targetIndexRef.current += 1;
      } else if (e.key === 'ArrowLeft') {
        targetIndexRef.current -= 1;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const stepCarousel = (delta) => {
    targetIndexRef.current = Math.round(targetIndexRef.current) + delta;
  };

  // Drag & momentum no container da vitrine 3D
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    dragDistanceRef.current = 0;
    velocityRef.current = 0;
  };

  const handlePointerMove = (e) => {
    // Parallax dos elementos flutuantes nos cantos
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    setParallax({ x: nx, y: ny });

    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    dragDistanceRef.current += Math.abs(dx);
    const deltaSlots = -dx / 230;
    scrollFloatRef.current += deltaSlots;
    velocityRef.current = deltaSlots * 0.72;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (Math.abs(velocityRef.current) < 0.015) {
      targetIndexRef.current = Math.round(scrollFloatRef.current);
    }
  };

  // Roda do mouse (horizontal ou Shift+Scroll para não travar a rolagem vertical)
  const wheelCooldownRef = useRef(0);
  const handleWheel = (e) => {
    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);
    if (absX > 14 || (e.shiftKey && absY > 14)) {
      const now = Date.now();
      if (now - wheelCooldownRef.current > 320) {
        wheelCooldownRef.current = now;
        const dir = (absX > absY ? e.deltaX : e.deltaY) > 0 ? 1 : -1;
        stepCarousel(dir);
      }
    }
  };

  const handleSelectOffset = (slotOffset) => {
    if (dragDistanceRef.current > 12) return;
    if (slotOffset === 0) {
      const el = document.getElementById('detalhes');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      stepCarousel(slotOffset);
    }
  };

  return (
    <section
      id="colecao"
      onPointerMove={handlePointerMove}
      onWheel={handleWheel}
      className="relative min-h-screen w-full overflow-hidden pt-24 pb-10 flex flex-col justify-between select-none"
      style={{ backgroundColor: bgLayers.prevColor }}
    >
      {/* Camada de Revelação Radial Suave */}
      <div
        key={bgLayers.key}
        className="animate-radial-reveal absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 48%, #FAF7F2 0%, ${activeProduct.colorSoft} 46%, ${activeProduct.bgTint} 100%)`
        }}
      />

      {/* Ondas Concêntricas Sutis (Ripple) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[460, 740, 1040, 1360].map((size, idx) => (
          <div
            key={size}
            className="ripple-ring absolute left-1/2 top-[48%] rounded-full border"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderColor: `${activeProduct.colorDeep}24`,
              animationDelay: `${idx * 1.4}s`
            }}
          />
        ))}
      </div>

      {/* Elementos Flutuantes Sutis nos Cantos com Parallax */}
      <div
        className="pointer-events-none hidden md:flex fixed-layer absolute top-28 left-8 z-10 flex-col gap-1.5 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallax.x * -14}px, ${parallax.y * -10}px, 0)`
        }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#181615]/55">
          Atelier Drop 01 • 2026
        </span>
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full border border-white/80 shadow-sm"
            style={{ backgroundColor: activeProduct.color }}
          />
          <span className="text-xs font-medium tracking-[0.14em] text-[#181615]/80">
            {activeProduct.category} — {activeProduct.sku}
          </span>
        </div>
      </div>

      <div
        className="pointer-events-none hidden md:flex absolute top-28 right-8 z-10 flex-col items-end gap-1 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallax.x * 16}px, ${parallax.y * -12}px, 0)`
        }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#181615]/55">
          Matéria-Prima Nobre
        </span>
        <span className="font-serif text-base italic text-[#181615]/80">
          {activeProduct.fabricTitle}
        </span>
      </div>

      {/* Palco do Carrossel em Arco Horizontal 3D */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative z-10 h-[56vh] min-h-[390px] max-h-[590px] w-full cursor-grab active:cursor-grabbing"
      >
        <Canvas
          camera={{ position: [0, 0.1, 6.9], fov: 39 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
        >
          <ArcCarouselScene
            scrollFloatRef={scrollFloatRef}
            onSelectOffset={handleSelectOffset}
          />
        </Canvas>

        {/* Setas laterais elegantes sobre a borda do palco */}
        <button
          type="button"
          onClick={() => stepCarousel(-1)}
          aria-label="Peça anterior"
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[#181615]/15 bg-[#F7F4F0]/75 text-[#181615] backdrop-blur-md transition-all hover:scale-105 hover:bg-[#181615] hover:text-[#F7F4F0]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => stepCarousel(1)}
          aria-label="Próxima peça"
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[#181615]/15 bg-[#F7F4F0]/75 text-[#181615] backdrop-blur-md transition-all hover:scale-105 hover:bg-[#181615] hover:text-[#F7F4F0]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Rodapé Editorial da Seção Hero: Nome Gigante Bold + Controles + Contador Vazado 01–05 */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-5 sm:px-8 pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Esquerda: Nome gigante editorial bold + preço e ações rápidas */}
          <div className="max-w-3xl">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#181615]/15 bg-[#F7F4F0]/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#181615]/75 backdrop-blur-md">
                {formatYen(activeProduct.price)}
              </span>
              <span className="text-xs tracking-[0.06em] text-[#181615]/70">
                {activeProduct.tagline}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.96] tracking-[-0.03em] text-[#181615] transition-all">
              {activeProduct.name}
            </h2>

            {/* Controles interativos: Autoplay, Indicadores, CTAs */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('detalhes');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#181615] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-[#F7F4F0] shadow-md transition-all hover:bg-[#312B27]"
              >
                <span>Inspecionar 3D</span>
                <ArrowDownRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onOpenTryOn}
                className="inline-flex items-center gap-2 rounded-full border border-[#181615]/20 bg-[#F7F4F0]/80 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#181615] backdrop-blur-md transition-all hover:border-[#181615] hover:bg-white"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#C88A75]" />
                <span>Provar em Mim (IA)</span>
              </button>

              <button
                type="button"
                onClick={() => setAutoplay((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur-md transition-all ${
                  autoplay
                    ? 'border-[#181615] bg-[#181615] text-[#F7F4F0]'
                    : 'border-[#181615]/15 bg-[#F7F4F0]/65 text-[#181615]/75 hover:border-[#181615]/40'
                }`}
              >
                {autoplay ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
                <span>Autoplay</span>
              </button>

              <span className="hidden sm:inline text-[11px] text-[#181615]/50 tracking-[0.06em]">
                Arraste, clique ou use ← →
              </span>
            </div>
          </div>

          {/* Direita: Contador Numérico Vazado ("01" a "05") */}
          <div
            className="flex items-baseline gap-2 self-end transition-transform duration-300"
            style={{
              transform: `translate3d(${parallax.x * 10}px, ${parallax.y * 8}px, 0)`
            }}
          >
            <span className="font-display text-7xl sm:text-8xl lg:text-9xl font-extrabold leading-none tracking-[-0.04em] text-outline-dark">
              {activeProduct.code}
            </span>
            <span className="font-serif text-xl sm:text-2xl italic text-[#181615]/45">
              / 05
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
