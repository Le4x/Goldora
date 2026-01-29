import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MetalsModule } from '../metals/metals.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [MetalsModule, AuditModule],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
