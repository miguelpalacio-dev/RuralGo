# 🎯 Guía de Módulos - Transporte Local Platform

## 📦 ¿Qué es un Módulo?

Un módulo es una **unidad funcional independiente** que encapsula toda la lógica relacionada con una funcionalidad de negocio específica.

### Características de un Módulo:

- ✅ Tiene su propia estructura interna completa
- ✅ Puede funcionar de forma independiente
- ✅ Tiene su propio estado (store)
- ✅ Tiene sus propias rutas
- ✅ Puede crecer sin afectar otros módulos

---

## 📁 Estructura de un Módulo

```
modulo/
├── components/       # Componentes SOLO de este módulo
├── views/            # Páginas del módulo
├── services/         # Lógica de API del módulo
├── store/            # Estado del módulo (Pinia)
├── composables/      # Hooks específicos del módulo
├── router/           # Rutas del módulo
└── types/            # TypeScript types del módulo
```

---

## 🔐 Módulo: AUTH (Autenticación)

### Propósito

Maneja toda la lógica de autenticación, autorización y gestión de sesiones.

### Estructura Completa

```
src/modules/auth/
├── components/
│   ├── LoginForm.vue           # Formulario de login
│   ├── RegisterForm.vue        # Formulario de registro
│   ├── ForgotPasswordForm.vue  # Recuperar contraseña
│   └── RoleSelector.vue        # Selector de rol (cliente/conductor)
│
├── views/
│   ├── LoginView.vue           # Página de login
│   ├── RegisterView.vue        # Página de registro
│   └── ForgotPasswordView.vue  # Página recuperar contraseña
│
├── services/
│   └── authService.ts          # API calls de autenticación
│
├── store/
│   └── authStore.ts            # Estado global de autenticación
│
├── composables/
│   ├── useAuth.ts              # Lógica de autenticación
│   └── usePermissions.ts       # Verificación de permisos
│
├── router/
│   └── authRoutes.ts           # Rutas del módulo
│
└── types/
    ├── User.ts                 # Interface User
    ├── AuthCredentials.ts      # Types de credenciales
    └── AuthResponse.ts         # Types de respuestas API
```

### Responsabilidades

✅ Login de usuarios  
✅ Registro de usuarios  
✅ JWT management (access & refresh tokens)  
✅ Persistencia de sesión  
✅ Logout  
✅ Verificación de roles y permisos  
✅ Recuperación de contraseña

### Ejemplo de Uso

```typescript
// En cualquier componente
import { useAuth } from '@/modules/auth/composables/useAuth'

const { login, logout, isAuthenticated } = useAuth()

async function handleLogin() {
  await login(email.value, password.value)
}
```

---

## 🚗 Módulo: TRIPS (Viajes)

### Propósito

Gestiona todo el ciclo de vida de los viajes.

### Estructura Completa

```
src/modules/trips/
├── components/
│   ├── TripCard.vue            # Card de viaje
│   ├── TripList.vue            # Lista de viajes
│   ├── TripTimeline.vue        # Timeline del viaje
│   ├── TripRequestForm.vue     # Formulario solicitar viaje
│   ├── TripStatusBadge.vue     # Badge de estado
│   └── TripRatingModal.vue     # Modal para calificar
│
├── views/
│   ├── TripListView.vue        # Lista de todos los viajes
│   ├── TripDetailView.vue      # Detalle de un viaje
│   ├── TripRequestView.vue     # Solicitar nuevo viaje
│   └── TripHistoryView.vue     # Historial de viajes
│
├── services/
│   ├── tripService.ts          # CRUD de viajes
│   └── tripSocketService.ts    # WebSocket para updates
│
├── store/
│   ├── tripStore.ts            # Estado de viajes
│   └── activeTripStore.ts      # Viaje activo actual
│
├── composables/
│   ├── useTrips.ts             # Gestión de viajes
│   ├── useActiveTrip.ts        # Viaje en curso
│   └── useTripHistory.ts       # Historial
│
├── router/
│   └── tripRoutes.ts
│
└── types/
    ├── Trip.ts                 # Interface Trip
    ├── TripStatus.ts           # Enum de estados
    └── TripRequest.ts          # Request data
```

### Estados de Viaje

```typescript
enum TripStatus {
  REQUESTED = 'requested', // Cliente solicitó
  ACCEPTED = 'accepted', // Conductor aceptó
  DRIVER_ARRIVING = 'arriving', // Conductor en camino
  IN_PROGRESS = 'in_progress', // Viaje en curso
  COMPLETED = 'completed', // Completado
  CANCELLED = 'cancelled', // Cancelado
}
```

### Responsabilidades

