import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Gera micro-textura de tecido (cetim, ripstop, canelado ou malha fluida)
 * aplicada diretamente sobre a malha 3D esculpida — ZERO plano retangular.
 */
function createFabricMicroTexture(silhouette, baseColor) {
  if (typeof document === 'undefined') return null;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  if (silhouette === 'ribbed-cutout') {
    for (let x = 0; x < size; x += 8) {
      ctx.fillStyle = x % 16 === 0 ? 'rgba(255,255,255,0.16)' : 'rgba(40,10,20,0.14)';
      ctx.fillRect(x, 0, 4, size);
    }
  } else if (silhouette === 'cargo-parachute') {
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.lineWidth = 1;
    for (let i = 0; i < size; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }
  } else if (silhouette === 'satin-corset' || silhouette === 'mini-draped') {
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, 'rgba(255,255,255,0.15)');
    g.addColorStop(0.5, 'rgba(0,0,0,0.06)');
    g.addColorStop(1, 'rgba(255,255,255,0.14)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  } else {
    for (let y = 0; y < size; y += 6) {
      ctx.fillStyle = y % 12 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
      ctx.fillRect(0, y, size, 3);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Etiqueta interna tecida "HARUMI MODAS" em 3D nas costas/gola da peça
 */
function HarumiBackLabel({ position = [0, 0.52, -0.22], rotation = [0, Math.PI, 0] }) {
  const labelTex = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 96;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#F7F3EC';
    ctx.fillRect(0, 0, 256, 96);
    ctx.strokeStyle = '#C9B290';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 240, 80);
    ctx.fillStyle = '#181615';
    ctx.font = 'bold 24px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('HARUMI MODAS', 128, 48);
    ctx.fillStyle = '#8C7554';
    ctx.font = '600 13px sans-serif';
    ctx.fillText('TOKYO • STREET LUXE', 128, 72);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[0.26, 0.095, 0.012]} />
      <meshStandardMaterial map={labelTex} roughness={0.6} />
    </mesh>
  );
}

/**
 * Helper: cria malha tubular anatômica esculpida (torso, saia, vestido ou perna)
 * com secção elíptica, dobras de tecido reais em 3D, decote/barra recortados.
 */
