import React from 'react';
import { MessageCircle, Cloud } from 'lucide-react';

export default function Footer({ onOpenPhotoManager }) {
  return (
    <footer className="w-full border-t border-[#181615]/10 bg-[#181615] text-[#F7F4F0]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9B290]/60 font-display text-xs font-extrabold tracking-[0.16em] text-[#D8C7B4]">
                HM
              </span>
              <span className="font-display text-2xl font-extrabold uppercase tracking-[0.18em] text-[#F7F4F0]">
                HARUMI MODAS
              </span>
            </div>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-[#F7F4F0]/60">
              Moda jovem urbana & Street Luxe D2C em vitrine editorial 3D com Provador
              Virtual multimodal via Google Gemini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-bold uppercase tracking-[0.2em] text-[#F7F4F0]/70">
            <a href="#colecao" className="hover:text-[#D8C7B4] transition-colors">
              New Drop
            </a>
            <a href="#detalhes" className="hover:text-[#D8C7B4] transition-colors">
              Fit Check 3D
            </a>
            <a href="#shop" className="hover:text-[#D8C7B4] transition-colors">
              Shop
            </a>
            <a href="#look" className="hover:text-[#D8C7B4] transition-colors">
              Monte seu Look
            </a>
            <a
              href="https://wa.me/818074558624"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D8C7B4]/35 px-4 py-2 text-[#D8C7B4] hover:bg-[#D8C7B4] hover:text-[#181615] transition-all"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp VIP</span>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F4F0]/55">
          <p className="tracking-[0.06em]">
            Harumi Modas • Powered by{' '}
            <a
              href="https://lojajp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#D8C7B4] underline underline-offset-4 hover:text-white"
            >
              Portal LOJAS JP (lojajp.com)
            </a>
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenPhotoManager}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-medium tracking-[0.08em] text-[#F7F4F0]/70 transition-all hover:border-[#D8C7B4]/60 hover:bg-white/10 hover:text-white"
            >
              <Cloud className="h-3.5 w-3.5 text-[#D8C7B4]" />
              <span>Gerenciar Fotos (Cloudinary)</span>
            </button>

            <p className="hidden md:block text-[11px] font-bold uppercase tracking-[0.22em] text-[#F7F4F0]/40">
              STREET LUXE • TOKYO
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
