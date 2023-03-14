import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { CustomerBill } from './customerBill';
import { UserEntity } from './userEntity';
@Entity('orderItems')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bookName: string;

    @Column()
    price: number;

    @Column()
    userId: number;

    @OneToOne(() => CustomerBill)
    @JoinColumn()
    customerBill: CustomerBill;

    @ManyToOne(() => UserEntity)
    user: UserEntity;
}