import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { BookAddToCartEntity } from './entity/bookAddChartEntity';
import { BookDetailEntity } from './entity/bookDetail';
import { FileEntity } from './entity/fileEntity';
import { UserEntity } from './entity/userEntity';
import { ReviewEntity } from './entity/review';
import { AddChartEntiy } from './entity/addChart';
import { OrderEntity } from './entity/orderEntity';
import { OrderDetailEntity } from './entity/orderDetailEntity';
import { AddressEntity } from './entity/addressEntity';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'tuhin.aiub2018@gmail.com',
          pass: 'rnyaqkesscbdcmho'
        },
      }
    }),
    TypeOrmModule.forFeature(
      [
        UserEntity,
        FileEntity,
        BookDetailEntity,
        BookAddToCartEntity,
        ReviewEntity,
        AddChartEntiy,
        OrderEntity,
        OrderDetailEntity,
        AddressEntity,

      ])],
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule { }
