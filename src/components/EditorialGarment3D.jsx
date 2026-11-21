import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * AlphaMap arredondado elegante (proporção 3:4) — pré-calculado 1 única vez.
 */
let sharedRoundedMask = null;
function getRoundedPanelAlphaMap() {
  if (sharedRoundedMask || typeof document === 'undefined') {
    return sharedRoundedMask;
  }
  const W = 512;
  const H = 682;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(6, 6, W - 12, H - 12, 54);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  sharedRoundedMask = tex;
  return tex;
}

/**
 * Sombra circular estática suave (Blob Shadow) — zero custo de shadow-map em GPU mobile.
 */
let sharedBlobShadowTex = null;
function getBlobShadowTexture() {
  if (sharedBlobShadowTex || typeof document === 'undefined') {
    return sharedBlobShadowTex;
  }
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.04,
    size / 2,
    size / 2,
    size * 0.48
  );
  grad.addColorStop(0, 'rgba(24, 22, 21, 0.34)');
  grad.addColorStop(0.55, 'rgba(24, 22, 21, 0.14)');
  grad.addColorStop(1, 'rgba(24, 22, 21, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  sharedBlobShadowTex = tex;
  return tex;
}

/**
 * Cache leve de texturas carregadas para evitar re-download no mobile ao girar o carrossel.
 */
const loadedTextureCache = new Map();

function useCachedGarmentTexture(url) {
  const [texture, setTexture] = useState(() =>
    url && loadedTextureCache.has(url) ? loadedTextureCache.get(url) : null
  );

  useEffect(() => {
    if (!url) {
      setTexture(null);
      return;
    }

    if (loadedTextureCache.has(url)) {
      setTexture(loadedTextureCache.get(url));
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
      tex.anisotropy = 4;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;

      loadedTextureCache.set(url, tex);
      setTexture(tex);
    };

    img.onerror = () => {
      if (!cancelled) {
        console.warn('[Harumi Modas 3D] Erro ao carregar imagem:', url);
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
 * Cria geometria 3D curva elegante (proporção 3:4) pré-esculpida uma única vez
 * — zero recomputação de vértices/normais por frame (60fps garantidos no iPhone/Safari).
 */
function buildCurvedPanelGeometry(width, height, curveDepth = 0.14) {
  const geo = new THREE.PlaneGeometry(width, height, 18, 12);
  const pos = geo.attributes.position;
  const halfW = width / 2;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const nx = x / halfW; // -1 a +1
    const z = (1 - nx * nx) * curveDepth - curveDepth * 0.5;
    pos.setZ(i, z);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/**
 * Painel 3D Curvo Premium de Peça Isolada (Ghost Mannequin / Packshot)
 * - Ultra leve para 60fps no iPhone/Android
 * - Bordas arredondadas suaves, acabamento acetinado (`MeshPhysicalMaterial` leve)
 * - Sombra circular estática (blob shadow) suave sob a peça
 */
export default function EditorialGarment3D({
  frontUrl,
  backUrl,
  accentColor = '#F3DFDA',
  width = 2.34,
  height = 3.12,
  showBlobShadow = true,
  parallax = { x: 0, y: 0 },
  floatOffset = 0
}) {
  const cardRef = useRef();
  const frontMatRef = useRef();
  const backMatRef = useRef();

  const frontTex = useCachedGarmentTexture(frontUrl);
  const backTex = useCachedGarmentTexture(backUrl || frontUrl);
  const alphaMap = useMemo(() => getRoundedPanelAlphaMap(), []);
  const blobShadowTex = useMemo(() => getBlobShadowTexture(), []);

  const geometry = useMemo(
    () => buildCurvedPanelGeometry(width, height, 0.14),
    [width, height]
  );

  useEffect(() => {
    if (frontMatRef.current) frontMatRef.current.needsUpdate = true;
  }, [frontTex]);

  useEffect(() => {
    if (backMatRef.current) backMatRef.current.needsUpdate = true;
  }, [backTex]);

  useFrame((state, delta) => {
    if (!cardRef.current) return;
    const t = state.clock.getElapsedTime();
    const targetRotX = THREE.MathUtils.clamp((parallax?.y || 0) * -0.1, -0.16, 0.16);
    const targetRotY = THREE.MathUtils.clamp((parallax?.x || 0) * 0.14, -0.22, 0.22);

    cardRef.current.rotation.x = THREE.MathUtils.lerp(
      cardRef.current.rotation.x,
      targetRotX,
      Math.min(1, delta * 6)
    );
    cardRef.current.rotation.y = THREE.MathUtils.lerp(
      cardRef.current.rotation.y,
      targetRotY,
      Math.min(1, delta * 6)
    );
    cardRef.current.position.y = Math.sin(t * 1.3 + floatOffset) * 0.045;
  });

  return (
    <group>
      <group ref={cardRef}>
        {/* Frente - Packshot Isolado */}
        <mesh geometry={geometry} position={[0, 0, 0.006]}>
          <meshPhysicalMaterial
            ref={frontMatRef}
            key={frontTex ? `f-${frontTex.uuid}` : 'f-loading'}
            map={frontTex || undefined}
            color={frontTex ? '#FFFFFF' : accentColor}
            alphaMap={alphaMap}
            transparent
            alphaTest={0.05}
            roughness={0.38}
            metalness={0.02}
            clearcoat={0.16}
            clearcoatRoughness={0.34}
            sheen={0.3}
            sheenColor="#FFF8F0"
          />
        </mesh>

        {/* Verso */}
        <mesh geometry={geometry} position={[0, 0, -0.006]} rotation={[0, Math.PI, 0]}>
          <meshPhysicalMaterial
            ref={backMatRef}
            key={backTex ? `b-${backTex.uuid}` : 'b-loading'}
            map={backTex || undefined}
            color={backTex ? '#F5F0EA' : accentColor}
            alphaMap={alphaMap}
            transparent
            alphaTest={0.05}
            roughness={0.44}
            metalness={0.02}
            clearcoat={0.1}
          />
        </mesh>
      </group>

      {/* Sombra circular estática suave (Blob Shadow) — 0 custo de shadow-map */}
      {showBlobShadow && (
        <mesh
          position={[0, -height / 2 - 0.24, -0.05]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1.15, 0.62, 1]}
        >
          <circleGeometry args={[1.1, 32]} />
          <meshBasicMaterial
            map={blobShadowTex}
            transparent
            depthWrite={false}
            opacity={0.78}
          />
        </mesh>
      )}
    </group>
  );
}
