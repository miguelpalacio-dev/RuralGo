# 🏗️ Reglas de Arquitectura - Transporte Local Platform

## 📐 Principios Fundamentales

### 1. **Separation of Concerns (SoC)**

Cada parte del código debe tener una única responsabilidad clara.

```
❌ MAL: Todo en un componente
✅ BIEN: Separar lógica, UI, estado y servicios
```

### 2. **DRY - Don't Repeat Yourself**

No duplicar código. Crear componentes, composables y utilidades reutilizables.

### 3. **KISS - Keep It Simple, Stupid**

Escribir código simple y fácil de entender. Evitar complejidad innecesaria.

### 4. **YAGNI - You Aren't Gonna Need It**

No implementar funcionalidades hasta que sean realmente necesarias.

---

## 🎯 Arquitectura Modular

### Regla de Oro

> **"Cada módulo debe poder funcionar de forma independiente"**

### Estructura de un Módulo

```
modulo/
├── components/     # Componentes SOLO de este módulo
├── views/          # Vistas/páginas del módulo
├── services/       # Lógica de API
├── store/          # Estado del módulo (Pinia)
├── composables/    # Hooks personalizados
├── router/         # Rutas del módulo
└── types/          # TypeScript types específicos
```

### ¿Cuándo crear un nuevo módulo?

- ✅ Cuando represente una funcionalidad de negocio clara (auth, trips, payments)
- ✅ Cuando tenga su propio estado y lógica
- ✅ Cuando pueda crecer independientemente
- ❌ NO crear módulos para 2-3 componentes simples

---

## 📁 Reglas de Carpetas

### `/components` - Componentes Globales

**Solo aquí van:**

- Componentes reutilizables en TODA la app
- Componentes de UI básicos (Button, Input, Modal)
- Componentes sin lógica de negocio

**Nombrado:**

```typescript
// PascalCase + descriptivo
Button.vue
InputField.vue
ModalDialog.vue
DataTable.vue
```

---

### `/modules` - Módulos de Negocio

**Solo aquí van:**

- Funcionalidades completas de negocio
- Componentes específicos del dominio

**Regla importante:**

```
❌ NO importar componentes entre módulos
✅ SI necesitas compartir, muévelo a /components global
```

---

### `/composables` - Lógica Reutilizable

**Solo aquí van:**

- Hooks de Vue (funciones que usan ref, computed, watch)
- Lógica reutilizable entre componentes

**Nombrado:**

```typescript
// use + CamelCase
useAuth.ts
useGeolocation.ts
useSocket.ts
useDebounce.ts
```

**Estructura:**

```typescript
// composables/useAuth.ts
import { ref, computed } from 'vue'

export function useAuth() {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials) => {
    // lógica
  }

  return {
    user,
    isAuthenticated,
    login,
  }
}
```

---

### `/services` - Servicios y APIs

**Solo aquí van:**

- Llamadas HTTP
- Lógica de negocio sin estado
- Interacciones con APIs externas

**Nombrado:**

```typescript
// camelCase + Service.ts
authService.ts
tripService.ts
mapService.ts
```

**Estructura:**

```typescript
// services/authService.ts
import api from '@/api/axios'

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async logout() {
    await api.post('/auth/logout')
  },
}
```

---

### `/stores` - Estado Global (Pinia)

**Solo aquí van:**

- Estado compartido entre múltiples componentes
- Estado que persiste entre rutas

**¿Cuándo NO usar store?**

- Estado local de un componente (usar ref/reactive)
- Props entre padre-hijo
- Estado que no se comparte

**Nombrado:**

```typescript
// camelCase + Store.ts
authStore.ts
tripStore.ts
uiStore.ts
```

**Estructura:**

```typescript
// stores/authStore.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref('')

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials) {
    // lógica
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
  }
})
```

---

### `/types` - TypeScript Types

**Solo aquí van:**

- Interfaces globales
- Types compartidos
- Enums del sistema

**Nombrado:**

```typescript
// PascalCase.ts
User.ts
Trip.ts
Driver.ts
```

**Estructura:**

```typescript
// types/User.ts
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export enum UserRole {
  CLIENT = 'client',
  DRIVER = 'driver',
  ADMIN = 'admin',
}
```

---

### `/utils` - Utilidades

**Solo aquí van:**

- Funciones puras (sin efectos secundarios)
- Helpers generales
- Formateadores, validadores, transformadores

**Nombrado:**

```typescript
// camelCase.ts
dateFormatter.ts
validators.ts
stringHelpers.ts
```

---

## 🔄 Flujo de Datos

### Flujo Recomendado:

```
Componente
    ↓
Composable (usa)
    ↓
Store (estado)
    ↓
Service (API)
    ↓
Backend
```

### Ejemplo Práctico:

```vue
<!-- LoginView.vue -->
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { login, isLoading, error } = useAuth()

async function handleLogin() {
  await login(email.value, password.value)
}
</script>
```

```typescript
// composables/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  async function login(email: string, password: string) {
    try {
      await authStore.login({ email, password })
      router.push('/dashboard')
    } catch (error) {
      // manejo de error
    }
  }

  return { login }
}
```

```typescript
// stores/authStore.ts
export const useAuthStore = defineStore('auth', () => {
  async function login(credentials) {
    const data = await authService.login(credentials)
    token.value = data.token
    user.value = data.user
  }

  return { login }
})
```

```typescript
// services/authService.ts
export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
}
```

---

## 🛡️ Reglas de Importación

### 1. Usar Alias

```typescript
// ❌ MAL
import Button from '../../../components/Button.vue'

// ✅ BIEN
import Button from '@/components/Button.vue'
```

### 2. Orden de Imports

