import React from 'react';
import { Palette, Armchair, Sparkles } from 'lucide-react';
import { CategoryType } from '../types';

interface BottomNavProps {
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Нижняя панель навигации"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--nav-bottom-bg)] backdrop-blur-xl border-t border-[var(--border-subtle)] px-3 py-2 pb-safe transition-colors duration-300 md:hidden shadow-[0_-8px_20px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {/* Paintings */}
        <button
          id="bottom-nav-paintings"
          onClick={() => onSelectCategory('paintings')}
          className={`flex-1 flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeCategory === 'paintings'
              ? 'text-[var(--text-primary)] font-semibold bg-white/5 shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          <div className="relative">
            <Palette className="w-5 h-5" />
            {activeCategory === 'paintings' && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] tracking-wider uppercase font-gallery-sans">
            КАРТИНЫ
          </span>
        </button>

        {/* Furniture */}
        <button
          id="bottom-nav-furniture"
          onClick={() => onSelectCategory('furniture')}
          className={`flex-1 flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeCategory === 'furniture'
              ? 'text-[var(--text-primary)] font-semibold bg-white/5 shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          <div className="relative">
            <Armchair className="w-5 h-5" />
            {activeCategory === 'furniture' && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] tracking-wider uppercase font-gallery-sans">
            МЕБЕЛЬ
          </span>
        </button>

        {/* Decor */}
        <button
          id="bottom-nav-decor"
          onClick={() => onSelectCategory('decor')}
          className={`flex-1 flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeCategory === 'decor'
              ? 'text-[var(--text-primary)] font-semibold bg-white/5 shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5" />
            {activeCategory === 'decor' && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] tracking-wider uppercase font-gallery-sans">
            ДЕКОР
          </span>
        </button>
      </div>
    </nav>
  );
};
