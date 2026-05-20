export interface Sede {
    id_sede: number;
    nombre: string;
    tipo_sede?: string;
    direccion?: string;
    ciudad?: string;
    departamento?: string;
    telefono?: string;
    estado?: boolean;
    created_at?: Date;
}