function buildSculptedTubeGeometry({
  height = 1.6,
  radialSegments = 52,
  heightSegments = 38,
  radiusXFn,
  radiusZFn,
  topCutFn = () => 0,
  bottomCutFn = () => 0,
  foldFn = () => 0,
  slitCheckFn = null
}) {
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let iy = 0; iy <= heightSegments; iy++) {
    const v = iy / heightSegments; // 0 = base, 1 = topo
    for (let ix = 0; ix <= radialSegments; ix++) {
      const u = ix / radialSegments;
      const theta = u * Math.PI * 2; // 0 = +Z (frente) se usarmos sin/cos adequados
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      const yTop = height / 2 + topCutFn(theta);
      const yBot = -height / 2 + bottomCutFn(theta);
      const y = THREE.MathUtils.lerp(yBot, yTop, v);

      const rx = radiusXFn(v, theta);
      const rz = radiusZFn(v, theta);
      const fold = foldFn(v, theta);

      const x = (rx + fold) * sinT;
      const z = (rz + fold) * cosT;

      positions.push(x, y, z);
      uvs.push(u, v);
    }
  }

  const row = radialSegments + 1;
  for (let iy = 0; iy < heightSegments; iy++) {
    const vMid = (iy + 0.5) / heightSegments;
    for (let ix = 0; ix < radialSegments; ix++) {
      const thetaMid = ((ix + 0.5) / radialSegments) * Math.PI * 2;
      if (slitCheckFn && slitCheckFn(vMid, thetaMid)) continue;

      const a = iy * row + ix;
      const b = a + 1;
      const c = (iy + 1) * row + ix;
      const d = c + 1;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * 1) CORSET CROPPED ACETINADO (#D47A6A)
 * Silhueta estruturada com decote coração, barbatanas verticais, bico frontal e alças finas 3D.
 */
function SatinCorset3D({ material, accentMaterial }) {
  const bodiceGeo = useMemo(
    () =>
      buildSculptedTubeGeometry({
        height: 1.32,
        radialSegments: 60,
        heightSegments: 36,
        radiusXFn: (v) => {
          // Ampulheta marcada: busto cheio no topo, cintura bem marcada em baixo
          const waist = 0.54;
          const bust = 0.72;
          return waist + Math.pow(v, 1.3) * (bust - waist) + Math.sin(v * Math.PI) * 0.05;
        },
        radiusZFn: (v, theta) => {
          const frontFactor = Math.max(0, Math.cos(theta));
          const bustPush = Math.exp(-Math.pow((v - 0.76) / 0.24, 2)) * 0.19 * frontFactor;
          return 0.34 + v * 0.07 + bustPush;
        },
        topCutFn: (theta) => {
          // Decote coração real na frente (theta ~ 0) + costas mais baixas (theta ~ PI)
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);
          const heartDip = -0.18 * Math.exp(-Math.pow(sinT / 0.24, 2)) * Math.max(0, cosT);
          const bustPeaks = 0.14 * Math.exp(-Math.pow((Math.abs(sinT) - 0.48) / 0.26, 2)) * Math.max(0, cosT);
          const backDrop = -0.14 * Math.max(0, -cosT);
          return heartDip + bustPeaks + backDrop;
        },
        bottomCutFn: (theta) => {
          // Bico frontal clássico de corset (V apontado para baixo)
          const front = Math.max(0, Math.cos(theta));
          return -0.22 * Math.pow(front, 2.2);
        },
        foldFn: (v, theta) => {
          // Relevo sutil das barbatanas estruturadas
          return Math.cos(theta * 8) * 0.012 * (0.4 + 0.6 * v);
        }
      }),
    []
  );

  // Alças finas 3D sobre os ombros
  const straps = useMemo(() => {
    return [-1, 1].map((side) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.36, 0.74, 0.36),
        new THREE.Vector3(side * 0.42, 1.18, 0.14),
        new THREE.Vector3(side * 0.38, 1.16, -0.18),
        new THREE.Vector3(side * 0.32, 0.56, -0.34)
      ]);
      return new THREE.TubeGeometry(curve, 28, 0.024, 10, false);
    });
  }, []);

  // Barbatanas externas sutis acompanhando a frente
  const boningCurves = useMemo(() => {
    return [-0.36, -0.17, 0.17, 0.36].map((xOff) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(xOff * 0.9, -0.76 + Math.abs(xOff) * 0.35, 0.34 - Math.abs(xOff) * 0.14),
        new THREE.Vector3(xOff, 0.02, 0.44 - Math.abs(xOff) * 0.22),
        new THREE.Vector3(xOff * 1.06, 0.66, 0.49 - Math.abs(xOff) * 0.32)
      ]);
      return new THREE.TubeGeometry(curve, 20, 0.012, 8, false);
    });
  }, []);

  return (
    <group position={[0, -0.1, 0]} scale={1.18}>
      <mesh geometry={bodiceGeo} material={material} castShadow receiveShadow />
      {straps.map((geo, i) => (
        <mesh key={`strap-${i}`} geometry={geo} material={accentMaterial} castShadow />
      ))}
      {boningCurves.map((geo, i) => (
        <mesh key={`bone-${i}`} geometry={geo} material={accentMaterial} />
      ))}
      {/* Costura e zíper metálico fino nas costas */}
      <mesh position={[0, -0.05, -0.39]}>
        <boxGeometry args={[0.028, 1.12, 0.02]} />
        <meshStandardMaterial color="#D9C3A3" metalness={0.8} roughness={0.25} />
      </mesh>
      <HarumiBackLabel position={[0, 0.36, -0.33]} />
    </group>
  );
}

/**
 * 2) CALÇA CARGO PARACHUTE (#D5C7B2)
 * Cintura ajustável com cordão, pernas largas volumosas, bolsos cargo 3D laterais e punhos franzidos.
 */
