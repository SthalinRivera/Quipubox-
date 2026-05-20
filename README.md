# API REST - Sistema Logístico de Frutas

## Base URL: `http://localhost:3000/api` (ejemplo)

## Autenticación
La mayoría de endpoints requieren el token JWT enviado en el header:  
`Authorization: Bearer <access_token>`

| Módulo | Endpoint | Métodos | Descripción |
|--------|----------|---------|-------------|
| **Auth** | `/auth/google` | GET | Redirige a la pantalla de autenticación de Google |
| | `/auth/google/callback` | GET | Callback de Google, retorna `access_token` y datos del usuario |
| | `/auth/profile` | GET | Obtiene el perfil del usuario autenticado |
| **Sedes** | `/sedes` | GET, POST, PATCH, DELETE | CRUD de sedes (origen/destino) |
| **Roles Usuario** | `/roles-usuarios` | GET, POST, PATCH, DELETE | CRUD de roles (administrador, repartidor, etc.) |
| **Usuarios** | `/usuarios` | GET, POST, PATCH, DELETE | CRUD de empleados/usuarios del sistema |
| **Roles Cliente** | `/roles-clientes` | GET, POST, PATCH, DELETE | CRUD de roles de cliente (emisor, receptor, ambos) |
| **Clientes** | `/clientes` | GET, POST, PATCH, DELETE | CRUD de clientes (personas o empresas) |
| **Cliente‑Sede** | `/cliente-sede` | GET, POST, PATCH, DELETE | Asigna clientes a sedes con rol y fechas |
| **Mercados** | `/mercados` | GET, POST, PATCH, DELETE | CRUD de mercados (Mayorista, Modelo, etc.) |
| **Puestos** | `/puestos` | GET, POST, PATCH, DELETE | CRUD de puestos dentro de un mercado |
| **Puesto Secciones** | `/puestos/:id/secciones` | GET, POST, PATCH, DELETE | CRUD de secciones/subpuestos |
| **Frutas** | `/frutas` | GET, POST, PATCH, DELETE | CRUD de catálogo de frutas (uva, pera, etc.) |
| **Variedades** | `/variedades` | GET, POST, PATCH, DELETE | CRUD de variedades de fruta (Italia, sin pepa, etc.) |
| **Calidades** | `/calidades` | GET, POST, PATCH, DELETE | CRUD de calidades (I, II, Mayorista, etc.) |
| **Tipos de Jaba** | `/tipos-jaba` | GET, POST, PATCH, DELETE | CRUD de tipos de jaba (batea, plástico, etc.) |
| **Camiones** | `/camiones` | GET, POST, PATCH, DELETE | CRUD de camiones (placa, marca, tipo propiedad) |
| **Operaciones Carga** | `/operaciones-carga` | GET, POST, PATCH, DELETE | CRUD de operaciones de carga (salida de camión) |
| **Detalle Carga** | `/operaciones/:id/detalle` | GET, POST, PATCH, DELETE | Lotes de fruta cargados por cliente emisor |
| **Instrucciones Reparto** | `/instrucciones-reparto` | GET, POST, PATCH, DELETE | Instrucciones enviadas por emisor (foto/WhatsApp) |
| **Items Reparto** | `/items-reparto` | GET, POST, PATCH, DELETE | Desglose de destinos por lote de carga |
| **Guías Operativas** | `/guias-operativas` | GET, POST, PATCH, DELETE | Documentos internos para respaldar entregas |
| **Entregas** | `/entregas` | GET, POST, PATCH, DELETE | Registro de recepción por cliente receptor |
| **Cobros Flete** | `/cobros-flete` | GET, POST, PATCH, DELETE | Cobros asociados a entregas |
| **Vales Retorno** | `/vales-retorno` | GET, POST, PATCH, DELETE | Vales de devolución de jabas |
| **Movimientos Jabas** | `/movimientos-jabas` | GET, POST, PATCH, DELETE | Trazabilidad de movimientos de jabas |
| **Inventario Jabas** | `/inventario-jabas` | GET, POST, PATCH, DELETE | Control de jabas plásticas por cliente |
| **Reclamos** | `/reclamos` | GET, POST, PATCH, DELETE | Gestión de reclamos de clientes |
| **Incidencias** | `/incidencias` | GET, POST, PATCH, DELETE | Registro de incidencias operativas |
| **Evidencias** | `/evidencias` | GET, POST, DELETE | Subida y consulta de fotos/documentos adjuntos |
| **Gastos Operación** | `/gastos-operacion` | GET, POST, PATCH, DELETE | Gastos por viaje (combustible, peajes, etc.) |
| **Pagos Empleados** | `/pagos-empleados` | GET, POST, PATCH, DELETE | Pagos a trabajadores |
| **Series Comprobantes** | `/series-comprobantes` | GET, POST, PATCH, DELETE | Series de facturación (F001, B001, etc.) |
| **Facturas** | `/facturas` | GET, POST, PATCH, DELETE | Emisión de facturas/boletas/notas electrónicas |
| **Guías Remisión** | `/guias-remision` | GET, POST, PATCH, DELETE | Guías de remisión para transporte |
| **Reportes** | `/reportes` | GET | Genera reportes (entregas, cobros, jabas, etc.) |
| **Dashboard** | `/dashboard` | GET | Métricas y resúmenes (cantidades, ingresos) |

## Ejemplo de petición autenticada

```bash
curl -X GET http://localhost:3000/api/clientes \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."