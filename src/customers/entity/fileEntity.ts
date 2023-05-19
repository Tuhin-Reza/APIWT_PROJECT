import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './userEntity';
@Entity('image')
export class FileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @ManyToOne(() => UserEntity, (user) => user.photos)
    user: UserEntity
}