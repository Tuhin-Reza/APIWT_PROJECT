
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customerBills')
export class CustomerBill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: false })
    totalBooks: number;

    @Column({ unique: false })
    totalBill: number;
}