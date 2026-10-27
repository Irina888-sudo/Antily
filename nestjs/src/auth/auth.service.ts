import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { RegisterDto } from "./ dto/register.dto";
import { ConflictException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor (@InjectRepository(User) private readonly users: Repository<User>){}
    async register(dto: RegisterDto) {
        const existing = await this.users.findOne({ where: { email: dto.email } }); 
        if (existing) throw new ConflictException('Email déjà utilisé'); 
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = this.users.create({ email : dto.email, password : passwordHash }); 
        const saved = await this.users.save(user);
        return { id: saved.id, email: saved.email };
    }
}
