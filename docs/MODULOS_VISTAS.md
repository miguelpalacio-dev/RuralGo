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

**Ruta:** `/` | **Layout:** Ninguno (full-screen) | **Archivo:** `modules/public/views/HomeView.vue`

Pagina publica que muestra un mapa interactivo con conductores de transporte rural disponibles en tiempo real. El usuario puede geolocalizarse, ver marcadores de motos, seleccionar un conductor y contactarlo directamente por llamada o WhatsApp.

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

**Ruta:** `/admin/login` | **Layout:** Ninguno (card centrada) | **Archivo:** `modules/admin/views/LoginView.vue`

Formulario de autenticacion para administradores con acceso al panel de gestion. Muestra una card centrada sobre fondo gris con el subtitulo "Panel Administracion". Valida credenciales contra el backend y redirige al dashboard en caso de exito.

#### Formulario de Login

- **Email** - tipo: email, requerido, placeholder: admin@ruralgo.com
- **Contrasena** - tipo: password, requerido

#### Funcionalidades

- Boton "Ingresar" (deshabilitado durante carga, texto "Ingresando...")
- Manejo de errores del backend
- Redireccion a `/admin/dashboard` en exito

---

### 2. Dashboard Admin

**Ruta:** `/admin/dashboard` | **Layout:** AdminLayout | **Archivo:** `modules/admin/views/DashboardView.vue`

Panel principal del administrador que muestra estadisticas generales, graficos de actividad y resumen financiero. Carga datos en paralelo al montar la vista para ofrecer una vision completa del estado actual del servicio de transporte.

#### Tarjetas de Estadisticas (grid 4 columnas)

- **Conductores** - icono personas, total de conductores registrados
- **Disponibles** - icono circulo verde, conductores disponibles ahora
- **Servicios Hoy** - icono auto, servicios realizados hoy
- **Servicios Mes** - icono calendario, servicios del mes actual

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

**Ruta:** `/admin/conductores` | **Layout:** AdminLayout | **Archivo:** `modules/admin/views/ConductoresView.vue`

Vista completa para administrar el registro de conductores del servicio. Permite listar todos los conductores, registrar nuevos, editar información existente, ver el detalle completo y cambiar el estado de activacion de cada uno con confirmacion.

#### Tabla Desktop / Tarjetas Mobile

- **Nombre** - avatar/foto + nombre (link al detalle)
- **Cedula** - numero de cedula
- **Telefono** - numero de contacto
- **Email** - correo electronico
- **Estado** - badge "Activo" (verde) / "Inactivo" (rojo)
- **Acciones** - Ver, Editar, Inhabilitar/Activar

#### Botones de Accion por Fila

- **Ver**: navega a `/admin/conductores/:id` (detalle)
- **Editar**: abre modal de edicion
- **Inhabilitar/Activar**: toggle de estado con confirmacion

#### Formulario: Registrar / Editar Conductor (Modal)

- **Nombre** - tipo: text, requerido
- **Cedula** - tipo: text, requerido, deshabilitado al editar
- **Telefono** - tipo: text, opcional
- **Email** - tipo: email, requerido
- **Contrasena** - tipo: password, requerido solo al crear (min 6 caracteres)

- Botones: "Cancelar" (outline) + "Guardar"/"Actualizar" (primario)
- Cierra al hacer click afuera del modal

#### ConfirmDialog de Toggle

- Mensaje: "¿Deseas inhabilitar/activar a [nombre]?"
- Botones: "Inhabilitar" (rojo) / "Activar" (verde)

---

### 4. Detalle de Conductor

**Ruta:** `/admin/conductores/:id` | **Layout:** AdminLayout | **Archivo:** `modules/admin/views/ConductorDetailView.vue`

Vista de solo lectura que muestra la informacion completa de un conductor especifico. Incluye datos personales, ubicacion geografica en tiempo real, lista de vehiculos asignados y los ultimos servicios realizados. Permite volver a la lista de conductores.

#### Datos Personales

- **Nombre** - nombre completo del conductor
- **Cedula** - numero de cedula
- **Telefono** - numero de contacto (o "N/A")
- **Email** - correo electronico
- **Estado** - badge Activo/Inactivo
- **Disponible** - badge Si (verde) / No (amarillo)

