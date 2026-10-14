import React from 'react';
import { Send, Sun, Moon, Palette, Armchair, Sparkles } from 'lucide-react';
import { CategoryType } from '../types';

interface HeaderProps {
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  currentTheme: 'dark' | 'light';
  onToggleTheme: () => void;
  onShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  currentTheme,
  onToggleTheme,
  onShare,
}) => {
  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'paintings':
        return 'КАРТИНЫ · ЖИВОПИСЬ';
      case 'furniture':
        return 'АВТОРСКАЯ МЕБЕЛЬ';
      case 'decor':
        return 'СКУЛЬПТУРНЫЙ ДЕКОР & АРТ-ОБЪЕКТЫ';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full pt-3.5 pb-2.5 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-md transition-colors duration-300">
      {/* Top Branding Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-gallery-serif text-xl sm:text-2xl font-bold tracking-wider text-[var(--text-primary)]">
            WOW
          </span>
          <span className="font-gallery-serif text-xs sm:text-sm tracking-[0.25em] text-[var(--text-secondary)] -mt-1 font-light">
            CONCEPT
          </span>
        </div>

        <div className="hidden sm:block">
          <span className="text-[11px] tracking-[0.35em] text-[var(--text-muted)] uppercase font-gallery-sans">
            G A L L E R Y
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme switcher */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Переключить тему оформления"
            className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--pill-bg)] text-[var(--text-primary)] hover:border-[var(--border-medium)] transition-all cursor-pointer"
            title={currentTheme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему'}
          >
            {currentTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Share / Telegram Icon */}
          <button
            id="share-gallery-btn"
            onClick={onShare}
            aria-label="Поделиться галереей"
            className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--pill-bg)] text-[var(--text-primary)] hover:border-[var(--border-medium)] transition-all cursor-pointer"
            title="Поделиться галереей"
          >
            <Send className="w-4 h-4 -rotate-12 translate-x-[-1px] text-[var(--text-secondary)]" />
          </button>

          {/* Monogram Seal */}
          <div className="w-8 h-8 rounded-full border border-[var(--border-medium)] flex items-center justify-center bg-[var(--bg-card)] shadow-xs">
            <span className="font-gallery-serif text-[11px] tracking-tight text-[var(--text-primary)] font-semibold">
              W
            </span>
          </div>
        </div>
      </div>

      {/* Sub-header with Category title */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mt-3 mb-1 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-gallery-sans text-[var(--text-secondary)]">
        <span>{getCategoryTitle()}</span>
        <span className="text-[10px] tracking-wider text-[var(--text-muted)] font-light">
          ЭКСПОЗИЦИЯ
        </span>
      </div>

      {/* Category Pills Navigation (Visible on Desktop/Tablet, hidden on mobile to avoid double navigation with BottomNav) */}
      <div className="max-w-7xl mx-auto hidden md:flex items-center gap-2 overflow-x-auto hide-scrollbar pt-2 pb-1">
        <button
          id="tab-paintings"
          onClick={() => onSelectCategory('paintings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'paintings'
              ? 'bg-[var(--pill-active-bg)] text-[var(--pill-active-text)] shadow-sm font-semibold'
              : 'bg-[var(--pill-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>КАРТИНЫ</span>
          {activeCategory === 'paintings' && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          )}
        </button>

        <button
          id="tab-furniture"
          onClick={() => onSelectCategory('furniture')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'furniture'
              ? 'bg-[var(--pill-active-bg)] text-[var(--pill-active-text)] shadow-sm font-semibold'
              : 'bg-[var(--pill-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          <Armchair className="w-3.5 h-3.5" />
          <span>МЕБЕЛЬ</span>
          {activeCategory === 'furniture' && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          )}
        </button>

        <button
          id="tab-decor"
          onClick={() => onSelectCategory('decor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'decor'
              ? 'bg-[var(--pill-active-bg)] text-[var(--pill-active-text)] shadow-sm font-semibold'
              : 'bg-[var(--pill-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ДЕКОР</span>
          {activeCategory === 'decor' && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};
