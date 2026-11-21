// Vercel Serverless Function: /api/tryon
// Provador Virtual Gratuito via Hugging Face Spaces (@gradio/client)
// Fallback duplo automático: yisol/IDM-VTON -> zhengchong/CatVTON

import { Client } from '@gradio/client';

export const maxDuration = 60;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '12mb'
    }
  }
};

function base64ToBlob(base64, mimeType = 'image/jpeg') {
  const buffer = Buffer.from(base64, 'base64');
  return new Blob([buffer], { type: mimeType });
}

async function resolveResultToDataUrl(rawOutput, hfToken) {
  if (!rawOutput) {
    throw new Error('O Space não retornou imagem.');
  }

  if (typeof rawOutput === 'string') {
    if (rawOutput.startsWith('data:image/')) {
      return rawOutput;
    }
    const res = await fetch(
      rawOutput,
      hfToken ? { headers: { Authorization: `Bearer ${hfToken}` } } : undefined
    );
    if (!res.ok) {
      throw new Error(`Falha ao baixar imagem gerada (HTTP ${res.status}).`);
    }
    const arrBuf = await res.arrayBuffer();
    const mime = res.headers.get('content-type') || 'image/png';
    return `data:${mime};base64,${Buffer.from(arrBuf).toString('base64')}`;
  }

  const imageUrl = rawOutput?.url || rawOutput?.path;
  if (!imageUrl) {
    throw new Error('Formato de resposta do Space sem URL de imagem.');
  }

  const res = await fetch(
    imageUrl,
    hfToken ? { headers: { Authorization: `Bearer ${hfToken}` } } : undefined
  );
  if (!res.ok) {
    throw new Error(`Falha ao baixar imagem gerada (HTTP ${res.status}).`);
  }
  const arrBuf = await res.arrayBuffer();
  const mime = res.headers.get('content-type') || 'image/png';
  return `data:${mime};base64,${Buffer.from(arrBuf).toString('base64')}`;
}

async function tryIdmVton({
  userBlob,
  garmentBlob,
  garmentDescription,
  hfToken
}) {
  const client = await Client.connect(
    'yisol/IDM-VTON',
    hfToken ? { hf_token: hfToken } : undefined
  );

  const result = await client.predict('/tryon', [
    { background: userBlob, layers: [], composite: null },
    garmentBlob,
    garmentDescription,
    true, // auto-mask
    false, // auto-crop
    30, // denoise steps
    42 // seed
  ]);

  const firstOutput = Array.isArray(result?.data) ? result.data[0] : result?.data;
  const imageUrl = await resolveResultToDataUrl(firstOutput, hfToken);
  return { imageUrl, engine: 'yisol/IDM-VTON' };
}

async function tryCatVton({
  userBlob,
  garmentBlob,
  clothType,
  hfToken
}) {
  const client = await Client.connect(
    'zhengchong/CatVTON',
    hfToken ? { hf_token: hfToken } : undefined
  );

  const safeClothType = ['upper', 'lower', 'overall'].includes(clothType)
    ? clothType
    : 'overall';

  const result = await client.predict('/submit_function', [
    { background: userBlob, layers: [], composite: null },
    garmentBlob,
    safeClothType,
    30, // num_inference_steps
    2.5, // guidance_scale
    42, // seed
    'result only'
  ]);

  const firstOutput = Array.isArray(result?.data) ? result.data[0] : result?.data;
  const imageUrl = await resolveResultToDataUrl(firstOutput, hfToken);
  return { imageUrl, engine: 'zhengchong/CatVTON' };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const {
      userImageBase64,
      userMimeType = 'image/jpeg',
      garmentImageBase64,
      garmentMimeType = 'image/jpeg',
      productName = 'Harumi Modas outfit',
      productDescription = '',
      clothType = 'overall',
      overrideHfToken = ''
    } = body;

    if (!userImageBase64 || !garmentImageBase64) {
      return res.status(400).json({
        error: 'É necessário enviar a foto da cliente e a imagem do look selecionado.'
      });
    }

    const hfToken = (overrideHfToken || process.env.HF_TOKEN || '').trim();
    const userBlob = base64ToBlob(userImageBase64, userMimeType);
    const garmentBlob = base64ToBlob(garmentImageBase64, garmentMimeType);
    const garmentDescription = `${productName} — ${productDescription}`.trim();

    const errors = [];

    // 1ª Tentativa: yisol/IDM-VTON
    try {
      const idmResult = await tryIdmVton({
        userBlob,
        garmentBlob,
        garmentDescription,
        hfToken
      });
      return res.status(200).json(idmResult);
    } catch (idmErr) {
      errors.push(
        `[yisol/IDM-VTON] ${idmErr?.message || String(idmErr)}`
      );
    }

    // 2ª Tentativa (Fallback automático): zhengchong/CatVTON
    try {
      const catResult = await tryCatVton({
        userBlob,
        garmentBlob,
        clothType,
        hfToken
      });
      return res.status(200).json(catResult);
    } catch (catErr) {
      errors.push(
        `[zhengchong/CatVTON] ${catErr?.message || String(catErr)}`
      );
    }

    return res.status(503).json({
      error: `Os dois motores gratuitos do Hugging Face retornaram indisponibilidade ou fila cheia no momento. Detalhes: ${errors.join(
        ' | '
      )}`
    });
  } catch (err) {
    return res.status(500).json({
      error: `Erro interno em /api/tryon: ${err?.message || String(err)}`
    });
  }
}
