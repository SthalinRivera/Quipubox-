import { IsString, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class CreateSedeDto {
    @IsString()
    nombre!: string;   // ← agregar !

    @IsOptional()
    @IsIn(['origen', 'destino', 'ambos'])
    tipo_sede?: string;

    @IsOptional()
    @IsString()
    direccion?: string;

    @IsOptional()
    @IsString()
    ciudad?: string;

    @IsOptional()
    @IsString()
    departamento?: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsBoolean()
    estado?: boolean;
}