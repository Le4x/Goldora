import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetalsService {
  private readonly logger = new Logger(MetalsService.name);

  constructor(private prisma: PrismaService) {}

  async getCurrentPrices() {
    // Get latest price for each metal type
    const metalTypes = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'] as const;

    const prices = await Promise.all(
      metalTypes.map((metalType) =>
        this.prisma.metalPrice.findFirst({
          where: { metalType },
          orderBy: { fetchedAt: 'desc' },
        }),
      ),
    );

    return prices.filter(Boolean);
  }

  async fetchAndStorePrices() {
    const apiKey = process.env.METAL_PRICE_API_KEY;
    const apiUrl = process.env.METAL_PRICE_API_URL;

    if (!apiKey || !apiUrl) {
      this.logger.warn('Metal price API not configured, using fallback prices');
      return this.storeFallbackPrices();
    }

    try {
      // Gold API integration
      const metals = [
        { symbol: 'XAU', type: 'GOLD' as const },
        { symbol: 'XAG', type: 'SILVER' as const },
        { symbol: 'XPT', type: 'PLATINUM' as const },
        { symbol: 'XPD', type: 'PALLADIUM' as const },
      ];

      for (const metal of metals) {
        const response = await fetch(`${apiUrl}/${metal.symbol}/EUR`, {
          headers: { 'x-access-token': apiKey },
        });

        if (response.ok) {
          const data = await response.json();
          // Gold API returns price per troy ounce, convert to grams (1 troy oz = 31.1035 grams)
          const pricePerGram = data.price / 31.1035;

          await this.prisma.metalPrice.create({
            data: {
              metalType: metal.type,
              pricePerGram,
              currency: 'EUR',
              source: 'goldapi.io',
            },
          });
        }
      }
    } catch (error) {
      this.logger.error('Failed to fetch metal prices', error);
      return this.storeFallbackPrices();
    }
  }

  private async storeFallbackPrices() {
    // Fallback approximate prices per gram in EUR
    const fallback = [
      { metalType: 'GOLD' as const, pricePerGram: 72.0 },
      { metalType: 'SILVER' as const, pricePerGram: 0.85 },
      { metalType: 'PLATINUM' as const, pricePerGram: 30.0 },
      { metalType: 'PALLADIUM' as const, pricePerGram: 35.0 },
    ];

    for (const metal of fallback) {
      await this.prisma.metalPrice.create({
        data: {
          ...metal,
          currency: 'EUR',
          source: 'fallback',
        },
      });
    }
  }
}
