# 📝 Convenciones de Código - Transporte Local Platform

## 🎨 Convenciones de Nombrado

### **Archivos y Carpetas**

| Tipo             | Convención             | Ejemplo                             |
| ---------------- | ---------------------- | ----------------------------------- |
| Componentes Vue  | PascalCase.vue         | `UserCard.vue`, `TripList.vue`      |
| Composables      | use + CamelCase.ts     | `useAuth.ts`, `useMap.ts`           |
| Services         | camelCase + Service.ts | `authService.ts`, `tripService.ts`  |
| Stores           | camelCase + Store.ts   | `authStore.ts`, `userStore.ts`      |
| Types/Interfaces | PascalCase.ts          | `User.ts`, `Trip.ts`                |
| Utils            | camelCase.ts           | `dateFormatter.ts`, `validators.ts` |
| Carpetas         | kebab-case             | `auth-module/`, `trip-history/`     |

---

### **Variables y Constantes**

```typescript
// Variables: camelCase
const userName = 'John'
let isActive = true

// Constantes globales: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_ATTEMPTS = 3

// Constantes locales: camelCase con const
const maxUsers = 100

// Booleanos: is, has, can, should
const isLoading = ref(false)
const hasPermission = computed(() => true)
const canEdit = ref(true)
const shouldRender = computed(() => false)

// Arrays: plural
const users = ref([])
const trips = reactive([])

// Objetos: singular
const user = ref({ name: 'John' })
const trip = reactive({ id: 1 })
```

---

### **Funciones**

```typescript
// Funciones: camelCase, verbos
function fetchUsers() {}
function calculateTotal() {}
function validateEmail() {}

// Handlers de eventos: handle + Evento
function handleClick() {}
function handleSubmit() {}
function handleInputChange() {}

// Callbacks: on + Acción
function onSuccess() {}
function onError() {}
function onComplete() {}

// Async functions: async/await siempre
async function fetchUser() {
  const user = await api.get('/user')
  return user
}
```

---

### **Clases e Interfaces**

```typescript
// Clases: PascalCase
class UserService {}
class TripManager {}

// Interfaces: PascalCase (sin prefijo I)
interface User {
  id: string
  name: string
}

// Types: PascalCase
type UserRole = 'admin' | 'driver' | 'client'

// Enums: PascalCase
enum TripStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}
```

---

## 📦 Estructura de Componentes Vue

### **Orden de Bloques**

```vue
<!-- 1. Template -->
<template>
  <div>
    <!-- contenido -->
  </div>
</template>

<!-- 2. Script Setup -->
<script setup lang="ts">
// código
</script>

<!-- 3. Styles -->
<style scoped>
/* estilos */
</style>
```

---

### **Orden Dentro de Script Setup**

```vue
<script setup lang="ts">
// 1. IMPORTS
// 1.1. Vue y librerías
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 1.2. Types
import type { User } from '@/types/User'

// 1.3. Stores
import { useAuthStore } from '@/stores/authStore'

// 1.4. Composables
import { useAuth } from '@/composables/useAuth'

// 1.5. Componentes
import Button from '@/components/Button.vue'
import UserCard from '@/components/UserCard.vue'

// 1.6. Services y Utils
import { userService } from '@/services/userService'
import { formatDate } from '@/utils/dateFormatter'

// 2. PROPS & EMITS
interface Props {
  userId: string
  isActive?: boolean
}

interface Emits {
  (e: 'update', value: string): void
  (e: 'delete'): void
}

const props = withDefaults(defineProps<Props>(), {
  isActive: true,
})

const emit = defineEmits<Emits>()

// 3. COMPOSABLES & STORES
const router = useRouter()
const authStore = useAuthStore()
const { login, logout } = useAuth()

// 4. REACTIVE STATE
const count = ref(0)
const user = ref<User | null>(null)
const isLoading = ref(false)

// 5. COMPUTED
const doubleCount = computed(() => count.value * 2)
const fullName = computed(() => `${user.value?.firstName} ${user.value?.lastName}`)

// 6. WATCHERS
watch(
  () => props.userId,
  (newId) => {
    fetchUser(newId)
  },
)

// 7. FUNCTIONS
async function fetchUser(id: string) {
  isLoading.value = true
  try {
    user.value = await userService.getById(id)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

function handleClick() {
  emit('update', 'new value')
}

// 8. LIFECYCLE HOOKS
onMounted(() => {
  fetchUser(props.userId)
})

onUnmounted(() => {
  // cleanup
})

// 9. EXPOSE (si es necesario)
defineExpose({
  fetchUser,
})
</script>
```

