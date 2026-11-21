// Catálogo HARUMI MODAS • Street Luxe / Zara & Bershka Vibes • Ecossistema Portal LOJAS JP
// Cloudinary Helper (cloud name: jontqsrz) + Renderização Editorial Limpa das 5 Peças

export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'jontqsrz';

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
    id: 'corset-cropped-acetinado',
    code: '01',
    sku: 'HM-ST01',
    name: 'Corset Cropped Acetinado',
    shortName: 'Corset Acetinado',
    category: 'Tops • Night & Street',
    price: 5900,
    color: '#D47A6A',
    colorDeep: '#96473A',
    colorSoft: '#F3DFDA',
    bgTint: '#E6BFB6',
    accentText: '#4F221A',
    silhouette: 'satin-corset',
    description:
      'Terracotta satin structured cropped corset top with sweetheart neckline, delicate spaghetti straps, vertical couture boning seams, and sleek fitted waist',
    fabricHeadline: 'CETIM ESTRUTURADO. BARBATANAS & DECOTE CORAÇÃO.',
    fabricTitle: 'Cetim Duchesse Stretch',
    fabricDescription:
      'Modelagem estruturada com barbatanas flexíveis, alças finas reguláveis e decote coração que valoriza o colo. O brilho acetinado urbano perfeito do café ao after.',
    composition: '92% Poliéster Acetinado Premium • 8% Elastano • Forro Macio',
    care: 'Lavar à mão em água fria • Não torcer • Secar à sombra',
    hollowBgTop: 'NEW DROP',
    hollowBgBottom: 'ZARA VIBES 01',
    tagline: 'Modelagem estruturada, alças finas e decote coração em brilho urbano.',
    cloudinaryFrontId: '',
    cloudinaryBackId: '',
    materialProps: {
      roughness: 0.24,
      metalness: 0.08,
      sheen: 1.0,
      sheenRoughness: 0.22,
      sheenColor: '#FAD3C8',
      clearcoat: 0.32
    },
    sizeGuide: [
      { size: 'P', bust: '80–84 cm', waist: '62–66 cm', hip: '—', length: '34 cm' },
      { size: 'M', bust: '85–89 cm', waist: '67–71 cm', hip: '—', length: '36 cm' },
      { size: 'G', bust: '90–95 cm', waist: '72–77 cm', hip: '—', length: '38 cm' },
      { size: 'GG', bust: '96–102 cm', waist: '78–84 cm', hip: '—', length: '40 cm' }
    ]
  },
  {
    id: 'calca-cargo-parachute',
    code: '02',
    sku: 'HM-ST02',
    name: 'Calça Cargo Parachute',
    shortName: 'Cargo Parachute',
    category: 'Bottoms • Streetwear',
    price: 8900,
    color: '#D5C7B2',
    colorDeep: '#8E7D65',
    colorSoft: '#F2ECE3',
    bgTint: '#E2D6C5',
    accentText: '#463C2E',
    silhouette: 'cargo-parachute',
    description:
      'Sand beige streetwear parachute cargo pants with adjustable low-to-mid drawstring waist, wide voluminous legs with knee pleats, large 3D side cargo pockets, and cinched elastic ankle cuffs',
    fabricHeadline: 'NYLON TECHNICAL LEVE. VOLUME STREETWEAR REAL.',
    fabricTitle: 'Ripstop Cotton-Nylon Ultraleve',
    fabricDescription:
      'Cintura baixa ou média ajustável por cordão com ponteiras metálicas, bolsos cargo 3D laterais volumosos, pregas anatômicas nos joelhos e punho franzido com stopper.',
    composition: '68% Algodão Technical • 32% Poliamida Ripstop',
    care: 'Lavar à máquina no ciclo delicado frio • Passar em temperatura baixa',
    hollowBgTop: 'FIT CHECK',
    hollowBgBottom: 'STREET LUXE 02',
    tagline: 'Cintura ajustável, bolsos laterais volumosos e punho franzido.',
    cloudinaryFrontId: '',
    cloudinaryBackId: '',
    materialProps: {
      roughness: 0.64,
      metalness: 0.04,
      sheen: 0.45,
      sheenRoughness: 0.62,
      sheenColor: '#F7EFE3',
      clearcoat: 0.05
    },
    sizeGuide: [
      { size: 'P', bust: '—', waist: '64–70 cm', hip: '96–102 cm', length: '101 cm' },
      { size: 'M', bust: '—', waist: '71–76 cm', hip: '103–108 cm', length: '103 cm' },
      { size: 'G', bust: '—', waist: '77–83 cm', hip: '109–115 cm', length: '105 cm' },
      { size: 'GG', bust: '—', waist: '84–90 cm', hip: '116–122 cm', length: '107 cm' }
    ]
  },
  {
    id: 'jaqueta-bomber-oversized',
    code: '03',
    sku: 'HM-ST03',
    name: 'Jaqueta Bomber Oversized',
    shortName: 'Bomber Oversized',
    category: 'Outerwear • Drop 01',
    price: 11500,
    color: '#8FA696',
    colorDeep: '#516858',
    colorSoft: '#E3ECE6',
    bgTint: '#C2D3C7',
    accentText: '#233328',
    silhouette: 'bomber-oversized',
    description:
      'Sage military green oversized streetwear bomber jacket with metallic front zipper, puffed ruched sleeves with utility bicep pocket, ribbed baseball collar, and cropped ribbed hem',
    fabricHeadline: 'NYLON ACETINADO MILITAR. MANGAS BUFANTES & ZÍPER METAL.',
    fabricTitle: 'Nylon Flight Satin & Ribana Pesada',
    fabricDescription:
      'Silhueta oversized com ombros caídos, zíper metálico polido, mangas bufantes com costura franzida, bolso utilitário no braço e acabamento em gola e punhos ribana.',
    composition: '100% Poliamida Flight Satin • Forro Matelassê Leve • Ribana 2x2',
    care: 'Limpeza suave com pano úmido ou lavagem a seco',
    hollowBgTop: 'STREET LUXE',
    hollowBgBottom: 'NEW DROP 03',
    tagline: 'Zíper metálico, mangas bufantes com franzido e gola ribana.',
    cloudinaryFrontId: '',
    cloudinaryBackId: '',
    materialProps: {
      roughness: 0.34,
      metalness: 0.14,
      sheen: 0.86,
      sheenRoughness: 0.35,
      sheenColor: '#CDE0D3',
      clearcoat: 0.24
    },
    sizeGuide: [
      { size: 'P', bust: '104–110 cm', waist: '86–92 cm', hip: '—', length: '56 cm' },
      { size: 'M', bust: '111–116 cm', waist: '93–98 cm', hip: '—', length: '58 cm' },
      { size: 'G', bust: '117–123 cm', waist: '99–105 cm', hip: '—', length: '60 cm' },
      { size: 'GG', bust: '124–130 cm', waist: '106–112 cm', hip: '—', length: '62 cm' }
    ]
  },
  {
    id: 'conjunto-ribbed-cut-out',
    code: '04',
    sku: 'HM-ST04',
    name: 'Conjunto Ribbed Cut-Out',
    shortName: 'Ribbed Cut-Out',
    category: 'Co-Ord Set • Trend',
    price: 7800,
    color: '#E295A8',
    colorDeep: '#A35469',
    colorSoft: '#F8E3E9',
    bgTint: '#EDCAD3',
    accentText: '#542030',
    silhouette: 'ribbed-cutout',
    description:
      'Bubblegum chic pink two-piece ribbed knit co-ord set featuring an asymmetric one-shoulder cut-out cropped top paired with a bodycon fitted midi skirt with a high side slit',
    fabricHeadline: 'MALHA CANELADA PREMIUM. RECORTE ASSIMÉTRICO + FENDA.',
    fabricTitle: 'Ribbed Modal Stretch 320g',
    fabricDescription:
      'Conjunto de duas peças em malha canelada de toque gelado que esculpe sem marcar: top cropped assimétrico com recorte cut-out moderno + saia midi justa com fenda lateral.',
    composition: '90% Modal Canelado Premium • 10% Elastano High-Recovery',
    care: 'Lavar à mão ou saquinho protetor em ciclo frio • Secar na horizontal',
    hollowBgTop: 'ZARA VIBES',
    hollowBgBottom: 'FIT CHECK 04',
    tagline: 'Top assimétrico com recorte + saia midi justa com fenda lateral.',
    cloudinaryFrontId: '',
    cloudinaryBackId: '',
    materialProps: {
      roughness: 0.7,
      metalness: 0.02,
      sheen: 0.88,
      sheenRoughness: 0.65,
      sheenColor: '#FAD3DE',
      clearcoat: 0.04
    },
    sizeGuide: [
      { size: 'P', bust: '80–85 cm', waist: '62–67 cm', hip: '88–94 cm', length: '82 cm' },
      { size: 'M', bust: '86–91 cm', waist: '68–73 cm', hip: '95–100 cm', length: '84 cm' },
      { size: 'G', bust: '92–98 cm', waist: '74–80 cm', hip: '101–107 cm', length: '86 cm' },
      { size: 'GG', bust: '99–105 cm', waist: '81–87 cm', hip: '108–114 cm', length: '88 cm' }
    ]
  },
  {
    id: 'vestido-mini-drapeado-onix',
    code: '05',
    sku: 'HM-ST05',
    name: 'Vestido Mini Drapeado Ônix',
    shortName: 'Mini Drapeado Ônix',
    category: 'Night Out • Club Luxe',
    price: 6900,
    color: '#7D7A85',
    colorDeep: '#3F3C47',
    colorSoft: '#E5E4E8',
    bgTint: '#C4C1CA',
    accentText: '#232129',
    silhouette: 'mini-draped',
    description:
      'Graphite onyx metallic-sheen draped mini dress with asymmetric spaghetti straps, bodycon ruched gathers across the waist and hips, and adjustable side drawstring tie for a chic night-out look',
    fabricHeadline: 'MALHA FLUIDA ÔNIX. DRAPEADO AJUSTÁVEL PARA A NOITE.',
    fabricTitle: 'Jersey Fluid Acetinado Ônix',
    fabricDescription:
      'Alças assimétricas ultrafinas, drapeado lateral ajustável por cordão que permite regular o comprimento e brilho grafite sutil criado para dominar a noite.',
    composition: '88% Poliamida Fluida Acetinada • 12% Elastano',
    care: 'Lavar à mão em água fria • Secar à sombra',
    hollowBgTop: 'NIGHT OUT',
    hollowBgBottom: 'NEW DROP 05',
    tagline: 'Alças assimétricas, drapeado lateral ajustável e brilho grafite.',
    cloudinaryFrontId: '',
    cloudinaryBackId: '',
    materialProps: {
      roughness: 0.28,
      metalness: 0.22,
      sheen: 1.0,
      sheenRoughness: 0.26,
      sheenColor: '#D6D2E3',
      clearcoat: 0.34
    },
    sizeGuide: [
      { size: 'P', bust: '80–85 cm', waist: '62–67 cm', hip: '88–94 cm', length: '78 cm' },
      { size: 'M', bust: '86–91 cm', waist: '68–73 cm', hip: '95–100 cm', length: '80 cm' },
      { size: 'G', bust: '92–97 cm', waist: '74–79 cm', hip: '101–106 cm', length: '82 cm' },
      { size: 'GG', bust: '98–104 cm', waist: '80–86 cm', hip: '107–113 cm', length: '84 cm' }
    ]
  }
];

