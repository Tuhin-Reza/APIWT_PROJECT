import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('addChart')
export class BookAddToCartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  
}