✅ Solicitar viajes  
✅ Ver viajes disponibles (para conductores)  
✅ Aceptar/rechazar viajes  
✅ Tracking en tiempo real  
✅ Completar viajes  
✅ Cancelar viajes  
✅ Historial de viajes  
✅ Calificaciones

---

## 🗺️ Módulo: MAPS (Mapas)

### Propósito

Maneja todo lo relacionado con mapas, geolocalización y rutas.

### Estructura Completa

```
src/modules/maps/
├── components/
│   ├── MapView.vue             # Componente principal del mapa
│   ├── DriverMarker.vue        # Marcador de conductor
│   ├── UserMarker.vue          # Marcador de usuario
│   ├── RouteDisplay.vue        # Visualización de ruta
│   ├── LocationPicker.vue      # Selector de ubicación
│   └── MapControls.vue         # Controles del mapa
│
├── views/
│   ├── MapMainView.vue         # Vista principal con mapa
│   └── RoutePreviewView.vue    # Preview de ruta antes de viaje
│
├── services/
│   ├── mapService.ts           # Inicialización del mapa
│   ├── geoService.ts           # Geolocalización
│   └── routeService.ts         # Cálculo de rutas
│
├── store/
│   ├── mapStore.ts             # Estado del mapa
│   └── locationStore.ts        # Ubicaciones
│
├── composables/
│   ├── useMap.ts               # Lógica del mapa
│   ├── useGeolocation.ts       # Geolocalización
│   └── useRoute.ts             # Rutas
│
├── router/
│   └── mapRoutes.ts
│
└── types/
    ├── Coordinates.ts          # Type [lat, lng]
    ├── Marker.ts               # Interface Marker
    ├── Route.ts                # Interface Route
    └── Location.ts             # Interface Location
```

### Responsabilidades

✅ Mostrar mapa interactivo  
✅ Geolocalización del usuario  
✅ Tracking de conductores en tiempo real  
✅ Cálculo de rutas optimizadas  
✅ Estimación de tiempo y distancia  
✅ Marcadores dinámicos  
✅ Zoom y centrado automático

### Librerías Sugeridas

- **Leaflet** (gratuito, ligero)
- **Google Maps API** (completo, de pago)
- **Mapbox** (moderno, freemium)

---

## 👤 Módulo: DRIVERS (Conductores)

### Propósito

Gestión de conductores, sus perfiles y disponibilidad.

### Estructura Completa

```
src/modules/drivers/
├── components/
│   ├── DriverCard.vue          # Card de conductor
│   ├── DriverList.vue          # Lista de conductores
│   ├── DriverProfile.vue       # Perfil completo
│   ├── DriverStatusToggle.vue  # Toggle disponible/ocupado
│   ├── DriverRating.vue        # Calificación
│   └── DriverVehicleInfo.vue   # Info del vehículo
│
├── views/
│   ├── DriverListView.vue      # Lista de conductores (admin)
│   ├── DriverDetailView.vue    # Detalle de conductor
│   ├── DriverProfileView.vue   # Perfil propio (conductor)
│   └── DriverRegistrationView.vue # Registro de conductor
│
├── services/
│   ├── driverService.ts        # CRUD de conductores
│   └── driverLocationService.ts # Actualización de ubicación
│
├── store/
│   ├── driverStore.ts          # Estado de conductores
│   └── availableDriversStore.ts # Conductores disponibles
│
├── composables/
│   ├── useDrivers.ts           # Gestión de conductores
│   ├── useDriverStatus.ts      # Status del conductor
│   └── useDriverLocation.ts    # Ubicación en tiempo real
│
├── router/
│   └── driverRoutes.ts
│
└── types/
    ├── Driver.ts               # Interface Driver
    ├── Vehicle.ts              # Interface Vehicle
    ├── DriverStatus.ts         # Enum de estados
    └── DriverDocument.ts       # Documentos requeridos
```

### Estados de Conductor

```typescript
enum DriverStatus {
  OFFLINE = 'offline', // No disponible
  AVAILABLE = 'available', // Disponible para viajes
  BUSY = 'busy', // En un viaje
  ON_BREAK = 'on_break', // En descanso
}
```

### Responsabilidades

✅ Ver conductores disponibles  
✅ Perfil de conductor  
✅ Gestión de documentos (licencia, etc.)  
✅ Info del vehículo  
✅ Calificaciones y reseñas  
✅ Historial de viajes  
✅ Cambiar status (disponible/ocupado)  
✅ Actualizar ubicación en tiempo real

---

## 👑 Módulo: ADMIN (Administración)

### Propósito

Panel administrativo para gestionar toda la plataforma.

