import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Plugin Vite local que expõe o mesmo endpoint `/api/tryon` em `npm run dev`
 * usando a função serverless `api/tryon.js` com `.env` carregado automaticamente.
 */
function localTryOnApiPlugin() {
  return {
    name: 'local-tryon-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
        process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
      }
      if (env.VITE_GEMINI_API_KEY && !process.env.VITE_GEMINI_API_KEY) {
        process.env.VITE_GEMINI_API_KEY = env.VITE_GEMINI_API_KEY;
      }

      server.middlewares.use('/api/tryon', async (req, res) => {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', async () => {
          try {
            const rawBody = Buffer.concat(chunks).toString('utf8');
            req.body = rawBody ? JSON.parse(rawBody) : {};

            // Adapter leve compatível com assinatura Vercel (res.status().json())
            const vercelRes = {
              setHeader: (k, v) => res.setHeader(k, v),
              status(code) {
                res.statusCode = code;
                return {
                  json(payload) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(payload));
                  },
                  end(data) {
                    res.end(data);
                  }
                };
              }
            };

            const { default: handler } = await import('./api/tryon.js');
            await handler(req, vercelRes);
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: `Erro no proxy local /api/tryon: ${err?.message || String(err)}`
              })
            );
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localTryOnApiPlugin()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          genai: ['@google/genai']
        }
      }
    }
  }
});
