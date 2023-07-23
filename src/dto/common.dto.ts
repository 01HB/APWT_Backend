import { IsEmail, IsNotEmpty, IsString, IsOptional, Matches, IsMimeType, IsDateString } from 'class-validator';

export class SignUpDto {
    
    @Matches(/^[A-Z][a-zA-Z]*(?:\s[a-zA-Z]*)*$/, {message: "first character must be capital & only alphabets & spaces are allowed"})
    @IsString()
    @IsNotEmpty({message: "name is required"})
    name:string;
    
    @IsEmail({}, {message: "provide a valid email address"})
    @IsNotEmpty({message: "email is required"})
    email:string;
    
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!.@#$%^&*+-_?<>])[a-zA-Z\d~!.@#$%^&*+-_?<>]{8,20}$/, { message: 'password must contain at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character and must be 8-20 characters long' })
    @IsString()
    @IsNotEmpty({message: "password is required"})
    password:string;

    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!.@#$%^&*+-_?<>])[a-zA-Z\d~!.@#$%^&*+-_?<>]{8,20}$/, { message: 're-typed password is incorrect' })
    @IsString()
    @IsNotEmpty({message: "re-type password to confirm"})
    confirm_password:string;
    
    @Matches(/^(\+880|0)(1[3-9]\d{8})$/, {message: "invalid Bangladeshi number"})
    @IsString()
    @IsNotEmpty({message: "contact no is required"})
    contact:string;

    @Matches(/^(?:male|female)$/ig, {message: "gender can only be \'male\' or \'female\'"})
    @IsString()
    @IsNotEmpty({message: "gender is required"})
    gender:string;
    
}


export class LoginDto {

    @IsEmail({}, { message: 'provide a valid email address' })
    @IsNotEmpty({ message: 'email is required' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'password is required' })
    password: string;
}
