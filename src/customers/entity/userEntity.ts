import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, Unique, OneToMany } from 'typeorm';
import { AddChartEntiy } from './addChart';
import { FileEntity } from './fileEntity';

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

  @OneToMany(() => FileEntity, (photo) => photo.user)
  photos: FileEntity[]

  @OneToMany(() => AddChartEntiy, addChart => addChart.user)
  addCharts: AddChartEntiy[];
}
