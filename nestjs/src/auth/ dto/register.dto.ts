import { IsString, MinLength } from "class-validator"


export class RegisterDto{
    @IsString()
    email?: String;

    @IsString()
    @MinLength(8)
    password!:String;


}