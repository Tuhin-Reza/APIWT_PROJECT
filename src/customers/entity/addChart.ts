import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserEntity } from './userEntity';
import { BookDetailEntity } from './bookDetail';

@Entity('ChartBook')
export class AddChartEntiy {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @ManyToOne(() => BookDetailEntity)
    @JoinColumn({ name: "bookDetailsId" })
    bookDetails: BookDetailEntity;
    static user: any;
    static bookDetails: any;
}