import { GoogleGenAI } from '@google/genai';
import { generateProceduralTexture, getProductImageUrl } from '../data/products';

/**
 * Converte dataURL ou URL externa para { mimeType, base64 }
 */
async function toInlineImageData(sourceUrl) {
  if (sourceUrl.startsWith('data:')) {
    const [header, base64] = sourceUrl.split(',');
    const mimeMatch = header.match(/data:(.*?);base64/);
    return {
      mimeType: mimeMatch ? mimeMatch[1] : 'image/png',
      base64
    };
  }

  const res = await fetch(sourceUrl, { mode: 'cors' });
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || '');
      const [, base64] = result.split(',');
      resolve({
        mimeType: blob.type || 'image/jpeg',
        base64
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Fallback visual editorial automático caso a chave Gemini não esteja configurada
 * ou ocorra erro de cota/rede — gera uma composição de estúdio preservando o rosto e
 * integrando o caimento, cor e iluminação da peça da Harumi Modas.
 */
async function createEditorialFallbackPreview(userPhotoDataUrl, product) {
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const [userImg, garmentImg] = await Promise.all([
    loadImage(userPhotoDataUrl),
    loadImage(generateProceduralTexture(product, 'front'))
  ]);

  const W = 768;
  const H = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. Foto da cliente centralizada (cover) preservando rosto e pose
  const scale = Math.max(W / userImg.width, H / userImg.height);
  const drawW = userImg.width * scale;
  const drawH = userImg.height * scale;
  const dx = (W - drawW) / 2;
  const dy = (H - drawH) / 2;
  ctx.drawImage(userImg, dx, dy, drawW, drawH);

  // 2. Harmonização suave de luz editorial no torso preservando totalmente rosto/cabelo (topo 34%)
  const torsoGrad = ctx.createLinearGradient(0, H * 0.34, 0, H * 0.96);
  torsoGrad.addColorStop(0, 'rgba(0,0,0,0)');
  torsoGrad.addColorStop(0.18, `${product.color}88`);
  torsoGrad.addColorStop(0.55, `${product.color}B8`);
  torsoGrad.addColorStop(1, `${product.colorDeep}CC`);

  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = torsoGrad;
  ctx.fillRect(0, H * 0.32, W, H * 0.68);
  ctx.restore();

  // 3. Projeção suave da silhueta e textura da peça na região do tronco
  ctx.save();
  const maskGrad = ctx.createRadialGradient(
    W * 0.5,
    H * 0.64,
    W * 0.08,
    W * 0.5,
    H * 0.64,
    W * 0.44
  );
  maskGrad.addColorStop(0, 'rgba(255,255,255,0.62)');
  maskGrad.addColorStop(0.65, 'rgba(255,255,255,0.28)');
  maskGrad.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.globalAlpha = 0.58;
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(garmentImg, W * 0.14, H * 0.28, W * 0.72, H * 0.72);
  ctx.restore();

  // 4. Brilho sutil de estúdio e selo discreto Harumi Modas AI Lookbook
  const vignette = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, H * 0.72);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(24,22,21,0.22)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // Etiqueta editorial inferior
  ctx.fillStyle = 'rgba(24, 22, 21, 0.72)';
  ctx.fillRect(28, H - 96, W - 56, 68);
  ctx.strokeStyle = 'rgba(201, 178, 144, 0.6)';
  ctx.lineWidth = 1;
  ctx.strokeRect(28, H - 96, W - 56, 68);

  ctx.fillStyle = '#F7F4F0';
  ctx.font = '600 20px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(`HARUMI MODAS • ${product.name.toUpperCase()}`, 48, H - 64);
  ctx.fillStyle = '#D8C7B4';
  ctx.font = '400 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${product.fabricTitle} • Simulação Visual de Estúdio`, 48, H - 42);

  return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Executa o Provador Virtual via Gemini API (@google/genai).
 * Envia a foto da cliente + textura da peça ativa e retorna a prévia gerada.
 * Em caso de falta de chave ou limite de cota, aciona o fallback visual automático.
 */
export async function generateVirtualTryOn(userPhotoDataUrl, product) {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();

  if (!apiKey) {
    const fallbackUrl = await createEditorialFallbackPreview(userPhotoDataUrl, product);
    return {
      imageUrl: fallbackUrl,
      mode: 'fallback',
      notice:
        'Modo de Prévia Editorial ativo (adicione VITE_GEMINI_API_KEY no .env / Vercel para renderização fotorrealista via Gemini).'
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const [userImg, garmentImg] = await Promise.all([
      toInlineImageData(userPhotoDataUrl),
      toInlineImageData(getProductImageUrl(product, 'front'))
    ]);

    const prompt = [
      `Você é um diretor de fotografia de moda de luxo da marca japonesa-brasileira HARUMI MODAS.`,
      `Crie uma fotografia editorial fotorrealista de provador virtual (Virtual Try-On) vestindo exatamente a cliente da primeira imagem com a peça da segunda imagem:`,
      `- Peça: ${product.name} (${product.category})`,
      `- Cor exata: ${product.color}`,
      `- Tecido e caimento: ${product.fabricTitle} — ${product.fabricDescription}`,
      `- Composição: ${product.composition}`,
      `REGRAS ESTRITAS:`,
      `1. Preserve com 100% de fidelidade o rosto, expressão, tom de pele, cabelo, proporções corporais, pose e iluminação original da cliente na primeira foto.`,
      `2. Substitua apenas a vestimenta atual pela peça "${product.name}" da Harumi Modas, ajustando o caimento natural do tecido, dobras, sombras e brilho de acordo com o corpo e a luz do ambiente dela.`,
      `3. Resultado fotográfico natural de alta costura, sem texto ou marcas d'água sobre a imagem.`
    ].join('\n');

    const candidateModels = [
      'gemini-2.5-flash-image',
      'gemini-2.0-flash-exp-image-generation'
    ];

    let lastError = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: userImg.mimeType,
                    data: userImg.base64
                  }
                },
                {
                  inlineData: {
                    mimeType: garmentImg.mimeType,
                    data: garmentImg.base64
                  }
                }
              ]
            }
          ],
          config: {
            responseModalities: ['IMAGE', 'TEXT']
          }
        });

        const parts = response?.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((p) => p.inlineData?.data);
        if (imagePart?.inlineData?.data) {
          const outMime = imagePart.inlineData.mimeType || 'image/png';
          return {
            imageUrl: `data:${outMime};base64,${imagePart.inlineData.data}`,
            mode: 'gemini',
            model,
            notice: 'Prévia fotorrealista gerada em tempo real pela IA do Google Gemini.'
          };
        }
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error('Nenhuma imagem retornada pela API do Gemini.');
  } catch (error) {
    console.warn('[Harumi Modas Virtual Try-On] Fallback visual acionado:', error);
    const fallbackUrl = await createEditorialFallbackPreview(userPhotoDataUrl, product);
    return {
      imageUrl: fallbackUrl,
      mode: 'fallback',
      notice:
        'A cota ou conexão com a API do Gemini oscilou — exibindo prévia editorial assistida automaticamente.'
    };
  }
}