```typescript
// 1. Vue y librerías externas
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 2. Tipos
import type { User } from '@/types/User'

// 3. Stores
import { useAuthStore } from '@/stores/authStore'

// 4. Composables
import { useAuth } from '@/composables/useAuth'

// 5. Componentes
import Button from '@/components/Button.vue'

// 6. Utils y helpers
import { formatDate } from '@/utils/dateFormatter'
```

### 3. No Circular Dependencies

```typescript
// ❌ MAL
// A importa B, B importa A

// ✅ BIEN
// Mover lógica compartida a un tercer archivo
```

---

## 🚦 Reglas de Router

### 1. Rutas Agrupadas por Módulo

```typescript
// router/index.ts
const routes = [
  {
    path: '/auth',
    children: [{ path: 'login', component: () => import('@/modules/auth/views/LoginView.vue') }],
  },
  {
    path: '/trips',
    children: [
      { path: '', component: () => import('@/modules/trips/views/TripListView.vue') },
      { path: ':id', component: () => import('@/modules/trips/views/TripDetailView.vue') },
    ],
  },
]
```

### 2. Lazy Loading

```typescript
// ✅ SIEMPRE usar lazy loading
component: () => import('./views/HomeView.vue')

// ❌ NO hacer import directo
import HomeView from './views/HomeView.vue'
```

### 3. Guards por Rol

```typescript
{
  path: '/admin',
  meta: { requiresAuth: true, role: 'admin' },
  beforeEnter: (to, from, next) => {
    // verificar permisos
  }
}
```

---

## 🎨 Reglas de Componentes

### 1. Composition API Setup Script

```vue
<!-- ✅ USAR -->
<script setup lang="ts">
// código aquí
</script>

<!-- ❌ NO USAR Options API -->
<script>
export default {
  data() {},
}
</script>
```

### 2. Props y Emits Tipados

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

interface Emits {
  (e: 'update', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>
```

### 3. Un Componente = Un Archivo

```
❌ NO definir múltiples componentes en un archivo
✅ Un archivo .vue = un componente
```

---

## 📊 Reglas de Estado

### Cuándo usar:

| Necesidad                                    | Solución               |
| -------------------------------------------- | ---------------------- |
| Estado local de componente                   | `ref()` / `reactive()` |
| Estado compartido entre componentes hermanos | Props + Emits o Pinia  |
| Estado global de app                         | Pinia Store            |
| Estado que persiste                          | Pinia + localStorage   |
| Cache de API                                 | Pinia Store            |

---

## 🔐 Reglas de Seguridad

### 1. Nunca Exponer Tokens

```typescript
// ❌ MAL
console.log(token)

// ✅ BIEN
// Guardar en httpOnly cookies o localStorage con encriptación
```

### 2. Validar Siempre en Frontend Y Backend

```typescript
// Frontend: validación de UX
// Backend: validación de seguridad
```

### 3. Sanitizar Inputs

```typescript
// Usar librerías como DOMPurify para inputs HTML
```

---

## 🧪 Reglas de Testing

### 1. Qué Testear

✅ Lógica de negocio (composables, services)  
✅ Funciones puras (utils)  
✅ Componentes con interacción compleja  
❌ Componentes solo de UI sin lógica

### 2. Nombrado de Tests

```typescript
// nombreFuncion.test.ts o nombreFuncion.spec.ts
authService.test.ts
useAuth.test.ts
```

---

## 📏 Reglas de Código Limpio

### 1. Nombres Descriptivos

```typescript
// ❌ MAL
const x = fetchData()
const calc = (a, b) => a + b

// ✅ BIEN
const userList = await fetchUsers()
const calculateTotalPrice = (basePrice, tax) => basePrice + tax
```

### 2. Funciones Pequeñas

```typescript
// Una función debe hacer UNA cosa
// Máximo 20-30 líneas
// Si es más grande, dividir
```

### 3. Evitar Magic Numbers

```typescript
// ❌ MAL
if (status === 1) {
}

// ✅ BIEN
const STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
}
if (status === STATUS.ACTIVE) {
}
```

---

## 📝 Reglas de Comentarios

### Cuándo comentar:

✅ Lógica compleja que no es obvia  
✅ Decisiones de arquitectura importantes  
✅ TODOs y FIXMEs

### Cuándo NO comentar:

❌ Código que se explica solo  
❌ Código obvio

```typescript
// ❌ MAL: comentario obvio
// Incrementar contador
counter++

// ✅ BIEN: comentario útil
// Usamos debounce de 500ms para evitar llamadas excesivas
// a la API de geolocalización que tiene límite de rate
const debouncedSearch = debounce(search, 500)
```

---

## 🚀 Reglas de Performance

### 1. Lazy Loading de Rutas

```typescript
// SIEMPRE
component: () => import('./View.vue')
```

### 2. Computed en lugar de Methods

```typescript
// ✅ BIEN: se cachea
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// ❌ MAL: se ejecuta cada render
function fullName() {
  return `${firstName.value} ${lastName.value}`
}
```

### 3. v-show vs v-if

```typescript
// v-show: alternar frecuentemente (siempre en DOM)
// v-if: renderizado condicional (destruye/crea)
```

---

## ✅ Checklist Antes de Commit

- [ ] ¿El código sigue las convenciones de nombrado?
- [ ] ¿Los imports están organizados?
- [ ] ¿Hay código duplicado que pueda extraerse?
- [ ] ¿Los tipos TypeScript están correctos?
- [ ] ¿Las funciones tienen una sola responsabilidad?
- [ ] ¿El código es fácil de entender?
- [ ] ¿Hay console.logs olvidados?
- [ ] ¿Pasaron los tests?
- [ ] ¿Pasó el linter?

---

**Estas reglas son una guía viva. Adaptarlas según las necesidades del proyecto.**
