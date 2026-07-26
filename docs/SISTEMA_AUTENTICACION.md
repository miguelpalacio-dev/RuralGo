# 🔐 Sistema de Autenticación Completo

## 📋 Resumen

Se ha implementado un sistema de autenticación completo con JWT, refresh tokens, guards, middleware, roles y permisos tanto en el backend (NestJS) como en el frontend (Vue 3 + Pinia).

## 🎯 Características Implementadas

### ✅ Backend (NestJS)

#### 1. **Entidades**
- **User Entity** (`backend/src/modules/auth/entities/user.entity.ts`)
  - Campos: id, email, password (hasheado), firstName, lastName, phone, avatar
  - Roles: `client`, `driver`, `admin`, `supervisor`
  - Estados: `active`, `inactive`, `suspended`, `pending_verification`
  - Relaciones: OneToMany con RefreshToken
  - Métodos auxiliares: `fullName`, `hasRole()`, `isActive()`

- **RefreshToken Entity** (`backend/src/modules/auth/entities/refresh-token.entity.ts`)
  - Campos: id, token, expiresAt, isRevoked, userAgent, ipAddress
  - Relación: ManyToOne con User
  - Métodos auxiliares: `isExpired()`, `isValid()`

#### 2. **DTOs**
- `LoginDto`: email, password
- `RegisterDto`: email, password, firstName, lastName, phone, role
- `RefreshTokenDto`: refreshToken
- `ChangePasswordDto`: currentPassword, newPassword
- `ForgotPasswordDto`: email
- `ResetPasswordDto`: token, newPassword

Todos con validaciones usando `class-validator`:
- Email válido
- Contraseña mínimo 6 caracteres con mayúscula, minúscula y número
- Campos requeridos

#### 3. **Interfaces**
- `JwtPayload`: sub (userId), email, role
- `TokenResponse`: accessToken, refreshToken, expiresIn
- `AuthResponse`: extends TokenResponse + user
- `UserResponse`: User sin password

#### 4. **AuthService** (`backend/src/modules/auth/services/auth.service.ts`)

Métodos implementados:
- `register()`: Registrar nuevo usuario
- `login()`: Login con credenciales
- `refreshAccessToken()`: Renovar access token con refresh token
- `logout()`: Revocar refresh token
- `changePassword()`: Cambiar contraseña
- `forgotPassword()`: Generar token de reset
- `resetPassword()`: Reset con token
- `getUserById()`: Obtener usuario por ID
- `validateUser()`: Validar usuario para JWT Strategy
- `hashPassword()`: Hash con bcrypt
- `comparePasswords()`: Comparar passwords

Características:
- Hash de contraseñas con bcrypt (10 rounds)
- Generación de JWT y refresh tokens
- Almacenamiento de refresh tokens en BD
- Tracking de userAgent e ipAddress
- Revocación de tokens al cambiar contraseña

#### 5. **JWT Strategy** (`backend/src/modules/auth/strategies/jwt.strategy.ts`)
- Estrategia Passport con JWT
- Extrae token del header `Authorization: Bearer <token>`
- Valida payload y verifica usuario activo

#### 6. **Guards**
- **JwtAuthGuard** (`backend/src/common/guards/jwt-auth.guard.ts`)
  - Protege rutas que requieren autenticación
  
- **RolesGuard** (`backend/src/common/guards/roles.guard.ts`)
  - Verifica roles del usuario usando decorator `@Roles()`

#### 7. **Decorators**
- **@Roles(...roles)** (`backend/src/common/decorators/roles.decorator.ts`)
  - Define roles permitidos para una ruta
  
- **@GetUser()** (`backend/src/common/decorators/get-user.decorator.ts`)
  - Inyecta usuario autenticado en el handler

#### 8. **AuthController** (`backend/src/modules/auth/auth.controller.ts`)

Endpoints:
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Refrescar token
- `POST /auth/logout` - Cerrar sesión (requiere auth)
- `GET /auth/profile` - Obtener perfil (requiere auth)
- `POST /auth/change-password` - Cambiar contraseña (requiere auth)
- `POST /auth/forgot-password` - Solicitar reset de contraseña
- `POST /auth/reset-password` - Resetear contraseña con token

Todos documentados con Swagger (`@ApiTags`, `@ApiOperation`, `@ApiResponse`)

#### 9. **AuthModule** (`backend/src/modules/auth/auth.module.ts`)
- TypeORM repositories: User, RefreshToken
- PassportModule con estrategia JWT
- JwtModule con configuración asíncrona
- Exports: AuthService, JwtStrategy, PassportModule

---

### ✅ Frontend (Vue 3 + TypeScript)

