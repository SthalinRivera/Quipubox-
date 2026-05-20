import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';

@Injectable()
export class SedesService {
  constructor(private prisma: PrismaService) {}

  create(createSedeDto: CreateSedeDto) {
    return this.prisma.sedes.create({
      data: createSedeDto,
    });
  }

  findAll() {
    return this.prisma.sedes.findMany({
      where: { estado: true },
      orderBy: { nombre: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.sedes.findUnique({
      where: { id_sede: id },
    });
  }

  update(id: number, updateSedeDto: UpdateSedeDto) {
    return this.prisma.sedes.update({
      where: { id_sede: id },
      data: updateSedeDto,
    });
  }

  remove(id: number) {
    // Borrado lógico: cambia estado a false
    return this.prisma.sedes.update({
      where: { id_sede: id },
      data: { estado: false },
    });
  }
}