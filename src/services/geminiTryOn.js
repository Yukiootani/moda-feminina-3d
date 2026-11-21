import { GoogleGenAI } from '@google/genai';

/**
 * Converte dataURL ou URL (local `./garments/...` ou Cloudinary/Unsplash CORS) para { mimeType, base64 }
 */
async function toInlineImageData(sourceUrl) {
  if (!sourceUrl) {
    throw new Error('Imagem de entrada vazia.');
  }

  if (sourceUrl.startsWith('data:')) {
    const commaIdx = sourceUrl.indexOf(',');
    const header = sourceUrl.slice(0, commaIdx);
    const base64 = sourceUrl.slice(commaIdx + 1);
    const mimeMatch = header.match(/data:(.*?);base64/);
    return {
      mimeType: mimeMatch ? mimeMatch[1] : 'image/png',
      base64
    };
  }

  const isExternal = /^https?:\/\//i.test(sourceUrl);
  const res = await fetch(sourceUrl, isExternal ? { mode: 'cors' } : undefined);
  if (!res.ok) {
    throw new Error(
      `Falha ao carregar imagem da peça (HTTP ${res.status}). Verifique se a URL permite CORS.`
    );
  }
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || '');
      const commaIdx = result.indexOf(',');
      resolve({
        mimeType: blob.type || 'image/png',
        base64: result.slice(commaIdx + 1)
      });
    };
    reader.onerror = () =>
      reject(new Error('Erro ao converter imagem da peça para Base64.'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Provador Virtual Multimodal REAL via Google Gemini (`@google/genai`).
 * Tenta primeiro `gemini-2.5-flash-image` e faz fallback automático para
 * `gemini-2.0-flash-exp-image-generation` caso necessário.
 *
 * Aceita opcionalmente `overrideApiKey` para testes instantâneos no modal em caso de erro de cota.
 */
export async function generateVirtualTryOn(
  userPhotoDataUrl,
  product,
  garmentImageUrl,
  overrideApiKey = ''
) {
  const apiKey = (
    overrideApiKey ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    ''
  ).trim();

  if (!apiKey) {
    throw new Error(
      'Nenhuma API Key do Gemini configurada. Defina VITE_GEMINI_API_KEY ou informe uma chave no campo abaixo para testar.'
    );
  }

  const [userImg, garmentImg] = await Promise.all([
    toInlineImageData(userPhotoDataUrl),
    toInlineImageData(garmentImageUrl)
  ]);

  const prompt = `Virtual try-on fashion photography: Dress the person from the first image wearing the exact clothing item shown in the second image (${product.name} - ${product.description}). Keep the person's exact face, identity, hair, skin tone, body pose, and background completely unchanged. Replace only their current outfit with the new garment, adapting natural fabric folds, shadows, and realistic lighting to fit their body seamlessly.`;

  const ai = new GoogleGenAI({ apiKey });
  const candidateModels = [
    'gemini-2.5-flash-image',
    'gemini-2.0-flash-exp-image-generation'
  ];

  const errors = [];

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
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
              },
              { text: prompt }
            ]
          }
        ],
        config: {
          responseModalities: ['IMAGE', 'TEXT']
        }
      });

      const candidate = response?.candidates?.[0];
      const parts = candidate?.content?.parts || [];
      const imagePart = parts.find((p) => p?.inlineData?.data);

      if (imagePart?.inlineData?.data) {
        const outMime = imagePart.inlineData.mimeType || 'image/png';
        return {
          imageUrl: `data:${outMime};base64,${imagePart.inlineData.data}`,
          model
        };
      }

      const textFeedback = parts
        .filter((p) => p?.text)
        .map((p) => p.text)
        .join(' ')
        .trim();
      errors.push(
        `[${model}] Sem imagem retornada${
          candidate?.finishReason ? ` (${candidate.finishReason})` : ''
        }${textFeedback ? `: ${textFeedback}` : ''}`
      );
    } catch (err) {
      const msg =
        err?.message || (typeof err === 'string' ? err : JSON.stringify(err));
      errors.push(`[${model}] ${msg}`);
    }
  }

  throw new Error(errors.join(' | '));
}
