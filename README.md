# HARUMI MODAS — Atelier D2C 3D & Provador Virtual IA

Aplicação web e-commerce D2C de moda feminina de luxo da marca **HARUMI MODAS**, integrada ao ecossistema **Portal LOJAS JP** (`lojajp.com`).

## Destaques Técnicos
- **React + Vite + Tailwind CSS** com `base: './'` para total compatibilidade tanto na raiz (**Vercel**) quanto em subdomínio/subcaminho (`lojajp.com/harumimodas` / `harumimodas.lojajp.com` no **Netlify**).
- **Intro Editorial 3D**: Monograma `HM`, partículas 3D de seda, pétalas e brilhos dourados + botão `SKIP INTRO`.
- **Vitrine Hero em Arco 3D (`#colecao`)**: Three.js (`@react-three/fiber`) com `MeshPhysicalMaterial`, ondulação sutil de tecido, revelação radial dinâmica com ondas concêntricas, drag & momentum, clique direto, setas do teclado, roda horizontal e Autoplay.
- **Inspeção 3D (`#detalhes`)**: Rotação 180°/360° exibindo frente, costas e etiqueta de cetim **HARUMI MODAS**, zoom de tecido, guia de tamanhos (`P, M, G, GG`), favoritos e botão **PROVAR EM MIM (IA)**.
- **Provador Virtual com IA (`@google/genai`)**: Envio da foto da cliente + textura da peça ativa via Google Gemini com fallback editorial automático.
- **Cloudinary (`jontqsrz`) + Texturas Procedurais**: Fallback automático em HTML5 Canvas de alta resolução (Frente e Verso) pronto para uso imediato; basta preencher `cloudinaryFrontId` e `cloudinaryBackId` em `src/data/products.js`.
- **Shop the Drop (`#shop`) + Monte seu Look (`#look`) + Sacola WhatsApp**: Animação de peça voando para a sacola, desconto automático de **15% OFF** para combos de 3+ peças em Ienes (`¥`) e checkout direto via WhatsApp (`https://wa.me/818074558624`).

## Variáveis de Ambiente (`.env`)
```env
VITE_GEMINI_API_KEY=sua_chave_gemini
VITE_CLOUDINARY_CLOUD_NAME=jontqsrz
```

## Desenvolvimento & Build
```bash
npm install
npm run dev
npm run build
```

---
*Harumi Modas • Powered by Portal LOJAS JP (lojajp.com)*
