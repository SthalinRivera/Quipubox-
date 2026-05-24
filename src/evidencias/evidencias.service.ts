import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';

import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto';

type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

@Injectable()
export class EvidenciasService {

  constructor(
    private prisma: PrismaService,
    private r2: R2Service,
  ) { }

  // SERIALIZAR BIGINT
  private serializeBigInt(obj: any): any {

    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'bigint') {
      return Number(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item =>
        this.serializeBigInt(item),
      );
    }

    if (typeof obj === 'object') {

      const newObj: any = {};

      for (const key in obj) {
        newObj[key] =
          this.serializeBigInt(obj[key]);
      }

      return newObj;
    }

    return obj;
  }

  // CREAR EVIDENCIA
  async create(
    file: MulterFile,
    createDto: CreateEvidenciaDto,
    userId: number,
  ) {

    // OBTENER USUARIO
    const usuario =
      await this.prisma.usuarios.findUnique({
        where: {
          id_usuario: BigInt(userId),
        },
      });

    if (!usuario) {

      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    // SUBIR ARCHIVO
    const url =
      await this.r2.uploadFile(
        file,
        `evidencias/${createDto.tipo_entidad}`,
      );

    // GUARDAR EN DB
    const result =
      await this.prisma.evidencias.create({

        data: {

          id_empresa:
            usuario.id_empresa,

          tipo_entidad:
            createDto.tipo_entidad,

          id_entidad:
            BigInt(createDto.id_entidad),

          url_archivo:
            url,

          tipo_archivo:
            file.mimetype,

          descripcion:
            createDto.descripcion || null,

          subido_por:
            BigInt(userId),
        },

        include: {
          usuarios: true,
          empresas: true,
        },
      });

    return this.serializeBigInt(result);
  }

  // LISTAR TODO
  async findAll() {

    const results =
      await this.prisma.evidencias.findMany({

        include: {
          usuarios: true,
          empresas: true,
        },

        orderBy: {
          created_at: 'desc',
        },
      });

    return this.serializeBigInt(results);
  }

  // BUSCAR POR ID
  async findOne(id: bigint) {

    const evidencia =
      await this.prisma.evidencias.findUnique({

        where: {
          id_evidencia: id,
        },

        include: {
          usuarios: true,
          empresas: true,
        },
      });

    if (!evidencia) {

      throw new NotFoundException(
        'Evidencia no encontrada',
      );
    }

    return this.serializeBigInt(evidencia);
  }

  // ACTUALIZAR
  async update(
    id: bigint,
    updateDto: UpdateEvidenciaDto,
  ) {

    // VALIDAR EXISTENCIA
    await this.findOne(id);

    const result =
      await this.prisma.evidencias.update({

        where: {
          id_evidencia: id,
        },

        data: {

          descripcion:
            updateDto.descripcion,

          tipo_entidad:
            updateDto.tipo_entidad,

          id_entidad:
            updateDto.id_entidad
              ? BigInt(updateDto.id_entidad)
              : undefined,
        },

        include: {
          usuarios: true,
          empresas: true,
        },
      });

    return this.serializeBigInt(result);
  }

  // ELIMINAR
  async remove(id: bigint) {

    const evidencia =
      await this.prisma.evidencias.findUnique({

        where: {
          id_evidencia: id,
        },
      });

    if (!evidencia) {

      throw new NotFoundException(
        'Evidencia no encontrada',
      );
    }

    // ELIMINAR ARCHIVO R2
    await this.r2.deleteFile(
      evidencia.url_archivo,
    );

    // ELIMINAR DB
    const result =
      await this.prisma.evidencias.delete({

        where: {
          id_evidencia: id,
        },
      });

    return this.serializeBigInt(result);
  }

  // BUSCAR POR ENTIDAD
  async findByEntity(
    tipo: string,
    idEntidad: number,
  ) {

    const results =
      await this.prisma.evidencias.findMany({

        where: {

          tipo_entidad:
            tipo,

          id_entidad:
            BigInt(idEntidad),
        },

        include: {
          usuarios: true,
          empresas: true,
        },

        orderBy: {
          created_at: 'desc',
        },
      });

    return this.serializeBigInt(results);
  }
}