import React, { useEffect, useMemo, useState } from 'react';
import { X, Sparkles, ShoppingBag, Check, Plus, RefreshCw } from 'lucide-react';
import { PRODUCTS, formatYen, getProductImageUrl } from '../data/products';

function buildSuggestedLook(activeIndex) {
  const total = PRODUCTS.length;
  return [
    { productId: PRODUCTS[activeIndex].id, size: 'M' },
    { productId: PRODUCTS[(activeIndex + 1) % total].id, size: 'M' },
    { productId: PRODUCTS[(activeIndex + 2) % total].id, size: 'M' }
  ];
}

export default function LookBuilder({
  activeIndex,
  onAddLookCombo
}) {
  const [slots, setSlots] = useState(() => buildSuggestedLook(activeIndex));
  const [pickingSlot, setPickingSlot] = useState(null);
  const [userCustomized, setUserCustomized] = useState(false);

  useEffect(() => {
    if (!userCustomized) {
      setSlots(buildSuggestedLook(activeIndex));
    }
  }, [activeIndex, userCustomized]);

  const resolvedSlots = useMemo(
    () =>
      slots.map((slot) =>
        slot
          ? {
              ...slot,
              product: PRODUCTS.find((p) => p.id === slot.productId) || null
            }
          : null
      ),
    [slots]
  );

  const filledCount = resolvedSlots.filter((s) => s && s.product).length;
  const subtotal = resolvedSlots.reduce(
    (sum, s) => sum + (s?.product ? s.product.price : 0),
    0
  );
  const discountUnlocked = filledCount === 3;
  const discountAmount = discountUnlocked ? Math.round(subtotal * 0.15) : 0;
  const total = subtotal - discountAmount;

  const removeSlot = (slotIdx) => {
    setUserCustomized(true);
    setSlots((prev) => prev.map((s, i) => (i === slotIdx ? null : s)));
    setPickingSlot(slotIdx);
  };

  const assignProductToSlot = (slotIdx, productId) => {
    setUserCustomized(true);
    setSlots((prev) =>
      prev.map((s, i) =>
        i === slotIdx ? { productId, size: s?.size || 'M' } : s
      )
    );
    setPickingSlot(null);
  };

  const changeSlotSize = (slotIdx, size) => {
    setUserCustomized(true);
    setSlots((prev) =>
      prev.map((s, i) => (i === slotIdx && s ? { ...s, size } : s))
    );
  };

  const resetSuggestion = () => {
    setUserCustomized(false);
    setSlots(buildSuggestedLook(activeIndex));
    setPickingSlot(null);
  };

  const handleAddCombo = () => {
    if (!discountUnlocked) return;
    const items = resolvedSlots
      .filter((s) => s && s.product)
      .map((s) => ({ product: s.product, size: s.size }));
    onAddLookCombo(items);
  };

  return (
    <section
      id="look"
      className="relative w-full bg-[#EFEAE2] py-24 sm:py-32 border-t border-[#181615]/8"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#D47A6A]/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.26em] text-[#6B2D22]">
              <Sparkles className="h-3.5 w-3.5" />
              FIT CHECK • 15% OFF NO COMBO
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.96] tracking-[-0.03em] text-[#181615]">
              MONTE SEU LOOK (3 PEÇAS)
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[#181615]/70">
              Combo streetwear pré-selecionado em torno de{' '}
              <strong className="text-[#181615]">{PRODUCTS[activeIndex].name}</strong>.
              Misture peças, troque pelas miniaturas e libere 15% OFF automático.
            </p>
          </div>

          <button
            type="button"
            onClick={resetSuggestion}
            className="inline-flex items-center gap-2 self-start md:self-end rounded-full border border-[#181615]/20 bg-[#F7F4F0] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#181615] transition-all hover:bg-[#181615] hover:text-[#F7F4F0]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sugestão Stylist</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resolvedSlots.map((slot, slotIdx) => {
            const isPicking = pickingSlot === slotIdx;

            return (
              <div
                key={slotIdx}
                className={`relative flex flex-col justify-between rounded-[2rem] border p-5 transition-all ${
                  isPicking
                    ? 'border-[#181615] bg-[#F7F4F0] shadow-xl'
                    : 'border-white/80 bg-[#F7F4F0]/90 shadow-[0_20px_50px_-28px_rgba(24,22,21,0.18)]'
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.26em] text-[#8C7554]">
                    Peça 0{slotIdx + 1}
                  </span>

                  {slot?.product && (
                    <button
                      type="button"
                      onClick={() => removeSlot(slotIdx)}
                      aria-label={`Remover peça do slot ${slotIdx + 1}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#181615]/15 bg-white text-[#181615]/70 transition-colors hover:bg-[#181615] hover:text-[#F7F4F0]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {slot?.product ? (
                  <>
                    <div
                      className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-[1.4rem]"
                      style={{ backgroundColor: slot.product.colorSoft }}
                    >
                      <img
                        src={getProductImageUrl(slot.product, 'front')}
                        alt={slot.product.name}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-extrabold uppercase text-[#181615]">
                        {slot.product.name}
                      </h3>
                      <p className="mt-0.5 text-sm font-bold text-[#181615]/85">
                        {formatYen(slot.product.price)}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          {['P', 'M', 'G', 'GG'].map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => changeSlotSize(slotIdx, sz)}
                              className={`h-7 min-w-[28px] rounded-full px-2 text-[11px] font-bold transition-all ${
                                slot.size === sz
                                  ? 'bg-[#181615] text-[#F7F4F0]'
                                  : 'border border-[#181615]/15 bg-white text-[#181615]/75 hover:border-[#181615]'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setPickingSlot(isPicking ? null : slotIdx)
                          }
                          className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8C7554] underline underline-offset-4 hover:text-[#181615]"
                        >
                          {isPicking ? 'Fechar' : 'Trocar'}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPickingSlot(slotIdx)}
                    className="flex flex-1 min-h-[280px] flex-col items-center justify-center rounded-[1.4rem] border-2 border-dashed border-[#181615]/20 bg-white/50 p-6 text-center transition-all hover:border-[#181615] hover:bg-white"
                  >
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#181615] text-[#F7F4F0]">
                      <Plus className="h-5 w-5" />
                    </span>
                    <span className="font-display text-lg font-extrabold uppercase text-[#181615]">
                      Escolher Peça
                    </span>
                    <span className="mt-1 text-xs text-[#181615]/60">
                      Selecione abaixo para completar seu combo 15% OFF
                    </span>
                  </button>
                )}

                <div className="mt-4 border-t border-[#181615]/10 pt-3">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#181615]/50 mb-2">
                    {isPicking || !slot?.product
                      ? 'Selecione uma peça:'
                      : 'Troca rápida por miniatura:'}
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {PRODUCTS.map((p) => {
                      const selected = slot?.productId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          title={p.name}
                          onClick={() => assignProductToSlot(slotIdx, p.id)}
                          className={`group relative aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all ${
                            selected
                              ? 'border-[#181615] scale-[1.03] shadow-sm'
                              : 'border-transparent opacity-75 hover:opacity-100 hover:border-[#181615]/35'
                          }`}
                          style={{ backgroundColor: p.colorSoft }}
                        >
                          <img
                            src={getProductImageUrl(p, 'front')}
                            alt={p.shortName}
                            className="h-full w-full object-contain p-0.5"
                          />
                          {selected && (
                            <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#181615] text-[#F7F4F0]">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-6 rounded-[2rem] border border-[#181615]/12 bg-[#181615] px-6 py-6 sm:px-9 text-[#F7F4F0] shadow-2xl">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-[#D8C7B4]">
                Peças no Look
              </span>
              <span className="font-display text-2xl font-extrabold">
                {filledCount} / 3
              </span>
            </div>

            <div className="h-10 w-[1px] bg-white/15 hidden sm:block" />

            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-white/55">
                Subtotal
              </span>
              <span
                className={`text-lg font-medium ${
                  discountUnlocked ? 'line-through text-white/45' : 'text-white'
                }`}
              >
                {formatYen(subtotal)}
              </span>
            </div>

            {discountUnlocked && (
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-[#D47A6A]">
                  Economia (15% OFF)
                </span>
                <span className="text-lg font-bold text-[#F3B9AE]">
                  -{formatYen(discountAmount)}
                </span>
              </div>
            )}

            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-[#D8C7B4]">
                Total do Combo
              </span>
              <span className="font-display text-3xl font-extrabold text-white">
                {formatYen(total)}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={!discountUnlocked}
            onClick={handleAddCombo}
            className="btn-shimmer inline-flex w-full lg:w-auto items-center justify-center gap-2.5 rounded-full bg-[#F7F4F0] px-8 py-4 text-xs font-extrabold uppercase tracking-[0.18em] text-[#181615] transition-all hover:bg-[#D5C7B2] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>
              {discountUnlocked
                ? 'Adicionar Look com 15% OFF'
                : `Selecione ${3 - filledCount} peça(s) para liberar 15% OFF`}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
