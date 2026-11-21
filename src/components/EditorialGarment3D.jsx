import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * AlphaMap suave que esfuma as bordas do estúdio fotográfico para integrar
 * a modelo de corpo inteiro diretamente ao palco 3D sem parecer cartão chapado.
 */
let sharedStageMask = null;
function getEditorialStageAlphaMap() {
  if (sharedStageMask || typeof document === 'undefined') {
    return sharedStageMask;
  }
  const W = 512;
  const H = 682;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.filter = 'blur(18px)';
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(24, 18, W - 48, H - 36, 92);
  ctx.fill();
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  sharedStageMask = tex;
  return tex;
}

/**
 * Gera mapa de relevo/profundidade 3D (displacement + bump) a partir da própria
 * fotografia da modelo para criar relevo volumétrico real sob a luz de estúdio.
 */
function buildReliefTexture(img) {
  const W = 256;
  const H = 340;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, W, H);

  const imgData = ctx.getImageData(0, 0, W, H);
  const d = imgData.data;

  // Amostra cor de fundo nos cantos superiores para separar a silhueta da modelo em relevo 3D
  const bgR = (d[0] + d[(W - 1) * 4]) / 2;
  const bgG = (d[1] + d[(W - 1) * 4 + 1]) / 2;
  const bgB = (d[2] + d[(W - 1) * 4 + 2]) / 2;

  for (let y = 0; y < H; y++) {
    const ny = y / H;
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      const nx = (x / W - 0.5) * 2;
      const diff =
        Math.abs(d[idx] - bgR) +
        Math.abs(d[idx + 1] - bgG) +
        Math.abs(d[idx + 2] - bgB);
      // Figura da modelo destacada do fundo + curvatura central suave
      const silhouetteLift = Math.min(1, diff / 95);
      const centerCurve = Math.max(0, 1 - nx * nx * 1.35) * (0.65 + 0.35 * (1 - ny));
      const depthVal = Math.round(
        Math.min(255, Math.max(0, (silhouetteLift * 0.72 + centerCurve * 0.28) * 255))
      );
      d[idx] = depthVal;
      d[idx + 1] = depthVal;
      d[idx + 2] = depthVal;
      d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const reliefTex = new THREE.CanvasTexture(canvas);
  reliefTex.needsUpdate = true;
  return reliefTex;
}

function useEditorialModelTextures(url) {
  const [bundle, setBundle] = useState({ map: null, relief: null });

  useEffect(() => {
    if (!url) {
      setBundle({ map: null, relief: null });
      return;
    }

    let cancelled = false;
    const img = new Image();
    if (/^https?:\/\//i.test(url)) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      if (cancelled) return;
      const map = new THREE.Texture(img);
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = 8;
      map.minFilter = THREE.LinearMipmapLinearFilter;
      map.magFilter = THREE.LinearFilter;
      map.generateMipmaps = true;
      map.needsUpdate = true;

      let relief = null;
      try {
        relief = buildReliefTexture(img);
      } catch {
        relief = null;
      }

      setBundle((prev) => {
        if (prev.map && prev.map !== map) prev.map.dispose();
        if (prev.relief && prev.relief !== relief) prev.relief.dispose();
        return { map, relief };
      });
    };

    img.onerror = () => {
      if (!cancelled) {
        console.warn('[Harumi Modas 3D] Erro ao carregar imagem da modelo:', url);
      }
    };

    img.src = url;

    return () => {
      cancelled = true;
    };
  }, [url]);

  return bundle;
}

/**
 * Modelo Real de Corpo Inteiro em Relevo 3D sobre Pedestal Circular Luminoso
 * - Relevo volumétrico real (displacementMap + bumpMap extraídos da silhueta)
 * - ZERO caixa cinza de etiqueta / ZERO quadrado branco
 * - Pedestal circular arquitetônico com anel de luz champanhe na base
 */
