import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}