import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, Unique } from 'typeorm';

@Entity('user')
@Unique(["email"])
@Unique(["password"])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
