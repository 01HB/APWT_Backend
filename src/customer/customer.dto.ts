import { SignUpDto, LoginDto } from "src/dto/common.dto";
import { IsNotEmpty, IsString, Matches, IsEmail, IsOptional, Length, ValidateIf } from "class-validator";

export class CustomerSignUpDto extends SignUpDto {}

export class CustomerLoginDto extends LoginDto {}

export class CustomerUpdateInfoDto {

    @Matches(/^[A-Z][a-zA-Z]*(?:\s[a-zA-Z]*)*$/, {message: "first character must be capital & only alphabets & spaces are allowed"})
    @IsString()
    @IsOptional()
    name:string;
    
    @IsEmail({}, {message: "provide a valid email address"})
    @IsOptional()
    email:string;
    
    @Matches(/^(\+880|0)(1[3-9]\d{8})$/, {message: "invalid Bangladeshi number"})
    @IsString()
    @IsOptional()
    contact:string;

    @Matches(/^(?:male|female)$/ig, {message: "gender can only be \'male\' or \'female\'"})
    @IsString()
    @IsOptional()
    gender:string;
    
    @IsString()
    @IsOptional()
    address:string;

    @IsString()
    @IsOptional()
    photo:string;

}

export class CustomerChangePassDto {

    @Length(8, 20, {message: "password must be 8-20 characters long"})
    @IsString()
    @IsNotEmpty({message: "type your current password"})
    password:string;

    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!.@#$%^&*+-_?<>])[a-zA-Z\d~!.@#$%^&*+-_?<>]{8,20}$/, { message: 'password must contain at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character and must be 8-20 characters long' })
    @IsString()
    @IsNotEmpty({message: "type a new password"})
    new_password:string;

    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!.@#$%^&*+-_?<>])[a-zA-Z\d~!.@#$%^&*+-_?<>]{8,20}$/, { message: 're-typed password is incorrect' })
    @IsString()
    @IsNotEmpty({message: "re-type new password to confirm"})
    confirm_password:string;

}

export class CustomerMailDto {

    @IsString()
    @IsNotEmpty({ message: "provide your name" })
    s_name: string;

    @IsEmail({}, { message: "invalid email" })
    @IsNotEmpty({ message: "your email address is required" })
    s_email: string;

    @IsString()
    @IsNotEmpty({ message: "subject of the message is required" })
    subject: string;

    @IsString()
    @IsNotEmpty({ message: "An empty message cannot be sent" })
    message: string;

}
