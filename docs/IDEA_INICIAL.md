Arquitectura de la aplicación

Tendremos tres módulos principales.

                RuralGo

                    │
        ┌───────────┼───────────┐
        │           │           │
    Público     Conductor   Administrador
1. Módulo Público

Objetivo: Permitir que cualquier usuario consulte los mototaxistas disponibles sin necesidad de registrarse.

Ruta:

/
Vista Inicio

Es la única vista pública.

Encabezado
LOGO RuralGo

No tendrá menú.

En la parte inferior del sitio únicamente aparecerá:

¿Eres conductor?

que dirige a:

/conductor/login
Contenido

La mayor parte de la pantalla será el mapa.

──────────────────────────

        MAPA

 Usuario

   🏍

      🏍

          🏍

──────────────────────────

El mapa mostrará:

Posición actual del usuario.
Conductores disponibles.
Estado del conductor.

No mostrará rutas.

No mostrará recorridos.

Solo una ubicación aproximada.

Selección del conductor

Cuando el usuario pulse un marcador.

Debajo del mapa aparecerá una tarjeta.

────────────────────────────

Juan Pérez

Moto:
Yamaha XTZ

Placa:
ABC123

Estado:
Disponible

📞 Llamar

WhatsApp

────────────────────────────

El usuario se comunica directamente con el conductor.

No existe solicitud dentro de la plataforma.

Flujo
Abrir página

↓

Permitir ubicación

↓

Ver conductores cercanos

↓

Seleccionar conductor

↓

Consultar información

↓

Contactar por llamada o WhatsApp
2. Módulo Conductor

Ruta

/conductor/login
Vista Login

Muy sencilla.

Logo

Cédula

Contraseña

Ingresar
Dashboard

Después del login.

──────────────────────────

LOGO

Foto

──────────────────────────

Nombre

Estado

Disponible

ON / OFF

──────────────────────────

Vehículo Activo

ABC123

Yamaha

[Cambiar vehículo]

──────────────────────────

Registrar Servicio

──────────────────────────
Cambiar Vehículo

Nueva vista.

Ruta

/conductor/vehiculos
Contenido
Vehículos

ABC123

ACTIVO

────────────

XYZ456

[Seleccionar]

────────────

KLM852

[Seleccionar]

Cuando selecciona uno.

El anterior pasa automáticamente a inactivo.

Registrar Servicio

Formulario.

Tipo Servicio

○ Pasajero

○ Encomienda

○ Diligencia

○ Mixto

Destino

Precio

[Iniciar Servicio]

Al iniciar.

El sistema obtiene automáticamente:

Ubicación GPS

↓

Latitud

Longitud

↓

Geocodificación

↓

Nombre del lugar

Todo queda almacenado.

Servicio en curso

Después de iniciar.

──────────────────────

Servicio Activo

Destino

Centro

Precio

$8.000

Hora Inicio

10:20

──────────────────────

Finalizar

Cancelar
Historial

Ruta

/conductor/historial

Tabla.

Fecha

Origen

Destino

Precio

Estado
Flujo completo
Login

↓

Activar disponibilidad

↓

Seleccionar vehículo activo

↓

Registrar servicio

↓

Iniciar

↓

Finalizar

↓

Disponible nuevamente
3. Módulo Administrador

Ruta

/admin/login
Login

Igual al conductor.

Dashboard
──────────────────────────

Conductores

Vehículos

Reportes

──────────────────────────

Conductores

Disponibles

Servicios Hoy

Servicios Mes

──────────────────────────
Gestión Conductores

Ruta

/admin/conductores
Vista
────────────────────────────

Registrar Conductor

────────────────────────────

Tabla

Nombre

Cédula

Teléfono

Estado

Editar

Inhabilitar
Registrar conductor

Formulario.

Nombre

Cédula

Teléfono

Correo

Contraseña

Guardar
Gestión Vehículos

Ruta

/admin/vehiculos
Vista
────────────────────────────

Registrar Vehículo

────────────────────────────

Tabla

Placa

Conductor

Estado

Editar
Registro
Conductor

▼

Juan

Pedro

Carlos

────────────

Placa

Marca

Modelo

Color

SOAT

Fecha

Licencia

Fecha

Guardar
Reportes

Ruta

/admin/reportes

Aquí aprovecharás la tabla servicios.

Podrás consultar:

Servicios por conductor

Servicios por vehículo

Servicios por tipo

Servicios por fecha

Ingresos

Servicios cancelados

Incluso podrías agregar filtros por rango de fechas.

Flujo Administrador
Login

↓

Dashboard

↓

Gestionar Conductores

↓

Registrar / Editar

↓

Gestionar Vehículos

↓

Registrar / Editar

↓

Consultar Reportes
Flujo general del sistema
                 Usuario

                     │

                     ▼

          Consulta conductores

                     │

                     ▼

         Llama o escribe WhatsApp

                     │

                     ▼

              Conductor recibe

                     │

                     ▼

          Se dirige al origen

                     │

                     ▼

        Registra servicio en RuralGo

                     │

                     ▼

        Inicia recorrido

                     │

                     ▼

        Finaliza recorrido

                     │

                     ▼

     Servicio almacenado en BD

                     │

                     ▼

