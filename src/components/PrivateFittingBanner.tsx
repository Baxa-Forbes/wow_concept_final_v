import React from 'react';
import { Compass, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const PrivateFittingBanner: React.FC = () => {
  const telegramMessage = encodeURIComponent(
    'Здравствуйте! Хочу запросить визит арт-эдвайзера для консультации и примерки произведений из коллекции WOW CONCEPT в моем интерьере.'
  );
  const telegramUrl = `https://t.me/wowconcept_admin?text=${telegramMessage}`;

  return (
    <section className="mt-12 sm:mt-16 mb-20">
      <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 sm:p-8 transition-all hover:border-[var(--border-medium)] shadow-md">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Header Tag with Icon */}
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-gallery-sans tracking-[0.25em] uppercase text-[var(--text-secondary)]">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-[var(--text-primary)]">ЧАСТНАЯ ПРИМЕРКА</span>
          </div>

          {/* Description Text */}
          <p className="text-xs sm:text-[14px] leading-relaxed text-[var(--text-secondary)] font-gallery-sans max-w-3xl">
            Каждое полотно и объект могут быть доставлены арт-консультантом WOW CONCEPT для
            примерки в вашем интерьере до подтверждения сделки.
          </p>

          {/* Value props badges */}
          <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-[var(--text-muted)] font-gallery-sans">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Страхование произведений
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Примерка 48 часов
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <a
              id="btn-request-advisor"
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-gallery-sans tracking-[0.2em] uppercase text-[var(--text-primary)] hover:text-blue-400 transition-colors font-semibold cursor-pointer group"
            >
              <span>ЗАПРОСИТЬ ВИЗИТ АРТ-ЭДВАЙЗЕРА</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