#### Ubicacion

- **Latitud** - coordenada de latitud
- **Longitud** - coordenada de longitud
- **Ultima actualizacion** - fecha formateada
- Sin ubicacion: "Sin ubicacion registrada"

#### Vehiculos (contador en titulo)

- Lista de vehiculos con placa (grande), marca/modelo/color
- Badges: Activo/Inactivo, SOAT verificado/no, Licencia verificada/no
- Sin vehiculos: "Sin vehiculos registrados"

#### Servicios Recientes (ultimos 10)

- Tabla con columnas: Fecha, Destino, Precio, Estado
- Badges de estado con colores

#### Accion

- Boton "Volver" -> `/admin/conductores`

---

### 5. Gestion de Vehiculos

**Ruta:** `/admin/vehiculos` | **Layout:** AdminLayout | **Archivo:** `modules/admin/views/VehiculosView.vue`

Vista para administrar la flota de vehiculos del servicio de transporte. Permite listar, registrar y editar vehiculos, ademas de verificar los documentos (SOAT y licencia de conducir) de cada vehiculo con un sistema de toggle y confirmacion.

#### Tabla Desktop / Tarjetas Mobile

- **Placa** - texto en bold
- **Marca / Modelo** - marca + modelo del vehiculo
- **Color** - color del vehiculo
- **Conductor** - nombre del conductor asignado
- **SOAT** - badge toggle: "Verificado" (verde) / "No verificado" (rojo) - clickeable
- **Licencia** - badge toggle: "Verificada" (verde) / "No verificada" (rojo) - clickeable
- **Estado** - badge "Activo" (verde) / "Inactivo" (rojo)
- **Acciones** - Editar

#### Toggle de Verificacion de Documentos

- **SOAT**: boton badge que al hacer click abre ConfirmDialog para marcar como verificado/no verificado
- **Licencia**: boton badge que al hacer click abre ConfirmDialog para marcar como verificada/no verificada
- Confirmacion dinamica: "¿Marcar SOAT/Licencia como verificado/no verificado para [placa]?"

#### Formulario: Registrar / Editar Vehiculo (Modal)

- **Conductor** - tipo: select, requerido, solo seleccionable al crear, placeholder: "Seleccionar conductor"
- **Placa** - tipo: text, requerido, deshabilitado al editar, placeholder: "ABC123"
- **Color** - tipo: text, opcional, placeholder: "Negro"
- **Marca** - tipo: text, requerido, placeholder: "Yamaha"
- **Modelo** - tipo: text, requerido, placeholder: "XTZ 150"
- **SOAT vence** - tipo: date, opcional
- **Licencia vence** - tipo: date, opcional

- El select de conductor carga la lista de conductores disponibles
- Botones: "Cancelar" + "Guardar"/"Actualizar"

---

### 6. Reportes

**Ruta:** `/admin/reportes` | **Layout:** AdminLayout | **Archivo:** `modules/admin/views/ReportesView.vue`

Modulo de reportes con sistema de filtros por fecha y tipo de reporte. Ofrece tres vistas: reporte de servicios individuales, resumen de ingresos y analisis por conductor con grafico de barras. Se actualiza automaticamente al cambiar el tipo de reporte.

#### Filtros

- **Tipo de reporte** - tipo: select, opciones: Servicios, Ingresos, Por Conductor
- **Fecha inicio** - tipo: date
- **Fecha fin** - tipo: date

- Boton "Buscar"
- Auto-busca al cambiar tipo de reporte
- Envia `tz_offset` junto con los filtros

#### Reporte de Servicios

**Tabla Desktop / Tarjetas Mobile:**

- **Fecha** - fecha y hora formateada
- **Conductor** - nombre del conductor
- **Placa** - placa del vehiculo
- **Tipo** - tipo de servicio
- **Origen** - punto de origen
- **Destino** - punto de destino
- **Precio** - formato COP
- **Estado** - badge: finalizado (verde), cancelado (rojo), en_curso (amarillo)

#### Reporte de Ingresos

**Card Resumen:**

- **Total Ingresos** - formato moneda COP
- **Total Servicios** - numero entero
- **Promedio por servicio** - calculado, solo si hay servicios

#### Reporte por Conductor

**Grafico de barras horizontal:**

