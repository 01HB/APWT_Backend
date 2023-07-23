import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";

export class ProductDto {
    
    @IsString()
    @IsNotEmpty()
    p_name: string;
    
    @IsNumber()
    @IsNotEmpty()
    p_price: number;
    
    @IsString()
    @IsNotEmpty()
    p_description: string;
    
    @IsString({message: 'Image url must be a string'})
    @IsOptional()
    p_image: string;
    
    @IsString()
    @IsNotEmpty()
    p_category: string;
    
    @IsNumber()
    @IsNotEmpty()
    p_stock: number;

}

export class UpdateProductDto extends PartialType(ProductDto) {}