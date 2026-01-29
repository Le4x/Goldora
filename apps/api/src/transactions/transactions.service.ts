import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MetalsService } from '../metals/metals.service';
import { getPurityFactor, calculateBuyPrice } from '@goldora/types';
import type { CreateTransactionRequest } from '@goldora/types';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private metalsService: MetalsService,
  ) {}

  async findByOrganization(organizationId: string, options?: { page?: number; limit?: number; customerId?: string; status?: string }) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const where: Record<string, unknown> = { organizationId };

    if (options?.customerId) where.customerId = options.customerId;
    if (options?.status) where.status = options.status;

    const [items, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          customer: { select: { firstName: true, lastName: true } },
          items: true,
          user: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findById(id: string, organizationId: string) {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, organizationId },
      include: {
        customer: true,
        items: true,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });
    if (!tx) throw new NotFoundException('Transaction introuvable');
    return tx;
  }

  async create(data: CreateTransactionRequest, userId: string, organizationId: string) {
    // Validate customer belongs to organization
    const customer = await this.prisma.customer.findFirst({
      where: { id: data.customerId, organizationId },
    });
    if (!customer) throw new BadRequestException('Client introuvable');

    // Get organization margins
    const org = await this.prisma.organization.findUnique({ where: { id: organizationId } });
    if (!org) throw new BadRequestException('Organisation introuvable');
    const margins = (org.metalMargins as Record<string, number>) || {};

    // Get current metal prices
    const prices = await this.metalsService.getCurrentPrices();

    // Calculate items
    const items = data.items.map((item) => {
      const purityFactor = getPurityFactor(item.metalType, item.purity);
      if (purityFactor === undefined) {
        throw new BadRequestException(`Pureté invalide: ${item.purity} pour ${item.metalType}`);
      }

      const priceInfo = prices.find((p) => p.metalType === item.metalType);
      if (!priceInfo) {
        throw new BadRequestException(`Prix indisponible pour ${item.metalType}`);
      }

      const spotPricePerGram = Number(priceInfo.pricePerGram);
      const marginPercent = margins[item.metalType] || 5;
      const totalPrice = calculateBuyPrice(item.weightGrams, purityFactor, spotPricePerGram, marginPercent);
      const unitPrice = totalPrice / item.weightGrams;

      return {
        metalType: item.metalType as 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM',
        weightGrams: item.weightGrams,
        purity: item.purity,
        purityFactor,
        description: item.description,
        spotPricePerGram,
        marginPercent,
        unitPrice,
        totalPrice,
      };
    });

    const totalAmount = items.reduce((sum, i) => sum + i.totalPrice, 0);

    // Generate invoice number
    const updated = await this.prisma.organization.update({
      where: { id: organizationId },
      data: { invoiceCounter: { increment: 1 } },
    });
    const invoiceNumber = `${org.invoicePrefix}-${String(updated.invoiceCounter).padStart(6, '0')}`;

    return this.prisma.transaction.create({
      data: {
        invoiceNumber,
        status: 'COMPLETED',
        totalAmount,
        notes: data.notes,
        customerId: data.customerId,
        userId,
        organizationId,
        items: { create: items },
      },
      include: { items: true, customer: { select: { firstName: true, lastName: true } } },
    });
  }

  async cancel(id: string, organizationId: string) {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, organizationId, status: 'COMPLETED' },
    });
    if (!tx) throw new NotFoundException('Transaction introuvable ou déjà annulée');

    return this.prisma.transaction.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
