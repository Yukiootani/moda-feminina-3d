import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  ArrowDownRight
} from 'lucide-react';
import { PRODUCTS, formatYen } from '../data/products';
import Garment3DModel from './Garment3DModel';

/**
 * Peça 3D esculpida individual flutuando limpa no arco horizontal (sem plano retangular).
 */
function SculptedGarmentSlot({
  product,
  slotOffset,
  visualDelta,
  isCenter,
  onSelect
}) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const posOffset = slotOffset - visualDelta;
    const absPos = Math.abs(posOffset);

    // Arco horizontal 3D elegante com 5 a 7 peças esculpidas visíveis
    const targetX = posOffset * 2.55;
    const targetZ = 1.2 - Math.pow(absPos, 1.35) * 1.15;
    const targetY =
      (isCenter ? 0.12 : -absPos * 0.08) +
      Math.sin(t * 1.35 + slotOffset * 1.2) * (isCenter ? 0.06 : 0.03);

    // A peça central gira suavemente revelando volume real 3D; as laterais ficam anguladas em perspectiva
    const targetRotY = isCenter
      ? Math.sin(t * 0.55) * 0.42
      : -posOffset * 0.46 + Math.sin(t * 0.4 + slotOffset) * 0.08;

    const baseScale = Math.max(0.58, 1.1 - absPos * 0.17);
    const targetScale = baseScale * (hovered ? 1.07 : 1.0);

    if (groupRef.current) {
      const k = Math.min(1, delta * 8.5);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, k);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, k);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, k);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, k);
      const nextScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, k);
      groupRef.current.scale.setScalar(nextScale);
    }
  });

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
      <Garment3DModel product={product} animateBreathe={false} />
    </group>
  );
}

