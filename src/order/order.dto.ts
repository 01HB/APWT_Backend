import { IsNotEmpty, IsString, IsOptional, IsNumber, Matches } from "class-validator";

export class OrderDto {

    @IsString()
    @IsOptional()
    o_status: string;

    @IsString()
    @IsOptional()
    payment_status: string;

    @IsString()
    @IsNotEmpty({message: "address is required"})
    o_address: string;
    

}

export class PaymentDto {

    @Matches(/^(?:cash on delivery|card|mfs)$/ig, {message: "payment methods can only be \'cash on delivery\' or, \'card\' or, \'mfs\'."})
    @IsString({message: "invalid input for payment method"})
    @IsNotEmpty({message: "select a payment method first"})
    payment_method: string;

}