- Barra con gradiente verde, ancho proporcional al maximo
- Nombre del conductor, valor numerico, ingresos totales

**Tabla Desktop / Tarjetas Mobile:**

- **Nombre** - nombre del conductor
- **Cedula** - numero de cedula
- **Total** - total de servicios realizados
- **Completados** - servicios completados exitosamente
- **Ingresos** - total de ingresos generados (COP)

---

### 7. Mi Perfil Admin

**Ruta:** `/admin/perfil` | **Layout:** AdminLayout | **Archivo:** `modules/admin/views/PerfilView.vue`

Gestion del perfil personal del administrador. Permite actualizar la foto de perfil, modificar datos personales como nombre, telefono y email, cambiar la contrasena de acceso y visualizar la informacion de cuenta en modo solo lectura.

#### Foto de Perfil

- Componente PhotoUpload con placeholder "person"
- Preview circular de la foto actual
- Sube via POST /upload/foto

#### Formulario: Datos Personales

- **Nombre completo** - tipo: text, requerido
- **Telefono** - tipo: tel, opcional
- **Email** - tipo: email, requerido

- Boton "Guardar cambios" (deshabilitado durante guardado)
- Mensaje de exito/error

#### Formulario: Cambiar Contrasena

- **Contrasena actual** - tipo: password, requerido
- **Nueva contrasena** - tipo: password, requerido (min 6 caracteres)

- Boton "Cambiar contrasena" (outline)
- Mensaje de exito/error

#### Informacion de Cuenta (solo lectura)

- **Cedula** - numero de cedula
- **Rol** - Administrador
- **Estado** - badge "Activo" (verde)

---

## Modulo Conductor

### 1. Login Conductor

**Ruta:** `/conductor/login` | **Layout:** Ninguno (card centrada) | **Archivo:** `modules/conductor/views/LoginView.vue`

Formulario de autenticacion para conductores del servicio de transporte rural. Muestra una card centrada sobre fondo gris con el subtitulo "Ingreso Conductores". Validad las credenciales y redirige al panel del conductor en caso de exito.

#### Formulario de Login

- **Email** - tipo: email, requerido, placeholder: "correo@ejemplo.com"
- **Contrasena** - tipo: password, requerido

#### Funcionalidades

- Boton "Ingresar" (deshabilitado durante carga)
- Redireccion a `/conductor/dashboard` en exito

---

### 2. Mi Panel (Dashboard)

**Ruta:** `/conductor/dashboard` | **Layout:** ConductorLayout | **Archivo:** `modules/conductor/views/DashboardView.vue`

Panel principal del conductor que muestra el estado actual del servicio, incluyendo si hay un servicio en curso, su nivel de disponibilidad para接收 nuevos servicios, el vehiculo activo y accesos rapidos a las funcionalidades principales del modulo.

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

**Ruta:** `/conductor/servicio` | **Layout:** ConductorLayout | **Archivo:** `modules/conductor/views/ServicioView.vue`

Vista dedicada para registrar nuevos servicios de transporte o gestionar el servicio actualmente activo. Si ya hay un servicio en curso, muestra sus detalles con opciones para finalizarlo o cancelarlo. De lo contrario, presenta el formulario de registro.

#### Vista: Servicio en Curso (si existe)

- Card con indicador pulsante verde
- Info: tipo, destino, precio (verde grande), hora de inicio
- Botones: "Finalizar" (verde) + "Cancelar" (rojo con ConfirmDialog)

#### Formulario de Nuevo Servicio (si NO hay servicio activo)

- **Tipo de Servicio** - tipo: radio cards (grid 2x2), requerido, opciones cargadas desde API con nombre + descripcion
- **Destino** - tipo: text, requerido, placeholder: "Ej: Centro, Parque Principal..."
- **Precio ($)** - tipo: number, requerido, minimo: 0, placeholder: "Ej: 15000"

- Boton "Iniciar Servicio" (full-width, deshabilitado si no hay tipo seleccionado)
- Muestra errores del backend

#### UI de Tipo de Servicio

- Grid 2 columnas de cards clickeables
- Cada card muestra nombre (bold) + descripcion (gris)
- Borde verde al seleccionar
- Comportamiento radio (solo uno seleccionado)

---

### 4. Mis Vehiculos