#### 1. **Types** (`src/modules/auth/types/auth.types.ts`)
```typescript
type UserRole = 'client' | 'driver' | 'admin' | 'supervisor'
type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification'

interface User { ... }
interface LoginCredentials { email, password }
interface RegisterData { email, password, firstName, lastName, phone?, role? }
interface TokenResponse { accessToken, refreshToken, expiresIn }
interface AuthResponse extends TokenResponse { user }
```

#### 2. **Auth Store (Pinia)** (`src/modules/auth/store/auth.store.ts`)

**Estado:**
- `user`: User | null
- `accessToken`: string | null
- `refreshToken`: string | null
- `loading`: boolean
- `error`: string | null

**Getters:**
- `isAuthenticated`: boolean
- `currentUser`: User | null
- `userRole`: UserRole | null
- `isClient`, `isDriver`, `isAdmin`, `isSupervisor`: boolean

**Actions:**
- `initAuth()`: Cargar auth desde localStorage
- `register(registerData)`: Registrar nuevo usuario
- `login(credentials)`: Login
- `logout()`: Cerrar sesión y limpiar estado
- `refreshAccessToken()`: Renovar access token
- `fetchProfile()`: Obtener perfil del usuario
- `changePassword(currentPassword, newPassword)`
- `forgotPassword(email)`
- `resetPassword(token, newPassword)`
- `hasRole(role)`: Verificar rol
- `clearAuth()`: Limpiar autenticación

Características:
- Persistencia en `localStorage`: `access_token`, `refresh_token`, `user`
- Integración completa con axios
- Manejo de errores con mensajes descriptivos

#### 3. **Axios Interceptors** (`src/api/axios.ts`)

**Request Interceptor:**
- Adjunta automáticamente `Authorization: Bearer <token>` a todas las requests

**Response Interceptor:**
- Maneja errores 401 (No autorizado)
- Intenta refrescar token automáticamente
- Cola de requests fallidas mientras se refresca
- Previene loops infinitos con flag `isRefreshing`
- Redirige a login si no se puede refrescar
- Maneja errores 403 (Forbidden) redirigiendo a `/unauthorized`

#### 4. **Router Guards** (`src/router/guards/auth.guard.ts`)

**Guards disponibles:**
- `authGuard`: Requiere autenticación
- `guestGuard`: Solo para no autenticados (login, register)
- `roleGuard(allowedRoles)`: Factory para roles específicos
- `adminGuard`: Solo admin
- `supervisorGuard`: Supervisor o admin
- `driverGuard`: Solo driver
- `clientGuard`: Solo client

#### 5. **Router Configuration** (`src/router/index.ts`)

**Global navigation guard:**
- Inicializa auth desde localStorage
- Actualiza título de página
- Verifica autenticación si `meta.requiresAuth: true`
- Verifica roles si `meta.roles: ['admin', 'supervisor']`
- Redirige a login con `?redirect=/ruta/protegida`

**Rutas configuradas:**
- `/` - Home (público)
- `/about` - About (público)
- `/auth/login` - Login (solo guests)
- `/auth/register` - Registro (solo guests)
- `/dashboard` - Dashboard general (autenticado)
- `/admin/dashboard` - Admin dashboard (admin/supervisor)
- `/driver/dashboard` - Driver dashboard (driver)
- `/unauthorized` - Acceso denegado
- `404` - Not Found

#### 6. **Componentes**

**LoginView.vue** (`src/modules/auth/views/LoginView.vue`)
- Formulario con email y password
- Validación en tiempo real
- Toggle para mostrar/ocultar password
- Checkbox "Recordarme"
- Link a "¿Olvidaste tu contraseña?"
- Link a registro
- Redirige según rol después de login
- Diseño responsive con gradiente

**RegisterView.vue** (`src/modules/auth/views/RegisterView.vue`)
- Formulario completo: firstName, lastName, email, phone, password, role
- Validación de contraseña con indicadores visuales:
  - ✓ Mínimo 6 caracteres
  - ✓ Una mayúscula
  - ✓ Una minúscula
  - ✓ Un número
- Selector de rol (Cliente/Conductor)
- Checkbox términos y condiciones
- Link a login
- Validación en tiempo real
- Diseño responsive

**Vistas de Dashboard:**
- `DashboardView.vue` - Dashboard general
- `admin/DashboardView.vue` - Admin dashboard con stats
- `driver/DashboardView.vue` - Driver dashboard con stats
- `UnauthorizedView.vue` - Página 403
- `NotFoundView.vue` - Página 404

#### 7. **Environment Variables** (`.env`)
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_ENV=development
VITE_APP_TITLE=Plataforma de Transporte
```

---

## 🔄 Flujo REAL de Autenticación

### 1. **Registro**
```
Usuario completa formulario
  ↓
Vue llama authStore.register(data)
  ↓
Axios POST /auth/register con data
  ↓