### Estructura Completa

```
src/modules/admin/
├── components/
│   ├── DashboardStats.vue      # Estadísticas principales
│   ├── DataTable.vue           # Tabla con filtros y paginación
│   ├── ChartComponent.vue      # Gráficos
│   ├── FilterBar.vue           # Barra de filtros
│   ├── ExportButton.vue        # Exportar Excel/PDF
│   └── UserManagementTable.vue # Tabla de usuarios
│
├── views/
│   ├── DashboardView.vue       # Dashboard principal
│   ├── UsersManagementView.vue # Gestión de usuarios
│   ├── DriversManagementView.vue # Gestión de conductores
│   ├── TripsManagementView.vue # Gestión de viajes
│   ├── ReportsView.vue         # Reportes y analytics
│   └── SettingsView.vue        # Configuración del sistema
│
├── services/
│   ├── adminService.ts         # API admin
│   ├── analyticsService.ts     # Analytics y métricas
│   └── reportService.ts        # Generación de reportes
│
├── store/
│   ├── adminStore.ts           # Estado admin
│   └── statsStore.ts           # Estadísticas
│
├── composables/
│   ├── useAdmin.ts             # Lógica admin
│   ├── useDataTable.ts         # Lógica de tablas
│   └── useExport.ts            # Exportación de datos
│
├── router/
│   └── adminRoutes.ts
│
└── types/
    ├── AdminUser.ts
    ├── DashboardStats.ts
    ├── Report.ts
    └── Filter.ts
```

### Responsabilidades

✅ Dashboard con KPIs  
✅ Gestión de usuarios (CRUD)  
✅ Gestión de conductores (CRUD)  
✅ Gestión de viajes  
✅ Reportes y analytics  
✅ Gráficos de rendimiento  
✅ Configuración del sistema  
✅ Exportar datos a Excel/PDF  
✅ Auditoría y logs

---

## 💬 Módulo: CHAT (Chat en Tiempo Real)

### Propósito

Sistema de chat en tiempo real entre cliente y conductor.

### Estructura Completa

```
src/modules/chat/
├── components/
│   ├── ChatWindow.vue          # Ventana de chat
│   ├── MessageList.vue         # Lista de mensajes
│   ├── MessageItem.vue         # Item de mensaje
│   ├── MessageInput.vue        # Input para enviar mensaje
│   └── TypingIndicator.vue     # Indicador "escribiendo..."
│
├── views/
│   ├── ChatView.vue            # Vista principal de chat
│   └── ChatListView.vue        # Lista de conversaciones
│
├── services/
│   ├── chatService.ts          # API de chat
│   └── chatSocketService.ts    # WebSocket
│
├── store/
│   ├── chatStore.ts            # Estado de chats
│   └── messagesStore.ts        # Mensajes
│
├── composables/
│   ├── useChat.ts              # Lógica de chat
│   ├── useSocket.ts            # WebSocket connection
│   └── useMessages.ts          # Gestión de mensajes
│
├── router/
│   └── chatRoutes.ts
│
└── types/
    ├── Message.ts              # Interface Message
    ├── Conversation.ts         # Interface Conversation
    └── ChatUser.ts             # Usuario en el chat
```

### Responsabilidades

✅ Chat en tiempo real con WebSocket  
✅ Enviar/recibir mensajes  
✅ Indicador "escribiendo..."  
✅ Historial de mensajes  
✅ Notificaciones de nuevos mensajes  
✅ Lista de conversaciones

---

## 💳 Módulo: PAYMENTS (Pagos)

### Propósito

Gestión de pagos y facturación.

### Estructura Completa

```
src/modules/payments/
├── components/
│   ├── PaymentForm.vue         # Formulario de pago
│   ├── PaymentMethodCard.vue   # Tarjeta de método de pago
│   ├── PaymentHistory.vue      # Historial de pagos
│   ├── InvoiceItem.vue         # Item de factura
│   └── PaymentSummary.vue      # Resumen de pago
│
├── views/
│   ├── PaymentView.vue         # Realizar pago
│   ├── PaymentMethodsView.vue  # Gestión de métodos
│   ├── PaymentHistoryView.vue  # Historial
│   └── InvoicesView.vue        # Facturas
│
├── services/
│   ├── paymentService.ts       # API de pagos
│   └── invoiceService.ts       # Generación de facturas
│
├── store/
│   └── paymentStore.ts         # Estado de pagos
│
├── composables/
│   ├── usePayments.ts          # Lógica de pagos
│   └── usePaymentMethods.ts    # Métodos de pago
│
├── router/
│   └── paymentRoutes.ts
│
└── types/
    ├── Payment.ts
    ├── PaymentMethod.ts
    ├── Invoice.ts
    └── PaymentStatus.ts
```

