import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany, OneToOne } from 'typeorm';
import { AddChartEntiy } from './addChart';
import { FileEntity } from './fileEntity';
import { AddressEntity } from './addressEntity';

@Entity('user')
@Unique(["email"])
@Unique(["password"])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  contact: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => FileEntity, (photo) => photo.user)
  photos: FileEntity[]

  @OneToMany(() => AddChartEntiy, addChart => addChart.user)
  addCharts: AddChartEntiy[];

  @OneToOne(() => AddressEntity, (addressEntity) => addressEntity.user) // specify inverse side as a second parameter
  addressEntity: AddressEntity;
}
