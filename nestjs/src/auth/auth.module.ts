import { Module } from '@nestjs/common';    
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';



@Module({
    imports: [TypeOrmModule.forFeature([User]),
     JwtModule.registerAsync({  
 inject: [ConfigService],
           useFactory: (config: ConfigService) => ({  
               secret:  config.get<string>('JWT_SECRET') ,
               signOptions: { expiresIn: '1h' },
         }),
        }),
    ] ,         
        controllers:[AuthController],
        providers:[AuthService],
        exports: [AuthService,JwtModule],

    
})


export class AuthModule{}