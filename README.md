# HARUMI MODAS — Lookbook Editorial 3D • Street Luxe & Provador Virtual IA

Aplicação web e-commerce D2C de moda feminina jovem urbana (*Zara / Bershka / Street Luxe*) da marca **HARUMI MODAS**, integrada ao ecossistema **Portal LOJAS JP** (`lojajp.com`).

## Destaques Técnicos
- **Fotografia Editorial Real em 3D Curvo Sem Bordas ([EditorialGarment3D.jsx](src/components/EditorialGarment3D.jsx))**: Planos 3D curvos com bordas esfumadas (`alphaMap`), efeito parallax 3D suave ao mover o mouse/arrastar, brilho especular sutil (`MeshPhysicalMaterial`), rotação 3D entre frente e verso (costas + etiqueta) e sombra realista projetada no chão (`ContactShadows`).
- **Gerenciador de Fotos Cloudinary no Rodapé ([CloudinaryManagerModal.jsx](src/components/CloudinaryManagerModal.jsx))**: Permite colar o Public ID ou URL de qualquer foto do Cloudinary (`jontqsrz`) com recorte automático de fundo (`e_background_removal`) e atualização instantânea sem mexer no código.
- **Catálogo Street Luxe (5 Peças)**:
  1. **Corset Cropped Acetinado** (`#D47A6A` | `¥5.900`)
  2. **Calça Cargo Parachute** (`#D5C7B2` | `¥8.900`)
  3. **Jaqueta Bomber Oversized** (`#8FA696` | `¥11.500`)
  4. **Conjunto Ribbed Cut-Out** (`#E295A8` | `¥7.800`)
  5. **Vestido Mini Drapeado Ônix** (`#7D7A85` | `¥6.900`)
- **Provador Virtual Multimodal Real (`gemini-2.5-flash-image` + fallback `gemini-2.0-flash-exp-image-generation`)**: Envia a foto da cliente + a foto editorial da peça em Base64 (`inlineData`), exibe lado a lado com botão **Amei, Adicionar ao Carrinho** e inclui campo discreto **Testar com outra API Key** em caso de erro de cota.

---
*Harumi Modas • Powered by Portal LOJAS JP (lojajp.com)*
