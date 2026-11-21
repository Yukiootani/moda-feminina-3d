# HARUMI MODAS — NEW DROP 3D • Street Luxe & Provador Virtual IA

Aplicação web e-commerce D2C de moda jovem urbana (*Zara / Bershka / Street Luxe vibes*) da marca **HARUMI MODAS**, integrada ao ecossistema **Portal LOJAS JP** (`lojajp.com`).

## Destaques Técnicos
- **Escultura 3D Real Sem Planos Retangulares ([Garment3DModel.jsx](src/components/Garment3DModel.jsx))**: Cada uma das 5 peças é esculpida em 3D volumétrico (`BufferGeometry`, `ExtrudeGeometry`, `TubeGeometry`, `TorusGeometry`) com silhueta recortada, dobras de tecido, barbatanas, bolsos cargo 3D, mangas bufantes, recortes cut-out, drapeado lateral, iluminação de estúdio (`Lightformer` + `ContactShadows`), costura traseira e etiqueta interna **HARUMI MODAS**.
- **Catálogo Street Luxe (5 Peças)**:
  1. **Corset Cropped Acetinado** (`#D47A6A` | `¥5.900`)
  2. **Calça Cargo Parachute** (`#D5C7B2` | `¥8.900`)
  3. **Jaqueta Bomber Oversized** (`#8FA696` | `¥11.500`)
  4. **Conjunto Ribbed Cut-Out** (`#E295A8` | `¥7.800`)
  5. **Vestido Mini Drapeado Ônix** (`#7D7A85` | `¥6.900`)
- **Provador Virtual Multimodal Real (`gemini-2.5-flash-image`)**: Captura automaticamente o snapshot PNG em Base64 da peça 3D ativa e envia junto com a foto da cliente via `@google/genai` com prompt fotográfico de troca de roupa. Sem simulação falsa: erros da API são exibidos com alerta claro de diagnóstico.
- **Compatibilidade Universal**: `base: './'` no Vite + `vercel.json` + `netlify.toml` (subdomínio / `/harumimodas/*`).

---
*Harumi Modas • Powered by Portal LOJAS JP (lojajp.com)*
