import React, { useState, useEffect } from 'react';
import { X, Share2, Eye, Home, Maximize2, ShieldCheck } from 'lucide-react';
import { LotItem } from '../types';
import { formatPrice } from '../utils/format';

interface LotDetailModalProps {
  lot: LotItem | null;
  onClose: () => void;
  onRequestFitting?: (lot: LotItem) => void;
  onShare: (title: string) => void;
}

export const LotDetailModal: React.FC<LotDetailModalProps> = ({
  lot,
  onClose,
  onShare,
}) => {
  const [viewMode, setViewMode] = useState<'artwork' | 'interior'>('artwork');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);


  // Handle ESC key and lock body scroll when modal is open
  useEffect(() => {
    if (!lot) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [lot, isLightboxOpen, onClose]);

  if (!lot) return null;

  const currentImage =
    viewMode === 'interior' && lot.interiorPreviewImage
      ? lot.interiorPreviewImage
      : lot.image;

  // Pre-filled Telegram message with exact lot info for smooth concierge service
  const telegramMessage = encodeURIComponent(
    `Здравствуйте! Хочу запросить примерку лота: ${lot.lotNumber} «${lot.title}» (${lot.dimensions}) в моем интерьере.`
  );
  const telegramUrl = `https://t.me/wowconcept_admin?text=${telegramMessage}`;

  const badgeLabels: Record<string, string> = {
    UNIQUE: 'Уникальный экспонат',
    MASTERPIECE: 'Шедевр коллекции',
    EXCLUSIVE: 'Эксклюзивный лот',
    NEW: 'Новое поступление',
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[var(--modal-overlay)] backdrop-blur-md overflow-y-auto"
      >
        <div
          id={`lot-detail-modal-${lot.id}`}
          className="relative w-full max-w-5xl bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden my-auto text-[var(--text-primary)] transition-all max-h-[92vh] flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            id="btn-close-detail-modal"
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute top-3.5 right-3.5 z-20 p-2.5 rounded-full bg-[rgba(7,11,20,0.65)] hover:bg-black/90 backdrop-blur-md text-white transition-all cursor-pointer border border-white/20 shadow-md group"
          >
            <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
          </button>

          {/* Left Side: Museum Exhibition Stage (Artwork Viewer) */}
          <div className="w-full md:w-1/2 relative bg-[var(--bg-card)] border-b md:border-b-0 md:border-r border-[var(--border-subtle)] flex flex-col items-center justify-center min-h-[340px] sm:min-h-[440px] md:min-h-[560px] p-4 sm:p-6 md:p-8 select-none">
            {/* Subtle Gallery Spotlight Vignette */}
            <div className="absolute inset-0 bg-radial-[at_50%_45%] from-blue-500/5 via-transparent to-black/20 pointer-events-none" />

            {/* Lightbox / Zoom Trigger Button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              aria-label="Увеличить произведение"
              title="На весь экран"
              className="absolute top-3.5 left-3.5 z-20 p-2.5 rounded-full bg-[rgba(7,11,20,0.65)] hover:bg-black/90 backdrop-blur-md text-white transition-all cursor-pointer border border-white/20 shadow-md group"
            >
              <Maximize2 className="w-4 h-4 transition-transform group-hover:scale-110" />
            </button>

            {/* Artwork Display Frame (Always 100% visible, uncropped) */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative w-full h-full flex-1 flex items-center justify-center cursor-zoom-in group"
            >
              <img
                src={currentImage}
                alt={lot.title}
                className={`max-w-full max-h-[42vh] sm:max-h-[48vh] md:max-h-[58vh] w-auto h-auto object-contain transition-all duration-300 ${
                  viewMode === 'artwork'
                    ? 'rounded-xs shadow-2xl drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)] ring-1 ring-white/10 dark:ring-white/10 ring-black/5 group-hover:scale-[1.015]'
                    : 'rounded-xl shadow-xl'
                }`}
              />

              {/* In-situ Badge if interior mode is active */}
              {viewMode === 'interior' && (
                <div className="absolute top-3.5 right-14 p-2 px-3 rounded-full bg-black/75 backdrop-blur-md text-[11px] text-white/95 font-gallery-sans border border-white/15 shadow-lg">
                  Примерка в интерьере · Масштаб 1:1
                </div>
              )}
            </div>

            {/* Bottom Switcher: Artwork / Interior (Only if interior preview exists) */}
            {lot.interiorPreviewImage && (
              <div className="pt-4 z-10 flex items-center justify-center w-full">
                <div className="inline-flex p-1 rounded-full bg-[rgba(7,11,20,0.85)] dark:bg-[rgba(7,11,20,0.85)] bg-[rgba(240,244,252,0.9)] backdrop-blur-md border border-[var(--border-subtle)] shadow-lg">
                  <button
                    id="btn-view-artwork"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewMode('artwork');
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-gallery-sans transition-all cursor-pointer ${
                      viewMode === 'artwork'
                        ? 'bg-white text-black font-semibold shadow-xs'
                        : 'text-white/70 hover:text-white dark:text-white/70'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Произведение</span>
                  </button>

                  <button
                    id="btn-view-interior"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewMode('interior');
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-gallery-sans transition-all cursor-pointer ${
                      viewMode === 'interior'
                        ? 'bg-white text-black font-semibold shadow-xs'
                        : 'text-white/70 hover:text-white dark:text-white/70'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>В интерьере</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Description, Specs & Direct Telegram Concierge */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[52vh] md:max-h-none">
            <div className="space-y-4">
              {/* Header info & Badges */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] tracking-[0.25em] font-semibold text-blue-400 font-gallery-sans uppercase">
                    {lot.lotNumber}
                  </span>
                  {lot.badgeType && (
                    <span className="text-[10px] tracking-wider text-[var(--accent-gold)] font-gallery-sans px-2 py-0.5 rounded-md bg-[var(--pill-bg)] border border-[var(--border-subtle)]">
                      {badgeLabels[lot.badgeType] || lot.badgeType}
                    </span>
                  )}
                </div>

                <h2 className="font-gallery-serif text-3xl sm:text-4xl text-[var(--text-primary)] font-normal leading-tight">
                  {lot.title}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] font-gallery-sans">
                  {lot.medium}
                </p>
              </div>

              {/* Specifications table */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-gallery-sans">
                <div>
                  <span className="text-[var(--text-muted)] block text-[10px] uppercase tracking-wider">Габариты</span>
                  <span className="text-[var(--text-primary)] font-medium">{lot.dimensions}</span>
                </div>
                {lot.color ? (
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase tracking-wider">Цвет</span>
                    <span className="text-[var(--text-primary)] font-medium">{lot.color}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase tracking-wider">Вес / База</span>
                    <span className="text-[var(--text-primary)] font-medium">{lot.weight || 'По запросу'}</span>
                  </div>
                )}
                {lot.weight && lot.color && (
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase tracking-wider">Вес / База</span>
                    <span className="text-[var(--text-primary)] font-medium">{lot.weight}</span>
                  </div>
                )}
                {lot.certificateOfAuthenticity && (
                  <div className="col-span-2 pt-1 border-t border-[var(--border-subtle)] flex items-center gap-1.5 text-emerald-400 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Сертификат подлинности WOW CONCEPT</span>
                  </div>
                )}
              </div>

              {/* Description text */}
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.2em] uppercase font-gallery-sans text-[var(--text-muted)] block">
                  ОПИСАНИЕ
                </span>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  {lot.description}
                </p>
                {lot.features && (
                  <div className="pt-1 text-xs text-[var(--text-secondary)] font-gallery-sans">
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase tracking-wider mb-0.5">Особенности</span>
                    <p className="leading-relaxed">{lot.features}</p>
                  </div>
                )}
                {lot.curatorNote && (
                  <p className="text-xs sm:text-[12.5px] leading-relaxed text-[var(--text-muted)] italic pl-3 border-l-2 border-blue-400/50">
                    «{lot.curatorNote}»
                  </p>
                )}
              </div>

              {/* Price display */}
              <div className="pt-2">
                <span className="text-[10px] tracking-[0.2em] uppercase font-gallery-sans text-[var(--text-muted)] block">
                  СТОИМОСТЬ
                </span>
                <div className="text-2xl sm:text-3xl font-gallery-serif text-[var(--text-primary)] font-semibold">
                  {formatPrice(lot.priceEstimate)}
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-5 border-t border-[var(--border-subtle)] mt-5 space-y-2.5">
              <a
                id={`btn-request-fitting-${lot.id}`}
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-xl bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-gallery-sans text-xs tracking-[0.2em] font-semibold uppercase hover:bg-[var(--btn-primary-hover)] transition-all cursor-pointer shadow-md text-center block"
              >
                ЗАПРОСИТЬ ПРИМЕРКУ В ВАШЕМ ИНТЕРЬЕРЕ
              </a>

              <button
                id={`btn-share-lot-${lot.id}`}
                onClick={() => onShare(lot.title)}
                className="w-full py-2.5 px-3 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-gallery-sans tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-[var(--border-medium)]"
                title="Поделиться лотом"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Поделиться лотом</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox for In-Depth Artwork Inspection */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Закрыть полноэкранный режим"
            className="absolute top-4 right-4 z-70 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/20 shadow-xl"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-full max-h-full flex items-center justify-center"
          >
            <img
              src={currentImage}
              alt={lot.title}
              className="max-w-[95vw] max-h-[92vh] object-contain rounded-md shadow-2xl ring-1 ring-white/10"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-gallery-sans tracking-wider border border-white/10 pointer-events-none">
              {lot.lotNumber} · {lot.title} ({lot.dimensions})
            </div>
          </div>
        </div>
      )}
    </>
  );
};
