import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerModel } from './customer.model';

export enum Currency {
  NGN = 'NGN',
  USD = 'USD',
  GBP = 'GBP',
  EUR = 'EUR',
}

export enum PaymentStatus {
  PAID = 'PAID',
  NOT_PAID = 'NOT_PAID',
}

@ObjectType()
export class Item {
  @Field()
  description: string;
  @Field()
  rate: number;
  @Field()
  quantity: number;
}

@ObjectType()
export class InvoiceModel {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 500, nullable: false })
  invoiceNo: string;

  @Field()
  @Column('text')
  description: string;

  @Field((type) => CustomerModel)
  @ManyToOne((type) => CustomerModel, (customer) => customer.invoices)
  customer: CustomerModel;

  @Field()
  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
  })
  currency: Currency;

  @Field()
  @Column()
  taxRate: number;

  @Field()
  @Column()
  issueDate: string;

  @Field()
  @Column()
  dueDate: string;

  @Field()
  @Column()
  note: string;

  @Field((type) => [Item])
  @Column({
    type: 'jsonb',
    array: false,
    default: [],
    nullable: false,
  })
  items: Item[];

  @Field()
  @Column()
  taxAmount: number;

  @Field()
  @Column()
  subTotal: number;

  @Field()
  @Column()
  total: string;

  @Field()
  @Column({ default: 0 })
  amountPaid: number;

  @Field()
  @Column()
  outstandingBalance: number;

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}