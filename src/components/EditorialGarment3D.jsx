import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * AlphaMap procedural com bordas arredondadas elegantes (3:4) para evitar
 * cantos retos de folha e integrar a fotografia editorial ao espaço 3D.
 */
let sharedRoundedAlphaMap = null;
function getRoundedEditorialAlphaMap() {
  if (sharedRoundedAlphaMap || typeof document === 'undefined') {
    return sharedRoundedAlphaMap;
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
  ctx.filter = 'blur(5px)';
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(10, 10, W - 20, H - 20, 48);
  ctx.fill();
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  sharedRoundedAlphaMap = tex;
  return tex;
}

/**
 * Carregador confiável de textura para imagens locais (`/roupas/*.png`),
 * Data URLs e URLs Cloudinary CORS, garantindo `needsUpdate = true` e
 * recompilação correta do material no Three.js (zero planos brancos!).
 */
function useReliableEditorialTexture(url) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!url) {
      setTexture(null);
      return;
    }

    let cancelled = false;
    const img = new Image();
    if (/^https?:\/\//i.test(url)) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      if (cancelled) return;
      const tex = new THREE.Texture(img);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;

      setTexture((prev) => {
        if (prev && prev !== tex) prev.dispose();
        return tex;
      });
    };

    img.onerror = () => {
      if (!cancelled) {
        console.warn('[Harumi Modas 3D] Falha ao carregar textura:', url);
      }
    };

    img.src = url;

    return () => {
      cancelled = true;
    };
  }, [url]);

  return texture;
}

/**
 * Fotografia Editorial Lookbook 3D (Proporção 3:4, bordas arredondadas, curvatura sutil,
 * parallax 3D suave, brilho especular discreto e rotação Frente/Costas sem quadros brancos).
 */
export default function EditorialGarment3D({
  frontUrl,
  backUrl,
  accentColor = '#E6BFB6',
  width = 2.34,
  height = 3.12,
  waveIntensity = 0.036,
  parallax = { x: 0, y: 0 }
}) {
  const groupRef = useRef();
  const frontMatRef = useRef();
  const backMatRef = useRef();

  const frontTex = useReliableEditorialTexture(frontUrl);
  const backTex = useReliableEditorialTexture(backUrl);
  const alphaMap = useMemo(() => getRoundedEditorialAlphaMap(), []);

  useEffect(() => {
    if (frontMatRef.current) {
      frontMatRef.current.needsUpdate = true;
    }
  }, [frontTex]);

  useEffect(() => {
    if (backMatRef.current) {
      backMatRef.current.needsUpdate = true;
    }
  }, [backTex]);

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(width, height, 28, 36),
    [width, height]
  );
  const basePositions = useMemo(
    () => Float32Array.from(geometry.attributes.position.array),
    [geometry]
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      const targetRotX = THREE.MathUtils.clamp((parallax?.y || 0) * -0.08, -0.13, 0.13);
      const targetShiftX = THREE.MathUtils.clamp((parallax?.x || 0) * 0.08, -0.14, 0.14);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        Math.min(1, delta * 5)
      );
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetShiftX,
        Math.min(1, delta * 5)
      );
    }

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const arch = -0.085 * (bx * bx);
      const wave =
        Math.sin(by * 1.4 - t * 1.55 + bx * 0.9) *
        waveIntensity *
        (0.4 + Math.max(0, (height * 0.5 - by) / height));
      pos.setZ(i, arch + wave);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <group ref={groupRef}>
      {/* Fotografia Editorial Real - Frente */}
      <mesh geometry={geometry} position={[0, 0, 0.009]} castShadow>
        <meshPhysicalMaterial
          ref={frontMatRef}
          key={frontTex ? `f-${frontTex.uuid}` : 'f-init'}
          map={frontTex || undefined}
          color={frontTex ? '#FFFFFF' : accentColor}
          alphaMap={alphaMap}
          transparent
          alphaTest={0.05}
          roughness={0.44}
          metalness={0.02}
          clearcoat={0.14}
          clearcoatRoughness={0.35}
          sheen={0.32}
          sheenRoughness={0.55}
          sheenColor="#FFF8F0"
        />
      </mesh>

      {/* Verso Editorial - Costas / Etiqueta Harumi Modas */}
      <mesh
        geometry={geometry}
        position={[0, 0, -0.009]}
        rotation={[0, Math.PI, 0]}
      >
        <meshPhysicalMaterial
          ref={backMatRef}
          key={backTex ? `b-${backTex.uuid}` : 'b-init'}
          map={backTex || undefined}
          color={backTex ? '#FFFFFF' : accentColor}
          alphaMap={alphaMap}
          transparent
          alphaTest={0.05}
          roughness={0.46}
          metalness={0.02}
          clearcoat={0.1}
          sheen={0.28}
          sheenColor="#FFF8F0"
        />
      </mesh>
    </group>
  );
}
