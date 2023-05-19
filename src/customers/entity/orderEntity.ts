import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('order')
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    userName: string;

    @Column()
    totalBookCount: number;

    @Column()
    totalPrice: number;

    @Column()
    orderTime: string;

    orderDetails: any;
}