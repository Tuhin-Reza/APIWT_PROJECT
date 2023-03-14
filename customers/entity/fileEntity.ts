import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './userEntity';

@Entity('image')
export class FileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @OneToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;
}