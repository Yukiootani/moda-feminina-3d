import React, { useCallback, useRef, useState } from 'react';
import { Sparkles, X, MessageCircle, Check } from 'lucide-react';
import { PRODUCTS, getProductImageUrl } from './data/products';
import IntroOverlay from './components/IntroOverlay';
import Navbar from './components/Navbar';
import HeroCarousel3D from './components/HeroCarousel3D';
import InspectionSection from './components/InspectionSection';
import VirtualTryOnModal from './components/VirtualTryOnModal';
import ShopSection from './components/ShopSection';
import LookBuilder from './components/LookBuilder';
import CartDrawer from './components/CartDrawer';
import FlyToBagLayer from './components/FlyToBagLayer';
import Footer from './components/Footer';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [garmentSnapshot, setGarmentSnapshot] = useState(null);
  const [newsOpen, setNewsOpen] = useState(false);
  const [flyItems, setFlyItems] = useState([]);
  const [bagPulse, setBagPulse] = useState(false);
  const [toast, setToast] = useState(null);

  const snapshotCaptureRef = useRef(null);

  const activeProduct = PRODUCTS[activeIndex];
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const registerSnapshotCapture = useCallback((fn) => {
    snapshotCaptureRef.current = fn;
  }, []);

  const openTryOnModal = useCallback(() => {
    let captured = null;
    if (typeof snapshotCaptureRef.current === 'function') {
      captured = snapshotCaptureRef.current();
    }
    setGarmentSnapshot(captured);
    setTryOnOpen(true);
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 2800);
  }, []);

  const triggerBagPulse = useCallback(() => {
    setBagPulse(true);
    setTimeout(() => setBagPulse(false), 550);
  }, []);

  const addToCart = useCallback(
    (product, size = 'M', openDrawer = false) => {
      setCartItems((prev) => {
        const idx = prev.findIndex(
          (i) => i.product.id === product.id && i.size === size
        );
        if (idx > -1) {
          return prev.map((item, i) =>
            i === idx ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { product, size, quantity: 1 }];
      });
      triggerBagPulse();
      if (openDrawer) {
        setCartOpen(true);
      } else {
        showToast(`${product.shortName} (${size}) adicionado à sacola`);
      }
    },
    [showToast, triggerBagPulse]
  );

  const handleAddWithFly = useCallback(
    (product, size, sourceRect) => {
      const bagEl = document.getElementById('navbar-bag-btn');
      if (bagEl && sourceRect) {
        const bagRect = bagEl.getBoundingClientRect();
        const startX = sourceRect.left + sourceRect.width / 2;
        const startY = sourceRect.top + sourceRect.height / 2;
        const targetX = bagRect.left + bagRect.width / 2;
        const targetY = bagRect.top + bagRect.height / 2;

        const id = `${Date.now()}_${Math.random()}`;
        setFlyItems((prev) => [
          ...prev,
          {
            id,
            startX,
            startY,
            deltaX: targetX - startX,
            deltaY: targetY - startY,
            imageUrl: getProductImageUrl(product, 'front')
          }
        ]);

        setTimeout(() => {
          setFlyItems((prev) => prev.filter((item) => item.id !== id));
          addToCart(product, size, false);
        }, 620);
      } else {
        addToCart(product, size, false);
      }
    },
    [addToCart]
  );

  const handleAddLookCombo = useCallback(
    (comboItems) => {
      setCartItems((prev) => {
        const next = [...prev];
        comboItems.forEach(({ product, size }) => {
          const idx = next.findIndex(
            (i) => i.product.id === product.id && i.size === size
          );
          if (idx > -1) {
            next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
          } else {
            next.push({ product, size, quantity: 1 });
          }
        });
        return next;
      });
      triggerBagPulse();
      setCartOpen(true);
    },
    [triggerBagPulse]
  );

  const handleUpdateQty = useCallback((productId, size, newQty) => {
    if (newQty <= 0) {
      setCartItems((prev) =>
        prev.filter((i) => !(i.product.id === productId && i.size === size))
      );
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.size === size
          ? { ...i, quantity: newQty }
          : i
      )
    );
  }, []);

  const handleRemoveItem = useCallback((productId, size) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.size === size))
    );
  }, []);

  const handleToggleFavorite = useCallback(
    (productId) => {
      setFavorites((prev) => {
        const exists = prev.includes(productId);
        showToast(
          exists ? 'Peça removida dos favoritos' : 'Peça salva nos seus favoritos'
        );
        return exists
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
      });
    },
    [showToast]
  );

  const handleInspectFromShop = useCallback((index) => {
    setActiveIndex(index);
    const el = document.getElementById('detalhes');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F4F0] text-[#181615]">
      {showIntro && <IntroOverlay onFinish={() => setShowIntro(false)} />}

      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenNews={() => setNewsOpen(true)}
        bagPulse={bagPulse}
      />

      <main>
        <HeroCarousel3D
          activeIndex={activeIndex}
          onChangeIndex={setActiveIndex}
          onOpenTryOn={openTryOnModal}
        />

        <InspectionSection
          product={activeProduct}
          isFavorite={favorites.includes(activeProduct.id)}
          onToggleFavorite={handleToggleFavorite}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          onAddToCart={(prod, sz) => addToCart(prod, sz, true)}
          onOpenTryOn={openTryOnModal}
          onRegisterSnapshot={registerSnapshotCapture}
        />

        <ShopSection
          activeIndex={activeIndex}
          onInspectProduct={handleInspectFromShop}
          onAddWithFly={handleAddWithFly}
        />

        <LookBuilder
          activeIndex={activeIndex}
          onAddLookCombo={handleAddLookCombo}
        />
      </main>

      <Footer />

      <VirtualTryOnModal
        isOpen={tryOnOpen}
        onClose={() => setTryOnOpen(false)}
        product={activeProduct}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onAddAndOpenCart={(prod, sz) => addToCart(prod, sz, true)}
        garmentSnapshot={garmentSnapshot}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
      />

      <FlyToBagLayer flyItems={flyItems} />

      {newsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setNewsOpen(false)}
            className="absolute inset-0 bg-[#181615]/55 backdrop-blur-md"
          />
          <div className="relative z-10 w-full max-w-lg rounded-[2rem] border border-white/75 bg-[#F7F4F0] p-7 sm:p-9 shadow-2xl">
            <button
              type="button"
              onClick={() => setNewsOpen(false)}
              aria-label="Fechar novidades"
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#181615]/15 bg-white text-[#181615] hover:bg-[#181615] hover:text-[#F7F4F0]"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#181615] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.26em] text-[#D8C7B4]">
              <Sparkles className="h-3 w-3" />
              NEW DROP • STREET LUXE VIP
            </span>

            <h3 className="mt-4 font-display text-3xl font-extrabold uppercase text-[#181615]">
              Novidades & Acesso Antecipado
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#181615]/70">
              Receba em primeira mão nossos drops limitados de streetwear, corsets,
              bombers oversized e vestidos night-out direto do Portal LOJAS JP.
            </p>

            <div className="mt-6 space-y-2.5 rounded-2xl border border-[#181615]/10 bg-white/80 p-4 text-xs text-[#181615]/80">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#516858]" />
                <span>15% OFF automático no combo de 3+ peças</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#516858]" />
                <span>Provador Virtual Real com IA Gemini 2.5 Flash Image</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#516858]" />
                <span>Envio rápido para todo o Japão via Portal LOJAS JP</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/818074558624?text=Ol%C3%A1%20HARUMI%20MODAS!%20Quero%20receber%20as%20novidades%20do%20NEW%20DROP%20Street%20Luxe."
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#181615] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#F7F4F0] hover:bg-[#2F2A27]"
              >
                <MessageCircle className="h-4 w-4 text-[#D8C7B4]" />
                <span>Entrar na Lista VIP</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setNewsOpen(false);
                  document
                    .getElementById('shop')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-full border border-[#181615]/20 bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#181615] hover:bg-[#EFEAE2]"
              >
                Ver Drop
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full border border-[#C9B290]/45 bg-[#181615] px-5 py-2.5 text-xs font-medium tracking-[0.06em] text-[#F7F4F0] shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}
