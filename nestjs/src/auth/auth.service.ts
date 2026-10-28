import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { RegisterDto } from "./ dto/register.dto";
import { ConflictException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "./ dto/login.dto";
import { IsStrongPassword } from "class-validator";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";



@Injectable()
export class AuthService {
    constructor (@InjectRepository(User) private readonly users: Repository<User>, 
    private readonly jwt: JwtService,){}
    async register(dto: RegisterDto) {
        const existing = await this.users.findOne({ where: { email: dto.email } }); 
        if (existing) throw new ConflictException('Email déjà utilisé'); 
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = this.users.create({ email : dto.email, password : passwordHash }); 
        const saved = await this.users.save(user);
        return { id: saved.id, email: saved.email };
    }

    async login (dto:LoginDto) {
        const user = await this.users.findOne({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException ('Identifiants invalides');
        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok) {
            throw new UnauthorizedException('Identifiants invalides');
        }
        const payload = { sub: user.id, email: user.email };
                  
        return { access_token: await this.jwt.signAsync(payload) };     
       
    }
}
