import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SilkPetalsAndGold({ phase }) {
  const petalsRef = useRef();
  const goldDustRef = useRef();
  const threadsRef = useRef();

  const petalData = useMemo(() => {
    const items = [];
    const palette = ['#D47A6A', '#D5C7B2', '#8FA696', '#E295A8', '#7D7A85'];
    for (let i = 0; i < 48; i++) {
      const angle = (i / 48) * Math.PI * 2 + Math.random() * 0.6;
      const radius = 0.8 + Math.random() * 4.4;
      items.push({
        x: Math.cos(angle) * radius,
        y: (Math.random() - 0.5) * 4.6,
        z: (Math.random() - 0.5) * 4.5,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        speed: 0.28 + Math.random() * 0.48,
        scale: 0.08 + Math.random() * 0.15,
        color: palette[i % palette.length],
        dirX: Math.cos(angle) * (0.6 + Math.random() * 1.4),
        dirY: (Math.random() - 0.35) * 1.2
      });
    }
    return items;
  }, []);

  const dustGeometry = useMemo(() => {
    const count = 220;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const silkCurves = useMemo(() => {
    return [0, 1, 2, 3].map((idx) => {
      const pts = [];
      const yOffset = (idx - 1.5) * 0.9;
      for (let t = 0; t <= 24; t++) {
        const u = t / 24;
        pts.push(
          new THREE.Vector3(
            (u - 0.5) * 9.5,
            yOffset + Math.sin(u * Math.PI * 2.2 + idx * 1.1) * 0.62,
            Math.cos(u * Math.PI * 1.7 + idx) * 0.9 - 0.8
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      return new THREE.TubeGeometry(curve, 64, 0.011, 8, false);
    });
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const expand = phase >= 1 ? 1.85 : 0.0;

    if (petalsRef.current) {
      petalsRef.current.children.forEach((mesh, i) => {
        const d = petalData[i];
        mesh.position.x = THREE.MathUtils.lerp(
          mesh.position.x,
          d.x + d.dirX * expand + Math.sin(t * d.speed + i) * 0.25,
          Math.min(1, delta * 2.2)
        );
        mesh.position.y = THREE.MathUtils.lerp(
          mesh.position.y,
          d.y + d.dirY * expand + Math.cos(t * d.speed * 0.9 + i) * 0.22,
          Math.min(1, delta * 2.2)
        );
        mesh.position.z = d.z + Math.sin(t * 0.5 + i) * 0.35 + (phase >= 1 ? 1.2 : 0);
        mesh.rotation.x += delta * d.speed * 0.8;
        mesh.rotation.y += delta * d.speed * 0.65;
        mesh.rotation.z += delta * d.speed * 0.4;
      });
    }

    if (goldDustRef.current) {
      goldDustRef.current.rotation.y = t * 0.055;
      goldDustRef.current.rotation.x = Math.sin(t * 0.2) * 0.06;
    }

    if (threadsRef.current) {
      threadsRef.current.rotation.z = Math.sin(t * 0.35) * 0.05;
      threadsRef.current.position.y = Math.sin(t * 0.5) * 0.09;
    }
  });

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 5]} intensity={1.45} color="#FFF8EE" />
      <pointLight position={[-4, -2, 3]} intensity={0.95} color="#E6C6A8" />

      <group ref={threadsRef}>
        {silkCurves.map((geo, idx) => (
          <mesh key={idx} geometry={geo}>
            <meshPhysicalMaterial
              color={idx % 2 === 0 ? '#C9B290' : '#D47A6A'}
              metalness={0.55}
              roughness={0.22}
              transparent
              opacity={phase >= 2 ? 0.1 : 0.45}
            />
          </mesh>
        ))}
      </group>

      <group ref={petalsRef}>
        {petalData.map((p, i) => (
          <mesh
            key={i}
            position={[p.x, p.y, p.z]}
            rotation={[p.rotX, p.rotY, p.rotZ]}
            scale={[p.scale * 1.45, p.scale * 0.72, p.scale * 0.2]}
          >
            <sphereGeometry args={[1, 12, 10]} />
            <meshPhysicalMaterial
              color={p.color}
              roughness={0.32}
              metalness={0.14}
              clearcoat={0.32}
              transparent
              opacity={0.76}
            />
          </mesh>
        ))}
      </group>

      <points ref={goldDustRef} geometry={dustGeometry}>
        <pointsMaterial
          size={0.048}
          color="#C5A36A"
          transparent
          opacity={0.62}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </>
  );
}

export default function IntroOverlay({ onFinish }) {
  const [phase, setPhase] = useState(0);
  const finishedRef = useRef(false);

  const triggerExit = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setPhase(2);
    setTimeout(() => {
      onFinish();
    }, 680);
  };

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1400);
    const t2 = setTimeout(() => triggerExit(), 2950);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#F7F4F0] transition-all duration-700 ease-out ${
        phase === 2 ? 'opacity-0 pointer-events-none scale-[1.03]' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 44 }}
          dpr={[1, 1.75]}
          gl={{ alpha: true, antialias: true }}
        >
          <SilkPetalsAndGold phase={phase} />
        </Canvas>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(247,244,240,0.08) 0%, rgba(247,244,240,0.58) 72%, rgba(235,226,216,0.72) 100%)'
        }}
      />

      <button
        type="button"
        onClick={triggerExit}
        className="fixed top-6 right-6 z-20 rounded-full border border-[#181615]/15 bg-[#F7F4F0]/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.26em] text-[#181615]/75 backdrop-blur-md transition-all hover:border-[#181615]/40 hover:bg-[#181615] hover:text-[#F7F4F0]"
      >
        SKIP INTRO
      </button>

      <div
        className={`relative z-10 flex flex-col items-center text-center px-6 transition-all duration-1000 ${
          phase >= 1 ? 'scale-105 opacity-90' : 'scale-100 opacity-100'
        }`}
      >
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#181615]/20 bg-[#181615] shadow-[0_18px_45px_-16px_rgba(24,22,21,0.35)]">
          <span className="font-display text-3xl font-extrabold tracking-[0.14em] text-[#F7F4F0]">
            HM
          </span>
        </div>

        <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.42em] text-[#8C7554]">
          NEW DROP • STREET LUXE TOKYO
        </p>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-[0.14em] text-[#181615]">
          HARUMI MODAS
        </h1>

        <div className="mt-6 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#181615]/55">
          <span className="h-[1px] w-10 bg-[#181615]/30" />
          <span>FIT CHECK • PORTAL LOJAS JP</span>
          <span className="h-[1px] w-10 bg-[#181615]/30" />
        </div>
      </div>
    </div>
  );
}