function CargoParachute3D({ material, accentMaterial }) {
  const pelvisGeo = useMemo(
    () =>
      buildSculptedTubeGeometry({
        height: 0.78,
        radialSegments: 48,
        heightSegments: 20,
        radiusXFn: (v) => 0.72 - v * 0.14,
        radiusZFn: (v) => 0.42 - v * 0.07,
        foldFn: (v, theta) => Math.sin(theta * 10) * 0.016 * (1 - v * 0.3)
      }),
    []
  );

  const legGeo = useMemo(
    () =>
      buildSculptedTubeGeometry({
        height: 1.98,
        radialSegments: 42,
        heightSegments: 36,
        radiusXFn: (v) => {
          // Punho bem franzido embaixo (v=0), volume balão parachute na perna toda
          const cuff = Math.min(1, v / 0.09);
          const balloon = 0.23 + cuff * 0.24 + Math.sin(v * Math.PI) * 0.085;
          return balloon;
        },
        radiusZFn: (v) => {
          const cuff = Math.min(1, v / 0.09);
          return 0.21 + cuff * 0.21 + Math.sin(v * Math.PI) * 0.07;
        },
        foldFn: (v, theta) => {
          // Pregas horizontais características no joelho (v ~ 0.45) + franzido no tornozelo
          const kneePleat = Math.exp(-Math.pow((v - 0.46) / 0.08, 2)) * Math.cos(theta) * 0.045;
          const cuffGather = Math.exp(-Math.pow((v - 0.08) / 0.06, 2)) * Math.sin(theta * 12) * 0.02;
          return kneePleat + cuffGather;
        }
      }),
    []
  );

  // Bolso cargo 3D em ExtrudeGeometry com tampa chanfrada
  const pocketGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.16, -0.22);
    shape.lineTo(0.16, -0.22);
    shape.lineTo(0.16, 0.22);
    shape.lineTo(-0.16, 0.22);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.11,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.025,
      bevelThickness: 0.025
    });
  }, []);

  const drawstringGeos = useMemo(() => {
    return [-1, 1].map((side) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.04, 1.18, 0.37),
        new THREE.Vector3(side * 0.09, 0.94, 0.44),
        new THREE.Vector3(side * 0.06, 0.72, 0.42)
      ]);
      return new THREE.TubeGeometry(curve, 18, 0.014, 8, false);
    });
  }, []);

  return (
    <group position={[0, -0.05, 0]} scale={0.95}>
      {/* Quadril + Cós ajustável */}
      <mesh position={[0, 0.88, 0]} geometry={pelvisGeo} material={material} castShadow receiveShadow />
      {/* Cós elástico franzido */}
      <mesh position={[0, 1.24, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.18, 0.74, 1]}>
        <torusGeometry args={[0.48, 0.07, 14, 48]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>

      {/* Cordões da cintura */}
      {drawstringGeos.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial color="#8E7D65" roughness={0.7} />
        </mesh>
      ))}

      {/* Perna Esquerda e Perna Direita */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.37, -0.26, 0]} rotation={[0, 0, side * -0.045]}>
          <mesh geometry={legGeo} material={material} castShadow receiveShadow />
          {/* Punho elástico do tornozelo */}
          <mesh position={[0, -0.96, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.21, 0.042, 12, 32]} />
            <primitive object={accentMaterial} attach="material" />
          </mesh>
          {/* Bolso Cargo 3D volumoso lateral */}
          <group
            position={[side * 0.45, 0.28, 0.02]}
            rotation={[0, side * (Math.PI / 2), 0]}
          >
            <mesh geometry={pocketGeo} material={accentMaterial} castShadow />
            {/* Tampa do bolso */}
            <mesh position={[0, 0.18, 0.08]}>
              <boxGeometry args={[0.37, 0.12, 0.14]} />
              <primitive object={material} attach="material" />
            </mesh>
          </group>
        </group>
      ))}

      {/* Etiqueta traseira no cós */}
      <HarumiBackLabel position={[0, 1.14, -0.36]} />
    </group>
  );
}

/**
 * 3) JAQUETA BOMBER OVERSIZED (#8FA696)
 * Corpo volumoso, zíper metálico, mangas bufantes com franzido e gola/barra ribana.
 */
