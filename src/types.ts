export type CategoryType = 'paintings' | 'furniture' | 'decor';

export type LotStatus = 'available' | 'reserved' | 'exhibition' | 'archival';

export interface LotItem {
  id: string;
  lotNumber: string; // e.g. "LOT 042"
  badgeType: 'UNIQUE' | 'ARCHIVAL' | 'LIMITED' | 'RESERVED';
  category: CategoryType;
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  curatorNote?: string;
  location: string; // e.g. "ЗАЛ А · СТЕНД 03" or "В ЭКСПОЗИЦИИ"
  priceEstimate: number;
  inStock: boolean;
  isAvailable: boolean;
  image: string;
  interiorPreviewImage?: string;
  weight?: string;
  color?: string;
  features?: string;
  certificateOfAuthenticity: boolean;
  viewsCount: number;
}
