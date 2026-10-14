import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import { LotItem } from '../types';

interface LotCardProps {
  lot: LotItem;
  onSelectLot: (lot: LotItem) => void;
}

export const LotCard: React.FC<LotCardProps> = ({
  lot,
  onSelectLot,
}) => {

  return (
    <article
      id={`lot-card-${lot.id}`}
      onClick={() => onSelectLot(lot)}
      className="gallery-card group flex flex-col bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--border-active)] transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer"
    >
      {/* Visual Image Container with Square / 4:5 Aspect Ratio */}
      <div className="gallery-img-wrapper relative aspect-square bg-[var(--bg-surface)] overflow-hidden">
        {/* Artwork Image */}
        <img
          src={lot.image}
          alt={`${lot.title} - ${lot.medium}`}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop';
          }}
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none">
          <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-black text-xs font-gallery-sans tracking-wider font-semibold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-3.5 h-3.5" />
            <span>Смотреть детали</span>
          </span>
        </div>
      </div>

      {/* Card Info & Typography */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Title */}
          <h2 className="font-gallery-serif text-2xl sm:text-[26px] font-normal leading-tight text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">
            {lot.title}
          </h2>

          {/* Medium and Dimensions */}
          <p className="mt-1.5 text-xs sm:text-[13px] text-[var(--text-secondary)] font-gallery-sans tracking-wide">
            {lot.medium} · {lot.dimensions}
          </p>

          {/* Description */}
          <p className="mt-3 text-xs sm:text-[13.5px] leading-relaxed text-[var(--text-secondary)] font-gallery-sans opacity-90 line-clamp-2">
            {lot.description}
          </p>
        </div>

        {/* Bottom Actions Row: ПОДРОБНЕЕ button */}
        <div className="pt-3 flex items-center justify-between border-t border-[var(--border-subtle)]">
          <button
            id={`btn-detail-${lot.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLot(lot);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-gallery-sans text-xs tracking-[0.15em] font-semibold uppercase hover:bg-[var(--btn-primary-hover)] transition-all cursor-pointer shadow-xs group/btn"
          >
            <span>ПОДРОБНЕЕ</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  );
};
