import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * AlphaMap procedural com bordas suavemente arredondadas e esfumadas (vignette alpha)
 * para eliminar qualquer efeito visual de "cartão/folha retangular dura" no espaço 3D.
 */
let sharedFeatherAlphaMap = null;
function getSoftEditorialAlphaMap() {
  if (sharedFeatherAlphaMap || typeof document === 'undefined') {
    return sharedFeatherAlphaMap;
  }
  const W = 512;
  const H = 680;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  // Desenha uma cápsula editorial bem suave com desfoque orgânico nas bordas
  ctx.save();
  ctx.filter = 'blur(16px)';
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(22, 22, W - 44, H - 44, 72);
  ctx.fill();
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  sharedFeatherAlphaMap = tex;
  return tex;
}

/**
 * Carrega textura WebGL com CORS limpo e dispose seguro quando a URL muda (ex: Cloudinary Manager).
 */
function useEditorialTexture(url) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    loader.load(
      url,
      (loaded) => {
        if (cancelled) {
          loaded.dispose();
          return;
        }
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.anisotropy = 8;
        loaded.needsUpdate = true;
        setTexture((prev) => {
          if (prev && prev !== loaded) prev.dispose();
          return loaded;
        });
      },
      undefined,
      () => {
        // Silencioso em caso de URL digitada incompleta no gerenciador
      }
    );

    return () => {
      cancelled = true;
    };
  }, [url]);

  return texture;
}

/**
 * Plano 3D Curvo de Fotografia Editorial Lookbook (Estilo Zara / Bershka)
 * - ZERO bordas retangulares duras (alphaMap com feathering orgânico)
 * - Curvatura 3D sutil de tecido/revista de luxo + ondulação respiratória suave
 * - Brilho especular sutil (`MeshPhysicalMaterial`) + rotação suave entre Frente e Costas
 */
export default function EditorialGarment3D({
  frontUrl,
  backUrl,
  accentColor = '#D47A6A',
  width = 2.45,
  height = 3.25,
  waveIntensity = 0.045,
  parallax = { x: 0, y: 0 }
}) {
  const groupRef = useRef();
  const frontTex = useEditorialTexture(frontUrl);
  const backTex = useEditorialTexture(backUrl);
  const alphaMap = useMemo(() => getSoftEditorialAlphaMap(), []);

  // Geometria curva suave de alta densidade para movimento orgânico
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

    // Parallax suave acompanhando o mouse
    if (groupRef.current) {
      const targetRotX = THREE.MathUtils.clamp((parallax?.y || 0) * -0.09, -0.14, 0.14);
      const targetTiltY = THREE.MathUtils.clamp((parallax?.x || 0) * 0.12, -0.18, 0.18);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        Math.min(1, delta * 5)
      );
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetTiltY * 0.35,
        Math.min(1, delta * 5)
      );
    }

    // Curvatura elegante + respiração sutil de tecido vivo
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const arch = -0.11 * (bx * bx);
      const wave =
        Math.sin(by * 1.45 - t * 1.65 + bx * 0.95) *
        waveIntensity *
        (0.45 + Math.max(0, (height * 0.5 - by) / height));
      pos.setZ(i, arch + wave);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <group ref={groupRef}>
      {/* Fotografia Editorial - Frente */}
      <mesh geometry={geometry} position={[0, 0, 0.008]} castShadow>
        <meshPhysicalMaterial
          map={frontTex || null}
          color={frontTex ? '#FFFFFF' : accentColor}
          alphaMap={alphaMap}
          transparent
          alphaTest={0.04}
          roughness={0.26}
          metalness={0.04}
          clearcoat={0.28}
          clearcoatRoughness={0.24}
          sheen={0.55}
          sheenRoughness={0.45}
          sheenColor="#FFF7EE"
        />
      </mesh>

      {/* Fotografia / Ficha Editorial - Verso (Costas + Etiqueta) */}
      <mesh
        geometry={geometry}
        position={[0, 0, -0.008]}
        rotation={[0, Math.PI, 0]}
      >
        <meshPhysicalMaterial
          map={backTex || null}
          color={backTex ? '#FFFFFF' : accentColor}
          alphaMap={alphaMap}
          transparent
          alphaTest={0.04}
          roughness={0.32}
          metalness={0.04}
          clearcoat={0.2}
          sheen={0.45}
          sheenColor="#FFF7EE"
        />
      </mesh>
    </group>
  );
}
