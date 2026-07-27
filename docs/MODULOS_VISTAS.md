# Modulos y Vistas - RuralGo

Documentacion detallada de cada modulo, vista, formulario y funcionalidad de la plataforma.

---

## Indice

- [Vista Publica](#vista-publica)
- [Modulo Administrador](#modulo-administrador)
  - [Login Admin](#1-login-admin)
  - [Dashboard Admin](#2-dashboard-admin)
  - [Gestion de Conductores](#3-gestion-de-conductores)
  - [Detalle de Conductor](#4-detalle-de-conductor)
  - [Gestion de Vehiculos](#5-gestion-de-vehiculos)
  - [Reportes](#6-reportes)
  - [Mi Perfil Admin](#7-mi-perfil-admin)
- [Modulo Conductor](#modulo-conductor)
  - [Login Conductor](#1-login-conductor)
  - [Mi Panel (Dashboard)](#2-mi-panel-dashboard)
  - [Registrar Servicio](#3-registrar-servicio)
  - [Mis Vehiculos](#4-mis-vehiculos)
  - [Historial](#5-historial)
  - [Mi Perfil Conductor](#6-mi-perfil-conductor)
- [Componentes Compartidos](#componentes-compartidos)

---

## Vista Publica

### Home - Mapa de Conductores Disponibles

| Propiedad | Valor |
|---|---|
| **Ruta** | `/` |
| **Layout** | Ninguno (full-screen) |
| **Archivo** | `modules/public/views/HomeView.vue` |

#### Descripcion

Pagina publica que muestra un mapa interactivo (Leaflet/OpenStreetMap) centrado en la ubicacion del usuario. Los conductores disponibles aparecen como marcadores de moto en el mapa. El publico puede seleccionar un conductor para ver sus datos y contactarlo.

#### Funcionalidades

- **Mapa interactivo** con marcadores de conductores disponibles (icono de moto verde)
- **Geolocalizacion automatica**: centra el mapa en la posicion del usuario
- **Auto-refresh**: actualiza conductores 4 veces cada 15 segundos con animacion "Buscando..."
- **Pausa inteligente**: detiene la actualizacion cuando la pestana esta oculta
- **Popup en marcadores**: muestra nombre y placa del conductor
- **Card de conductor seleccionado**: foto, nombre, vehiculo, placa
- **Contacto directo**: botones para llamar (telefono) y enviar WhatsApp
- **Actualizacion manual**: boton "Actualizar mapa" cuando no hay auto-refresh

#### Elementos de UI

- Header con logo y badge animado "Buscando..."
- Mapa fullscreen con marcadores
- Card flotante inferior con info del conductor seleccionado
- Footer con link "¿Eres conductor? Inicia sesion"

---

## Modulo Administrador

### 1. Login Admin

| Propiedad | Valor |
|---|---|
| **Ruta** | `/admin/login` |
| **Layout** | Ninguno (card centrada) |
| **Archivo** | `modules/admin/views/LoginView.vue` |
| **Subtitulo visible** | Panel Administracion |

#### Formulario de Login

| Campo | Tipo | Requerido | Placeholder |
|---|---|---|---|
| Email | email | Si | admin@ruralgo.com |
| Contrasena | password | Si | --- |

#### Funcionalidades

- Boton "Ingresar" (deshabilitado durante carga, texto "Ingresando...")
- Manejo de errores del backend
- Redireccion a `/admin/dashboard` en exito

---

### 2. Dashboard Admin

| Propiedad | Valor |
|---|---|
| **Ruta** | `/admin/dashboard` |
| **Layout** | AdminLayout |
| **Titulo** | Dashboard |
| **Archivo** | `modules/admin/views/DashboardView.vue` |

#### Descripcion

Panel principal con estadisticas generales, graficos y resumen de actividad reciente.

#### Tarjetas de Estadisticas (grid 4 columnas)

| Tarjeta | Icono | Dato mostrado |
|---|---|---|
| Conductores | personas | Total de conductores registrados |
| Disponibles | circulo verde | Conductores disponibles ahora |
| Servicios Hoy | auto | Servicios realizados hoy |
| Servicios Mes | calendario | Servicios del mes actual |

#### Secciones

- **Grafico de barras "Servicios por Conductor"**: barras horizontales con gradiente verde, nombre y valor numerico
- **Servicios Recientes**: ultimos 5 servicios con badge de estado, destino, precio y fecha
- **Ingresos del Mes**: total ingresos (COP), servicios completados, promedio por servicio

#### Datos cargados (paralelo)

- Estadisticas generales
- Reporte por conductor
- Servicios recientes
- Ingresos del mes

---

### 3. Gestion de Conductores

| Propiedad | Valor |
|---|---|
| **Ruta** | `/admin/conductores` |
| **Layout** | AdminLayout |
| **Titulo** | Gestion de Conductores |
| **Archivo** | `modules/admin/views/ConductoresView.vue` |

#### Descripcion

Vista completa para administrar conductores: listar, registrar, editar, ver detalle y cambiar estado.

#### Tabla Desktop / Tarjetas Mobile

| Columna | Contenido |
|---|---|
| Nombre | Avatar/foto + nombre (link al detalle) |
| Cedula | Numero de cedula |
| Telefono | Numero de contacto |
| Email | Correo electronico |
| Estado | Badge "Activo" (verde) / "Inactivo" (rojo) |
| Acciones | Ver, Editar, Inhabilitar/Activar |

#### Botones de Accion por Fila

- **Ver**: navega a `/admin/conductores/:id` (detalle)
- **Editar**: abre modal de edicion
- **Inhabilitar/Activar**: toggle de estado con confirmacion

#### Formulario: Registrar / Editar Conductor (Modal)

| Campo | Tipo | Requerido | Deshabilitado al editar |
|---|---|---|---|
| Nombre | text | Si | No |
| Cedula | text | Si | Si (bloqueado) |
| Telefono | text | No | No |
| Email | email | Si | No |
| Contrasena | password | Si (solo al crear) | Si (solo al crear, min 6 chars) |

- Botones: "Cancelar" (outline) + "Guardar"/"Actualizar" (primario)
- Cierra al hacer click afuera del modal

#### ConfirmDialog de Toggle

- Mensaje: "¿Deseas inhabilitar/activar a [nombre]?"
- Botones: "Inhabilitar" (rojo) / "Activar" (verde)

---

### 4. Detalle de Conductor

| Propiedad | Valor |
|---|---|
| **Ruta** | `/admin/conductores/:id` |
| **Layout** | AdminLayout |
| **Titulo** | Conductor: [nombre] |
| **Archivo** | `modules/admin/views/ConductorDetailView.vue` |

#### Descripcion

Vista de solo lectura con informacion completa de un conductor especifico, incluyendo datos personales, ubicacion, vehiculos y historial de servicios.

#### Secciones

**Datos Personales**
| Campo | Valor |
|---|---|
| Nombre | nombre del conductor |
| Cedula | numero de cedula |
| Telefono | numero (o "N/A") |
| Email | correo electronico |
| Estado | Badge Activo/Inactivo |
| Disponible | Badge Si (verde) / No (amarillo) |

**Ubicacion**
| Campo | Valor |
|---|---|
| Latitud | coordenada lat |
| Longitud | coordenada lng |
| Ultima actualizacion | fecha formateada |
- Sin ubicacion: "Sin ubicacion registrada"

**Vehiculos** (contador en titulo)
- Lista de vehiculos con: placa (grande), marca/modelo/color
- Badges: Activo/Inactivo, SOAT verificado/no, Licencia verificada/no
- Sin vehiculos: "Sin vehiculos registrados"

**Servicios Recientes** (ultimos 10)
- Tabla: Fecha, Destino, Precio, Estado
- Badges de estado con colores

#### Accion

- Boton "Volver" -> `/admin/conductores`

---

### 5. Gestion de Vehiculos

| Propiedad | Valor |
|---|---|
| **Ruta** | `/admin/vehiculos` |
| **Layout** | AdminLayout |
| **Titulo** | Gestion de Vehiculos |
| **Archivo** | `modules/admin/views/VehiculosView.vue` |

#### Descripcion

Vista para administrar vehiculos: listar, registrar, editar y verificar documentos (SOAT y licencia).

#### Tabla Desktop / Tarjetas Mobile

| Columna | Contenido |
|---|---|
| Placa | texto en bold |
| Marca / Modelo | marca + modelo |
| Color | color del vehiculo |
| Conductor | nombre del conductor asignado |
| SOAT | Badge toggle: "Verificado" (verde) / "No verificado" (rojo) - clickeable |
| Licencia | Badge toggle: "Verificada" (verde) / "No verificada" (rojo) - clickeable |
| Estado | Badge "Activo" (verde) / "Inactivo" (rojo) |
| Acciones | Editar |

#### Toggle de Verificacion de Documentos

- **SOAT**: boton badge que al hacer click abre ConfirmDialog para marcar como verificado/no verificado
- **Licencia**: boton badge que al hacer click abre ConfirmDialog para marcar como verificada/no verificada
- Confirmacion dinamica: "¿Marcar SOAT/Licencia como verificado/no verificado para [placa]?"

#### Formulario: Registrar / Editar Vehiculo (Modal)

| Campo | Tipo | Requerido | Deshabilitado al editar | Placeholder |
|---|---|---|---|---|
| Conductor | select | Si | Solo al crear | Seleccionar conductor |
| Placa | text | Si | Si (bloqueado) | ABC123 |
| Color | text | No | No | Negro |
| Marca | text | Si | No | Yamaha |
| Modelo | text | Si | No | XTZ 150 |
| SOAT vence | date | No | No | --- |
| Licencia vence | date | No | No | --- |

- El select de conductor carga la lista de conductores disponibles
- Botones: "Cancelar" + "Guardar"/"Actualizar"

---

### 6. Reportes

| Propiedad | Valor |
|---|---|
| **Ruta** | `/admin/reportes` |
| **Layout** | AdminLayout |
| **Titulo** | Reportes |
| **Archivo** | `modules/admin/views/ReportesView.vue` |

#### Descripcion

Modulo de reportes con filtros por fecha y tipo. Tres tipos de reporte: servicios, ingresos y por conductor.

#### Filtros

| Campo | Tipo | Opciones |
|---|---|---|
| Tipo de reporte | select | Servicios, Ingresos, Por Conductor |
| Fecha inicio | date | --- |
| Fecha fin | date | --- |

- Boton "Buscar"
- Auto-busca al cambiar tipo de reporte
- Envia `tz_offset` junto con los filtros

#### Reporte de Servicios

**Tabla Desktop / Tarjetas Mobile:**

| Columna | Contenido |
|---|---|
| Fecha | fecha y hora formateada |
| Conductor | nombre del conductor |
| Placa | placa del vehiculo |
| Tipo | tipo de servicio |
| Origen | punto de origen |
| Destino | punto de destino |
| Precio | formato COP |
| Estado | Badge: finalizado (verde), cancelado (rojo), en_curso (amarillo) |

#### Reporte de Ingresos

**Card Resumen:**
- Total Ingresos (formato moneda COP)
- Total Servicios (numero)
- Promedio por servicio (calculado, solo si hay servicios)

#### Reporte por Conductor

**Grafico de barras horizontal:**
- Barra con gradiente verde, ancho proporcional al maximo
- Nombre del conductor, valor numerico, ingresos totales

**Tabla Desktop / Tarjetas Mobile:**

| Columna | Contenido |
|---|---|
| Nombre | nombre del conductor |
| Cedula | numero de cedula |
| Total | total de servicios |
| Completados | servicios completados |
| Ingresos | total de ingresos (COP) |

---

### 7. Mi Perfil Admin

| Propiedad | Valor |
|---|---|
| **Ruta** | `/admin/perfil` |
| **Layout** | AdminLayout |
| **Titulo** | Mi Perfil |
| **Archivo** | `modules/admin/views/PerfilView.vue` |

#### Descripcion

Gestion del perfil del administrador: foto, datos personales, contrasena e informacion de cuenta.

#### Foto de Perfil

- Componente PhotoUpload con placeholder "person"
- Preview circular de la foto actual
- Sube via POST /upload/foto

#### Formulario: Datos Personales

| Campo | Tipo | Requerido |
|---|---|---|
| Nombre completo | text | Si |
| Telefono | tel | No |
| Email | email | Si |

- Boton "Guardar cambios" (deshabilitado durante guardado)
- Mensaje de exito/error

#### Formulario: Cambiar Contrasena

| Campo | Tipo | Requerido |
|---|---|---|
| Contrasena actual | password | Si |
| Nueva contrasena | password | Si (min 6 chars) |

- Boton "Cambiar contrasena" (outline)
- Mensaje de exito/error

#### Informacion de Cuenta (solo lectura)

| Campo | Valor |
|---|---|
| Cedula | numero de cedula |
| Rol | Administrador |
| Estado | Badge "Activo" (verde) |

---

## Modulo Conductor

### 1. Login Conductor

| Propiedad | Valor |
|---|---|
| **Ruta** | `/conductor/login` |
| **Layout** | Ninguno (card centrada) |
| **Archivo** | `modules/conductor/views/LoginView.vue` |
| **Subtitulo visible** | Ingreso Conductores |

#### Formulario de Login

| Campo | Tipo | Requerido | Placeholder |
|---|---|---|---|
| Email | email | Si | correo@ejemplo.com |
| Contrasena | password | Si | --- |

#### Funcionalidades

- Boton "Ingresar" (deshabilitado durante carga)
- Redireccion a `/conductor/dashboard` en exito

---

### 2. Mi Panel (Dashboard)

| Propiedad | Valor |
|---|---|
| **Ruta** | `/conductor/dashboard` |
| **Layout** | ConductorLayout |
| **Titulo** | Mi Panel |
| **Archivo** | `modules/conductor/views/DashboardView.vue` |

#### Descripcion

Panel principal del conductor con servicio en curso, estado de disponibilidad, vehiculo activo y accesos rapidos.

#### Servicio en Curso (si existe)

- Card con borde verde lateral
- Icono de auto + "Servicio en curso" + badge "Activo desde [hora]"
- Detalles: tipo de servicio, destino, precio (COP)
- Botones: "Finalizar" (verde) + "Cancelar" (rojo con ConfirmDialog)

#### Perfil del Conductor

- Componente PhotoUpload
- Nombre + email
- Badge de disponibilidad: "Disponible" (verde) / "No disponible" (rojo)
- Indicador de ubicacion: "Ubicacion activa" con precision en metros
- Error de permiso: "Permiso de ubicacion denegado"
- Boton toggle: "Encender/Apagar disponibilidad"
  - Deshabilitado si hay servicio activo
  - Al encender: inicia geolocalizacion en tiempo real (watchPosition)
  - Al apagar: detiene geolocalizacion

#### Vehiculo Activo

- Placa (grande) + marca/modelo/color
- Sin vehiculo: "Sin vehiculo seleccionado"
- Link "Cambiar vehiculo" -> `/conductor/vehiculos`

#### Cards de Accion

- **Registrar Servicio** (solo si NO hay servicio activo) -> `/conductor/servicio`
  - Subtexto: "Pasajero, encomienda, diligencia o mixto"
- **Historial** -> `/conductor/historial`
  - Subtexto: "Consulta tus servicios anteriores"

#### Geolocalizacion en Tiempo Real

- Usa `navigator.geolocation.watchPosition`
- Envia coordenadas via `PUT /conductor/ubicacion`
- Se detiene automaticamente al salir de la vista

---

### 3. Registrar Servicio

| Propiedad | Valor |
|---|---|
| **Ruta** | `/conductor/servicio` |
| **Layout** | ConductorLayout |
| **Titulo** | Registrar Servicio |
| **Archivo** | `modules/conductor/views/ServicioView.vue` |

#### Descripcion

Vista para registrar un nuevo servicio o gestionar el servicio activo actual.

#### Vista: Servicio en Curso (si existe)

- Card con indicador pulsante verde
- Info: tipo, destino, precio (verde grande), hora de inicio
- Botones: "Finalizar" (verde) + "Cancelar" (rojo con ConfirmDialog)

#### Vista: Formulario de Nuevo Servicio (si NO hay servicio activo)

| Campo | Tipo | Requerido | Descripcion |
|---|---|---|---|
| Tipo de Servicio | radio cards (grid 2x2) | Si | Opciones cargadas de API, cada una con nombre + descripcion |
| Destino | text | Si | Placeholder: "Ej: Centro, Parque Principal..." |
| Precio ($) | number | Si | min=0, Placeholder: "Ej: 15000" |

- Boton "Iniciar Servicio" (full-width, deshabilitado si no hay tipo seleccionado)
- Muestra errores del backend

#### UI de Tipo de Servicio

- Grid 2 columnas de cards clickeables
- Cada card muestra nombre (bold) + descripcion (gris)
- Borde verde al seleccionar
- Comportamiento radio (solo uno seleccionado)

---

### 4. Mis Vehiculos

| Propiedad | Valor |
|---|---|
| **Ruta** | `/conductor/vehiculos` |
| **Layout** | ConductorLayout |
| **Titulo** | Mis Vehiculos |
| **Archivo** | `modules/conductor/views/VehiculosView.vue` |

#### Descripcion

Lista de vehiculos asignados al conductor con opcion de seleccionar el vehiculo activo.

#### Estado Vacio

- "No tienes vehiculos registrados"
- "Contacta al administrador para registrar tu vehiculo"

#### Lista de Tarjetas

Cada vehiculo muestra:

| Elemento | Contenido |
|---|---|
| Header | Placa (grande) + Marca Modelo + Badge ACTIVO/INACTIVO |
| Detalle | Color |
| Documentos | Badge SOAT (verificado/no) + Badge Licencia (verificada/no) |
| Accion | Boton "Seleccionar como activo" (solo si NO esta activo) |

- El vehiculo activo tiene borde lateral verde

---

### 5. Historial

| Propiedad | Valor |
|---|---|
| **Ruta** | `/conductor/historial` |
| **Layout** | ConductorLayout |
| **Titulo** | Historial |
| **Archivo** | `modules/conductor/views/HistorialView.vue` |

#### Descripcion

Historial de servicios del conductor con filtros, estadisticas y vista expandible (accordion).

#### Filtros

| Campo | Tipo | Opciones |
|---|---|---|
| Filtro | select | Todos, Finalizados, Cancelados |

#### Estadisticas

- Total ingresos (solo de finalizados)
- Conteo de servicios finalizados

#### Estado Vacio

- "No hay servicios registrados/finalizados/cancelados"
- Si filtro es "todos": boton "Registrar primer servicio" -> `/conductor/servicio`

#### Lista de Servicios (Accordion)

Cada servicio es una tarjeta clickeable:

| Elemento | Contenido |
|---|---|
| Top | Badge de estado + Fecha |
| Body | Ruta: origen (pin verde) -> flecha -> destino (bandera) |
| Footer | Precio (verde, grande) + Tipo de servicio |

**Al hacer click se expande mostrando:**
- Tipo de servicio
- Inicio (fecha y hora)
- Fin (si existe)
- Estado

- Solo un servicio expandido a la vez (comportamiento accordion)

---

### 6. Mi Perfil Conductor

| Propiedad | Valor |
|---|---|
| **Ruta** | `/conductor/perfil` |
| **Layout** | ConductorLayout |
| **Titulo** | Mi Perfil |
| **Archivo** | `modules/conductor/views/PerfilView.vue` |

#### Descripcion

Gestion del perfil del conductor: foto, datos personales, contrasena e informacion de cuenta.

#### Foto de Perfil

- Componente PhotoUpload con placeholder "person"
- Preview circular de la foto actual

#### Formulario: Datos Personales

| Campo | Tipo | Requerido |
|---|---|---|
| Nombre completo | text | Si |
| Telefono | tel | No |
| Email | email | Si |

- Boton "Guardar cambios"
- Mensaje de exito/error

#### Formulario: Cambiar Contrasena

| Campo | Tipo | Requerido |
|---|---|---|
| Contrasena actual | password | Si |
| Nueva contrasena | password | Si (min 6 chars) |

- Boton "Cambiar contrasena" (outline)

#### Informacion de Cuenta (solo lectura)

| Campo | Valor |
|---|---|
| Cedula | numero de cedula |
| Rol | valor dinamico del perfil |
| Estado | Badge Activo/Inactivo |

---

## Componentes Compartidos

### ConfirmDialog

| Propiedad | Valor |
|---|---|
| **Archivo** | `components/ConfirmDialog.vue` |

Dialogo modal de confirmacion con teleport a `<body>`.

**Props:**
- `show` (Boolean) - controla visibilidad
- `titulo` (String, default "Confirmar")
- `mensaje` (String, default "¿Estas seguro?")
- `textoConfirmar` (String, default "Confirmar")
- `type` (String: "primary" o "danger")

**Eventos:** `confirm`, `cancel`

**UI:** Overlay oscuro centrado, icono (check verde o warning rojo), titulo, mensaje, 2 botones (Cancelar outline + Confirmar con color segun type)

---

### PhotoUpload

| Propiedad | Valor |
|---|---|
| **Archivo** | `components/PhotoUpload.vue` |

Selector de imagen con preview circular y subida automatica.

**Props:**
- `placeholder` (String, default "camara")

**Funcionalidad:**
- Click para seleccionar imagen (acepta JPEG, PNG, WebP)
- Muestra preview circular (100x100px, borde verde)
- Sube via `POST /upload/foto` con FormData
- Muestra spinner durante subida
- Actualiza la foto en auth store + localStorage
- Resuelve URLs relativas con `API_BASE`

---

### ToastMessage

| Propiedad | Valor |
|---|---|
| **Archivo** | `components/ToastMessage.vue` |

Notificacion toast fija arriba-derecha.

**Props:**
- `show` (Boolean)
- `mensaje` (String)
- `type` (String: success/error/warning/info, default "success")

**UI:** Notificacion fija (z-index 4000), icono + texto, color de fondo segun tipo, animacion slideIn

---

## Caracteristicas Generales de la Plataforma

| Caracteristica | Descripcion |
|---|---|
| **Responsive** | Todas las vistas admin tienen tabla desktop + tarjetas mobile via media queries |
| **Autenticacion** | Token Bearer en localStorage, guardia de navegacion por rol |
| **Moneda** | Todos los precios en pesos colombianos (COP) con formato `toLocaleString('es-CO')` |
| **Geolocalizacion** | Conductores comparten ubicacion en tiempo real via watchPosition |
| **Mapa** | Leaflet/OpenStreetMap con auto-refresh y marcadores interactivos |
| **Servicio activo** | Impide logout o cambio de disponibilidad mientras hay servicio en curso |
| **Documentos** | Toggle de verificacion de SOAT y licencia con confirmacion |
| **Accordion** | Historial de servicios con expansion individual |
| **Formularios** | Modales para crear/editar con validacion y estados de carga |