---

## 🎯 Props y Emits

### **Props**

```typescript
// ✅ BIEN: Props tipados
interface Props {
  title: string // requerido
  count?: number // opcional
  isActive?: boolean // opcional con default
  user: User // tipo complejo
  items: string[] // array
  onClick?: () => void // función
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  isActive: true,
  items: () => [], // arrays/objects necesitan función
})

// ❌ MAL: Sin tipos
const props = defineProps(['title', 'count'])
```

### **Emits**

```typescript
// ✅ BIEN: Emits tipados
interface Emits {
  (e: 'update', id: string): void
  (e: 'delete', id: string): void
  (e: 'submit', data: FormData): void
}

const emit = defineEmits<Emits>()

// Uso
emit('update', userId)
emit('submit', formData)

// ❌ MAL: Sin tipos
const emit = defineEmits(['update', 'delete'])
```

---

## 🎨 Convenciones de Template

### **Directivas**

```vue
<!-- Orden de directivas -->
<div
  v-if="isVisible"
  v-for="item in items"
  :key="item.id"
  :class="{ active: isActive }"
  :style="{ color: textColor }"
  @click="handleClick"
>

<!-- v-if vs v-show -->
<!-- v-if: renderizado condicional (destruye/crea) -->
<div v-if="showExpensive">Contenido pesado</div>

<!-- v-show: toggle display (siempre en DOM) -->
<div v-show="isVisible">Toggle frecuente</div>

<!-- Evitar v-if con v-for -->
<!-- ❌ MAL -->
<div v-for="user in users" v-if="user.isActive">

<!-- ✅ BIEN -->
<div v-for="user in activeUsers">
```

### **Atributos**

```vue
<!-- Orden de atributos -->
<input
  id="username"
  ref="inputRef"
  type="text"
  class="input"
  :class="dynamicClass"
  :disabled="isDisabled"
  v-model="username"
  @input="handleInput"
  @blur="handleBlur"
/>
```

### **Nombrado de Eventos**

```vue
<!-- kebab-case para eventos -->
<UserCard @user-selected="handleUserSelected" @edit-clicked="handleEditClicked" />

<!-- En el componente hijo -->
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'user-selected', id: string): void
  (e: 'edit-clicked'): void
}>()
</script>
```

---

## 🎨 Convenciones de CSS

### **Scoped Styles**

```vue
<style scoped>
/* Siempre usar scoped para componentes */
.user-card {
  padding: 1rem;
}
</style>
```

### **Clases BEM**

```vue
<template>
  <div class="user-card">
    <div class="user-card__header">
      <h2 class="user-card__title">Title</h2>
    </div>
    <div class="user-card__body">
      <p class="user-card__text user-card__text--highlight">Text</p>
    </div>
  </div>
</template>

<style scoped>
/* Block */
.user-card {
}

/* Element */
.user-card__header {
}
.user-card__title {
}

/* Modifier */
.user-card__text--highlight {
}
</style>
```

### **Variables CSS**

```css
/* styles/variables.css */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
  --color-danger: #ef4444;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
}

/* Uso */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}
```

---

## 🔧 Convenciones de TypeScript

### **Tipos vs Interfaces**

```typescript
// Interface: para objetos y contratos
interface User {
  id: string
  name: string
}

// Type: para unions, primitivos, tuples
type UserRole = 'admin' | 'driver' | 'client'
type Coordinates = [number, number]
type ID = string | number
```

### **Tipos de Funciones**

```typescript
// Funciones simples
function add(a: number, b: number): number {
  return a + b
}

// Funciones async
async function fetchUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`)
  return response.data
}

// Callbacks
type OnSuccess = (data: User) => void
type OnError = (error: Error) => void