Backend valida con RegisterDto
  ↓
Backend hashea password con bcrypt
  ↓
Backend guarda User en PostgreSQL
  ↓
Backend genera JWT + Refresh Token
  ↓
Backend responde { accessToken, refreshToken, user }
  ↓
Frontend guarda tokens en localStorage
  ↓
Frontend guarda user en Pinia store
  ↓
Frontend redirige a dashboard según rol
```

### 2. **Login**
```
Usuario ingresa email y password
  ↓
Vue llama authStore.login(credentials)
  ↓
Axios POST /auth/login
  ↓
Backend busca user por email
  ↓
Backend compara password con bcrypt
  ↓
Backend verifica user.isActive()
  ↓
Backend actualiza lastLogin
  ↓
Backend genera JWT + Refresh Token
  ↓
Backend guarda RefreshToken en BD
  ↓
Backend responde { accessToken, refreshToken, user }
  ↓
Frontend guarda en localStorage
  ↓
Frontend actualiza Pinia store
  ↓
Router redirige según rol
```

### 3. **Request Protegida**
```
Usuario navega a /dashboard
  ↓
Router guard verifica isAuthenticated
  ↓
Usuario hace request a API
  ↓
Axios interceptor adjunta Authorization: Bearer <token>
  ↓
Backend JwtAuthGuard verifica token
  ↓
Backend JwtStrategy valida payload
  ↓
Backend inyecta user en request
  ↓
Backend procesa request
  ↓
Backend responde datos
  ↓
Frontend actualiza UI
```

### 4. **Token Expirado (Auto-refresh)**
```
Usuario hace request
  ↓
Backend responde 401 Unauthorized
  ↓
Axios interceptor detecta 401
  ↓
Axios pausa request original
  ↓
Axios llama authStore.refreshAccessToken()
  ↓
Axios POST /auth/refresh con refreshToken
  ↓
Backend verifica refresh token en BD
  ↓
Backend verifica JWT refresh token
  ↓
Backend revoca refresh token viejo
  ↓
Backend genera nuevos tokens
  ↓
Backend responde { accessToken, refreshToken }
  ↓
Frontend actualiza tokens en localStorage
  ↓
Axios reintenta request original con nuevo token
  ↓
Request exitosa
```

### 5. **Logout**
```
Usuario hace clic en "Cerrar Sesión"
  ↓
Vue llama authStore.logout()
  ↓
Axios POST /auth/logout con refreshToken
  ↓
Backend revoca refresh token (isRevoked = true)
  ↓
Frontend limpia localStorage
  ↓
Frontend limpia Pinia store
  ↓
Router redirige a /auth/login
```

---

## 🛡️ Seguridad Implementada

### Backend
- ✅ Passwords hasheados con bcrypt (10 rounds)
- ✅ Validación de DTOs con class-validator
- ✅ JWT con secreto configurado (env)
- ✅ Refresh tokens almacenados en BD
- ✅ Tokens revocables (logout, cambio password)
- ✅ Verificación de usuario activo en cada request
- ✅ Guards para autenticación y autorización
- ✅ Tracking de userAgent e ipAddress
- ✅ Expiration times configurables
- ✅ Forbidden (403) para roles insuficientes

### Frontend
- ✅ Tokens almacenados en localStorage (no cookies httpOnly, trade-off)
- ✅ Auto-refresh de tokens expirados
- ✅ Limpieza de auth en logout
- ✅ Router guards en todas las rutas
- ✅ Validación de formularios
- ✅ Manejo de errores con mensajes claros
- ✅ Prevención de loops infinitos en refresh
- ✅ Queue de requests durante refresh
- ✅ Redireciones según rol

---

## 🎭 Roles y Permisos

### Roles Disponibles

| Rol           | Valor       | Descripción                        |
|---------------|-------------|------------------------------------|
| Cliente       | `client`    | Usuario que solicita viajes        |
| Conductor     | `driver`    | Usuario que ofrece viajes          |
| Administrador | `admin`     | Control total del sistema          |
| Supervisor    | `supervisor`| Monitoreo y reportes               |

### Ejemplo de Uso en Backend

```typescript
// Proteger ruta solo para admins
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get('users')
getAllUsers() { ... }

// Proteger para admin y supervisor
@Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
@Get('analytics')
getAnalytics() { ... }
```

### Ejemplo de Uso en Frontend

```typescript
// En router
{
  path: '/admin',
  meta: {
    requiresAuth: true,
    roles: ['admin', 'supervisor']
  }
}