### Responsabilidades

✅ Procesar pagos  
✅ Guardar métodos de pago  
✅ Historial de transacciones  
✅ Generar facturas  
✅ Integración con pasarelas (Stripe, PayPal)

---

## 🔔 Módulo: NOTIFICATIONS (Notificaciones)

### Propósito

Sistema de notificaciones de la plataforma.

### Estructura Completa

```
src/modules/notifications/
├── components/
│   ├── NotificationItem.vue    # Item de notificación
│   ├── NotificationBell.vue    # Campana con badge
│   ├── NotificationList.vue    # Lista de notificaciones
│   ├── ToastNotification.vue   # Toast emergente
│   └── NotificationSettings.vue # Configuración
│
├── views/
│   └── NotificationsView.vue   # Vista de todas las notificaciones
│
├── services/
│   ├── notificationService.ts  # API de notificaciones
│   └── pushService.ts          # Push notifications
│
├── store/
│   └── notificationStore.ts    # Estado
│
├── composables/
│   ├── useNotifications.ts     # Lógica
│   └── useToast.ts             # Toasts
│
├── router/
│   └── notificationRoutes.ts
│
└── types/
    ├── Notification.ts
    └── NotificationType.ts
```

### Tipos de Notificaciones

```typescript
enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  TRIP_REQUEST = 'trip_request',
  TRIP_ACCEPTED = 'trip_accepted',
  DRIVER_ARRIVING = 'driver_arriving',
  MESSAGE = 'message',
}
```

### Responsabilidades

✅ Toasts (notificaciones emergentes)  
✅ Push notifications  
✅ Lista de notificaciones  
✅ Marcar como leídas  
✅ Configuración de preferencias

---

## 📊 Módulo: ANALYTICS (Analíticas)

### Propósito

Analíticas, métricas y reportes del sistema.

### Estructura Completa

```
src/modules/analytics/
├── components/
│   ├── ChartComponent.vue      # Componente de gráfico
│   ├── MetricCard.vue          # Card de métrica
│   ├── ReportCard.vue          # Card de reporte
│   └── DateRangePicker.vue     # Selector de fechas
│
├── views/
│   ├── AnalyticsView.vue       # Vista principal
│   └── ReportsView.vue         # Reportes detallados
│
├── services/
│   └── analyticsService.ts     # API de analytics
│
├── store/
│   └── analyticsStore.ts       # Estado
│
├── composables/
│   └── useAnalytics.ts         # Lógica
│
├── router/
│   └── analyticsRoutes.ts
│
└── types/
    ├── ChartData.ts
    ├── Metric.ts
    └── Report.ts
```

### Responsabilidades

✅ Gráficos de rendimiento  
✅ KPIs del sistema  
✅ Reportes personalizados  
✅ Filtros por fecha  
✅ Exportación de datos

---

## 🔧 Módulo: CONFIG (Configuración)

### Propósito

Configuración global del sistema.

### Estructura Completa

```
src/modules/config/
├── components/
│   └── SettingsForm.vue
│
├── views/
│   └── SettingsView.vue
│
├── services/
│   └── configService.ts
│
├── store/
│   └── configStore.ts
│
├── composables/
│   └── useConfig.ts
│
├── router/
│   └── configRoutes.ts
│
└── types/
    └── AppConfig.ts
```

---

## 🤝 Comunicación Entre Módulos

### ❌ MAL: Import directo entre módulos

```typescript
// ❌ NO HACER
import { DriverCard } from '@/modules/drivers/components/DriverCard.vue'
```

### ✅ BIEN: Usar eventos globales o store global

```typescript
// ✅ OPCIÓN 1: Store global
const globalStore = useGlobalStore()
globalStore.emit('driver-selected', driverId)

// ✅ OPCIÓN 2: Event bus
import { eventBus } from '@/utils/eventBus'
eventBus.emit('driver-selected', driverId)

// ✅ OPCIÓN 3: Mover componente a /components global
import DriverCard from '@/components/DriverCard.vue'
```

---

## ✅ Checklist al Crear un Módulo

- [ ] ¿Representa una funcionalidad de negocio clara?
- [ ] ¿Tiene su propia carpeta con estructura completa?
- [ ] ¿Tiene su propio store de Pinia?
- [ ] ¿Tiene sus propias rutas?
- [ ] ¿Los componentes son específicos del módulo?
- [ ] ¿Está documentado en esta guía?
- [ ] ¿No tiene dependencias directas de otros módulos?

---

**Esta guía es la referencia principal para trabajar con módulos en el proyecto.**