Administrador consulta reportes
Mi recomendación antes de comenzar el desarrollo

Con la cantidad de vistas que ya tienes definidas, estructuraría el proyecto en Vue por módulos desde el inicio, por ejemplo:

src/
├── modules/
│   ├── public/
│   ├── conductor/
│   └── admin/
├── components/
├── layouts/
├── router/
├── services/
├── stores/
└── assets/

Esta organización coincide con la arquitectura funcional del sistema, facilita el mantenimiento y hace que el proyecto se vea mucho más profesional tanto en el desarrollo como durante la sustentación.



DB

// RuralGo - Modelo de Base de Datos
// https://dbdiagram.io

Table usuarios {
  id bigint [pk, increment]

  nombre varchar(150)
  cedula varchar(20) [unique]
  telefono varchar(20)
  email varchar(150) [unique]
  password varchar(255)
  foto varchar(255)

  rol varchar(20)
  activo boolean

  created_at timestamp
  updated_at timestamp
}

Table conductores {
  id bigint [pk, increment]

  usuario_id bigint [not null]

  disponible boolean

  created_at timestamp
  updated_at timestamp
}

Table vehiculos {
  id bigint [pk, increment]

  conductor_id bigint [not null]

  placa varchar(10) [unique]
  marca varchar(100)
  modelo varchar(100)
  color varchar(50)

  licencia_verificada boolean
  licencia_vencimiento date

  soat_verificado boolean
  soat_vencimiento date

  activo boolean

  created_at timestamp
  updated_at timestamp
}

Table ubicaciones {
  id bigint [pk, increment]

  conductor_id bigint [not null, unique]

  latitud decimal
  longitud decimal

  precision_metros decimal

  ultima_actualizacion datetime

  created_at timestamp
  updated_at timestamp
}

Table tipos_servicio {
  id bigint [pk, increment]

  nombre varchar(100)
  descripcion varchar(255)

  created_at timestamp
  updated_at timestamp
}

Table servicios {
  id bigint [pk, increment]

  vehiculo_id bigint [not null]

  tipo_servicio_id bigint [not null]

  origen_nombre varchar(255)

  origen_latitud decimal
  origen_longitud decimal

  destino_texto varchar(255)

  precio decimal

  estado varchar(20)

  hora_inicio datetime
  hora_fin datetime

  created_at timestamp
  updated_at timestamp
}

Ref: conductores.usuario_id > usuarios.id

Ref: vehiculos.conductor_id > conductores.id

Ref: ubicaciones.conductor_id > conductores.id

Ref: servicios.vehiculo_id > vehiculos.id

Ref: servicios.tipo_servicio_id > tipos_servicio.id



FASES

Fases de Desarrollo
Fase 1: Configuración Base
1. Inicializar proyecto frontend/ con Vue 3 + Vite
2. Inicializar proyecto backend/ con Express
3. Configurar PostgreSQL local + crear BD ruralgo
4. Configurar Sequelize ORM + migraciones
5. Variables de entorno (.env)
Fase 2: Backend - Modelos y Auth
 6. Modelo usuarios + conductores (con relaciones)
 7. Modelo vehiculos, ubicaciones, tipos_servicio, servicios
 8. Endpoints de auth: POST /api/auth/login, POST /api/auth/register
 9. Middleware de JWT para proteger rutas
10. Seeders: usuario admin + conductor de prueba
Fase 3: Backend - API Completa
11. CRUD Conductores (admin)
12. CRUD Vehículos (admin)
13. Endpoints conductor: actualizar ubicación, cambiar disponibilidad, registrar servicio, historial
14. Endpoints reportes (admin): servicios por conductor/vehículo/fecha/ingresos
15. Endpoint público: obtener conductores disponibles + ubicación
Fase 4: Frontend - Estructura y Auth
16. Router con 3 módulos (público, conductor, admin)
17. Layouts: pública, conductor, admin
18. Stores Pinia: auth, conductores, vehículos, servicios
19. Servicio axios con interceptor JWT
20. Vistas de login (conductor + admin)
Fase 5: Frontend - Módulo Público
21. Vista inicio con mapa Leaflet (ubicación usuario)
22. Marcadores de conductores disponibles
23. Tarjeta info del conductor al hacer clic
24. Botones llamada/WhatsApp
Fase 6: Frontend - Módulo Conductor
25. Dashboard: estado, vehículo activo, toggle ON/OFF
26. Vista cambiar vehículo
27. Formulario registrar servicio
28. Vista servicio en curso
29. Historial de servicios (tabla)
Fase 7: Frontend - Módulo Admin
30. Dashboard con estadísticas
31. Gestión conductores (tabla + registrar/editar)
32. Gestión vehículos (tabla + registrar/editar)
33. Reportes con filtros
Fase 8: Pulido
34. Imágenes de logo y placeholders
35. Estilos finales
36. Pruebas locales completas