import { GoogleGenAI } from '@google/genai';
import { generateCleanGarmentPng } from '../data/products';

/**
 * Extrai { mimeType, base64 } de um data URL (base64) ou URL de imagem.
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

  const res = await fetch(sourceUrl, { mode: 'cors' });
  if (!res.ok) {
    throw new Error(`Falha ao carregar imagem de referência (HTTP ${res.status}).`);
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
    reader.onerror = () => reject(new Error('Erro ao converter imagem para Base64.'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Provador Virtual Multimodal REAL via Google Gemini (`gemini-2.5-flash-image`).
 * Envia DUAS imagens em Base64 (`inlineData`):
 *   1) Foto da cliente
 *   2) Snapshot PNG da peça 3D ativa (ou renderização limpa em alta resolução da peça)
 * + prompt explícito em inglês para troca realista de roupa.
 *
 * IMPORTANTE: NÃO realiza simulação falsa silenciosa. Qualquer erro da API é
 * propagado com a mensagem exata para diagnóstico imediato na interface.
 */
export async function generateVirtualTryOn(
  userPhotoDataUrl,
  product,
  garmentSnapshotDataUrl = null
) {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();

  if (!apiKey) {
    throw new Error(
      'Chave VITE_GEMINI_API_KEY não configurada. Defina VITE_GEMINI_API_KEY no arquivo .env e nas variáveis de ambiente da Vercel.'
    );
  }

  const garmentSource =
    garmentSnapshotDataUrl || generateCleanGarmentPng(product, false);

  const [userImg, garmentImg] = await Promise.all([
    toInlineImageData(userPhotoDataUrl),
    toInlineImageData(garmentSource)
  ]);

  const prompt = `Virtual try-on fashion photography: Dress the person from the first image wearing the exact clothing item shown in the second image (${product.name} - ${product.description}). Keep the person's exact face, identity, hair, skin tone, body pose, and background completely unchanged. Replace only their current outfit with the new garment, adapting natural fabric folds, shadows, and realistic lighting to fit their body seamlessly.`;

  const ai = new GoogleGenAI({ apiKey });

  let response;
  try {
    response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
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
  } catch (apiError) {
    const rawMsg =
      apiError?.message ||
      (typeof apiError === 'string' ? apiError : JSON.stringify(apiError));
    throw new Error(`Erro na API do Gemini (gemini-2.5-flash-image): ${rawMsg}`);
  }

  const candidate = response?.candidates?.[0];
  const parts = candidate?.content?.parts || [];
  const imagePart = parts.find((p) => p?.inlineData?.data);

  if (!imagePart?.inlineData?.data) {
    const textFeedback = parts
      .filter((p) => p?.text)
      .map((p) => p.text)
      .join(' ')
      .trim();
    const finishReason = candidate?.finishReason
      ? ` (finishReason: ${candidate.finishReason})`
      : '';
    throw new Error(
      `O modelo gemini-2.5-flash-image não retornou uma imagem${finishReason}.${
        textFeedback ? ` Resposta do modelo: "${textFeedback}"` : ''
      }`
    );
  }

  const outMime = imagePart.inlineData.mimeType || 'image/png';
  return {
    imageUrl: `data:${outMime};base64,${imagePart.inlineData.data}`,
    model: 'gemini-2.5-flash-image',
    garmentRefUrl: garmentSource
  };
}
