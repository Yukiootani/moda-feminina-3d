/**
 * Comprime fotos gigantes de smartphone (ex: 12MP do iPhone) para max 1024px JPEG
 * mantendo nitidez máxima e upload instantâneo para o IDM-VTON / CatVTON.
 */
async function compressUserPhoto(dataUrl, maxDim = 1024) {
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

function splitDataUrl(dataUrl) {
  const commaIdx = dataUrl.indexOf(',');
  const header = dataUrl.slice(0, commaIdx);
  const base64 = dataUrl.slice(commaIdx + 1);
  const mimeMatch = header.match(/data:(.*?);base64/);
  return {
    mimeType: mimeMatch ? mimeMatch[1] : 'image/jpeg',
    base64
  };
}

/**
 * Provador Virtual via `/api/tryon` (Hugging Face IDM-VTON -> fallback CatVTON).
 * Envia o caminho exato da peça isolada (`/roupas/...` ou URL Cloudinary) para o servidor
 * ler o arquivo original direto do disco/CDN sem nunca enviar captura de tela.
 */
export async function generateVirtualTryOn(
  userPhotoDataUrl,
  product,
  resolvedGarmentUrl,
  overrideHfToken = ''
) {
  const compressedUser = await compressUserPhoto(userPhotoDataUrl, 1024);
  const userImg = splitDataUrl(compressedUser);

  const isLocalPath =
    typeof resolvedGarmentUrl === 'string' &&
    resolvedGarmentUrl.startsWith('/roupas/');

  const response = await fetch('/api/tryon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userImageBase64: userImg.base64,
      userMimeType: userImg.mimeType,
      garmentPath: isLocalPath ? resolvedGarmentUrl : product.defaultFrontImage,
      garmentUrl: !isLocalPath ? resolvedGarmentUrl : '',
      garmentDes: product.garmentDes || product.description,
      productName: product.name,
      productDescription: product.description,
      clothType: product.clothType || 'overall',
      overrideHfToken: (overrideHfToken || '').trim()
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
    engine: data.engine || 'yisol/IDM-VTON'
  };
}
