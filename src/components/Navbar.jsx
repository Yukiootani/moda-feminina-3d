import React, { useEffect, useState } from 'react';
import { ShoppingBag, Sparkles, Percent } from 'lucide-react';

const NAV_LINKS = [
  { id: 'colecao', label: 'Coleção' },
  { id: 'detalhes', label: 'Detalhes' },
  { id: 'shop', label: 'Shop' },
  { id: 'look', label: 'Monte seu Look' }
];

export default function Navbar({
  cartCount,
  onOpenCart,
  onOpenNews,
  bagPulse
}) {
  const [activeSection, setActiveSection] = useState('colecao');

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0.05 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none">
      <nav className="glass-nav pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-full px-4 py-2.5 sm:px-6">
        {/* Marca à esquerda */}
        <button
          type="button"
          onClick={() => scrollTo('colecao')}
          className="group flex items-center gap-2.5 text-left"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#181615]/15 bg-[#181615] font-serif text-xs tracking-[0.14em] text-[#F7F4F0] transition-transform group-hover:scale-105">
            HM
          </span>
          <div className="leading-none">
            <span className="block font-serif text-sm sm:text-base font-semibold tracking-[0.2em] text-[#181615]">
              HARUMI MODAS
            </span>
            <span className="hidden sm:block text-[9px] uppercase tracking-[0.28em] text-[#181615]/50">
              Portal LOJAS JP
            </span>
          </div>
        </button>

        {/* Menu central em pílula */}
        <div className="hidden lg:flex items-center rounded-full border border-[#181615]/10 bg-[#F7F4F0]/70 p-1">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-[0.06em] transition-all ${
                  isActive
                    ? 'bg-[#181615] text-[#F7F4F0] shadow-sm'
                    : 'text-[#181615]/75 hover:text-[#181615]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Ações à direita: % OFF, Sacola com contador, Botão escuro Novidades */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={() => scrollTo('look')}
            title="Combo 3 peças com 15% OFF automático"
            className="flex items-center gap-1 rounded-full border border-[#C88A75]/45 bg-[#C88A75]/15 px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#6B3B2B] transition-all hover:bg-[#C88A75] hover:text-white"
          >
            <Percent className="h-3.5 w-3.5" />
            <span>% OFF</span>
          </button>

          <button
            id="navbar-bag-btn"
            type="button"
            onClick={onOpenCart}
            aria-label="Abrir sacola de compras"
            className={`relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#181615]/15 bg-[#F7F4F0]/90 text-[#181615] transition-all hover:border-[#181615]/40 hover:scale-105 ${
              bagPulse ? 'scale-115 ring-2 ring-[#C88A75]' : ''
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#181615] px-1 text-[10px] font-bold text-[#F7F4F0] shadow">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenNews}
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#181615] px-4 py-2 text-xs font-medium tracking-[0.08em] text-[#F7F4F0] shadow-md transition-all hover:bg-[#2F2A27] hover:shadow-lg"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#D8C7B4]" />
            <span>Novidades</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