**Ruta:** `/conductor/vehiculos` | **Layout:** ConductorLayout | **Archivo:** `modules/conductor/views/VehiculosView.vue`

Vista que muestra la lista de vehiculos asignados al conductor con su estado y documentos. Permite seleccionar cual vehiculo esta activo para realizar servicios, mostrando un indicador visual del vehiculo seleccionado actualmente.

#### Estado Vacio

- "No tienes vehiculos registrados"
- "Contacta al administrador para registrar tu vehiculo"

#### Lista de Tarjetas

Cada vehiculo muestra:

- **Header** - placa (grande) + Marca Modelo + Badge ACTIVO/INACTIVO
- **Detalle** - color del vehiculo
- **Documentos** - Badge SOAT (verificado/no) + Badge Licencia (verificada/no)
- **Accion** - boton "Seleccionar como activo" (solo si NO esta activo)

- El vehiculo activo tiene borde lateral verde

---

### 5. Historial

**Ruta:** `/conductor/historial` | **Layout:** ConductorLayout | **Archivo:** `modules/conductor/views/HistorialView.vue`

Historial completo de servicios realizados por el conductor con sistema de filtros y estadisticas de rendimiento. Los servicios se muestran como tarjetas expandibles (accordion) que revelan detalles adicionales al hacer click, como fechas de inicio y fin.

#### Filtros

- **Filtro** - tipo: select, opciones: Todos, Finalizados, Cancelados

#### Estadisticas

- Total ingresos (solo de finalizados)
- Conteo de servicios finalizados

#### Estado Vacio

- "No hay servicios registrados/finalizados/cancelados"
- Si filtro es "todos": boton "Registrar primer servicio" -> `/conductor/servicio`

#### Lista de Servicios (Accordion)

Cada servicio es una tarjeta clickeable:

- **Top** - badge de estado + fecha
- **Body** - ruta: origen (pin verde) -> flecha -> destino (bandera)
- **Footer** - precio (verde, grande) + tipo de servicio

**Al hacer click se expande mostrando:**

- Tipo de servicio
- Inicio (fecha y hora)
- Fin (si existe)
- Estado

- Solo un servicio expandido a la vez (comportamiento accordion)

---

### 6. Mi Perfil Conductor

**Ruta:** `/conductor/perfil` | **Layout:** ConductorLayout | **Archivo:** `modules/conductor/views/PerfilView.vue`

Gestion del perfil personal del conductor. Permite actualizar la foto de perfil, modificar datos personales, cambiar la contrasena de acceso y visualizar la informacion de cuenta. Mantiene la misma estructura que el perfil del administrador.

#### Foto de Perfil

- Componente PhotoUpload con placeholder "person"
- Preview circular de la foto actual

#### Formulario: Datos Personales

- **Nombre completo** - tipo: text, requerido
- **Telefono** - tipo: tel, opcional
- **Email** - tipo: email, requerido

- Boton "Guardar cambios"
- Mensaje de exito/error

#### Formulario: Cambiar Contrasena

- **Contrasena actual** - tipo: password, requerido
- **Nueva contrasena** - tipo: password, requerido (min 6 caracteres)

- Boton "Cambiar contrasena" (outline)

#### Informacion de Cuenta (solo lectura)

- **Cedula** - numero de cedula
- **Rol** - valor dinamico del perfil
- **Estado** - badge Activo/Inactivo

---

## Componentes Compartidos

### ConfirmDialog

**Archivo:** `components/ConfirmDialog.vue`

Dialogo modal de confirmacion que se teletransporta al body del documento. Se utiliza para confirmar acciones criticas como inhabilitar conductores, verificar documentos, cancelar servicios o cerrar sesion con servicio activo.

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

**Archivo:** `components/PhotoUpload.vue`

Selector de imagen con vista previa circular y subida automatica al servidor. Muestra la foto actual del usuario y permite cambiarla seleccionando un archivo del dispositivo. Incluye spinner de carga y actualizacion automatica del estado de autenticacion.

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

**Archivo:** `components/ToastMessage.vue`

Componente de notificacion toast que aparece fijo en la esquina superior derecha de la pantalla. Muestra mensajes de exito, error, advertencia o informacion con un icono representativo y animacion de entrada slideIn.

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
