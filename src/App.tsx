import { useState } from 'react';
import { Header } from './components/Header';
import { LotCard } from './components/LotCard';
import { PrivateFittingBanner } from './components/PrivateFittingBanner';
import { BottomNav } from './components/BottomNav';
import { LotDetailModal } from './components/LotDetailModal';
import { Toast } from './components/Toast';
import { LotItem } from './types';
import { useGallery } from './hooks/useGallery';
import { useTheme } from './hooks/useTheme';
import { useShare } from './hooks/useShare';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const { activeCategory, setActiveCategory, filteredLots } = useGallery();

  const { handleShare } = useShare(showToast);

  // Modals state
  const [selectedLotForDetail, setSelectedLotForDetail] = useState<LotItem | null>(null);

  return (

    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 pb-16 md:pb-0">
      {/* Top Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        currentTheme={theme}
        onToggleTheme={toggleTheme}
        onShare={() => handleShare()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Empty state if no lots match */}
        {filteredLots.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="font-gallery-serif text-2xl text-[var(--text-secondary)]">
              В данном разделе нет экспонатов
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Попробуйте выбрать другую категорию.
            </p>
          </div>
        ) : (
          /* Responsive Modern CSS Grid Container with <img> tags inside */
          <div className="art-grid-container">
            {filteredLots.map((lot) => (
              <LotCard
                key={lot.id}
                lot={lot}
                onSelectLot={(item) => setSelectedLotForDetail(item)}
              />
            ))}
          </div>
        )}

        {/* Private Fitting Concierge Banner */}
        <PrivateFittingBanner />
      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-10 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="font-gallery-serif text-xl font-bold tracking-wider text-[var(--text-primary)] block">
              WOW CONCEPT
            </span>
            <span className="text-[11px] font-gallery-sans tracking-[0.2em] text-[var(--text-muted)] uppercase">
              GALLERY OF CONTEMPORARY ART & ARCHITECTURAL OBJECTS
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-[var(--text-secondary)] font-gallery-sans">
            <span>Ежедневно: 11:00 — 21:00</span>
            <span>Экспозиция: Залы I · II · III</span>
            <a
              href="https://t.me/wowconcept_admin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Приватный осмотр
            </a>
          </div>

          <div className="text-[11px] text-[var(--text-muted)] font-gallery-sans">
            © 2024–2026 WOW CONCEPT. Все права защищены.
          </div>
        </div>
      </footer>

      {/* Fixed Bottom Navigation for Mobile Devices */}
      <BottomNav
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Modals & Overlays */}

      <LotDetailModal
        key={selectedLotForDetail?.id ?? 'none'}
        lot={selectedLotForDetail}
        onClose={() => setSelectedLotForDetail(null)}
        onRequestFitting={() => {
          window.open('https://t.me/wowconcept_admin', '_blank', 'noopener');
        }}
        onShare={(title) => handleShare(title)}
      />

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