export default function EditorialGarment3D({
  frontUrl,
  backUrl,
  accentColor = '#D47A6A',
  width = 2.45,
  height = 3.26,
  showPedestal = true,
  isHighlighted = true,
  parallax = { x: 0, y: 0 }
}) {
  const figureRef = useRef();
  const frontMatRef = useRef();
  const backMatRef = useRef();

  const frontBundle = useEditorialModelTextures(frontUrl);
  const backBundle = useEditorialModelTextures(backUrl || frontUrl);
  const alphaMap = useMemo(() => getEditorialStageAlphaMap(), []);

  useEffect(() => {
    if (frontMatRef.current) frontMatRef.current.needsUpdate = true;
  }, [frontBundle.map, frontBundle.relief]);

  useEffect(() => {
    if (backMatRef.current) backMatRef.current.needsUpdate = true;
  }, [backBundle.map, backBundle.relief]);

  // Malha de alta subdivisão para o relevo 3D real da silhueta da modelo
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(width, height, 48, 64),
    [width, height]
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (figureRef.current) {
      const targetRotX = THREE.MathUtils.clamp((parallax?.y || 0) * -0.06, -0.1, 0.1);
      const targetShiftX = THREE.MathUtils.clamp((parallax?.x || 0) * 0.06, -0.1, 0.1);
      figureRef.current.rotation.x = THREE.MathUtils.lerp(
        figureRef.current.rotation.x,
        targetRotX,
        Math.min(1, delta * 5)
      );
      figureRef.current.position.x = THREE.MathUtils.lerp(
        figureRef.current.position.x,
        targetShiftX,
        Math.min(1, delta * 5)
      );
      figureRef.current.position.y = Math.sin(t * 1.25) * 0.025;
    }
  });

  const pedestalY = -height / 2 - 0.12;

  return (
    <group>
      {/* Modelo de corpo inteiro em relevo 3D com profundidade real */}
      <group ref={figureRef}>
        <mesh geometry={geometry} position={[0, 0, 0.02]} castShadow receiveShadow>
          <meshPhysicalMaterial
            ref={frontMatRef}
            key={frontBundle.map ? `fm-${frontBundle.map.uuid}` : 'fm-loading'}
            map={frontBundle.map || undefined}
            displacementMap={frontBundle.relief || undefined}
            displacementScale={0.22}
            displacementBias={-0.06}
            bumpMap={frontBundle.relief || undefined}
            bumpScale={0.028}
            color={frontBundle.map ? '#FFFFFF' : accentColor}
            alphaMap={alphaMap}
            transparent
            alphaTest={0.06}
            roughness={0.48}
            metalness={0.02}
            clearcoat={0.12}
            sheen={0.28}
            sheenColor="#FFF8F0"
          />
        </mesh>

        {/* Verso limpo em relevo (foto de costas do Cloudinary ou silhueta editorial sem caixa cinza) */}
        <mesh
          geometry={geometry}
          position={[0, 0, -0.02]}
          rotation={[0, Math.PI, 0]}
          castShadow
        >
          <meshPhysicalMaterial
            ref={backMatRef}
            key={backBundle.map ? `bm-${backBundle.map.uuid}` : 'bm-loading'}
            map={backBundle.map || undefined}
            displacementMap={backBundle.relief || undefined}
            displacementScale={0.16}
            displacementBias={-0.04}
            color={backBundle.map ? '#EAE3DB' : accentColor}
            alphaMap={alphaMap}
            transparent
            alphaTest={0.06}
            roughness={0.55}
            metalness={0.02}
          />
        </mesh>
      </group>

      {/* Pedestal Circular Luminoso de Passarela 3D */}
      {showPedestal && (
        <group position={[0, pedestalY, 0]}>
          {/* Disco do pedestal */}
          <mesh receiveShadow castShadow>
            <cylinderGeometry args={[1.18, 1.28, 0.12, 56]} />
            <meshPhysicalMaterial
              color="#EFEAE3"
              roughness={0.28}
              metalness={0.08}
              clearcoat={0.4}
            />
          </mesh>

          {/* Anel luminoso sutil em torno do pedestal */}
          <mesh position={[0, 0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.17, 0.016, 16, 64]} />
            <meshStandardMaterial
              color={isHighlighted ? accentColor : '#C9B290'}
              emissive={isHighlighted ? accentColor : '#C9B290'}
              emissiveIntensity={isHighlighted ? 1.45 : 0.45}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