// En componente
const authStore = useAuthStore()
if (authStore.isAdmin) {
  // Mostrar funcionalidad de admin
}
```

---

## 📁 Estructura de Archivos

### Backend
```
backend/src/
├── common/
│   ├── decorators/
│   │   ├── get-user.decorator.ts
│   │   ├── roles.decorator.ts
│   │   └── index.ts
│   └── guards/
│       ├── jwt-auth.guard.ts
│       ├── roles.guard.ts
│       └── index.ts
└── modules/auth/
    ├── dto/
    │   ├── login.dto.ts
    │   ├── register.dto.ts
    │   ├── refresh-token.dto.ts
    │   ├── change-password.dto.ts
    │   ├── forgot-password.dto.ts
    │   ├── reset-password.dto.ts
    │   └── index.ts
    ├── entities/
    │   ├── user.entity.ts
    │   ├── refresh-token.entity.ts
    │   └── index.ts
    ├── interfaces/
    │   ├── auth.interface.ts
    │   └── index.ts
    ├── services/
    │   ├── auth.service.ts
    │   └── index.ts
    ├── strategies/
    │   ├── jwt.strategy.ts
    │   └── index.ts
    ├── auth.controller.ts
    └── auth.module.ts
```

### Frontend
```
src/
├── api/
│   ├── axios.ts
│   └── index.ts
├── modules/auth/
│   ├── router/
│   │   └── index.ts
│   ├── store/
│   │   ├── auth.store.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   └── index.ts
│   └── views/
│       ├── LoginView.vue
│       ├── RegisterView.vue
│       └── index.ts
├── router/
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── index.ts
│   └── index.ts
└── views/
    ├── DashboardView.vue
    ├── UnauthorizedView.vue
    ├── NotFoundView.vue
    ├── admin/
    │   └── DashboardView.vue
    └── driver/
        └── DashboardView.vue
```

---

## 🧪 Testing (Pendiente)

### Backend
- [ ] Unit tests para AuthService
- [ ] E2E tests para AuthController
- [ ] Tests de JWT Strategy
- [ ] Tests de Guards

### Frontend
- [ ] Unit tests para auth store
- [ ] E2E tests de flujo de login/registro
- [ ] Tests de router guards
- [ ] Tests de axios interceptors

---

## 🚀 Próximos Pasos

### Mejoras de Seguridad
1. **Implementar email verification**
   - Enviar email con token de verificación
   - Endpoint para verificar email
   - Bloquear acceso hasta verificar

2. **Rate limiting**
   - Limitar intentos de login
   - Throttling en endpoints sensibles

3. **2FA (Two-Factor Authentication)**
   - TOTP con authenticator apps
   - Códigos por SMS

4. **Session management**
   - Listar sesiones activas
   - Cerrar sesión en otros dispositivos
   - Notificaciones de login

### Mejoras de UX
1. **Forgot password completo**
   - Envío de emails
   - Vista para reset de password

2. **Social login**
   - Google OAuth
   - Facebook login

3. **Perfil de usuario**
   - Editar información
   - Subir avatar
   - Configuración de notificaciones

---

## 📝 Notas Importantes

### PostgreSQL
⚠️ **Importante**: El backend requiere PostgreSQL corriendo.

Ver instrucciones de instalación en:
- `backend/docs/DESARROLLO_LOCAL.md`

### Redis (Opcional)
Redis está configurado pero es opcional en desarrollo.

### Tokens
- **Access Token**: Expira en 7 días (configurable)
- **Refresh Token**: Expira en 30 días (configurable)

### Roles por Defecto
- Al registrarse, el rol por defecto es `client`
- Solo admins pueden asignar roles `admin` o `supervisor`

---

## ✅ Checklist de Implementación

### Backend
- [x] User Entity con roles y estados
- [x] RefreshToken Entity
- [x] DTOs con validaciones
- [x] AuthService completo
- [x] JWT Strategy
- [x] JwtAuthGuard
- [x] RolesGuard
- [x] Decorators (@Roles, @GetUser)
- [x] AuthController con todos los endpoints
- [x] AuthModule configurado
- [x] Documentación Swagger

### Frontend
- [x] Types e interfaces
- [x] Auth Store (Pinia)
- [x] Axios con interceptors
- [x] Router guards
- [x] LoginView component
- [x] RegisterView component
- [x] Dashboard views
- [x] Error pages (401, 403, 404)
- [x] Router configuration
- [x] Environment variables
- [x] .gitignore actualizado

---

## 🎉 Conclusión

Sistema de autenticación completo y funcional implementado con:
- ✅ JWT + Refresh Tokens
- ✅ 4 roles (client, driver, admin, supervisor)
- ✅ Guards en backend y frontend
- ✅ Auto-refresh de tokens
- ✅ Protección de rutas
- ✅ UI moderna y responsive
- ✅ Manejo robusto de errores
- ✅ TypeScript en todo el stack
- ✅ Arquitectura modular y escalable

**¡Listo para desarrollo y pruebas!** 🚀
