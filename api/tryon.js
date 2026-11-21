// Vercel Serverless Function: /api/tryon
// Provador Virtual Gratuito via Hugging Face Spaces (@gradio/client)
// Lê o arquivo EXATO da peça isolada (`/roupas/*.jpg` do disco ou URL absoluta de produção)
// e executa yisol/IDM-VTON com fallback automático para zhengchong/CatVTON.

import fs from 'node:fs/promises';
import path from 'node:path';
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

/**
 * Carrega o arquivo EXATO da peça isolada como Blob (`image/jpeg`):
 * 1) Se `garmentPath` for local (`/roupas/...`), tenta ler diretamente do disco (`public/` ou `dist/`)
 * 2) Caso contrário (Vercel CDN estático ou URL Cloudinary customizada), baixa da URL absoluta
 * 3) Por último, usa `garmentImageBase64` se fornecido
 */
async function loadExactGarmentBlob({
  req,
  garmentPath,
  garmentUrl,
  garmentImageBase64,
  garmentMimeType = 'image/jpeg'
}) {
  // 1. Tenta ler diretamente do disco local para arquivos `/roupas/...`
  if (garmentPath && typeof garmentPath === 'string' && garmentPath.startsWith('/roupas/')) {
    const safeRel = garmentPath.replace(/^\/+/, '').replace(/\.\./g, '');
    const candidateDiskPaths = [
      path.join(process.cwd(), 'public', safeRel),
      path.join(process.cwd(), 'dist', safeRel)
    ];

    for (const diskPath of candidateDiskPaths) {
      try {
        const fileBuf = await fs.readFile(diskPath);
        if (fileBuf && fileBuf.length > 1024) {
          return new Blob([fileBuf], { type: 'image/jpeg' });
        }
      } catch {
        // segue para o próximo caminho ou URL absoluta
      }
    }

    // 2a. Busca pela URL absoluta de produção na Vercel
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = req.headers['x-forwarded-proto'] || 'https';
    if (host) {
      const absUrl = `${proto}://${host}/${safeRel}`;
      const res = await fetch(absUrl);
      if (res.ok) {
        const arrBuf = await res.arrayBuffer();
        return new Blob([arrBuf], { type: 'image/jpeg' });
      }
    }
  }

  // 2b. URL externa (ex: foto substituída pelo Gerenciador Cloudinary `jontqsrz`)
  if (garmentUrl && /^https?:\/\//i.test(garmentUrl)) {
    const res = await fetch(garmentUrl);
    if (res.ok) {
      const arrBuf = await res.arrayBuffer();
      const ct = res.headers.get('content-type') || 'image/jpeg';
      return new Blob([arrBuf], { type: ct.includes('png') ? 'image/png' : 'image/jpeg' });
    }
  }

  // 3. Fallback para Base64 caso enviado pelo cliente
  if (garmentImageBase64) {
    return base64ToBlob(garmentImageBase64, garmentMimeType || 'image/jpeg');
  }

  throw new Error('Não foi possível localizar o arquivo da peça isolada para o Provador Virtual.');
}

async function resolveResultToDataUrl(rawOutput, hfToken) {
  if (!rawOutput) {
    throw new Error('O Space não retornou imagem.');
  }

  const targetUrl =
    typeof rawOutput === 'string'
      ? rawOutput
      : rawOutput?.url || rawOutput?.path;

  if (!targetUrl) {
    throw new Error('Formato de resposta do Space sem URL de imagem.');
  }

  if (targetUrl.startsWith('data:image/')) {
    return targetUrl;
  }

  const res = await fetch(
    targetUrl,
    hfToken ? { headers: { Authorization: `Bearer ${hfToken}` } } : undefined
  );
  if (!res.ok) {
    throw new Error(`Falha ao baixar imagem gerada (HTTP ${res.status}).`);
  }
  const arrBuf = await res.arrayBuffer();
  const mime = res.headers.get('content-type') || 'image/png';
  return `data:${mime};base64,${Buffer.from(arrBuf).toString('base64')}`;
}

async function tryIdmVton({ userBlob, garmentBlob, garmentDes, hfToken }) {
  const client = await Client.connect(
    'yisol/IDM-VTON',
    hfToken ? { hf_token: hfToken } : undefined
  );

  const result = await client.predict('/tryon', [
    { background: userBlob, layers: [], composite: null }, // dict (foto da cliente)
    garmentBlob, // garm_img (arquivo exato da peça isolada)
    garmentDes, // garment_des (descrição técnica em inglês)
    true, // is_checked
    false, // is_checked_crop
    30, // denoise_steps
    42 // seed
  ]);

  const firstOutput = Array.isArray(result?.data) ? result.data[0] : result?.data;
  const imageUrl = await resolveResultToDataUrl(firstOutput, hfToken);
  return { imageUrl, engine: 'yisol/IDM-VTON' };
}

async function tryCatVton({ userBlob, garmentBlob, clothType, hfToken }) {
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
    30,
    2.5,
    42,
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
      garmentPath = '',
      garmentUrl = '',
      garmentImageBase64 = '',
      garmentMimeType = 'image/jpeg',
      garmentDes = '',
      productName = 'fashion garment',
      productDescription = '',
      clothType = 'overall',
      overrideHfToken = ''
    } = body;

    if (!userImageBase64) {
      return res.status(400).json({
        error: 'Envie sua foto antes de iniciar o Provador Virtual.'
      });
    }

    const hfToken = (overrideHfToken || process.env.HF_TOKEN || '').trim();
    const userBlob = base64ToBlob(userImageBase64, userMimeType);
    const garmentBlob = await loadExactGarmentBlob({
      req,
      garmentPath,
      garmentUrl,
      garmentImageBase64,
      garmentMimeType
    });

    const finalGarmentDes = (
      garmentDes ||
      productDescription ||
      productName
    ).trim();

    const errors = [];

    // 1ª Tentativa: yisol/IDM-VTON com a peça isolada exata
    try {
      const idmResult = await tryIdmVton({
        userBlob,
        garmentBlob,
        garmentDes: finalGarmentDes,
        hfToken
      });
      return res.status(200).json(idmResult);
    } catch (idmErr) {
      errors.push(`[yisol/IDM-VTON] ${idmErr?.message || String(idmErr)}`);
    }

    // 2ª Tentativa: fallback automático para zhengchong/CatVTON
    try {
      const catResult = await tryCatVton({
        userBlob,
        garmentBlob,
        clothType,
        hfToken
      });
      return res.status(200).json(catResult);
    } catch (catErr) {
      errors.push(`[zhengchong/CatVTON] ${catErr?.message || String(catErr)}`);
    }

    return res.status(503).json({
      error: `Fila cheia ou indisponibilidade temporária nos Spaces gratuitos do Hugging Face. Detalhes: ${errors.join(
        ' | '
      )}`
    });
  } catch (err) {
    return res.status(500).json({
      error: `Erro interno em /api/tryon: ${err?.message || String(err)}`
    });
  }
}
