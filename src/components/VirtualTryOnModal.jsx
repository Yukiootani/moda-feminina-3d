import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Camera,
  ShoppingBag,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  KeyRound
} from 'lucide-react';
import { formatYen, getProductImageUrl } from '../data/products';
import { generateVirtualTryOn } from '../services/geminiTryOn';

export default function VirtualTryOnModal({
  isOpen,
  onClose,
  product,
  selectedSize,
  onSelectSize,
  onAddAndOpenCart,
  customPhotos
}) {
  const fileInputRef = useRef(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');

  useEffect(() => {
    setResult(null);
    setErrorMsg('');
  }, [product?.id]);

  if (!isOpen || !product) return null;

  const garmentRefUrl = getProductImageUrl(product, 'front', customPhotos);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor, selecione uma foto nos formatos JPG, PNG ou WEBP.');
      return;
    }
    setErrorMsg('');
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setUserPhoto(String(e.target?.result || ''));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  };

  const handleGenerate = async (overrideKey = customApiKey) => {
    if (!userPhoto || isLoading) return;
    setIsLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const output = await generateVirtualTryOn(
        userPhoto,
        product,
        garmentRefUrl,
        overrideKey
      );
      setResult(output);
    } catch (err) {
      setErrorMsg(
        err?.message ||
          'Erro desconhecido ao chamar o modelo multimodal do Gemini.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUserPhoto(null);
    setResult(null);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#181615]/60 backdrop-blur-md transition-opacity"
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/80 bg-[#F7F4F0]/95 p-5 sm:p-8 shadow-[0_36px_90px_-24px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4 border-b border-[#181615]/10 pb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#181615] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.26em] text-[#D8C7B4]">
              <Sparkles className="h-3 w-3" />
              FIT CHECK IA • Gemini Multimodal
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.02em] text-[#181615]">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#181615]/65">
              Envie sua foto para vestir esta peça mantendo rosto, cabelo, pose e iluminação reais.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar provador virtual"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#181615]/15 bg-white/85 text-[#181615] transition-all hover:bg-[#181615] hover:text-[#F7F4F0]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Alerta de Diagnóstico + Campo Discreto "Testar com outra API Key" */}
        {errorMsg && (
          <div className="mt-5 rounded-2xl border border-red-300 bg-red-50 p-4 text-left text-xs text-red-900 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div className="space-y-1">
                <p className="font-bold uppercase tracking-[0.14em] text-red-700">
                  Erro na API do Gemini
                </p>
                <p className="font-mono text-[11px] leading-relaxed break-words text-red-900/90">
                  {errorMsg}
                </p>
              </div>
            </div>

            {/* Campo discreto para testar outra API Key imediatamente */}
            <div className="rounded-xl border border-red-200 bg-white/85 p-3">
              <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#181615]/75">
                <KeyRound className="h-3.5 w-3.5 text-[#8C7554]" />
                <span>Testar com outra API Key (Gemini AI Studio)</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="Cole sua chave AIzaSy... ou AQ... aqui para testar agora"
                  className="flex-1 rounded-lg border border-[#181615]/20 bg-[#F7F4F0] px-3 py-2 font-mono text-xs text-[#181615] focus:border-[#181615] focus:outline-none"
                />
                <button
                  type="button"
                  disabled={!customApiKey.trim() || !userPhoto || isLoading}
                  onClick={() => handleGenerate(customApiKey.trim())}
                  className="rounded-lg bg-[#181615] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#F7F4F0] hover:bg-[#2F2A27] disabled:opacity-45"
                >
                  Testar Agora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estado 1: Upload + Preview da Foto Editorial da Peça */}
        {!result ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            <div className="md:col-span-7 flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#181615]">
                  1. Envie sua Foto
                </span>
                {userPhoto && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-[#8C7554] underline hover:text-[#181615]"
                  >
                    Trocar foto
                  </button>
                )}
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !userPhoto && fileInputRef.current?.click()}
                className={`relative flex flex-1 min-h-[340px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
                  isDragging
                    ? 'border-[#D47A6A] bg-[#D47A6A]/10'
                    : userPhoto
                    ? 'border-[#181615]/15 bg-white'
                    : 'cursor-pointer border-[#181615]/20 bg-white/70 hover:border-[#181615]/50 hover:bg-white'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                {userPhoto ? (
                  <>
                    <img
                      src={userPhoto}
                      alt="Sua foto enviada"
                      className="h-full max-h-[400px] w-full object-contain bg-[#EFECE7]"
                    />

                    {isLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#181615]/78 px-6 text-center text-[#F7F4F0] backdrop-blur-sm">
                        <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#D8C7B4]/50">
                          <Sparkles className="h-7 w-7 animate-pulse text-[#D8C7B4]" />
                          <span className="absolute inset-0 rounded-full border-2 border-t-[#D8C7B4] border-transparent animate-spin" />
                        </div>
                        <p className="font-display text-lg font-bold uppercase tracking-[0.06em]">
                          A IA do Gemini está gerando sua prévia...
                        </p>
                        <p className="mt-1.5 text-xs text-[#F7F4F0]/75">
                          Vestindo {product.name} com caimento e iluminação realistas
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#181615] text-[#F7F4F0] shadow-md">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="font-display text-lg font-extrabold uppercase text-[#181615]">
                      Arraste sua foto ou clique para escolher
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-[#181615]/60">
                      Prefira foto de frente com boa iluminação (meio corpo ou corpo inteiro)
                      para um resultado fotográfico impecável.
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#181615]/20 bg-[#F7F4F0] px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#181615] hover:bg-[#181615] hover:text-[#F7F4F0]"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Selecionar Foto</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Peça Editorial Selecionada */}
            <div className="md:col-span-5 flex flex-col justify-between rounded-2xl border border-[#181615]/10 bg-white/80 p-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8C7554]">
                    2. Peça de Referência
                  </span>
                  <span className="rounded-full bg-[#181615]/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#181615]/70">
                    Lookbook
                  </span>
                </div>

                <div
                  className="mt-3 overflow-hidden rounded-xl border border-[#181615]/10"
                  style={{ backgroundColor: product.colorSoft }}
                >
                  <img
                    src={garmentRefUrl}
                    alt={product.name}
                    className="h-56 w-full object-cover object-top"
                  />
                </div>

                <div className="mt-3">
                  <h4 className="font-display text-base font-extrabold uppercase text-[#181615]">
                    {product.name}
                  </h4>
                  <p className="text-xs text-[#181615]/60">{product.fabricTitle}</p>
                  <p className="mt-1 font-bold text-[#181615]">
                    {formatYen(product.price)}
                  </p>
                </div>

                <div className="mt-4">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#181615]/60 mb-1.5">
                    Tamanho desejado
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['P', 'M', 'G', 'GG'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => onSelectSize(sz)}
                        className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                          selectedSize === sz
                            ? 'bg-[#181615] text-[#F7F4F0]'
                            : 'border border-[#181615]/15 bg-white text-[#181615] hover:border-[#181615]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!userPhoto || isLoading}
                onClick={() => handleGenerate()}
                className="btn-shimmer mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#181615] px-5 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#F7F4F0] shadow-lg transition-all hover:bg-[#2F2A27] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Sparkles className="h-4 w-4 text-[#D8C7B4]" />
                <span>
                  {isLoading ? 'Gerando no Gemini...' : 'Gerar Prévia com IA Gemini'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Estado 2: Comparação Lado a Lado */
          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 text-xs text-emerald-950">
              <span className="inline-flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Prévia real gerada via Google Gemini ({result.model})
              </span>
              <span className="font-bold text-[#181615]">
                Tam. {selectedSize} • {formatYen(product.price)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="overflow-hidden rounded-2xl border border-[#181615]/10 bg-white">
                <div className="border-b border-[#181615]/8 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#181615]/60">
                  Foto Original
                </div>
                <div className="aspect-[3/4] w-full bg-[#EFECE7]">
                  <img
                    src={userPhoto}
                    alt="Foto original da cliente"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border-2 border-[#181615] bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-[#181615] bg-[#181615] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F7F4F0]">
                  <span>Prévia Gerada por IA</span>
                  <Sparkles className="h-3.5 w-3.5 text-[#D8C7B4]" />
                </div>
                <div className="aspect-[3/4] w-full bg-[#EFECE7]">
                  <img
                    src={result.imageUrl}
                    alt={`Prévia IA com ${product.name}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#181615]/10 pt-5">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#181615]/70 underline underline-offset-4 transition-colors hover:text-[#181615]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Tentar outra foto</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onAddAndOpenCart(product, selectedSize);
                  onClose();
                }}
                className="btn-shimmer inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#181615] px-8 py-4 text-xs font-extrabold uppercase tracking-[0.18em] text-[#F7F4F0] shadow-xl transition-all hover:bg-[#2F2A27]"
              >
                <ShoppingBag className="h-4 w-4 text-[#D8C7B4]" />
                <span>Amei, Adicionar ao Carrinho</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
