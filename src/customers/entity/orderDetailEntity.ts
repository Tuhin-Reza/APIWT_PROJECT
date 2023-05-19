import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BookDetailEntity } from './bookDetail';
import { OrderEntity } from './orderEntity';

@Entity('orderDetail')
export class OrderDetailEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OrderEntity, order => order.orderDetails)
    order: OrderEntity;

    @ManyToOne(() => BookDetailEntity, book => book.orderDetails)
    book: BookDetailEntity;

    @Column()
    pricePerUnit: number;
}