function BomberOversized3D({ material, accentMaterial }) {
  const torsoGeo = useMemo(
    () =>
      buildSculptedTubeGeometry({
        height: 1.56,
        radialSegments: 54,
        heightSegments: 32,
        radiusXFn: (v) => 0.72 + Math.sin(v * Math.PI) * 0.22,
        radiusZFn: (v) => 0.44 + Math.sin(v * Math.PI) * 0.16,
        topCutFn: (theta) => -0.08 * Math.max(0, Math.cos(theta)),
        foldFn: (v, theta) => Math.sin(v * Math.PI * 5) * 0.015 * Math.abs(Math.sin(theta))
      }),
    []
  );

  // Mangas bufantes curvadas em 3D com franzido (ruching)
  const sleeves = useMemo(() => {
    return [-1, 1].map((side) => {
      const geo = buildSculptedTubeGeometry({
        height: 1.52,
        radialSegments: 34,
        heightSegments: 34,
        radiusXFn: (v) => {
          const cuff = Math.min(1, v / 0.12);
          return 0.16 + cuff * 0.17 + Math.sin(v * Math.PI) * 0.095;
        },
        radiusZFn: (v) => {
          const cuff = Math.min(1, v / 0.12);
          return 0.16 + cuff * 0.17 + Math.sin(v * Math.PI) * 0.095;
        },
        foldFn: (v) => Math.sin(v * Math.PI * 14) * 0.022
      });
      return { side, geo };
    });
  }, []);

  return (
    <group position={[0, -0.05, 0]} scale={0.96}>
      {/* Corpo oversized */}
      <mesh geometry={torsoGeo} material={material} castShadow receiveShadow />

      {/* Gola Ribana */}
      <mesh position={[0, 0.79, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.1, 0.85, 1]}>
        <torusGeometry args={[0.38, 0.095, 16, 40]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>

      {/* Barra Ribana inferior */}
      <mesh position={[0, -0.78, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.18, 0.78, 1]}>
        <torusGeometry args={[0.58, 0.1, 16, 44]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>

      {/* Zíper Metálico Frontal + Puxador */}
      <mesh position={[0, -0.02, 0.59]}>
        <boxGeometry args={[0.048, 1.56, 0.04]} />
        <meshStandardMaterial color="#DFE4EA" metalness={0.88} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.42, 0.63]}>
        <boxGeometry args={[0.06, 0.13, 0.025]} />
        <meshStandardMaterial color="#C9B290" metalness={0.9} roughness={0.16} />
      </mesh>

      {/* Mangas Bufantes + Punhos Ribana + Bolso Utilitário */}
      {sleeves.map(({ side, geo }) => (
        <group
          key={side}
          position={[side * 0.98, -0.06, -0.02]}
          rotation={[0.08, 0, side * 0.25]}
        >
          <mesh geometry={geo} material={material} castShadow receiveShadow />
          {/* Punho ribana */}
          <mesh position={[0, -0.74, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16, 0.055, 14, 30]} />
            <primitive object={accentMaterial} attach="material" />
          </mesh>
          {/* Bolso utilitário de voo na manga esquerda */}
          {side === -1 && (
            <group position={[-0.29, 0.24, 0.04]} rotation={[0, -Math.PI / 2, 0]}>
              <mesh material={accentMaterial}>
                <boxGeometry args={[0.24, 0.3, 0.07]} />
              </mesh>
              <mesh position={[0, -0.18, 0.045]} rotation={[0, 0, 0.12]}>
                <boxGeometry args={[0.055, 0.24, 0.012]} />
                <meshStandardMaterial color="#D47A6A" roughness={0.45} />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* Costura traseira e etiqueta */}
      <mesh position={[0, 0, -0.57]}>
        <boxGeometry args={[0.018, 1.48, 0.018]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>
      <HarumiBackLabel position={[0, 0.64, -0.34]} />
    </group>
  );
}

/**
 * 4) CONJUNTO RIBBED CUT-OUT (#E295A8)
 * Top assimétrico com recorte cut-out + saia midi justa com fenda lateral real.
 */
function RibbedCutOut3D({ material, accentMaterial }) {
  const topGeo = useMemo(
    () =>
      buildSculptedTubeGeometry({
        height: 0.72,
        radialSegments: 54,
        heightSegments: 24,
        radiusXFn: (v) => 0.56 + v * 0.1,
        radiusZFn: (v, theta) => {
          const front = Math.max(0, Math.cos(theta));
          return 0.34 + v * 0.06 + front * Math.sin(v * Math.PI) * 0.1;
        },
        topCutFn: (theta) => {
          // Decote diagonal assimétrico de um ombro só
          return Math.sin(theta) * -0.14;
        },
        foldFn: (v, theta) => Math.cos(theta * 24) * 0.008,
        // Recorte cut-out frontal moderno!
        slitCheckFn: (v, theta) => {
          const normT = theta > Math.PI ? theta - Math.PI * 2 : theta;
          return v > 0.34 && v < 0.66 && Math.abs(normT - 0.18) < 0.34;
        }
      }),
    []
  );

  const strapGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.38, 1.15, 0.34),
      new THREE.Vector3(-0.44, 1.54, 0.08),
      new THREE.Vector3(-0.38, 1.48, -0.22),
      new THREE.Vector3(-0.3, 1.06, -0.35)
    ]);
    return new THREE.TubeGeometry(curve, 26, 0.065, 12, false);
  }, []);

  const skirtGeo = useMemo(
    () =>
      buildSculptedTubeGeometry({
        height: 1.56,
        radialSegments: 56,
        heightSegments: 36,
        radiusXFn: (v) => {
          // Cintura alta -> quadril cheio -> midi justa
          const hipCurve = Math.exp(-Math.pow((v - 0.72) / 0.28, 2)) * 0.16;
          return 0.54 + hipCurve;
        },
        radiusZFn: (v) => {
          const hipCurve = Math.exp(-Math.pow((v - 0.72) / 0.28, 2)) * 0.12;
          return 0.34 + hipCurve;
        },
        foldFn: (v, theta) => Math.cos(theta * 24) * 0.009,
        // Fenda lateral alta elegante na perna direita (theta ~ PI/2)
        slitCheckFn: (v, theta) => {
          return v < 0.56 && Math.abs(theta - Math.PI * 0.44) < 0.22 * (1 - v * 0.7);
        }
      }),
    []
  );

  return (
    <group position={[0, -0.08, 0]} scale={0.96}>
      {/* Top Cropped Assimétrico */}
      <mesh position={[0, 0.86, 0]} geometry={topGeo} material={material} castShadow receiveShadow />
      {/* Alça larga de um ombro só */}
      <mesh geometry={strapGeo} material={accentMaterial} castShadow />

      {/* Saia Midi com Fenda Lateral */}
      <mesh position={[0, -0.44, 0]} geometry={skirtGeo} material={material} castShadow receiveShadow />
      {/* Cós da saia */}
      <mesh position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.18, 0.76, 1]}>
        <torusGeometry args={[0.47, 0.04, 12, 44]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>

      <HarumiBackLabel position={[0, 0.96, -0.35]} />
    </group>
  );
}

