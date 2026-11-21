// Vercel Serverless Function: /api/tryon
// Chamada REST direta para o Google Gemini Multimodal Image Generation (compatível com chaves AQ. e AIzaSy)

const CANDIDATE_MODELS = [
  'gemini-2.5-flash-image',
  'gemini-2.0-flash-exp-image-generation',
  'gemini-3.1-flash-image',
  'gemini-3.1-flash-lite-image'
];

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '12mb'
    }
  }
};

export default async function handler(req, res) {
  // CORS headers seguros
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
      garmentMimeType = 'image/png',
      productName = 'Harumi Modas garment',
      productDescription = '',
      overrideApiKey = ''
    } = body;

    const apiKey = (
      overrideApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      ''
    ).trim();

    if (!apiKey) {
      return res.status(400).json({
        error:
          'GEMINI_API_KEY não configurada no servidor Vercel. Configure GEMINI_API_KEY nas variáveis de ambiente ou teste com uma chave no campo abaixo.'
      });
    }

    if (!userImageBase64 || !garmentImageBase64) {
      return res.status(400).json({
        error: 'É necessário enviar userImageBase64 e garmentImageBase64.'
      });
    }

    const prompt = `Virtual try-on fashion photography: Dress the person from the first image wearing the exact clothing item shown in the second image (${productName} - ${productDescription}). Keep the person's exact face, identity, hair, skin tone, body pose, and background completely unchanged. Replace only their current outfit with the new garment, adapting natural fabric folds, shadows, and realistic lighting to fit their body seamlessly.`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              inline_data: {
                mime_type: userMimeType,
                data: userImageBase64
              }
            },
            {
              inline_data: {
                mime_type: garmentMimeType,
                data: garmentImageBase64
              }
            },
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT']
      }
    };

    const attemptErrors = [];

    for (const model of CANDIDATE_MODELS) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
        apiKey
      )}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(payload)
      });

      const rawText = await response.text();
      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { raw: rawText };
      }

      if (!response.ok) {
        const errMsg =
          data?.error?.message ||
          data?.raw?.slice(0, 260) ||
          `HTTP ${response.status}`;
        attemptErrors.push(`[${model} • HTTP ${response.status}] ${errMsg}`);
        continue;
      }

      const candidate = data?.candidates?.[0];
      const parts = candidate?.content?.parts || [];
      const imagePart = parts.find(
        (p) => p?.inlineData?.data || p?.inline_data?.data
      );

      if (imagePart) {
        const inline = imagePart.inlineData || imagePart.inline_data;
        const outMime = inline.mimeType || inline.mime_type || 'image/png';
        return res.status(200).json({
          imageUrl: `data:${outMime};base64,${inline.data}`,
          model
        });
      }

      const textFeedback = parts
        .filter((p) => p?.text)
        .map((p) => p.text)
        .join(' ')
        .trim();
      attemptErrors.push(
        `[${model}] Nenhuma imagem retornada${
          candidate?.finishReason ? ` (${candidate.finishReason})` : ''
        }${textFeedback ? `: ${textFeedback}` : ''}`
      );
    }

    return res.status(502).json({
      error: attemptErrors.join(' | ')
    });
  } catch (err) {
    return res.status(500).json({
      error: `Erro interno em /api/tryon: ${err?.message || String(err)}`
    });
  }
}
