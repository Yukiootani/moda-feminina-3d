// Catálogo HARUMI MODAS • Ecossistema Portal LOJAS JP
// Cloudinary Helper (cloud name: jontqsrz) + Gerador Procedural Canvas de Alta Resolução (Frente & Verso)

export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'jontqsrz';

/**
 * Monta a URL otimizada do Cloudinary quando o publicId estiver preenchido.
 * Exemplo: getCloudinaryUrl('harumi/vestido-terracota-frente', 'f_auto,q_auto,w_1200')
 */
export function getCloudinaryUrl(
  publicId,
  transforms = 'f_auto,q_auto:best,w_1200'
) {
  if (!publicId || typeof publicId !== 'string' || !publicId.trim()) {
    return null;
  }
  const cleanId = publicId.trim().replace(/^\/+/, '');
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${cleanId}`;
}

export function formatYen(amount) {
  return `¥${Math.round(amount).toLocaleString('pt-BR')}`;
}

export const PRODUCTS = [
  {
    id: 'vestido-midi-seda-terracota',
    code: '01',
    sku: 'HM-2601',
    name: 'Vestido Midi Seda Terracota',
    shortName: 'Seda Terracota',
    category: 'Vestido Midi',
    price: 12800,
    color: '#C88A75',
    colorDeep: '#8E5644',
    colorSoft: '#EFE0D9',
    bgTint: '#DFC1B4',
    accentText: '#4F2D22',
    silhouette: 'silk-dress',
    fabricHeadline: '100% SEDA PURA. CAIMENTO FLUIDO.',
    fabricTitle: 'Seda Mulberry 22 Momme',
    fabricDescription:
      'Seda pura de corte enviesado que acompanha o movimento natural do corpo com brilho acetinado discreto e toque fresco sobre a pele.',
    composition: '100% Seda Mulberry Natural • Forro 100% Cupro Japonês',
    care: 'Lavagem a seco especializada • Passar a vapor em temperatura mínima',
    hollowBgTop: 'TOQUE DE SEDA',
    hollowBgBottom: 'CORTE PERFEITO 01',
    tagline: 'Fluidez escultural em seda natural tingida artesanalmente.',
    cloudinaryFrontId: '',
    cloudinaryBackId: '',
    materialProps: {
      roughness: 0.28,
      metalness: 0.08,
      sheen: 1.0,
      sheenRoughness: 0.25,
      sheenColor: '#F3D2C3',
      clearcoat: 0.22
    },
    sizeGuide: [
      { size: 'P', bust: '82–86 cm', waist: '64–68 cm', hip: '90–94 cm', length: '118 cm' },
      { size: 'M', bust: '87–91 cm', waist: '69–73 cm', hip: '95–99 cm', length: '120 cm' },
      { size: 'G', bust: '92–97 cm', waist: '74–79 cm', hip: '100–105 cm', length: '122 cm' },
      { size: 'GG', bust: '98–104 cm', waist: '80–86 cm', hip: '106–112 cm', length: '124 cm' }
    ]
  },
  {
    id: 'blazer-alfaiataria-linho-areia',
    code: '02',
    sku: 'HM-2602',
    name: 'Blazer Alfaiataria Linho Areia',
    shortName: 'Linho Areia',
    category: 'Alfaiataria',
    price: 15900,
    color: '#D8C7B4',
    colorDeep: '#9B8771',
    colorSoft: '#F3ECE4',
    bgTint: '#E5DACB',
    accentText: '#493D30',
    silhouette: 'linen-blazer',
    fabricHeadline: 'LINHO BELGA ESTRUTURADO. ALFAIATARIA TOKYO.',
    fabricTitle: 'Linho Belga & Algodão Pima',
    fabricDescription:
      'Modelagem arquitetônica de ombros suaves, lapelas precisas e abotoamento tartaruga polido à mão. Respirabilidade superior com caimento impecável.',
    composition: '78% Linho Belga Premium • 22% Algodão Pima • Forro Bemberg',
    care: 'Lavagem a seco • Guardar em cabide anatômico de madeira',
    hollowBgTop: 'ALFAIATARIA PURA',
    hollowBgBottom: 'CORTE PERFEITO 02',
    tagline: 'Minimalismo estruturado para transitar do atelier ao jantar.',
    cloudinaryFrontId: '',
    cloudinaryBackId: '',
    materialProps: {
      roughness: 0.76,
      metalness: 0.02,
      sheen: 0.35,
      sheenRoughness: 0.72,
      sheenColor: '#F5EDE3',
      clearcoat: 0.04
    },
    sizeGuide: [
      { size: 'P', bust: '86–90 cm', waist: '68–72 cm', hip: '92–96 cm', length: '70 cm' },
      { size: 'M', bust: '91–95 cm', waist: '73–77 cm', hip: '97–101 cm', length: '72 cm' },
      { size: 'G', bust: '96–101 cm', waist: '78–83 cm', hip: '102–107 cm', length: '74 cm' },
      { size: 'GG', bust: '102–108 cm', waist: '84–90 cm', hip: '108–114 cm', length: '76 cm' }
    ]
  },
  {
    id: 'conjunto-alfaiataria-verde-salvia',
    code: '03',
    sku: 'HM-2603',
    name: 'Conjunto Alfaiataria Verde Sálvia',
    shortName: 'Verde Sálvia',
    category: 'Conjunto 2 Peças',
    price: 18500,
    color: '#A3B8AA',
    colorDeep: '#617869',
    colorSoft: '#E5EEE8',
    bgTint: '#C8D8CE',
    accentText: '#2A3B30',
    silhouette: 'sage-coord',
    fabricHeadline: 'CREPE JAPONÊS ANTIAMASSO. PRESENÇA SERENA.',
    fabricTitle: 'Lã Fria & Crepe Japonês',
    fabricDescription:
      'Colete-casaqueto minimalista combinado à calça pantalona de pregas profundas. Caimento vertical alongador que mantém o vinco perfeito o dia inteiro.',
    composition: '65% Triacetato Japonês • 35% Lã Fria Merino',
    care: 'Lavagem a seco ou ciclo delicado frio • Secagem à sombra',
    hollowBgTop: 'LINHA ESCULTURAL',
    hollowBgBottom: 'CORTE PERFEITO 03',
    tagline: 'Harmonia cromática em alfaiataria contemporânea de duas peças.',
    cloudinaryFrontId: '',
    cloudinaryBackId: '',
    materialProps: {
      roughness: 0.56,
      metalness: 0.04,
      sheen: 0.55,
      sheenRoughness: 0.5,
      sheenColor: '#D6E6DC',
      clearcoat: 0.08
    },
    sizeGuide: [
      { size: 'P', bust: '82–86 cm', waist: '64–68 cm', hip: '92–96 cm', length: '108 cm' },
      { size: 'M', bust: '87–91 cm', waist: '69–73 cm', hip: '97–101 cm', length: '110 cm' },
      { size: 'G', bust: '92–97 cm', waist: '74–79 cm', hip: '102–107 cm', length: '112 cm' },
      { size: 'GG', bust: '98–104 cm', waist: '80–86 cm', hip: '108–114 cm', length: '114 cm' }
    ]
  },
  {
    id: 'trico-cashmere-rosa-antigo',
    code: '04',
    sku: 'HM-2604',
    name: 'Tricô Cashmere Rosa Antigo',
    shortName: 'Cashmere Rosa',
    category: 'Tricô de Luxo',
    price: 11400,
    color: '#D9A7B0',
    colorDeep: '#99646E',
    colorSoft: '#F5E5E8',
    bgTint: '#E9CCD2',
    accentText: '#512C33',
    silhouette: 'cashmere-knit',
    fabricHeadline: 'CASHMERE FIO 2/28. NUVEM SOBRE A PELE.',
    fabricTitle: '100% Cashmere da Mongólia Interior',
    fabricDescription:
      'Trama canelada fina com ombros levemente deslocados e gola redonda estruturada. Isolamento térmico leve como pluma e maciez incomparável.',
    composition: '100% Cashmere Grau A (Fio Duplo 12gg)',
    care: 'Lavar à mão em água fria com sabão neutro • Secar na horizontal',
    hollowBgTop: 'TRAMA ARTESANAL',
    hollowBgBottom: 'CORTE PERFEITO 04',
    tagline: 'Aconchego luminoso em rosa antigo com acabamento de alta costura.',
    cloudinaryFrontId: '',
    cloudinaryBackId: '',
    materialProps: {
      roughness: 0.84,
      metalness: 0.0,
      sheen: 0.92,
      sheenRoughness: 0.78,
      sheenColor: '#F6DCE1',
      clearcoat: 0.0
    },
    sizeGuide: [
      { size: 'P', bust: '88–94 cm', waist: '68–74 cm', hip: '90–96 cm', length: '59 cm' },
      { size: 'M', bust: '95–100 cm', waist: '75–80 cm', hip: '97–102 cm', length: '61 cm' },
      { size: 'G', bust: '101–107 cm', waist: '81–87 cm', hip: '103–109 cm', length: '63 cm' },
      { size: 'GG', bust: '108–114 cm', waist: '88–94 cm', hip: '110–116 cm', length: '65 cm' }
    ]
  },
  {
    id: 'vestido-midi-onix-elegante',
    code: '05',
    sku: 'HM-2605',
    name: 'Vestido Midi Ônix Elegante',
    shortName: 'Ônix Elegante',
    category: 'Evening Midi',
    price: 14200,
    color: '#8E8B94',
    colorDeep: '#4B4852',
    colorSoft: '#E7E6EA',
    bgTint: '#C8C5CE',
    accentText: '#28262E',
    silhouette: 'onyx-dress',
    fabricHeadline: 'CREPE ACETINADO ÔNIX. SILHUETA ATEMPORAL.',
    fabricTitle: 'Crepe de Seda & Viscose Acetinada',
    fabricDescription:
      'Decote canoa assimétrico com drapeado sutil na cintura e fenda lateral discreta. Elegância arquitetônica pensada para noites memoráveis.',
    composition: '72% Viscose Acetinada • 28% Seda Natural',
    care: 'Lavagem a seco • Vaporizar pelo avesso',
    hollowBgTop: 'NOITE DE GALA',
    hollowBgBottom: 'CORTE PERFEITO 05',
    tagline: 'Sofisticação monocromática com brilho mineral e caimento coluna.',
    cloudinaryFrontId: '',
    cloudinaryBackId: '',
    materialProps: {
      roughness: 0.34,
      metalness: 0.12,
      sheen: 0.9,
      sheenRoughness: 0.32,
      sheenColor: '#D8D5E0',
      clearcoat: 0.18
    },
    sizeGuide: [
      { size: 'P', bust: '82–86 cm', waist: '64–68 cm', hip: '90–94 cm', length: '122 cm' },
      { size: 'M', bust: '87–91 cm', waist: '69–73 cm', hip: '95–99 cm', length: '124 cm' },
      { size: 'G', bust: '92–97 cm', waist: '74–79 cm', hip: '100–105 cm', length: '126 cm' },
      { size: 'GG', bust: '98–104 cm', waist: '80–86 cm', hip: '106–112 cm', length: '128 cm' }
    ]
  }
];

// Cache em memória para evitar regenerar texturas procedurais repetidamente
const textureDataUrlCache = new Map();

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function shadeHex(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const f = (c) =>
    Math.max(0, Math.min(255, Math.round(c + (percent / 100) * 255)));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

function rgbaHex(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Desenha micro-textura têxtil realista (seda, linho, cashmere, crepe)
 */
function drawFabricWeave(ctx, width, height, silhouette, color) {
  ctx.save();
  if (silhouette === 'linen-blazer') {
    // Linho com fios irregulares horizontais e verticais
    ctx.strokeStyle = rgbaHex('#FFFFFF', 0.08);
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 5) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + ((y % 3) - 1));
      ctx.stroke();
    }
    ctx.strokeStyle = rgbaHex('#3B2F23', 0.05);
    for (let x = 0; x < width; x += 6) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  } else if (silhouette === 'cashmere-knit') {
    // Trama canelada macia de tricô cashmere
    for (let x = 0; x < width; x += 10) {
      ctx.fillStyle = x % 20 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(60,25,35,0.06)';
      ctx.fillRect(x, 0, 5, height);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1.2;
    for (let y = 0; y < height; y += 12) {
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 5, y + 6);
        ctx.lineTo(x + 10, y);
        ctx.stroke();
      }
    }
  } else if (silhouette === 'silk-dress' || silhouette === 'onyx-dress') {
    // Brilho líquido diagonal de seda/crepe acetinado
    const sheenGrad = ctx.createLinearGradient(0, 0, width, height);
    sheenGrad.addColorStop(0, 'rgba(255,255,255,0.16)');
    sheenGrad.addColorStop(0.28, 'rgba(255,255,255,0.0)');
    sheenGrad.addColorStop(0.52, 'rgba(255,255,255,0.20)');
    sheenGrad.addColorStop(0.78, 'rgba(0,0,0,0.07)');
    sheenGrad.addColorStop(1, 'rgba(255,255,255,0.12)');
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(0, 0, width, height);
  } else {
    // Crepe alfaiataria fino
    ctx.strokeStyle = rgbaHex(color, 0.08);
    ctx.lineWidth = 1;
    for (let i = -height; i < width; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawGarmentSilhouette(ctx, product, side, W, H) {
  const cx = W / 2;
  const { silhouette, color, colorDeep } = product;

  const baseGrad = ctx.createLinearGradient(cx - 260, 180, cx + 260, H - 140);
  baseGrad.addColorStop(0, shadeHex(color, 10));
  baseGrad.addColorStop(0.35, color);
  baseGrad.addColorStop(0.75, shadeHex(color, -8));
  baseGrad.addColorStop(1, colorDeep);

  ctx.save();
  ctx.shadowColor = 'rgba(24, 22, 21, 0.24)';
  ctx.shadowBlur = 46;
  ctx.shadowOffsetY = 26;

  if (silhouette === 'silk-dress') {
    // Vestido Midi Seda Terracota (corte enviesado fluido)
    ctx.beginPath();
    if (side === 'front') {
      // Alças delicadas + decote V suave
      ctx.moveTo(cx - 108, 220);
      ctx.lineTo(cx - 94, 220);
      ctx.lineTo(cx - 86, 335);
      ctx.quadraticCurveTo(cx, 420, cx + 86, 335);
      ctx.lineTo(cx + 94, 220);
      ctx.lineTo(cx + 108, 220);
      ctx.lineTo(cx + 114, 345);
    } else {
      // Costas abertas esculturais
      ctx.moveTo(cx - 108, 220);
      ctx.lineTo(cx - 94, 220);
      ctx.lineTo(cx - 88, 375);
      ctx.quadraticCurveTo(cx, 468, cx + 88, 375);
      ctx.lineTo(cx + 94, 220);
      ctx.lineTo(cx + 108, 220);
      ctx.lineTo(cx + 114, 350);
    }
    // Busto -> Cintura marcada -> Saia midi fluida evasê
    ctx.bezierCurveTo(cx + 150, 445, cx + 115, 530, cx + 106, 585);
    ctx.bezierCurveTo(cx + 155, 740, cx + 235, 980, cx + 262, 1170);
    ctx.quadraticCurveTo(cx + 140, 1215, cx, 1188);
    ctx.quadraticCurveTo(cx - 140, 1215, cx - 262, 1170);
    ctx.bezierCurveTo(cx - 235, 980, cx - 155, 740, cx - 106, 585);
    ctx.bezierCurveTo(cx - 115, 530, cx - 150, 445, cx - 114, 345);
    ctx.closePath();
    ctx.fillStyle = baseGrad;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.clip();
    drawFabricWeave(ctx, W, H, silhouette, color);

    // Pregas / drapeado líquido vertical na saia
    const folds = [-160, -82, -10, 68, 148];
    folds.forEach((offset, i) => {
      const fGrad = ctx.createLinearGradient(cx + offset - 35, 0, cx + offset + 35, 0);
      fGrad.addColorStop(0, 'rgba(0,0,0,0)');
      fGrad.addColorStop(0.45, i % 2 === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(55,25,18,0.18)');
      fGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.moveTo(cx + offset * 0.45, 520);
      ctx.quadraticCurveTo(cx + offset * 0.85, 840, cx + offset * 1.25, 1210);
      ctx.lineTo(cx + offset * 1.25 + 65, 1210);
      ctx.quadraticCurveTo(cx + offset * 0.85 + 35, 840, cx + offset * 0.45 + 22, 520);
      ctx.closePath();
      ctx.fill();
    });

    // Linha de cintura em viés + costura central nas costas
    ctx.strokeStyle = 'rgba(255,255,255,0.26)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 110, 585);
    ctx.quadraticCurveTo(cx, 608, cx + 110, 585);
    ctx.stroke();

    if (side === 'back') {
      ctx.strokeStyle = 'rgba(40,20,15,0.28)';
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(cx, 440);
      ctx.lineTo(cx, 1188);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  } else if (silhouette === 'linen-blazer') {
    // Blazer Alfaiataria Linho Areia
    ctx.beginPath();
    ctx.moveTo(cx - 115, 225);
    ctx.quadraticCurveTo(cx, side === 'front' ? 245 : 215, cx + 115, 225);
    // Ombros estruturados + mangas longas
    ctx.lineTo(cx + 225, 272);
    ctx.lineTo(cx + 292, 865);
    ctx.lineTo(cx + 206, 878);
    ctx.lineTo(cx + 168, 520);
    // Corpo acinturado do blazer
    ctx.quadraticCurveTo(cx + 150, 680, cx + 178, 965);
    ctx.lineTo(cx + 22, 985);
    ctx.lineTo(cx, 955);
    ctx.lineTo(cx - 22, 985);
    ctx.lineTo(cx - 178, 965);
    ctx.quadraticCurveTo(cx - 150, 680, cx - 168, 520);
    ctx.lineTo(cx - 206, 878);
    ctx.lineTo(cx - 292, 865);
    ctx.lineTo(cx - 225, 272);
    ctx.closePath();
    ctx.fillStyle = baseGrad;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.clip();
    drawFabricWeave(ctx, W, H, silhouette, color);

    if (side === 'front') {
      // Abertura em V do forro interno
      ctx.beginPath();
      ctx.moveTo(cx - 86, 225);
      ctx.lineTo(cx, 560);
      ctx.lineTo(cx + 86, 225);
      ctx.closePath();
      ctx.fillStyle = '#EFE9E1';
      ctx.fill();

      // Lapelas esculturais
      ctx.fillStyle = shadeHex(color, 6);
      ctx.strokeStyle = 'rgba(70,56,42,0.22)';
      ctx.lineWidth = 2;
      // Lapela esquerda
      ctx.beginPath();
      ctx.moveTo(cx - 86, 225);
      ctx.lineTo(cx - 142, 375);
      ctx.lineTo(cx - 108, 415);
      ctx.lineTo(cx - 134, 448);
      ctx.lineTo(cx, 570);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Lapela direita
      ctx.beginPath();
      ctx.moveTo(cx + 86, 225);
      ctx.lineTo(cx + 142, 375);
      ctx.lineTo(cx + 108, 415);
      ctx.lineTo(cx + 134, 448);
      ctx.lineTo(cx, 570);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Botões tartaruga duplos
      const buttons = [
        [cx - 46, 615],
        [cx + 46, 615],
        [cx - 46, 715],
        [cx + 46, 715]
      ];
      buttons.forEach(([bx, by]) => {
        ctx.beginPath();
        ctx.arc(bx, by, 13, 0, Math.PI * 2);
        ctx.fillStyle = '#4A3628';
        ctx.fill();
        ctx.strokeStyle = '#C8A882';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Bolsos com lapela
      ctx.strokeStyle = 'rgba(70,56,42,0.28)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cx - 142, 748, 86, 20);
      ctx.strokeRect(cx + 56, 748, 86, 20);
    } else {
      // Costuras princesa e fenda central nas costas
      ctx.strokeStyle = 'rgba(70,56,42,0.26)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, 235);
      ctx.lineTo(cx, 955);
      ctx.moveTo(cx - 110, 265);
      ctx.quadraticCurveTo(cx - 88, 600, cx - 102, 965);
      ctx.moveTo(cx + 110, 265);
      ctx.quadraticCurveTo(cx + 88, 600, cx + 102, 965);
      ctx.stroke();
    }
  } else if (silhouette === 'sage-coord') {
    // Conjunto Alfaiataria Verde Sálvia (Colete estruturado + Calça pantalona)
    // Parte superior (Colete alfaiataria)
    ctx.beginPath();
    ctx.moveTo(cx - 118, 222);
    ctx.lineTo(cx - 64, 222);
    ctx.quadraticCurveTo(cx, side === 'front' ? 320 : 248, cx + 64, 222);
    ctx.lineTo(cx + 118, 222);
    ctx.lineTo(cx + 158, 272);
    ctx.lineTo(cx + 132, 410);
    ctx.lineTo(cx + 136, 566);
    ctx.lineTo(cx + 18, 592);
    ctx.lineTo(cx, 565);
    ctx.lineTo(cx - 18, 592);
    ctx.lineTo(cx - 136, 566);
    ctx.lineTo(cx - 132, 410);
    ctx.lineTo(cx - 158, 272);
    ctx.closePath();
    ctx.fillStyle = baseGrad;
    ctx.fill();

    // Parte inferior (Calça Pantalona de Pregas)
    ctx.beginPath();
    ctx.moveTo(cx - 130, 602);
    ctx.lineTo(cx + 130, 602);
    ctx.lineTo(cx + 196, 1192);
    ctx.lineTo(cx + 28, 1192);
    ctx.lineTo(cx, 780);
    ctx.lineTo(cx - 28, 1192);
    ctx.lineTo(cx - 196, 1192);
    ctx.closePath();
    ctx.fillStyle = baseGrad;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    drawFabricWeave(ctx, W, H, silhouette, color);

    // Detalhes de pregas da pantalona e botões forrados
    ctx.strokeStyle = 'rgba(35,55,42,0.28)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(cx - 72, 610);
    ctx.lineTo(cx - 108, 1185);
    ctx.moveTo(cx + 72, 610);
    ctx.lineTo(cx + 108, 1185);
    ctx.moveTo(cx - 130, 638);
    ctx.lineTo(cx + 130, 638);
    ctx.stroke();

    if (side === 'front') {
      [395, 455, 515].forEach((by) => {
        ctx.beginPath();
        ctx.arc(cx, by, 10, 0, Math.PI * 2);
        ctx.fillStyle = shadeHex(color, -12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    } else {
      ctx.strokeStyle = 'rgba(35,55,42,0.24)';
      ctx.beginPath();
      ctx.moveTo(cx, 250);
      ctx.lineTo(cx, 560);
      ctx.moveTo(cx, 602);
      ctx.lineTo(cx, 775);
      ctx.stroke();
    }
  } else if (silhouette === 'cashmere-knit') {
    // Tricô Cashmere Rosa Antigo
    ctx.beginPath();
    ctx.moveTo(cx - 105, 248);
    ctx.quadraticCurveTo(cx, side === 'front' ? 298 : 262, cx + 105, 248);
    ctx.quadraticCurveTo(cx + 198, 275, cx + 250, 345);
    ctx.lineTo(cx + 312, 855);
    ctx.lineTo(cx + 225, 875);
    ctx.lineTo(cx + 178, 540);
    ctx.lineTo(cx + 184, 922);
    ctx.quadraticCurveTo(cx, 945, cx - 184, 922);
    ctx.lineTo(cx - 178, 540);
    ctx.lineTo(cx - 225, 875);
    ctx.lineTo(cx - 312, 855);
    ctx.lineTo(cx - 250, 345);
    ctx.quadraticCurveTo(cx - 198, 275, cx - 105, 248);
    ctx.closePath();
    ctx.fillStyle = baseGrad;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.clip();
    drawFabricWeave(ctx, W, H, silhouette, color);

    // Gola canelada grossa + barra canelada
    ctx.strokeStyle = 'rgba(110,55,66,0.26)';
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.moveTo(cx - 104, 256);
    ctx.quadraticCurveTo(cx, side === 'front' ? 305 : 270, cx + 104, 256);
    ctx.stroke();

    // Barra inferior ribana
    ctx.fillStyle = 'rgba(110,55,66,0.12)';
    ctx.fillRect(cx - 190, 868, 380, 68);
    ctx.strokeStyle = 'rgba(255,255,255,0.24)';
    ctx.lineWidth = 2;
    for (let rx = cx - 180; rx <= cx + 180; rx += 12) {
      ctx.beginPath();
      ctx.moveTo(rx, 868);
      ctx.lineTo(rx, 936);
      ctx.stroke();
    }
  } else {
    // Vestido Midi Ônix Elegante (Coluna escultural com decote canoa assimétrico)
    ctx.beginPath();
    ctx.moveTo(cx - 154, 252);
    if (side === 'front') {
      ctx.quadraticCurveTo(cx - 10, 298, cx + 154, 242);
    } else {
      ctx.lineTo(cx - 98, 252);
      ctx.lineTo(cx - 92, 382);
      ctx.lineTo(cx + 92, 382);
      ctx.lineTo(cx + 98, 252);
      ctx.lineTo(cx + 154, 252);
    }
    ctx.bezierCurveTo(cx + 178, 390, cx + 126, 485, cx + 114, 575);
    ctx.bezierCurveTo(cx + 155, 725, cx + 170, 960, cx + 172, 1188);
    // Fenda lateral elegante
    ctx.lineTo(cx + 95, 1188);
    ctx.lineTo(cx + 80, 965);
    ctx.lineTo(cx + 58, 1188);
    ctx.lineTo(cx - 168, 1188);
    ctx.bezierCurveTo(cx - 166, 960, cx - 155, 725, cx - 114, 575);
    ctx.bezierCurveTo(cx - 126, 485, cx - 178, 390, cx - 154, 252);
    ctx.closePath();
    ctx.fillStyle = baseGrad;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.clip();
    drawFabricWeave(ctx, W, H, silhouette, color);

    // Drapeado diagonal arquitetônico na cintura
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(cx - 120, 520 + i * 24);
      ctx.quadraticCurveTo(cx, 565 + i * 18, cx + 120, 505 + i * 22);
      ctx.stroke();
    }

    if (side === 'back') {
      // Zíper invisível traseiro com puxador metálico sutil
      ctx.strokeStyle = 'rgba(255,255,255,0.34)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, 382);
      ctx.lineTo(cx, 720);
      ctx.stroke();
      ctx.fillStyle = '#E4D5BD';
      ctx.fillRect(cx - 4, 382, 8, 18);
    }
  }

  ctx.restore();
}

/**
 * Gera textura procedural em alta resolução (1024x1400) para Frente ou Verso.
 * Verso inclui a etiqueta de cetim champanhe "HARUMI MODAS • TOKYO • ATELIER".
 */
export function generateProceduralTexture(product, side = 'front') {
  const cacheKey = `${product.id}_${side}`;
  if (textureDataUrlCache.has(cacheKey)) {
    return textureDataUrlCache.get(cacheKey);
  }

  if (typeof document === 'undefined') {
    return '';
  }

  const W = 1024;
  const H = 1400;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. Fundo editorial luxuoso no tom suave da peça
  const bgGrad = ctx.createRadialGradient(W * 0.5, H * 0.36, 90, W * 0.5, H * 0.5, H * 0.78);
  bgGrad.addColorStop(0, '#FAF7F3');
  bgGrad.addColorStop(0.62, product.colorSoft);
  bgGrad.addColorStop(1, product.bgTint);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Moldura editorial finíssima
  ctx.strokeStyle = rgbaHex('#181615', 0.08);
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  // Marca d'água sutil ao fundo
  ctx.save();
  ctx.fillStyle = rgbaHex(product.colorDeep, 0.06);
  ctx.font = '600 185px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(product.code, W / 2, 230);
  ctx.restore();

  // Cabeçalho discreto no topo da peça/cartão
  ctx.save();
  ctx.fillStyle = rgbaHex('#181615', 0.52);
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('HARUMI MODAS', 72, 92);
  ctx.textAlign = 'right';
  ctx.fillText(side === 'front' ? `ATELIER • ${product.sku}` : 'VERSO • COSTURA & ETIQUETA', W - 72, 92);
  ctx.restore();

  // 2. Desenho detalhado da peça (Frente ou Verso)
  drawGarmentSilhouette(ctx, product, side, W, H);

  // 3. No VERSO, etiqueta tecida de luxo "HARUMI MODAS"
  if (side === 'back') {
    const lx = W / 2 - 128;
    const ly = 296;
    const lw = 256;
    const lh = 94;

    ctx.save();
    ctx.shadowColor = 'rgba(24,22,21,0.22)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#F7F3EC';
    ctx.fillRect(lx, ly, lw, lh);
    ctx.restore();

    ctx.strokeStyle = '#C9B290';
    ctx.lineWidth = 2;
    ctx.strokeRect(lx + 7, ly + 7, lw - 14, lh - 14);

    // Pontos de costura dourados nos 4 cantos da etiqueta
    ctx.fillStyle = '#B89A6D';
    [
      [lx + 14, ly + 14],
      [lx + lw - 14, ly + 14],
      [lx + 14, ly + lh - 14],
      [lx + lw - 14, ly + lh - 14]
    ].forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#181615';
    ctx.textAlign = 'center';
    ctx.font = '600 24px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('HARUMI MODAS', W / 2, ly + 46);
    ctx.fillStyle = '#8C7554';
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TOKYO • ATELIER D2C', W / 2, ly + 71);

    // Rodapé técnico no verso
    ctx.fillStyle = rgbaHex('#181615', 0.65);
    ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(product.composition, W / 2, H - 96);
    ctx.fillStyle = rgbaHex('#181615', 0.45);
    ctx.font = '400 17px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PORTAL LOJAS JP • EDIÇÃO NUMERADA', W / 2, H - 64);
  } else {
    // Assinatura minimalista na base da frente
    ctx.save();
    ctx.fillStyle = rgbaHex('#181615', 0.72);
    ctx.textAlign = 'left';
    ctx.font = '600 28px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(product.name.toUpperCase(), 72, H - 92);
    ctx.fillStyle = rgbaHex('#181615', 0.52);
    ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(product.fabricTitle, 72, H - 58);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#181615';
    ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(formatYen(product.price), W - 72, H - 72);
    ctx.restore();
  }

  const dataUrl = canvas.toDataURL('image/png');
  textureDataUrlCache.set(cacheKey, dataUrl);
  return dataUrl;
}

/**
 * Retorna URL do Cloudinary (se preenchida) ou fallback procedural em Canvas.
 */
export function getProductImageUrl(product, side = 'front') {
  const publicId =
    side === 'front' ? product.cloudinaryFrontId : product.cloudinaryBackId;
  const cloudinaryUrl = getCloudinaryUrl(publicId);
  if (cloudinaryUrl) return cloudinaryUrl;
  return generateProceduralTexture(product, side);
}
