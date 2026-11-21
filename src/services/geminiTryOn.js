/**
 * Converte dataURL ou URL local/CORS (`/roupas/*.png` ou Cloudinary) para { mimeType, base64 }
 * reduzindo fotos gigantes da câmera para max 1280px JPEG para manter o payload leve e rápido.
 */
async function compressDataUrlIfLarge(dataUrl, maxDim = 1280) {
  if (typeof document === 'undefined' || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const largest = Math.max(img.width, img.height);
      if (largest <= maxDim) {
        resolve(dataUrl);
        return;
      }
      const scale = maxDim / largest;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.88));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

async function toInlineImageData(sourceUrl) {
  if (!sourceUrl) {
    throw new Error('Imagem de entrada vazia.');
  }

  let workingUrl = sourceUrl;

  if (!workingUrl.startsWith('data:')) {
    const isExternal = /^https?:\/\//i.test(workingUrl);
    const res = await fetch(
      workingUrl,
      isExternal ? { mode: 'cors' } : undefined
    );
    if (!res.ok) {
      throw new Error(
        `Falha ao carregar imagem da peça (HTTP ${res.status}).`
      );
    }
    const blob = await res.blob();
    workingUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || ''));
      reader.onerror = () =>
        reject(new Error('Erro ao converter imagem da peça para Base64.'));
      reader.readAsDataURL(blob);
    });
  }

  const optimizedUrl = await compressDataUrlIfLarge(workingUrl, 1280);
  const commaIdx = optimizedUrl.indexOf(',');
  const header = optimizedUrl.slice(0, commaIdx);
  const base64 = optimizedUrl.slice(commaIdx + 1);
  const mimeMatch = header.match(/data:(.*?);base64/);

  return {
    mimeType: mimeMatch ? mimeMatch[1] : 'image/jpeg',
    base64
  };
}

/**
 * Provador Virtual Multimodal REAL via Backend Serverless `/api/tryon` (Vercel + Vite dev proxy)
 * usando chamada REST direta compatível com chaves `AQ.` e `AIzaSy`.
 */
export async function generateVirtualTryOn(
  userPhotoDataUrl,
  product,
  garmentImageUrl,
  overrideApiKey = ''
) {
  const [userImg, garmentImg] = await Promise.all([
    toInlineImageData(userPhotoDataUrl),
    toInlineImageData(garmentImageUrl)
  ]);

  const response = await fetch('/api/tryon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userImageBase64: userImg.base64,
      userMimeType: userImg.mimeType,
      garmentImageBase64: garmentImg.base64,
      garmentMimeType: garmentImg.mimeType,
      productName: product.name,
      productDescription: product.description,
      overrideApiKey: (overrideApiKey || '').trim()
    })
  });

  const rawText = await response.text();
  let data = null;
  try {
    data = JSON.parse(rawText);
  } catch {
    data = null;
  }

  if (!response.ok || !data?.imageUrl) {
    throw new Error(
      data?.error ||
        `Erro HTTP ${response.status} ao chamar /api/tryon: ${rawText.slice(0, 260)}`
    );
  }

  return {
    imageUrl: data.imageUrl,
    model: data.model || 'gemini-2.5-flash-image'
  };
}
