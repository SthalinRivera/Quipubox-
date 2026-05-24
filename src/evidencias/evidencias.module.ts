import { Module } from '@nestjs/common';
import { EvidenciasController } from './evidencias.controller';
import { EvidenciasService } from './evidencias.service';
import { R2Module } from '../r2/r2.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [R2Module, PrismaModule],
  controllers: [EvidenciasController],
  providers: [EvidenciasService],
})
export class EvidenciasModule { }