export interface MetalPriceDto {
  metalType: 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';
  pricePerGram: number;
  currency: string;
  fetchedAt: string;
}

export const PURITY_MAP: Record<string, Record<string, number>> = {
  GOLD: {
    '9K': 0.375,
    '14K': 0.5833,
    '18K': 0.75,
    '22K': 0.9167,
    '24K': 0.999,
    '375': 0.375,
    '585': 0.585,
    '750': 0.75,
    '916': 0.9167,
    '999': 0.999,
  },
  SILVER: {
    '800': 0.8,
    '925': 0.925,
    '999': 0.999,
  },
  PLATINUM: {
    '850': 0.85,
    '900': 0.9,
    '950': 0.95,
    '999': 0.999,
  },
  PALLADIUM: {
    '500': 0.5,
    '950': 0.95,
    '999': 0.999,
  },
};

export function getPurityFactor(metalType: string, purity: string): number | undefined {
  return PURITY_MAP[metalType]?.[purity];
}

export function calculateBuyPrice(
  weightGrams: number,
  purityFactor: number,
  spotPricePerGram: number,
  marginPercent: number,
): number {
  const grossValue = weightGrams * purityFactor * spotPricePerGram;
  const margin = grossValue * (marginPercent / 100);
  return Math.round((grossValue - margin) * 100) / 100;
}
