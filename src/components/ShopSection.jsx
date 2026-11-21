import React, { useState } from 'react';
import { Plus, Eye, Sparkles } from 'lucide-react';
import { PRODUCTS, formatYen, getProductImageUrl } from '../data/products';

const SHOP_SIZES = ['P', 'M', 'G'];

export default function ShopSection({
  activeIndex,
  customPhotos,
  onInspectProduct,
  onAddWithFly
}) {
  const [cardSizes, setCardSizes] = useState(() =>
    PRODUCTS.reduce((acc, p) => ({ ...acc, [p.id]: 'M' }), {})
  );

  const handleSizeSelect = (productId, size) => {
    setCardSizes((prev) => ({ ...prev, [productId]: size }));
  };

  return (
    <section
      id="shop"
      className="relative w-full bg-[#F7F4F0] py-24 sm:py-32 border-t border-[#181615]/8"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Cabeçalho Editorial Urbano Assimétrico */}
        <div className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.34em] text-[#8C7554]">
              <Sparkles className="h-3.5 w-3.5 text-[#D47A6A]" />
              NEW DROP • STREET LUXE • ZARA VIBES
            </span>
            <h2 className="mt-2 font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.94] tracking-[-0.03em] text-[#181615]">
              SHOP THE DROP
            </h2>
          </div>

          <div className="lg:col-span-5 lg:text-right">
            <p className="text-sm leading-relaxed text-[#181615]/70 max-w-md lg:ml-auto">
              Cinco peças statement criadas para o street e para a noite. Escolha seu
              tamanho e toque em <strong className="text-[#181615]">+</strong> para
              lançar direto na sacola.
            </p>
          </div>
        </div>

        {/* 5 Cards Verticais Arredondados na Paleta de Cada Peça */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {PRODUCTS.map((product, idx) => {
            const selectedSize = cardSizes[product.id] || 'M';
            const frontImg = getProductImageUrl(product, 'front', customPhotos);
            const isActive = idx === activeIndex;

            return (
              <article
                key={product.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border p-4 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_-24px_rgba(24,22,21,0.28)] ${
                  isActive
                    ? 'border-[#181615]/50 ring-2 ring-[#181615]/10'
                    : 'border-white/80'
                }`}
                style={{
                  background: `linear-gradient(175deg, ${product.colorSoft} 0%, ${product.bgTint} 100%)`
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-xs font-extrabold tracking-[0.2em] text-[#181615]/60">
                    {product.code}
                  </span>

                  <button
                    type="button"
                    onClick={() => onInspectProduct(idx)}
                    title="Fit Check em 3D"
                    className="inline-flex items-center gap-1 rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#181615]/85 backdrop-blur-sm transition-colors hover:bg-[#181615] hover:text-[#F7F4F0]"
                  >
                    <Eye className="h-3 w-3" />
                    <span>3D</span>
                  </button>
                </div>

                {/* Silhueta limpa da peça */}
                <div
                  onClick={() => onInspectProduct(idx)}
                  className="relative mb-4 aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-[1.4rem] bg-white/55 shadow-inner"
                >
                  <img
                    src={frontImg}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#181615]/55">
                    {product.category}
                  </span>
                  <h3 className="mt-1 font-display text-base font-extrabold uppercase leading-snug text-[#181615]">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-base font-extrabold text-[#181615]">
                    {formatYen(product.price)}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-[#181615]/10">
                    <div className="flex items-center gap-1">
                      {SHOP_SIZES.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleSizeSelect(product.id, sz)}
                          className={`h-8 w-8 rounded-full text-[11px] font-bold transition-all ${
                            selectedSize === sz
                              ? 'bg-[#181615] text-[#F7F4F0] shadow-sm'
                              : 'bg-white/75 text-[#181615]/80 hover:bg-white'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      aria-label={`Adicionar ${product.name} tamanho ${selectedSize} à sacola`}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        onAddWithFly(product, selectedSize, rect);
                      }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#181615] text-[#F7F4F0] shadow-md transition-all hover:scale-110 hover:bg-[#2F2A27] active:scale-95"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
