import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TransactionsService } from './transactions.service';
import { AuditService } from '../audit/audit.service';
import type { CreateTransactionRequest } from '@goldora/types';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionsController {
  constructor(
    private txService: TransactionsService,
    private auditService: AuditService,
  ) {}

  @Get()
  async findAll(
    @CurrentUser('organizationId') orgId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
  ) {
    return this.txService.findByOrganization(orgId, {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      customerId,
      status,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('organizationId') orgId: string) {
    return this.txService.findById(id, orgId);
  }

  @Post()
  async create(
    @Body() data: CreateTransactionRequest,
    @CurrentUser('id') userId: string,
    @CurrentUser('organizationId') orgId: string,
  ) {
    const tx = await this.txService.create(data, userId, orgId);
    await this.auditService.log({
      action: 'TRANSACTION_CREATED',
      entityType: 'Transaction',
      entityId: tx.id,
      organizationId: orgId,
      userId,
      details: { invoiceNumber: tx.invoiceNumber, totalAmount: Number(tx.totalAmount) },
    });
    return tx;
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('id') userId: string,
  ) {
    const tx = await this.txService.cancel(id, orgId);
    await this.auditService.log({
      action: 'TRANSACTION_CANCELLED',
      entityType: 'Transaction',
      entityId: id,
      organizationId: orgId,
      userId,
    });
    return tx;
  }
}