/**
 * 5) VESTIDO MINI DRAPEADO ÔNIX (#7D7A85)
 * Silhueta noite/balada com alças assimétricas, drapeado lateral ajustável em 3D e cordões pendentes.
 */
function MiniDrapedOnyx3D({ material, accentMaterial }) {
  const dressGeo = useMemo(
    () =>
      buildSculptedTubeGeometry({
        height: 1.94,
        radialSegments: 60,
        heightSegments: 44,
        radiusXFn: (v) => {
          const bust = Math.exp(-Math.pow((v - 0.86) / 0.18, 2)) * 0.14;
          const hip = Math.exp(-Math.pow((v - 0.36) / 0.24, 2)) * 0.17;
          return 0.5 + bust + hip;
        },
        radiusZFn: (v, theta) => {
          const front = Math.max(0, Math.cos(theta));
          const bust = Math.exp(-Math.pow((v - 0.86) / 0.18, 2)) * 0.12 * front;
          const hip = Math.exp(-Math.pow((v - 0.36) / 0.24, 2)) * 0.13;
          return 0.33 + bust + hip;
        },
        topCutFn: (theta) => {
          // Decote assimétrico diagonal na frente + costas cavadas
          const backDrop = -0.22 * Math.max(0, -Math.cos(theta));
          return Math.sin(theta) * 0.09 + backDrop;
        },
        bottomCutFn: (theta) => {
          // Barra drapeada assimétrica mais curtinha na lateral do franzido
          return Math.max(0, Math.sin(theta)) * 0.22;
        },
        foldFn: (v, theta) => {
          // Drapeado horizontal escultural concentrado na lateral & cintura
          const sideBias = 0.55 + 0.45 * Math.sin(theta);
          return Math.sin(v * Math.PI * 16 + theta * 1.6) * 0.028 * sideBias;
        }
      }),
    []
  );

  // Alças assimétricas (uma reta, uma dupla cruzada)
  const straps = useMemo(() => {
    const s1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.36, 0.88, 0.34),
      new THREE.Vector3(-0.4, 1.36, 0.1),
      new THREE.Vector3(-0.34, 1.32, -0.2),
      new THREE.Vector3(-0.28, 0.72, -0.34)
    ]);
    const s2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.38, 1.0, 0.32),
      new THREE.Vector3(0.42, 1.38, 0.08),
      new THREE.Vector3(0.36, 1.32, -0.2),
      new THREE.Vector3(0.28, 0.72, -0.34)
    ]);
    const sCross = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.08, 0.94, 0.43),
      new THREE.Vector3(0.22, 1.24, 0.26),
      new THREE.Vector3(0.42, 1.38, 0.08)
    ]);
    return [s1, s2, sCross].map((c) => new THREE.TubeGeometry(c, 26, 0.02, 8, false));
  }, []);

  // Cordões pendentes do drapeado lateral
  const tieCords = useMemo(() => {
    return [0, 1].map((idx) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.62, -0.74, 0.06),
        new THREE.Vector3(0.66 + idx * 0.08, -1.04, 0.12 - idx * 0.08),
        new THREE.Vector3(0.6 + idx * 0.12, -1.28, 0.04)
      ]);
      return new THREE.TubeGeometry(curve, 16, 0.012, 8, false);
    });
  }, []);

  return (
    <group position={[0, -0.06, 0]} scale={1.0}>
      <mesh geometry={dressGeo} material={material} castShadow receiveShadow />
      {straps.map((geo, i) => (
        <mesh key={`s-${i}`} geometry={geo} material={accentMaterial} />
      ))}
      {tieCords.map((geo, i) => (
        <mesh key={`tie-${i}`} geometry={geo}>
          <meshStandardMaterial color="#C8C4D4" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
      <HarumiBackLabel position={[0, 0.56, -0.32]} />
    </group>
  );
}

/**
 * Componente principal da peça 3D esculpida — respiração/caimento suave em tempo real.
 */
export default function Garment3DModel({ product, animateBreathe = true }) {
  const wrapRef = useRef();

  const { material, accentMaterial } = useMemo(() => {
    const tex = createFabricMicroTexture(product.silhouette, product.color);
    const props = product.materialProps;

    const mainMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: tex,
      roughness: props.roughness,
      metalness: props.metalness,
      sheen: props.sheen,
      sheenRoughness: props.sheenRoughness,
      sheenColor: new THREE.Color(props.sheenColor),
      clearcoat: props.clearcoat,
      clearcoatRoughness: 0.26,
      side: THREE.DoubleSide
    });

    const accentMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(product.colorDeep),
      roughness: Math.min(0.95, props.roughness + 0.14),
      metalness: props.metalness * 0.5,
      sheen: props.sheen * 0.7,
      sheenColor: new THREE.Color(props.sheenColor),
      side: THREE.DoubleSide
    });

    return { material: mainMat, accentMaterial: accentMat };
  }, [product]);

  useFrame((state) => {
    if (!wrapRef.current || !animateBreathe) return;
    const t = state.clock.getElapsedTime();
    wrapRef.current.position.y = Math.sin(t * 1.45) * 0.045;
  });

  return (
    <group ref={wrapRef}>
      {product.silhouette === 'satin-corset' && (
        <SatinCorset3D material={material} accentMaterial={accentMaterial} />
      )}
      {product.silhouette === 'cargo-parachute' && (
        <CargoParachute3D material={material} accentMaterial={accentMaterial} />
      )}
      {product.silhouette === 'bomber-oversized' && (
        <BomberOversized3D material={material} accentMaterial={accentMaterial} />
      )}
      {product.silhouette === 'ribbed-cutout' && (
        <RibbedCutOut3D material={material} accentMaterial={accentMaterial} />
      )}
      {product.silhouette === 'mini-draped' && (
        <MiniDrapedOnyx3D material={material} accentMaterial={accentMaterial} />
      )}
    </group>
  );
}
