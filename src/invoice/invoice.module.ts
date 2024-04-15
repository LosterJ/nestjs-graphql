import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from 'src/customer/customer.module';
import { InvoiceModel } from './invoice.model';
import { InvoiceService } from './invoice.service';
import { InvoiceResolver } from './invoice.resolver';

@Module({
  imports: [
    forwardRef(() => CustomerModule),
    TypeOrmModule.forFeature([InvoiceModel]),
  ],
  providers: [InvoiceService, InvoiceResolver],
  exports: [InvoiceService],
})
export class InvoiceModule {}
