import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MetalsService } from './metals.service';

@ApiTags('Metals')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('metals')
export class MetalsController {
  constructor(private metalsService: MetalsService) {}

  @Get('prices')
  async getCurrentPrices() {
    return this.metalsService.getCurrentPrices();
  }

  @Post('prices/refresh')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async refreshPrices() {
    await this.metalsService.fetchAndStorePrices();
    return { message: 'Prix mis à jour' };
  }
}
