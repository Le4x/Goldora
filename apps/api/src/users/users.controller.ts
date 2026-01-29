import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@CurrentUser('organizationId') orgId: string) {
    return this.usersService.findByOrganization(orgId);
  }

  @Post()
  async create(
    @CurrentUser('organizationId') orgId: string,
    @Body() data: { email: string; password: string; firstName: string; lastName: string; role?: 'ADMIN' | 'SELLER' },
  ) {
    return this.usersService.create({ ...data, organizationId: orgId });
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string, @CurrentUser('organizationId') orgId: string) {
    return this.usersService.deactivate(id, orgId);
  }
}
