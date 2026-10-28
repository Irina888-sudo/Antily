import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";



@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const header = req.headers.authorization;         
    if (!header) throw new UnauthorizedException('Token manquant');
    const token = header.split(' ')[1];   
    try {
      req.user = await this.jwt.verifyAsync(token);  
      return true;
    } catch {
      throw new UnauthorizedException('Token invalide');
    }
  }
}


