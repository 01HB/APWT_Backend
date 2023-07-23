import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class WishlistItemDto {

    @IsNumber()
    @IsNotEmpty()
    wi_product_id: number;

    @IsString()
    @IsNotEmpty()
    wi_name: string;

    @IsNumber()
    @IsNotEmpty()
    wi_price: number;

    @IsString()
    @IsNotEmpty()
    wi_description: string;

    @IsString()
    @IsOptional()
    wi_image: string;
}