function fetchWithCallbacks(onSuccess: OnSuccess, onError: OnError): void {
  // lógica
}
```

### **Generics**

```typescript
// Generic functions
function identity<T>(value: T): T {
  return value
}

// Generic interfaces
interface Response<T> {
  data: T
  status: number
  message: string
}

// Uso
const userResponse: Response<User> = await api.get('/user')
const tripsResponse: Response<Trip[]> = await api.get('/trips')
```

### **Utility Types**

```typescript
// Partial: hacer propiedades opcionales
type PartialUser = Partial<User>

// Required: hacer propiedades requeridas
type RequiredUser = Required<User>

// Pick: seleccionar propiedades
type UserPreview = Pick<User, 'id' | 'name'>

// Omit: omitir propiedades
type UserWithoutPassword = Omit<User, 'password'>

// Record: objeto con keys específicas
type UserMap = Record<string, User>
```

---

## 🔄 Convenciones de Async/Await

```typescript
// ✅ BIEN: manejo completo de errores
async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await api.get(`/users/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

// ✅ BIEN: con loading state
const isLoading = ref(false)
const error = ref<Error | null>(null)

async function fetchUser(id: string) {
  isLoading.value = true
  error.value = null

  try {
    const response = await api.get(`/users/${id}`)
    user.value = response.data
  } catch (err) {
    error.value = err as Error
  } finally {
    isLoading.value = false
  }
}

// ❌ MAL: sin manejo de errores
async function fetchUser(id: string) {
  const response = await api.get(`/users/${id}`)
  return response.data
}
```

---

## 🎯 Convenciones de Composables

```typescript
// composables/useAuth.ts
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  // 1. Refs locales
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // 2. Composables y stores
  const router = useRouter()
  const authStore = useAuthStore()

  // 3. Computed
  const isAuthenticated = computed(() => !!authStore.token)

  // 4. Functions
  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      await authStore.login({ email, password })
      router.push('/dashboard')
    } catch (err) {
      error.value = err as Error
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    authStore.logout()
    router.push('/login')
  }

  // 5. Return público
  return {
    // State
    isLoading,
    error,

    // Computed
    isAuthenticated,

    // Methods
    login,
    logout,
  }
}
```

---

## 🏪 Convenciones de Pinia Stores

```typescript
// stores/authStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 1. STATE
  const user = ref<User | null>(null)
  const token = ref<string>('')

  // 2. GETTERS (computed)
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || null)

  // 3. ACTIONS
  async function login(credentials: LoginCredentials) {
    const response = await authService.login(credentials)
    user.value = response.user
    token.value = response.token

    // Persistir
    localStorage.setItem('token', response.token)
  }

  function logout() {
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
  }

  function setUser(newUser: User) {
    user.value = newUser
  }

  // 4. RETURN
  return {
    // State
    user,
    token,

    // Getters
    isAuthenticated,
    userRole,

    // Actions
    login,
    logout,
    setUser,
  }
})
```

---

## 📝 Convenciones de Comentarios

### **JSDoc para Funciones**

```typescript
/**
 * Calcula el precio total de un viaje
 * @param basePrice - Precio base del viaje
 * @param distance - Distancia en kilómetros
 * @param timeOfDay - 'day' o 'night' para tarifa nocturna
 * @returns Precio total calculado
 */
function calculateTripPrice(
  basePrice: number,
  distance: number,
  timeOfDay: 'day' | 'night',
): number {
  // lógica
}
```

### **TODOs y FIXMEs**

```typescript
// TODO: Implementar paginación
// FIXME: Este método falla con arrays vacíos
// HACK: Workaround temporal hasta actualizar la librería
// NOTE: Esta función es crítica para el rendimiento
```

---

## ✅ Resumen de Buenas Prácticas

### ✅ HACER

- Usar TypeScript siempre
- Composition API con `<script setup>`
- Props y emits tipados
- Async/await con try/catch
- Composables para lógica reutilizable
- Lazy loading de rutas
- Scoped styles
- Nombres descriptivos

### ❌ EVITAR

- Options API
- Props sin tipos
- v-if con v-for
- console.log en producción
- Magic numbers
- Código duplicado
- Funciones largas (+50 líneas)
- Imports circulares

---

**Estas convenciones aseguran código limpio, mantenible y escalable.**
