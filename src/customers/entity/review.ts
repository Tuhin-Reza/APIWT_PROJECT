import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { BookDetailEntity } from './bookDetail';

@Entity('reviews')
export class ReviewEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rating: string;

    @Column()
    comment: string;

    @Column()
    userName: string;

    @Column()
    orderId: number;

    @Column()
    reviewTime: string;

    @ManyToOne(() => BookDetailEntity, book => book.reviews)
    @JoinColumn({ name: 'bookId' })
    book: BookDetailEntity;
    length: number;
}
