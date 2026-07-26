# RuralGo - Enlaces de Vistas y Credenciales de Acceso

## URLs del Frontend (http://localhost:5173)

### Módulo Público

| Vista | URL | Descripción |
|-------|-----|-------------|
| Inicio | http://localhost:5173/ | Mapa con conductores disponibles |

### Módulo Conductor

| Vista | URL | Descripción |
|-------|-----|-------------|
| Login | http://localhost:5173/conductor/login | Ingreso de conductores |
| Dashboard | http://localhost:5173/conductor/dashboard | Panel del conductor |
| Vehículos | http://localhost:5173/conductor/vehiculos | Cambiar vehículo activo |
| Servicio | http://localhost:5173/conductor/servicio | Registrar/finalizar servicio |
| Historial | http://localhost:5173/conductor/historial | Histórico de servicios |

### Módulo Administrador

| Vista | URL | Descripción |
|-------|-----|-------------|
| Login | http://localhost:5173/admin/login | Ingreso administración |
| Dashboard | http://localhost:5173/admin/dashboard | Estadísticas generales |
| Conductores | http://localhost:5173/admin/conductores | Gestión de conductores |
| Vehículos | http://localhost:5173/admin/vehiculos | Gestión de vehículos |
| Reportes | http://localhost:5173/admin/reportes | Consulta de reportes |

---

## URLs del Backend (http://localhost:3000)

| Servicio | URL |
|----------|-----|
| Health Check | http://localhost:3000/api/health |
| Swagger Docs | http://localhost:3000/api/docs |
| Swagger JSON | http://localhost:3000/api/docs.json |

---

## Credenciales de Acceso

### Administrador

| Campo | Valor |
|-------|-------|
| Email | admin@ruralgo.com |
| Contraseña | admin123 |
| Ruta de ingreso | http://localhost:5173/admin/login |

### Conductor 1 (Juan Pérez)

| Campo | Valor |
|-------|-------|
| Email | juan@ruralgo.com |
| Contraseña | conductor123 |
| Ruta de ingreso | http://localhost:5173/conductor/login |
| Vehículos | ABC123 (Yamaha XTZ - Activo), XYZ456 (Honda CB160) |

### Conductor 2 (Pedro Gómez)

| Campo | Valor |
|-------|-------|
| Email | pedro@ruralgo.com |
| Contraseña | conductor123 |
| Ruta de ingreso | http://localhost:5173/conductor/login |
| Vehículo | KLM789 (Suzuki AX100 - Activo) |

### Conductor 3 (Carlos López)

| Campo | Valor |
|-------|-------|
| Email | carlos@ruralgo.com |
| Contraseña | conductor123 |
| Ruta de ingreso | http://localhost:5173/conductor/login |
| Vehículo | DEF321 (Bajaj Pulsar - Activo, No disponible) |

---

## Flujo de Prueba Rápida

1. Abrir http://localhost:5173/ → Ver mapa con 2 conductores
2. Ir a http://localhost:5173/admin/login → Login con admin@ruralgo.com
3. Gestionar conductores y vehículos
4. Ir a http://localhost:5173/conductor/login → Login con juan@ruralgo.com
5. Activar disponibilidad → Registrar servicio → Finalizar
6. Ver historial en http://localhost:5173/conductor/historial
7. Ver reportes en http://localhost:5173/admin/reportes
8. Verificar documentación API en http://localhost:3000/api/docs
