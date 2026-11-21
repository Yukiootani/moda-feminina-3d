import React from 'react';
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { formatYen, getProductImageUrl } from '../data/products';

const WHATSAPP_NUMBER = '818074558624';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart
}) {
  if (!isOpen) return null;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const hasComboDiscount = totalCount >= 3;
  const discountAmount = hasComboDiscount ? Math.round(subtotal * 0.15) : 0;
  const finalTotal = subtotal - discountAmount;

  const handleWhatsAppCheckout = () => {
    if (!items.length) return;

    const lines = [
      'Olá, Atelier *HARUMI MODAS* (Portal LOJAS JP)! ✨',
      'Gostaria de finalizar o seguinte pedido:',
      ''
    ];

    items.forEach((item, index) => {
      const lineTotal = item.product.price * item.quantity;
      lines.push(
        `${index + 1}. *${item.product.name}* (${item.product.sku})`,
        `   • Tamanho: *${item.size}* | Qtd: *${item.quantity}* | ${formatYen(lineTotal)}`
      );
    });

    lines.push('', `Subtotal: ${formatYen(subtotal)}`);
    if (hasComboDiscount) {
      lines.push(`Desconto Look 3+ Peças (15% OFF): -${formatYen(discountAmount)}`);
    }
    lines.push(`*Total Estimado: ${formatYen(finalTotal)}*`);
    lines.push('', 'Aguardo a confirmação de disponibilidade e envio. Obrigada!');

    const encoded = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#181615]/50 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Lateral */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#F7F4F0] shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-[#181615]/10 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#181615]" />
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#181615]">
                Sua Sacola
              </h3>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C7554]">
                {totalCount} {totalCount === 1 ? 'peça' : 'peças'} • Harumi Modas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar sacola"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#181615]/15 bg-white text-[#181615] hover:bg-[#181615] hover:text-[#F7F4F0]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Barra de Incentivo 15% OFF */}
        <div className="border-b border-[#181615]/10 bg-[#EFEAE2] px-6 py-3 text-xs">
          {hasComboDiscount ? (
            <div className="flex items-center gap-2 font-semibold text-[#3C664A]">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>Parabéns! Desconto de 15% OFF aplicado automaticamente.</span>
            </div>
          ) : (
            <div className="text-[#181615]/75">
              Adicione mais{' '}
              <strong className="text-[#181615]">{Math.max(0, 3 - totalCount)}</strong>{' '}
              {3 - totalCount === 1 ? 'peça' : 'peças'} para desbloquear{' '}
              <strong className="text-[#6B3B2B]">15% OFF automático</strong>.
            </div>
          )}
        </div>

        {/* Lista de Peças */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#181615]/12 bg-white text-[#181615]/40">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <p className="font-serif text-2xl font-medium text-[#181615]">
                Sua sacola está vazia
              </p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-[#181615]/60">
                Explore nossa vitrine 3D, prove no Provador Virtual com IA ou monte seu
                look de 3 peças com 15% OFF.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-full bg-[#181615] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F7F4F0]"
              >
                Explorar Coleção
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}_${item.size}`}
                className="flex gap-4 rounded-2xl border border-[#181615]/10 bg-white/85 p-3.5 shadow-sm"
              >
                <div
                  className="h-24 w-20 shrink-0 overflow-hidden rounded-xl"
                  style={{ backgroundColor: item.product.colorSoft }}
                >
                  <img
                    src={getProductImageUrl(item.product, 'front')}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-base font-semibold leading-snug text-[#181615]">
                        {item.product.name}
                      </h4>
                      <span className="mt-0.5 inline-block rounded-full bg-[#F7F4F0] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#181615]/75">
                        Tam. {item.size}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.product.id, item.size)}
                      aria-label="Remover item"
                      className="text-[#181615]/40 transition-colors hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    {/* Controle de quantidade */}
                    <div className="flex items-center rounded-full border border-[#181615]/15 bg-[#F7F4F0]">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQty(item.product.id, item.size, item.quantity - 1)
                        }
                        className="flex h-7 w-7 items-center justify-center text-[#181615] hover:opacity-65"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQty(item.product.id, item.size, item.quantity + 1)
                        }
                        className="flex h-7 w-7 items-center justify-center text-[#181615] hover:opacity-65"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-[#181615]">
                      {formatYen(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé com Totais em Ienes (¥) e Botão WhatsApp */}
        {items.length > 0 && (
          <div className="border-t border-[#181615]/10 bg-white/90 px-6 py-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#181615]/70">
              <span>Subtotal</span>
              <span>{formatYen(subtotal)}</span>
            </div>

            {hasComboDiscount && (
              <div className="flex items-center justify-between text-xs font-semibold text-[#3C664A]">
                <span>Desconto Combo (15% OFF)</span>
                <span>-{formatYen(discountAmount)}</span>
              </div>
            )}

            <div className="flex items-baseline justify-between border-t border-[#181615]/10 pt-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#181615]">
                Total
              </span>
              <span className="font-serif text-2xl font-bold text-[#181615]">
                {formatYen(finalTotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppCheckout}
              className="btn-shimmer flex w-full items-center justify-center gap-2.5 rounded-full bg-[#181615] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[#F7F4F0] shadow-xl transition-all hover:bg-[#25D366] hover:text-[#181615]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Finalizar Pedido via WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onClearCart}
              className="w-full text-center text-[11px] font-medium text-[#181615]/50 hover:text-[#181615] underline underline-offset-4"
            >
              Limpar sacola
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
