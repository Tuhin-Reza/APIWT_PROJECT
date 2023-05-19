import { IsNotEmpty, IsEmail, MinLength, IsString, IsOptional } from 'class-validator';
import { AddChartEntiy } from '../entity/addChart';
import { FileEntity } from '../entity/fileEntity';
import { AddressEntity } from '../entity/addressEntity';

export class SignInDto {
    id: number;

    @IsNotEmpty({ message: "Email is required" })
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: "Password is required" })
    @IsString()
    @MinLength(3)
    password: string;

    photos: FileEntity[];

    addCharts: AddChartEntiy[];

    addressEntity: AddressEntity;
}
