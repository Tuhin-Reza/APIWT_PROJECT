import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ReviewEntity } from './review';
import { AddChartEntiy } from './addChart';
import { Exclude } from 'class-transformer';

@Entity('bookDetails')
export class BookDetailEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    publicationDate: Date;

    @Column()
    genre: string;

    @Column()
    price: number;


    @OneToMany(() => AddChartEntiy, addChart => addChart.bookDetails)
    addCharts: AddChartEntiy[];

    @OneToMany(() => ReviewEntity, review => review.book)
    reviews: ReviewEntity[];
    
    orderDetails: any;
    bookCount: number;
}