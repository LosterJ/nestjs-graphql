import { Field, InputType } from '@nestjs/graphql';
import { Currency, PaymentStatus } from './invoice.model';

@InputType()
class ItemDTO {
  @Field()
  description: string;
  @Field()
  rate: number;
  @Field()
  quantity: number;
}

@InputType()
export class CreateInvoiceDTO {
  @Field()
  invoiceNo: string;
  @Field()
  paymentStatus: PaymentStatus;
  @Field()
  description: string;
  @Field()
  customer: string;
  @Field()
  currency: Currency;
  @Field()
  taxRate: number;
  @Field()
  issueDate: Date;
  @Field()
  dueDate: Date;
  @Field()
  note: string;
  @Field((type) => [ItemDTO])
  items: Array<{ description: string; rate: number; quantity: number }>;
}
