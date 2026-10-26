import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";

@Controller('auth')
export class AuthController {
    constructor ( private readonly service: AuthService){}

    @Post('register')
    register (@Body() dto: RegisterDto){
        return  this.service.register(dto);
    }

    
}