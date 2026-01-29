import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateCustomerRequest, UpdateCustomerRequest } from '@goldora/types';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findByOrganization(organizationId: string, search?: string) {
    const where: Record<string, unknown> = { organizationId };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.customer.findMany({
      where,
      orderBy: { lastName: 'asc' },
      include: { _count: { select: { transactions: true } } },
    });
  }

  async findById(id: string, organizationId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, organizationId },
      include: { identityDocuments: true, transactions: { orderBy: { createdAt: 'desc' }, take: 10 } },
    });
    if (!customer) throw new NotFoundException('Client introuvable');
    return customer;
  }

  async create(data: CreateCustomerRequest, organizationId: string) {
    return this.prisma.customer.create({
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        organizationId,
      },
    });
  }

  async update(id: string, data: UpdateCustomerRequest, organizationId: string) {
    const customer = await this.prisma.customer.findFirst({ where: { id, organizationId } });
    if (!customer) throw new NotFoundException('Client introuvable');

    return this.prisma.customer.update({
      where: { id },
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
    });
  }

  async delete(id: string, organizationId: string) {
    const customer = await this.prisma.customer.findFirst({ where: { id, organizationId } });
    if (!customer) throw new NotFoundException('Client introuvable');

    await this.prisma.customer.delete({ where: { id } });
    return { deleted: true };
  }
}
