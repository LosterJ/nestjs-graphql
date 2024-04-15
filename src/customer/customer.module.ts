import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { CustomerModel } from './customer.model';
import { CustomerService } from './customer.service';
import { CustomerResolver } from './customer.resolver';

@Module({
  imports: [
    forwardRef(() => InvoiceModule),
    TypeOrmModule.forFeature([CustomerModel]),
  ],
  providers: [CustomerService, CustomerResolver],
  exports: [CustomerService],
})
export class CustomerModule {}
