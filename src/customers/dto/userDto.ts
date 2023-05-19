import { IsNotEmpty, IsEmail, MinLength, IsString, IsOptional } from 'class-validator';
import { AddChartEntiy } from '../entity/addChart';
import { FileEntity } from '../entity/fileEntity';
import { AddressEntity } from '../entity/addressEntity';

export class UserDto {
    id: number;

    @IsNotEmpty({ message: "First Name is required" })
    @IsString()
    @MinLength(3)
    firstName: string;

    @IsNotEmpty({ message: "Last Name is required" })
    @IsString()
    @MinLength(3)
    lastName: string;

    @IsString()
    @IsNotEmpty({ message: "Contact is required" })
    contact: string;

    @IsNotEmpty({ message: "Email is required" })
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: "Username is required" })
    username: string;

    @IsNotEmpty({ message: "Password is required" })
    @IsString()
    @MinLength(3)
    password: string;

    photos: FileEntity[];

    addCharts: AddChartEntiy[];

    addressEntity: AddressEntity;
}
