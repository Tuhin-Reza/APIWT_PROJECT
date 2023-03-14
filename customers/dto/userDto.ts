import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';

export class UserDto {

    id: number;

    @IsNotEmpty({ message: "Email is required" })
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: "Password is required" })
    @IsString()
    @MinLength(3)
    password: string;
}
