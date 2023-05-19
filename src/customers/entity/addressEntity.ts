import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './userEntity';

@Entity('userAddress')
export class AddressEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    country: string;

    @OneToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;
}