function ArcCarouselScene({ scrollFloatRef, onSelectOffset }) {
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
      <ambientLight intensity={0.75} />
      <directionalLight
        position={[5, 8, 7]}
        intensity={1.65}
        color="#FFF9F2"
        castShadow
      />
      <directionalLight position={[-6, 3, 4]} intensity={0.85} color="#F7DFC6" />
      <spotLight
        position={[0, 7, -5]}
        intensity={1.15}
        angle={0.6}
        penumbra={0.8}
        color="#FFFFFF"
      />
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[0, 5, 4]}
          scale={[10, 4, 1]}
          color="#FFF9F0"
        />
        <Lightformer
          form="ring"
          intensity={1.5}
          position={[-5, 2, 3]}
          scale={5}
          color="#F7DEC8"
        />
        <Lightformer
          form="rect"
          intensity={1.3}
          position={[5, -1, -4]}
          scale={[6, 6, 1]}
          color="#FFFFFF"
        />
      </Environment>

      <group position={[0, 0.08, 0]}>
        {slots.map((slotOffset) => {
          const virtualIndex = centerInt + slotOffset;
          const productIndex = ((virtualIndex % total) + total) % total;
          const product = PRODUCTS[productIndex];
          return (
            <SculptedGarmentSlot
              key={virtualIndex}
              product={product}
              slotOffset={slotOffset}
              visualDelta={visualDelta}
              isCenter={slotOffset === 0}
              onSelect={() => onSelectOffset(slotOffset)}
            />
          );
        })}
      </group>

      <ContactShadows
        position={[0, -1.65, 0]}
        opacity={0.32}
        scale={16}
        blur={2.4}
        far={4.5}
        color="#181615"
      />
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

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      if (!isDraggingRef.current) {
        targetIndexRef.current += 1;
      }
    }, 3400);
    return () => clearInterval(id);
  }, [autoplay]);

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

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    dragDistanceRef.current = 0;
    velocityRef.current = 0;
  };

  const handlePointerMove = (e) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    setParallax({ x: nx, y: ny });

    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    dragDistanceRef.current += Math.abs(dx);
    const deltaSlots = -dx / 225;
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
      {/* Revelação Radial Dinâmica */}
      <div
        key={bgLayers.key}
        className="animate-radial-reveal absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 48%, #FAF7F2 0%, ${activeProduct.colorSoft} 46%, ${activeProduct.bgTint} 100%)`
        }}
      />

      {/* Tipografia Editorial Urbana Gigante ao Fundo */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden text-center">
        <span className="block whitespace-nowrap font-display text-[17vw] sm:text-[13vw] font-extrabold uppercase leading-none tracking-[-0.05em] text-outline-accent">
          {activeProduct.hollowBgTop}
        </span>
      </div>

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

      {/* Cantos Flutuantes com Parallax — Estética Street Luxe / Zara Vibes */}
      <div
        className="pointer-events-none hidden md:flex absolute top-28 left-8 z-10 flex-col gap-1.5 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallax.x * -14}px, ${parallax.y * -10}px, 0)`
        }}
      >
        <span className="text-[10px] font-extrabold uppercase tracking-[0.34em] text-[#181615]/60">
          NEW DROP • STREET LUXE 26
        </span>
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full border border-white/80 shadow-sm"
            style={{ backgroundColor: activeProduct.color }}
          />
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#181615]/85">
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
        <span className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-[#181615]/55">
          FIT CHECK • 3D SCULPTED
        </span>
        <span className="font-display text-sm font-bold uppercase tracking-[0.1em] text-[#181615]/80">
          {activeProduct.fabricTitle}
        </span>
      </div>

      {/* Palco 3D com Peças Esculpidas Recortadas (ZERO plano retangular) */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative z-10 h-[56vh] min-h-[400px] max-h-[600px] w-full cursor-grab active:cursor-grabbing"
      >
        <Canvas
          shadows
          camera={{ position: [0, 0.15, 6.4], fov: 39 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
        >
          <ArcCarouselScene
            scrollFloatRef={scrollFloatRef}
            onSelectOffset={handleSelectOffset}
          />
        </Canvas>

        <button
          type="button"
          onClick={() => stepCarousel(-1)}
          aria-label="Peça anterior"
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[#181615]/15 bg-[#F7F4F0]/80 text-[#181615] backdrop-blur-md transition-all hover:scale-105 hover:bg-[#181615] hover:text-[#F7F4F0]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => stepCarousel(1)}
          aria-label="Próxima peça"
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[#181615]/15 bg-[#F7F4F0]/80 text-[#181615] backdrop-blur-md transition-all hover:scale-105 hover:bg-[#181615] hover:text-[#F7F4F0]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Rodapé Editorial Hero */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-5 sm:px-8 pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#181615] px-3.5 py-1 text-xs font-bold tracking-[0.14em] text-[#F7F4F0]">
                {formatYen(activeProduct.price)}
              </span>
              <span className="rounded-full border border-[#181615]/15 bg-[#F7F4F0]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#181615]/80">
                ZARA VIBES • STREET DROP
              </span>
              <span className="text-xs font-medium tracking-[0.04em] text-[#181615]/75">
                {activeProduct.tagline}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-[#181615]">
              {activeProduct.name}
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('detalhes');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#181615] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#F7F4F0] shadow-md transition-all hover:bg-[#312B27]"
              >
                <span>Fit Check 360°</span>
                <ArrowDownRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onOpenTryOn}
                className="inline-flex items-center gap-2 rounded-full border border-[#181615]/25 bg-[#F7F4F0]/85 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#181615] backdrop-blur-md transition-all hover:border-[#181615] hover:bg-white"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#D47A6A]" />
                <span>Provar em Mim (IA)</span>
              </button>

              <button
                type="button"
                onClick={() => setAutoplay((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] backdrop-blur-md transition-all ${
                  autoplay
                    ? 'border-[#181615] bg-[#181615] text-[#F7F4F0]'
                    : 'border-[#181615]/15 bg-[#F7F4F0]/70 text-[#181615]/75 hover:border-[#181615]/40'
                }`}
              >
                {autoplay ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
                <span>Autoplay</span>
              </button>

              <span className="hidden sm:inline text-[11px] font-medium text-[#181615]/55">
                Arraste, clique ou use ← →
              </span>
            </div>
          </div>

          {/* Contador Numérico Vazado 01 a 05 */}
          <div
            className="flex items-baseline gap-2 self-end transition-transform duration-300"
            style={{
              transform: `translate3d(${parallax.x * 10}px, ${parallax.y * 8}px, 0)`
            }}
          >
            <span className="font-display text-7xl sm:text-8xl lg:text-9xl font-extrabold leading-none tracking-[-0.04em] text-outline-dark">
              {activeProduct.code}
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold text-[#181615]/40">
              / 05
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
