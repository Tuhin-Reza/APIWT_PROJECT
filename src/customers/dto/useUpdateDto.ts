import { IsNotEmpty, MinLength, IsString, } from 'class-validator';
export class userUpdateDto {

    @IsNotEmpty({ message: "Last Name is required" })
    @IsString()
    @MinLength(3)
    firstName: string;

    @IsNotEmpty({ message: "Last Name is required" })
    @IsString()
    @MinLength(3)
    lastName: string;

    @IsNotEmpty({ message: "Contact is required" })
    contact: string;

    @IsNotEmpty({ message: "Username is required" })
    @MinLength(3)
    username: string;
}
