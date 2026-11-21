import React, { useEffect, useState } from 'react';
import { X, Cloud, Sparkles, RotateCcw, Check } from 'lucide-react';
import {
  CLOUDINARY_CLOUD_NAME,
  PRODUCTS,
  getProductImageUrl
} from '../data/products';

export default function CloudinaryManagerModal({
  isOpen,
  onClose,
  customPhotos,
  onSavePhotos
}) {
  const [draft, setDraft] = useState({});
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDraft(customPhotos || {});
      setSavedNotice(false);
    }
  }, [isOpen, customPhotos]);

  if (!isOpen) return null;

  const updateField = (productId, field, value) => {
    setDraft((prev) => ({
      ...prev,
      [productId]: {
        removeBg: true,
        ...(prev[productId] || {}),
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onSavePhotos(draft);
    setSavedNotice(true);
    setTimeout(() => {
      onClose();
    }, 650);
  };

  const handleResetAll = () => {
    setDraft({});
    onSavePhotos({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#181615]/60 backdrop-blur-md"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/80 bg-[#F7F4F0] p-6 sm:p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#181615]/10 pb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#181615] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#D8C7B4]">
              <Cloud className="h-3.5 w-3.5" />
              Cloudinary • Cloud: {CLOUDINARY_CLOUD_NAME}
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold uppercase text-[#181615]">
              Gerenciar Fotos (Cloudinary)
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#181615]/65">
              Cole o <strong>Public ID</strong> do seu Cloudinary (ex:{' '}
              <code>harumi/corset-01</code>) ou qualquer URL completa. Com o recorte
              ativado, aplicamos automaticamente <code>e_background_removal</code>.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar gerenciador de fotos"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#181615]/15 bg-white text-[#181615] hover:bg-[#181615] hover:text-[#F7F4F0]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {PRODUCTS.map((product) => {
            const entry = draft[product.id] || {};
            const removeBg = entry.removeBg !== false;
            const livePreview = getProductImageUrl(product, 'front', draft);

            return (
              <div
                key={product.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-4 rounded-2xl border border-[#181615]/10 bg-white/85 p-4 items-center"
              >
                <div className="sm:col-span-2 flex items-center gap-3">
                  <div
                    className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-[#181615]/10"
                    style={{ backgroundColor: product.colorSoft }}
                  >
                    <img
                      src={livePreview}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="sm:col-span-10 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-display text-sm font-extrabold uppercase text-[#181615]">
                      {product.code} — {product.name}
                    </h4>

                    <label className="inline-flex cursor-pointer items-center gap-2 text-[11px] font-semibold text-[#181615]/75">
                      <input
                        type="checkbox"
                        checked={removeBg}
                        onChange={(e) =>
                          updateField(product.id, 'removeBg', e.target.checked)
                        }
                        className="h-4 w-4 accent-[#181615]"
                      />
                      <span>
                        Recorte automático (<code>e_background_removal</code>)
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C7554] mb-1">
                        Foto Frente (Public ID Cloudinary ou URL)
                      </label>
                      <input
                        type="text"
                        value={entry.front || ''}
                        onChange={(e) =>
                          updateField(product.id, 'front', e.target.value)
                        }
                        placeholder="ex: harumi/corset-frente ou https://..."
                        className="w-full rounded-xl border border-[#181615]/15 bg-[#F7F4F0]/70 px-3 py-2 text-xs text-[#181615] placeholder:text-[#181615]/35 focus:border-[#181615] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C7554] mb-1">
                        Foto Costas (Opcional — ID Cloudinary ou URL)
                      </label>
                      <input
                        type="text"
                        value={entry.back || ''}
                        onChange={(e) =>
                          updateField(product.id, 'back', e.target.value)
                        }
                        placeholder="ex: harumi/corset-costas ou https://..."
                        className="w-full rounded-xl border border-[#181615]/15 bg-[#F7F4F0]/70 px-3 py-2 text-xs text-[#181615] placeholder:text-[#181615]/35 focus:border-[#181615] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#181615]/10 pt-5">
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-2 rounded-full border border-[#181615]/20 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#181615]/80 hover:bg-[#EFEAE2]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restaurar Fotos Editoriais Padrão</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#181615] px-7 py-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#F7F4F0] shadow-lg hover:bg-[#2F2A27]"
          >
            {savedNotice ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Fotos Atualizadas!</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-[#D8C7B4]" />
                <span>Aplicar Fotos Agora</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