const previewCache = new Map();

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function shadeHex(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const f = (c) =>
    Math.max(0, Math.min(255, Math.round(c + (percent / 100) * 255)));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

/**
 * Gera uma imagem editorial limpa de estúdio (silhueta recortada sem borda de pôster)
 * para cards do Shop, Look Builder e fallback de referência limpa para a IA.
 */
export function generateCleanGarmentPng(product, transparentBg = false) {
  const cacheKey = `${product.id}_${transparentBg ? 'alpha' : 'studio'}`;
  if (previewCache.has(cacheKey)) {
    return previewCache.get(cacheKey);
  }
  if (typeof document === 'undefined') return '';

  const W = 900;
  const H = 1150;
  const cx = W / 2;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  if (!transparentBg) {
    const bg = ctx.createRadialGradient(cx, H * 0.44, 60, cx, H * 0.5, H * 0.72);
    bg.addColorStop(0, '#FFFFFF');
    bg.addColorStop(0.7, product.colorSoft);
    bg.addColorStop(1, product.bgTint);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
  }

  const grad = ctx.createLinearGradient(cx - 240, 160, cx + 260, H - 140);
  grad.addColorStop(0, shadeHex(product.color, 14));
  grad.addColorStop(0.45, product.color);
  grad.addColorStop(1, product.colorDeep);

  ctx.save();
  ctx.shadowColor = 'rgba(24, 22, 21, 0.26)';
  ctx.shadowBlur = 44;
  ctx.shadowOffsetY = 26;

  if (product.silhouette === 'satin-corset') {
    // Alças finas
    ctx.strokeStyle = product.colorDeep;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(cx - 122, 250);
    ctx.lineTo(cx - 134, 415);
    ctx.moveTo(cx + 122, 250);
    ctx.lineTo(cx + 134, 415);
    ctx.stroke();

    // Corpo do Corset com decote coração e bico inferior
    ctx.beginPath();
    ctx.moveTo(cx, 455);
    ctx.bezierCurveTo(cx - 55, 360, cx - 165, 375, cx - 178, 465);
    ctx.bezierCurveTo(cx - 175, 585, cx - 142, 680, cx - 138, 760);
    ctx.quadraticCurveTo(cx - 55, 795, cx, 845);
    ctx.quadraticCurveTo(cx + 55, 795, cx + 138, 760);
    ctx.bezierCurveTo(cx + 142, 680, cx + 175, 585, cx + 178, 465);
    ctx.bezierCurveTo(cx + 165, 375, cx + 55, 360, cx, 455);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.clip();
    // Barbatanas verticais + brilho cetim
    ctx.strokeStyle = 'rgba(255,255,255,0.34)';
    ctx.lineWidth = 4;
    [-112, -56, 0, 56, 112].forEach((bx) => {
      ctx.beginPath();
      ctx.moveTo(cx + bx, 395);
      ctx.quadraticCurveTo(cx + bx * 0.85, 620, cx + bx * 0.92, 835);
      ctx.stroke();
    });
    const gloss = ctx.createLinearGradient(cx - 180, 380, cx + 120, 820);
    gloss.addColorStop(0, 'rgba(255,255,255,0.28)');
    gloss.addColorStop(0.5, 'rgba(255,255,255,0)');
    gloss.addColorStop(1, 'rgba(255,255,255,0.18)');
    ctx.fillStyle = gloss;
    ctx.fillRect(0, 0, W, H);
  } else if (product.silhouette === 'cargo-parachute') {
    // Calça Cargo Parachute ampla com punhos franzidos
    ctx.beginPath();
    ctx.moveTo(cx - 138, 175);
    ctx.lineTo(cx + 138, 175);
    ctx.bezierCurveTo(cx + 188, 340, cx + 245, 610, cx + 220, 935);
    ctx.lineTo(cx + 174, 985);
    ctx.lineTo(cx + 72, 985);
    ctx.lineTo(cx + 48, 925);
    ctx.bezierCurveTo(cx + 42, 720, cx + 22, 540, cx, 445);
    ctx.bezierCurveTo(cx - 22, 540, cx - 42, 720, cx - 48, 925);
    ctx.lineTo(cx - 72, 985);
    ctx.lineTo(cx - 174, 985);
    ctx.lineTo(cx - 220, 935);
    ctx.bezierCurveTo(cx - 245, 610, cx - 188, 340, cx - 138, 175);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    // Bolsos cargo 3D laterais volumosos
    ctx.fillStyle = shadeHex(product.color, -6);
    ctx.strokeStyle = 'rgba(70,58,42,0.34)';
    ctx.lineWidth = 3;
    // Esquerdo
    ctx.beginPath();
    ctx.roundRect(cx - 236, 465, 92, 148, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = shadeHex(product.color, 6);
    ctx.beginPath();
    ctx.roundRect(cx - 240, 460, 100, 42, 10);
    ctx.fill();
    ctx.stroke();

    // Direito
    ctx.fillStyle = shadeHex(product.color, -6);
    ctx.beginPath();
    ctx.roundRect(cx + 144, 465, 92, 148, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = shadeHex(product.color, 6);
    ctx.beginPath();
    ctx.roundRect(cx + 140, 460, 100, 42, 10);
    ctx.fill();
    ctx.stroke();

    // Cordão ajustável na cintura + pregas nos joelhos + punhos franzidos
    ctx.strokeStyle = 'rgba(65,52,38,0.45)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 140, 218);
    ctx.lineTo(cx + 140, 218);
    ctx.moveTo(cx - 10, 218);
    ctx.quadraticCurveTo(cx - 26, 290, cx - 18, 342);
    ctx.moveTo(cx + 10, 218);
    ctx.quadraticCurveTo(cx + 28, 295, cx + 16, 350);
    ctx.moveTo(cx - 190, 690);
    ctx.quadraticCurveTo(cx - 130, 712, cx - 65, 690);
    ctx.moveTo(cx + 190, 690);
    ctx.quadraticCurveTo(cx + 130, 712, cx + 65, 690);
    ctx.stroke();
  } else if (product.silhouette === 'bomber-oversized') {
    // Jaqueta Bomber Oversized com mangas bufantes + gola ribana
    ctx.beginPath();
    ctx.moveTo(cx - 95, 225);
    ctx.quadraticCurveTo(cx, 255, cx + 95, 225);
    ctx.bezierCurveTo(cx + 195, 240, cx + 275, 295, cx + 315, 425);
    ctx.bezierCurveTo(cx + 355, 580, cx + 345, 735, cx + 295, 845);
    ctx.lineTo(cx + 215, 835);
    ctx.bezierCurveTo(cx + 225, 700, cx + 215, 560, cx + 195, 495);
    ctx.bezierCurveTo(cx + 215, 635, cx + 212, 760, cx + 188, 848);
    ctx.quadraticCurveTo(cx, 882, cx - 188, 848);
    ctx.bezierCurveTo(cx - 212, 760, cx - 215, 635, cx - 195, 495);
    ctx.bezierCurveTo(cx - 215, 560, cx - 225, 700, cx - 215, 835);
    ctx.lineTo(cx - 295, 845);
    ctx.bezierCurveTo(cx - 345, 735, cx - 355, 580, cx - 315, 425);
    ctx.bezierCurveTo(cx - 275, 295, cx - 195, 240, cx - 95, 225);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    // Gola ribana + barra ribana + punhos ribana
    ctx.fillStyle = product.colorDeep;
    ctx.beginPath();
    ctx.roundRect(cx - 186, 795, 372, 62, 18);
    ctx.fill();
    ctx.strokeStyle = product.colorDeep;
    ctx.lineWidth = 28;
    ctx.beginPath();
    ctx.moveTo(cx - 95, 232);
    ctx.quadraticCurveTo(cx, 272, cx + 95, 232);
    ctx.stroke();

    // Zíper metálico central
    ctx.strokeStyle = '#E4E7EB';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(cx, 252);
    ctx.lineTo(cx, 855);
    ctx.stroke();
    ctx.fillStyle = '#D1D5DB';
    ctx.fillRect(cx - 9, 295, 18, 34);

    // Franzidos nas mangas bufantes
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 3;
    [410, 490, 575, 665].forEach((my) => {
      ctx.beginPath();
      ctx.moveTo(cx - 325, my);
      ctx.quadraticCurveTo(cx - 265, my + 18, cx - 215, my - 5);
      ctx.moveTo(cx + 325, my);
      ctx.quadraticCurveTo(cx + 265, my + 18, cx + 215, my - 5);
      ctx.stroke();
    });
  } else if (product.silhouette === 'ribbed-cutout') {
    // Top cropped assimétrico um ombro só + cut-out
    ctx.beginPath();
    ctx.moveTo(cx - 140, 210);
    ctx.lineTo(cx - 72, 210);
    ctx.bezierCurveTo(cx - 30, 320, cx + 72, 352, cx + 150, 325);
    ctx.lineTo(cx + 154, 480);
    ctx.quadraticCurveTo(cx, 500, cx - 152, 480);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Recorte cut-out oval na frente
    ctx.save();
    ctx.globalCompositeOperation = transparentBg ? 'destination-out' : 'source-over';
    ctx.fillStyle = transparentBg ? '#000000' : product.colorSoft;
    ctx.beginPath();
    ctx.ellipse(cx + 12, 395, 44, 20, -0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Saia midi justa com fenda lateral
    ctx.beginPath();
    ctx.moveTo(cx - 134, 530);
    ctx.lineTo(cx + 134, 530);
    ctx.bezierCurveTo(cx + 178, 635, cx + 164, 830, cx + 154, 1025);
    ctx.lineTo(cx + 88, 1025);
    ctx.lineTo(cx + 76, 765);
    ctx.lineTo(cx + 42, 1025);
    ctx.lineTo(cx - 154, 1025);
    ctx.bezierCurveTo(cx - 164, 830, cx - 178, 635, cx - 134, 530);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    // Canelado vertical
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 2;
    for (let x = cx - 150; x <= cx + 150; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, 220);
      ctx.lineTo(x, 1020);
      ctx.stroke();
    }
  } else {
    // Vestido Mini Drapeado Ônix com alças assimétricas + drapeado lateral
    ctx.strokeStyle = product.colorDeep;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(cx - 115, 220);
    ctx.lineTo(cx - 122, 365);
    ctx.moveTo(cx + 98, 220);
    ctx.lineTo(cx + 132, 345);
    ctx.moveTo(cx + 112, 226);
    ctx.lineTo(cx - 28, 382);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 134, 358);
    ctx.quadraticCurveTo(cx + 12, 396, cx + 144, 338);
    ctx.bezierCurveTo(cx + 160, 470, cx + 122, 540, cx + 132, 610);
    ctx.bezierCurveTo(cx + 178, 725, cx + 168, 845, cx + 152, 920);
    ctx.quadraticCurveTo(cx + 68, 868, cx - 148, 955);
    ctx.bezierCurveTo(cx - 176, 825, cx - 172, 705, cx - 132, 610);
    ctx.bezierCurveTo(cx - 120, 540, cx - 154, 460, cx - 134, 358);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    // Dobras de drapeado lateral ajustável
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 3;
    for (let y = 520; y <= 880; y += 34) {
      ctx.beginPath();
      ctx.moveTo(cx - 140, y + 18);
      ctx.quadraticCurveTo(cx + 15, y - 16, cx + 145, y - 24);
      ctx.stroke();
    }
    // Cordão lateral franzido
    ctx.strokeStyle = '#D5D2DD';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(cx + 124, 885);
    ctx.quadraticCurveTo(cx + 142, 965, cx + 118, 1025);
    ctx.moveTo(cx + 124, 885);
    ctx.quadraticCurveTo(cx + 106, 955, cx + 138, 1015);
    ctx.stroke();
  }

  ctx.restore();

  const url = canvas.toDataURL('image/png');
  previewCache.set(cacheKey, url);
  return url;
}

export function getProductImageUrl(product, side = 'front') {
  const publicId =
    side === 'front' ? product.cloudinaryFrontId : product.cloudinaryBackId;
  const cloudinaryUrl = getCloudinaryUrl(publicId);
  if (cloudinaryUrl) return cloudinaryUrl;
  return generateCleanGarmentPng(product, false);
}
