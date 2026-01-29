import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CustomersService } from './customers.service';
import { AuditService } from '../audit/audit.service';
import type { CreateCustomerRequest, UpdateCustomerRequest } from '@goldora/types';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('customers')
export class CustomersController {
  constructor(
    private customersService: CustomersService,
    private auditService: AuditService,
  ) {}

  @Get()
  async findAll(@CurrentUser('organizationId') orgId: string, @Query('search') search?: string) {
    return this.customersService.findByOrganization(orgId, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('organizationId') orgId: string) {
    return this.customersService.findById(id, orgId);
  }

  @Post()
  async create(
    @Body() data: CreateCustomerRequest,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('id') userId: string,
  ) {
    const customer = await this.customersService.create(data, orgId);
    await this.auditService.log({
      action: 'CUSTOMER_CREATED',
      entityType: 'Customer',
      entityId: customer.id,
      organizationId: orgId,
      userId,
    });
    return customer;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCustomerRequest,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('id') userId: string,
  ) {
    const customer = await this.customersService.update(id, data, orgId);
    await this.auditService.log({
      action: 'CUSTOMER_UPDATED',
      entityType: 'Customer',
      entityId: id,
      organizationId: orgId,
      userId,
    });
    return customer;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.auditService.log({
      action: 'CUSTOMER_DELETED',
      entityType: 'Customer',
      entityId: id,
      organizationId: orgId,
      userId,
    });
    return this.customersService.delete(id, orgId);
  }
}
