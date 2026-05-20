import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async findOrCreateUser(googleUser: any) {
        let user = await this.prisma.usuarios.findUnique({
            where: { email: googleUser.email },
        });

        if (!user) {
            // Buscar rol y sede por defecto
            const defaultRol = await this.prisma.roles_usuarios.findFirst();
            const defaultSede = await this.prisma.sedes.findFirst();

            if (!defaultRol || !defaultSede) {
                throw new Error('Faltan datos iniciales: roles_usuarios o sedes');
            }

            // Crear nuevo usuario con datos de Google
            user = await this.prisma.usuarios.create({
                data: {
                    email: googleUser.email,
                    nombres: googleUser.firstName,
                    apellidos: googleUser.lastName,
                    google_id: googleUser.googleId,
                    avatar_url: googleUser.picture,
                    id_rol_usuario: defaultRol.id_rol_usuario,
                    id_sede: defaultSede.id_sede,
                    estado_acceso: 'activo', // Por defecto activo
                },
            });
        } else {
            // Si ya existe, actualizamos sus datos de Google (por si cambió foto o nombre)
            user = await this.prisma.usuarios.update({
                where: { id_usuario: user.id_usuario },
                data: {
                    google_id: googleUser.googleId,
                    avatar_url: googleUser.picture,
                    nombres: googleUser.firstName,
                    apellidos: googleUser.lastName,
                },
            });
        }

        // Verificar si el usuario está habilitado para acceder
        if (user.estado_acceso !== 'activo') {
            throw new UnauthorizedException(
                `Usuario ${user.estado_acceso}. Contacta al administrador.`
            );
        }

        return user;
    }

    async login(user: any) {
        const payload = { sub: user.id_usuario, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id_usuario,
                nombres: user.nombres,
                apellidos: user.apellidos,
                email: user.email,
                avatar_url: user.avatar_url,
                estado_acceso: user.estado_acceso,
            },
        };
    }

    async getProfile(userId: number) {
        const user = await this.prisma.usuarios.findUnique({
            where: { id_usuario: userId },
            select: {
                id_usuario: true,
                email: true,
                nombres: true,
                apellidos: true,
                avatar_url: true,
                estado_acceso: true,
                id_rol_usuario: true,
                id_sede: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        return {
            id: user.id_usuario,
            email: user.email,
            nombres: user.nombres,
            apellidos: user.apellidos,
            avatar_url: user.avatar_url,
            estado_acceso: user.estado_acceso,
            id_rol_usuario: user.id_rol_usuario,
            id_sede: user.id_sede,
        };
    }
}