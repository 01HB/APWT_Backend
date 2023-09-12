import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEmail, Matches } from "class-validator";

export class OrderDto {

    @IsString()
    @IsEmail({}, {message: "invalid email address"})
    @IsNotEmpty({message: "email is required"})
    o_email: string;

    @IsString()
    @IsNotEmpty({message: "contact is required"})
    o_contact: string;

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