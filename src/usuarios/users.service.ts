import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) { }

    // GET ALL
    findAll() {
        return this.prisma.usuarios.findMany();
    }

    // GET BY ID
    findOne(id: number) {
        return this.prisma.usuarios.findUnique({
            where: { id_usuario: BigInt(id) },
        });
    }

    // CREATE
    create(data: any) {
        return this.prisma.usuarios.create({
            data,
        });
    }

    // UPDATE
    update(id: number, data: any) {
        return this.prisma.usuarios.update({
            where: { id_usuario: BigInt(id) },
            data,
        });
    }

    // DELETE
    remove(id: number) {
        return this.prisma.usuarios.delete({
            where: { id_usuario: BigInt(id) },
        });
    }
}