import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './userEntity';

@Entity('addChart')
export class BookAddToCartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @ManyToOne(() => UserEntity, user => user.id)
  user: UserEntity;
  @Column()
  userId: number;
}