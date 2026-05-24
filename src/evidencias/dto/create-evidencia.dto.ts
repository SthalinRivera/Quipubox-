import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEvidenciaDto {
    @IsString()
    @IsNotEmpty()
    tipo_entidad: string;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    id_entidad: number;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsString()
    @IsOptional()
    observaciones?: string;

    constructor(tipo_entidad: string, id_entidad: number, descripcion?: string, observaciones?: string) {
        this.tipo_entidad = tipo_entidad;
        this.id_entidad = id_entidad;
        this.descripcion = descripcion;
        this.observaciones = observaciones;
    }
}