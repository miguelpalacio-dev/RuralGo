# 🖥️ Guía de Desarrollo Local - Transporte Local Platform

Esta guía te ayudará a configurar y ejecutar el proyecto en tu máquina local.

---

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

### Software Requerido

| Software    | Versión Mínima | Versión Recomendada | Link de Descarga                    |
| ----------- | -------------- | ------------------- | ----------------------------------- |
| **Node.js** | 20.19.0+       | 22.12.0+            | [nodejs.org](https://nodejs.org/)   |
| **npm**     | 10.0.0+        | 11.0.0+             | (incluido con Node.js)              |
| **Git**     | 2.40.0+        | Última              | [git-scm.com](https://git-scm.com/) |

### Software Opcional (Recomendado)

| Software         | Propósito                             |
| ---------------- | ------------------------------------- |
| **VS Code**      | Editor de código recomendado          |
| **Vue DevTools** | Extensión de navegador para debugging |
| **Postman**      | Para testing de APIs                  |

### Verificar Instalaciones

```bash
# Verificar Node.js
node --version
# Salida esperada: v22.x.x o superior

# Verificar npm
npm --version
# Salida esperada: 11.x.x o superior

# Verificar Git
git --version
# Salida esperada: git version 2.x.x
```

---

## 🚀 Instalación y Configuración

### Paso 1: Clonar el Repositorio (si aplica)

```bash
# Si el proyecto está en un repositorio Git
git clone <url-del-repositorio>
cd transporte-local-platform

# O si ya tienes la carpeta, navegar a ella
cd "d:\Estudio\Proyecto Vue"
```

### Paso 2: Instalar Dependencias

```bash
# Instalar todas las dependencias del proyecto
npm install

# Esto instalará:
# - Vue 3, Vue Router, Pinia
# - Vite (build tool)
# - TypeScript
# - Vitest, Playwright (testing)
# - ESLint, Prettier (code quality)
# - Y todas las demás dependencias...
```

**⏱️ Tiempo estimado:** 2-5 minutos (dependiendo de tu conexión)

**📦 Espacio requerido:** ~500 MB en `node_modules/`

#### Posibles Problemas Durante la Instalación

**Problema: Errores de permisos**

```bash
# Windows (ejecutar PowerShell como Administrador)
npm install

# Linux/Mac
sudo npm install
```

**Problema: npm lento**

```bash
# Limpiar caché de npm
npm cache clean --force

# Reinstalar
npm install
```

### Paso 3: Verificar la Instalación

```bash
# Verificar que las dependencias se instalaron correctamente
npm list --depth=0

# Deberías ver:
# - vue
# - vue-router
# - pinia
# - vite
# - typescript
# - y más...
```

---

## 🎮 Comandos Principales

### Desarrollo

#### Iniciar Servidor de Desarrollo

```bash
npm run dev
```

**¿Qué hace este comando?**

- ✅ Inicia Vite en modo desarrollo
- ✅ Abre el proyecto en `http://localhost:5173`
- ✅ Habilita Hot Module Replacement (HMR)
- ✅ Los cambios se reflejan automáticamente en el navegador

**Salida esperada:**

```
VITE v8.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Acceder a la aplicación:**

- 🌐 Abrir navegador en: `http://localhost:5173`

**Detener el servidor:**

- Presionar `Ctrl + C` en la terminal

#### Iniciar en Otro Puerto

```bash
# Usar puerto específico
npm run dev -- --port 3000

# Exponer en la red local
npm run dev -- --host

# Ambos
npm run dev -- --host --port 3000
```

### Build de Producción

#### Compilar para Producción

```bash
npm run build
```

**¿Qué hace este comando?**

- ✅ Compila TypeScript a JavaScript
- ✅ Optimiza y minifica el código
- ✅ Genera bundle optimizado
- ✅ Crea carpeta `dist/` con los archivos

**Salida esperada:**

```
vite v8.x.x building for production...
✓ xxx modules transformed.
dist/index.html                  x.xx kB
dist/assets/index-xxxxx.js      xxx.xx kB
Build complete!
```

#### Previsualizar Build de Producción

```bash
npm run preview
```

**¿Qué hace?**

- Sirve la carpeta `dist/` en modo producción
- Permite probar el build antes de deployment
- Por defecto en `http://localhost:4173`

---

## 🧪 Testing

### Tests Unitarios (Vitest)

#### Ejecutar Tests Unitarios

```bash
# Ejecutar todos los tests una vez
npm run test:unit

# Ejecutar en modo watch (se re-ejecutan al cambiar archivos)
npm run test:unit -- --watch

# Ejecutar con coverage
npm run test:unit -- --coverage
```

**¿Qué testea?**

- Composables
- Services
- Utils
- Stores de Pinia
- Lógica de componentes

### Tests End-to-End (Playwright)

#### Instalar Navegadores de Playwright (primera vez)

```bash
npx playwright install
```

#### Ejecutar Tests E2E

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar en modo UI (interfaz gráfica)
npx playwright test --ui

# Ejecutar en navegador específico
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Ejecutar test específico
npx playwright test tests/login.spec.ts
```

**¿Qué testea?**

- Flujos completos de usuario
- Interacciones en el navegador
- Navegación entre páginas
- Formularios y validaciones

---

## 🔧 Code Quality

### Linter (ESLint)

#### Verificar Código

```bash
# Verificar todos los archivos
npm run lint

# Verificar archivo específico
npx eslint src/components/Button.vue
```

#### Arreglar Automáticamente

```bash
# Arreglar problemas automáticamente
npx eslint src --fix
```

### Formateo (Prettier)

#### Formatear Código

```bash
# Formatear todo el proyecto
npm run format

# Verificar si hay archivos sin formatear
npm run format -- --check

# Formatear archivo específico
npx prettier --write src/components/Button.vue
```

---

## 📦 Gestión de Dependencias

### Ver Dependencias Instaladas

```bash
# Lista de dependencias principales
npm list --depth=0

# Ver información de una dependencia específica
npm list vue
npm list pinia
```

### Instalar Nueva Dependencia

```bash
# Dependencia de producción
npm install nombre-libreria

# Dependencia de desarrollo
npm install -D nombre-libreria

# Versión específica
npm install vue@3.5.0
```

### Actualizar Dependencias

```bash
# Ver paquetes desactualizados
npm outdated

# Actualizar todos los paquetes (con cuidado)
npm update

# Actualizar paquete específico
npm update vue

# Actualizar a última versión (breaking changes)
npm install vue@latest
```

### Desinstalar Dependencia

```bash
npm uninstall nombre-libreria
```

---

## 🌍 Variables de Entorno

### Crear Archivo de Variables

```bash
# En la raíz del proyecto, crear archivo .env
```

**Ejemplo de `.env`:**

```env
# API
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Google Maps (ejemplo)
VITE_GOOGLE_MAPS_API_KEY=tu-api-key-aqui

# WebSocket
VITE_SOCKET_URL=ws://localhost:3001

# Entorno
VITE_ENV=development
```

**Ejemplo de `.env.production`:**

```env
VITE_API_BASE_URL=https://api.tudominio.com
VITE_ENV=production
```

### Usar Variables en el Código

```typescript
// En cualquier archivo .ts o .vue
const apiUrl = import.meta.env.VITE_API_BASE_URL
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
```

**⚠️ Importante:**

- Solo las variables con prefijo `VITE_` son accesibles en el cliente
- Nunca subir `.env` a Git (ya está en `.gitignore`)
- Crear `.env.example` con las variables necesarias (sin valores sensibles)

---

## 🛠️ Configuración de VS Code (Recomendado)

### Extensiones Necesarias

Instalar estas extensiones en VS Code:

1. **Vue Official** (`Vue.volar`)

   ```
   code --install-extension Vue.volar
   ```

2. **TypeScript Vue Plugin** (`Vue.vscode-typescript-vue-plugin`)

   ```
   code --install-extension Vue.vscode-typescript-vue-plugin
   ```

3. **ESLint** (`dbaeumer.vscode-eslint`)

   ```
   code --install-extension dbaeumer.vscode-eslint
   ```

4. **Prettier** (`esbenp.prettier-vscode`)
   ```
   code --install-extension esbenp.prettier-vscode
   ```

### Configuración de VS Code

Crear `.vscode/settings.json` (si no existe):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 🔍 Debugging

### Debugging en VS Code

Crear `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

**Cómo usar:**

1. Iniciar servidor: `npm run dev`
2. Poner breakpoints en tu código
3. Presionar F5 en VS Code
4. El navegador se abrirá y pausará en los breakpoints

### Debugging en Navegador

#### Vue DevTools

**Chrome/Edge:**

```
https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd
```

**Firefox:**

```
https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/
```

**Cómo usar:**

1. Abrir DevTools (F12)
2. Buscar pestaña "Vue"
3. Explorar componentes, Pinia stores, router, etc.

---

## 🚨 Troubleshooting

### Problema: Puerto 5173 ya en uso

```bash
# Windows - Encontrar proceso en el puerto
netstat -ano | findstr :5173

# Matar proceso (usar PID del comando anterior)
taskkill /PID <numero-pid> /F

# O usar otro puerto
npm run dev -- --port 3000
```

### Problema: Errores de TypeScript

```bash
# Limpiar caché de TypeScript
npx tsc --build --clean

# Verificar tipos
npx vue-tsc --noEmit
```

### Problema: node_modules corrupto

```bash
# Eliminar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Problema: Caché de Vite corrupto

```bash
# Limpiar caché de Vite
Remove-Item -Recurse -Force .vite
Remove-Item -Recurse -Force dist
npm run dev
```

### Problema: ESLint no funciona

```bash
# Reinstalar ESLint
npm install -D eslint --force

# Verificar configuración
npx eslint --print-config src/App.vue
```

### Problema: Hot Reload no funciona

```bash
# Reiniciar servidor
Ctrl + C
npm run dev

# Si persiste, limpiar caché
Remove-Item -Recurse -Force .vite
npm run dev
```

---

## 📊 Monitoreo de Performance

### Analizar Bundle Size

```bash
# Build con reporte
npm run build

# Ver tamaño de archivos en dist/
Get-ChildItem -Path dist/assets -Recurse | Select-Object Name, Length | Sort-Object Length -Descending
```

### Lighthouse (Chrome DevTools)

1. Abrir Chrome DevTools (F12)
2. Ir a pestaña "Lighthouse"
3. Seleccionar categorías
4. Click en "Analyze page load"

---

## 🔄 Workflow Diario Recomendado

### Inicio del Día

```bash
# 1. Actualizar rama principal (si usas Git)
git pull origin main

# 2. Instalar nuevas dependencias (si hay)
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

### Durante el Desarrollo

```bash
# El servidor sigue corriendo...
# Los cambios se reflejan automáticamente

# En otra terminal, ejecutar tests en watch mode
npm run test:unit -- --watch
```

### Antes de Commit

```bash
# 1. Formatear código
npm run format

# 2. Verificar linter
npm run lint

# 3. Ejecutar tests
npm run test:unit

# 4. Verificar build
npm run build

# Si todo pasa, hacer commit
git add .
git commit -m "feat: descripción del cambio"
git push
```

---

## 📝 Comandos Útiles Adicionales

### Limpiar Proyecto

```bash
# Limpiar todo (caché, build, node_modules)
Remove-Item -Recurse -Force node_modules, dist, .vite, coverage
npm install
```

### Ver Info del Proyecto

```bash
# Ver scripts disponibles
npm run

# Ver info de npm
npm info transporte-local-platform

# Ver árbol de dependencias
npm list --all
```

### Actualización de npm

```bash
# Actualizar npm a la última versión
npm install -g npm@latest

# Verificar versión
npm --version
```

---

## 🎓 Recursos y Documentación

### Documentación Interna del Proyecto

- [RESUMEN_PROYECTO.md](./RESUMEN_PROYECTO.md) - Estructura del proyecto
- [REGLAS_ARQUITECTURA.md](./REGLAS_ARQUITECTURA.md) - Principios arquitectónicos
- [CONVENCIONES_CODIGO.md](./CONVENCIONES_CODIGO.md) - Guía de estilo
- [GUIA_MODULOS.md](./GUIA_MODULOS.md) - Descripción de módulos

### Documentación Externa

- [Vue 3](https://vuejs.org/) - Framework principal
- [Vite](https://vite.dev/) - Build tool
- [Pinia](https://pinia.vuejs.org/) - State management
- [Vue Router](https://router.vuejs.org/) - Routing
- [Vitest](https://vitest.dev/) - Unit testing
- [Playwright](https://playwright.dev/) - E2E testing
- [TypeScript](https://www.typescriptlang.org/) - Tipado

---

## ✅ Checklist de Configuración Completa

- [ ] Node.js y npm instalados
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor de desarrollo funciona (`npm run dev`)
- [ ] VS Code con extensiones instaladas
- [ ] Vue DevTools instalado en navegador
- [ ] `.env` creado (si es necesario)
- [ ] Tests ejecutándose (`npm run test:unit`)
- [ ] Linter funcionando (`npm run lint`)
- [ ] Build de producción exitoso (`npm run build`)

---

## 🆘 ¿Necesitas Ayuda?

Si encuentras problemas no cubiertos en esta guía:

1. Verifica la [documentación oficial de Vue 3](https://vuejs.org/)
2. Revisa [Vite troubleshooting](https://vite.dev/guide/troubleshooting.html)
3. Busca en [Stack Overflow](https://stackoverflow.com/questions/tagged/vue.js)
4. Revisa los [issues del proyecto](si tienes repositorio Git)

---

**¡Todo listo! Ya puedes empezar a desarrollar.** 🚀

**Última Actualización:** 14 de mayo de 2026
