import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
    id: number;
    @IsNotEmpty({ message: "Password is required" })
    @IsString()
    @MinLength(3)
    password: string;
}