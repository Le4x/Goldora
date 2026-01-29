import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const org = await this.prisma.organization.findUnique({ where: { id } });
    if (!org) throw new NotFoundException('Organisation introuvable');
    return org;
  }

  async update(id: string, data: { name?: string; address?: string; phone?: string; email?: string; metalMargins?: Record<string, number> }) {
    return this.prisma.organization.update({ where: { id }, data });
  }

  async findAll() {
    return this.prisma.organization.findMany({ orderBy: { name: 'asc' } });
  }
}
