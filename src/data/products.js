// Catálogo HARUMI MODAS • Street Luxe / Zara & Bershka Lookbook • Ecossistema Portal LOJAS JP
// Fotografias Editoriais Reais + Gerenciador Cloudinary (`jontqsrz`) com `e_background_removal`

export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'jontqsrz';

const CUSTOM_PHOTOS_STORAGE_KEY = 'harumi_modas_cloudinary_photos_v1';

/**
 * Monta URL otimizada do Cloudinary (`jontqsrz`) com suporte a recorte automático de fundo
 * (`e_background_removal`) ou aceita uma URL completa (Unsplash / Pexels / Cloudinary).
 */
export function resolveCloudinaryOrUrl(input, removeBackground = true) {
  if (!input || typeof input !== 'string' || !input.trim()) {
    return null;
  }
  const raw = input.trim();
  const bgTransform = removeBackground ? 'e_background_removal,' : '';
  const transforms = `${bgTransform}f_auto,q_auto:best,w_1200`;

  if (/^https?:\/\//i.test(raw)) {
    // Se já for uma URL do Cloudinary e o usuário ativou recorte de fundo, injeta a transformação
    if (
      removeBackground &&
      raw.includes('res.cloudinary.com/') &&
      raw.includes('/image/upload/') &&
      !raw.includes('e_background_removal')
    ) {
      return raw.replace('/image/upload/', `/image/upload/${transforms}/`);
    }
    return raw;
  }

  const cleanId = raw.replace(/^\/+/, '');
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${cleanId}`;
}

export function loadCustomPhotos() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CUSTOM_PHOTOS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCustomPhotos(photoMap) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      CUSTOM_PHOTOS_STORAGE_KEY,
      JSON.stringify(photoMap || {})
    );
  } catch {
    // ignore storage quota errors
  }
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
    defaultFrontImage: './garments/corset-terracota.jpg',
    description:
      'Terracotta satin structured cropped corset top with sweetheart neckline, thin spaghetti straps, vertical couture boning seams, and sleek fitted waist',
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
    defaultFrontImage: './garments/cargo-parachute.jpg',
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
    defaultFrontImage: './garments/bomber-oversized.jpg',
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
    defaultFrontImage: './garments/ribbed-cutout.jpg',
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
    defaultFrontImage: './garments/mini-draped-onix.jpg',
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
    sizeGuide: [
      { size: 'P', bust: '80–85 cm', waist: '62–67 cm', hip: '88–94 cm', length: '78 cm' },
      { size: 'M', bust: '86–91 cm', waist: '68–73 cm', hip: '95–100 cm', length: '80 cm' },
      { size: 'G', bust: '92–97 cm', waist: '74–79 cm', hip: '101–106 cm', length: '82 cm' },
      { size: 'GG', bust: '98–104 cm', waist: '80–86 cm', hip: '107–113 cm', length: '84 cm' }
    ]
  }
];

const backSpecCache = new Map();

/**
 * Gera verso editorial minimalista (ficha técnica + etiqueta tecida HARUMI MODAS)
 * caso o usuário não tenha cadastrado uma foto separada de costas no Cloudinary.
 */
export function generateBackEditorialCard(product) {
  if (backSpecCache.has(product.id)) return backSpecCache.get(product.id);
  if (typeof document === 'undefined') return '';

  const W = 900;
  const H = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#FAF7F3');
  bg.addColorStop(0.55, product.colorSoft);
  bg.addColorStop(1, product.bgTint);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Etiqueta tecida de cetim champanhe no topo central
  const lw = 340;
  const lh = 118;
  const lx = (W - lw) / 2;
  const ly = 140;

  ctx.save();
  ctx.shadowColor = 'rgba(24,22,21,0.18)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#F7F3EC';
  ctx.fillRect(lx, ly, lw, lh);
  ctx.restore();

  ctx.strokeStyle = '#C9B290';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(lx + 10, ly + 10, lw - 20, lh - 20);

  ctx.fillStyle = '#181615';
  ctx.textAlign = 'center';
  ctx.font = '700 32px "Syne", sans-serif';
  ctx.fillText('HARUMI MODAS', W / 2, ly + 58);
  ctx.fillStyle = '#8C7554';
  ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TOKYO • STREET LUXE D2C', W / 2, ly + 90);

  // Detalhes editoriais do verso
  ctx.fillStyle = 'rgba(24,22,21,0.08)';
  ctx.font = '800 220px "Syne", sans-serif';
  ctx.fillText(product.code, W / 2, 520);

  ctx.fillStyle = '#181615';
  ctx.font = '800 36px "Syne", sans-serif';
  ctx.fillText(product.name.toUpperCase(), W / 2, 620);

  ctx.fillStyle = product.accentText;
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(product.fabricTitle.toUpperCase(), W / 2, 675);

  // Bloco de composição e cuidados
  ctx.fillStyle = 'rgba(255,255,255,0.68)';
  ctx.beginPath();
  ctx.roundRect(96, 745, W - 192, 235, 28);
  ctx.fill();

  ctx.fillStyle = '#8C7554';
  ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('COMPOSIÇÃO & CUIDADOS DO ATELIER', W / 2, 800);

  ctx.fillStyle = '#181615';
  ctx.font = '500 21px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(product.composition, W / 2, 855);
  ctx.fillStyle = 'rgba(24,22,21,0.7)';
  ctx.font = '400 19px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(product.care, W / 2, 902);
  ctx.fillStyle = '#181615';
  ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`SKU ${product.sku}  •  ${formatYen(product.price)}`, W / 2, 952);

  ctx.fillStyle = 'rgba(24,22,21,0.5)';
  ctx.font = '600 17px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PORTAL LOJAS JP • LOJAJP.COM', W / 2, H - 86);

  const dataUrl = canvas.toDataURL('image/png');
  backSpecCache.set(product.id, dataUrl);
  return dataUrl;
}

/**
 * Resolve a imagem final da peça levando em conta overrides do Gerenciador Cloudinary
 * salvos em localStorage -> IDs fixos no catálogo -> fotografia editorial local de estúdio.
 */
export function getProductImageUrl(product, side = 'front', customPhotos = null) {
  const custom = customPhotos?.[product.id];
  const removeBg = custom?.removeBg !== false;

  if (side === 'front') {
    if (custom?.front) {
      const resolved = resolveCloudinaryOrUrl(custom.front, removeBg);
      if (resolved) return resolved;
    }
    if (product.cloudinaryFrontId) {
      const resolved = resolveCloudinaryOrUrl(product.cloudinaryFrontId, true);
      if (resolved) return resolved;
    }
    return product.defaultFrontImage;
  }

  // Verso / Costas
  if (custom?.back) {
    const resolved = resolveCloudinaryOrUrl(custom.back, removeBg);
    if (resolved) return resolved;
  }
  if (product.cloudinaryBackId) {
    const resolved = resolveCloudinaryOrUrl(product.cloudinaryBackId, true);
    if (resolved) return resolved;
  }
  return generateBackEditorialCard(product);
}
