import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Header } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';



@UseGuards(JwtAuthGuard)




@Controller('member')
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @Post()
  create(@Body() dto: CreateMemberDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }


  @Get('count')
  countMember(){
    return this.service.countMember();
  }

    @Get('exists')
  exists(@Query('dateOfBirth') dateOfBirth: string) {
    return this.service.existsByBirthDate(dateOfBirth);
  }

  @Post('import')
@UseInterceptors(FileInterceptor('file'))                          // l'outil qui reçoit le fichier
importCsv(@UploadedFile() file: Express.Multer.File) {          // récupérer le fichier reçu
  if (!file) throw new BadRequestException('Fichier manquant');
  return this.service.importCsv(file.buffer.toString('utf-8'));   // octets du fichier → texte
}

  @Get('export')                                                        
@Header('Content-Type', 'text/csv')                                    
@Header('Content-Disposition', 'attachment; filename="membres.csv"')   
exportCsv() {
  return this.service.exportCsv();                                           
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

   

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

 



 
}
