import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly repository: Repository<Member>,
  ) {}

  create(dto: CreateMemberDto) {
    const entity = this.repository.create(dto as Partial<Member>);
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find({ relations: ['memberships'] });
  }

  async findOne(id: string | number) {
    const entity = await this.repository.findOne({ where: { id } as any, relations: ['memberships'] });
    if (!entity) throw new NotFoundException(`Member ${id} introuvable`);
    return entity;
  }

  async update(id: string | number, dto: UpdateMemberDto) {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: string | number) {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
    return entity;
  }

    async existsByBirthDate(dateOfBirth: string) {
    const count = await this.repository.count({ where: { dateOfBirth } as any });
    return { exists: count > 0 };
  }

  async exportCsv(){
    const members = await this.repository.find();
  const header = 'name,firstname,dateOfBirth,email,phone';
  const lines = members.map((m) =>
    [m.name, m.firstname, m.dateOfBirth, m.email, m.phone]
      .map((v) => `"${v ?? ''}"`)
      .join(','),
  );
  return [header, ...lines].join('\n');
  }
  
  async importCsv(content: string) {
  const lines = content.split('\n').map((l) => l.trim());   // couper en lignes, enlever \r et espaces
  const rows = lines.slice(1).filter((l) => l !== '');      // ignorer le header et les lignes vides
  let imported = 0;
  let skipped = 0;
  for (const row of rows) {
    const [name, firstname, dateOfBirth, email, phone] =    // ← la 3e case a enfin un nom
      row.split(',').map((v) => v.slice(1, -1));            // couper par virgule, enlever les guillemets
    const existing = await this.repository.findOne({ where: { email } });
    if (existing) {
      skipped++;                                            // déjà en base : on saute
    } else {
      const birthDate = dateOfBirth === "" ? undefined : dateOfBirth;  // date vide → "rien"
      const member = this.repository.create({ name, firstname, dateOfBirth: birthDate, email, phone });
      await this.repository.save(member);                   // INSERT
      imported++;
    }
  }
  return { imported, skipped };                             // APRÈS la boucle
}

}
