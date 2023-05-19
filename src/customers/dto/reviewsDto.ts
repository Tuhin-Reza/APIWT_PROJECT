import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateReviewDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(['good', 'best', 'poor'])
    rating: string;

    @IsNotEmpty()
    @IsString()
    comment: string;
}
