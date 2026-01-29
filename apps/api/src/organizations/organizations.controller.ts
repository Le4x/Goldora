import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private orgService: OrganizationsService) {}

  @Get('mine')
  async getMyOrganization(@CurrentUser('organizationId') orgId: string) {
    return this.orgService.findById(orgId);
  }

  @Patch('mine')
  @Roles('ADMIN', 'SUPER_ADMIN')
  async updateMyOrganization(
    @CurrentUser('organizationId') orgId: string,
    @Body() data: { name?: string; address?: string; phone?: string; email?: string; metalMargins?: Record<string, number> },
  ) {
    return this.orgService.update(orgId, data);
  }

  @Get()
  @Roles('SUPER_ADMIN')
  async findAll() {
    return this.orgService.findAll();
  }
}
