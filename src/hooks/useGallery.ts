import { useState, useMemo } from 'react';
import { INITIAL_LOTS } from '../data/galleryData';
import { CategoryType } from '../types';

export function useGallery() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('paintings');

  const filteredLots = useMemo(() => {
    return INITIAL_LOTS.filter((lot) => lot.category === activeCategory);
  }, [activeCategory]);

  return {
    activeCategory,
    setActiveCategory,
    filteredLots,
  };
}
