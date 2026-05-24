import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  ParseIntPipe,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EvidenciasService } from './evidencias.service';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto';

// Definición local del tipo para evitar errores (opcional)
type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

@Controller('evidencias')
export class EvidenciasController {
  constructor(private readonly evidenciasService: EvidenciasService) { }

  // Único endpoint POST para subir archivo
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: MulterFile,
    @Body() createDto: CreateEvidenciaDto,
    @Req() req: any,
  ) {
    try {
      console.log('📥 Archivo:', file?.originalname, file?.size);
      const userId = req.user?.id_usuario ?? 1;
      console.log('👤 userId:', userId);
      let result = await this.evidenciasService.create(file, createDto, userId);

      // Serializar BigInt
      result = JSON.parse(JSON.stringify(result, (_, value) =>
        typeof value === 'bigint' ? Number(value) : value
      ));

      console.log('✅ Resultado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error completo:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  findAll() {
    return this.evidenciasService.findAll();
  }

  @Get('entity')
  findByEntity(
    @Query('tipo') tipo: string,
    @Query('idEntidad', ParseIntPipe) idEntidad: number,
  ) {
    return this.evidenciasService.findByEntity(tipo, idEntidad);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evidenciasService.findOne(BigInt(id)); // ✅ bigint
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateEvidenciaDto) {
    return this.evidenciasService.update(BigInt(id), updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evidenciasService.remove(BigInt(id));
  }
}