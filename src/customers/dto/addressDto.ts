import { IsNotEmpty, IsString, IsInt, IsNumberString } from 'class-validator';

export class AddressDTO {
    @IsNotEmpty({ message: 'Street cannot be empty' })
    @IsString({ message: 'Street must be a string' })
    street: string;

    @IsNotEmpty({ message: 'City cannot be empty' })
    @IsString({ message: 'City must be a string' })
    city: string;

    @IsNotEmpty({ message: 'State cannot be empty' })
    @IsString({ message: 'State must be a string' })
    state: string;

    @IsNotEmpty({ message: 'Country cannot be empty' })
    @IsString({ message: 'Country must be a string' })
    country: string;

    // @IsNotEmpty({ message: 'User ID cannot be empty' })
    // @IsInt({ message: 'User ID must be an integer' })
    // userId: number;
}
