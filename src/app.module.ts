import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './pets/pets.module';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver } from '@nestjs/apollo';
import { CustomerModel } from './customer/customer.model';
import { InvoiceModel } from './invoice/invoice.model';
import { CustomerModule } from './customer/customer.module';
import { InvoiceModule } from './invoice/invoice.module';
import { CustomerResolver } from './customer/customer.resolver';
import { InvoiceResolver } from './invoice/invoice.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      autoSchemaFile: 'schema.gql',
      //also be set to true, which means the gen-ed schema will be saved to memory
      driver: ApolloDriver,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'luongba',
      password: 'luongba',
      database: 'invoiceapp',
      // entities: [CustomerModel, InvoiceModel],
      entities: ['dist/**/*.model.js'],
      // migrations: [path.resolve(__dirname, 'database', 'migration', '*')],
      synchronize: true,
      logging: true,
    }),
    PetsModule,
    CustomerModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomerResolver, InvoiceResolver],
})
export class AppModule {}
