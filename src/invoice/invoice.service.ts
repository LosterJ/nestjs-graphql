import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceModel } from './invoice.model';
import { Repository } from 'typeorm';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceModel)
    private invoiceRepository: Repository<InvoiceModel>,
  ) {}

  findByCustomer(customerId: string): Promise<InvoiceModel[]> {
    return this.invoiceRepository.find({
      where: { customer: { id: customerId } },
    });
  }
  findAll(): Promise<InvoiceModel[]> {
    return this.invoiceRepository.find();
  }
}
