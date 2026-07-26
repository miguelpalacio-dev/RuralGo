# RuralGo - Comandos de Ejecución

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL instalado y corriendo
- npm

---

## 1. Configurar Base de Datos

Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE ruralgo;
```

O desde la línea de comandos:

```bash
psql -U postgres -c "CREATE DATABASE ruralgo;"
```

---

## 2. Backend (API REST)

### Instalar dependencias

```bash
cd backend
npm install
```

### Configurar variables de entorno

Editar el archivo `.env` con tus datos de PostgreSQL:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ruralgo
DB_USER=tu_usuario
DB_PASSWORD=tu_password
```

### Ejecutar seed (datos iniciales)

```bash
npm run seed
```

Esto creará:
- Admin: `admin@ruralgo.com` / `admin123`
- Conductor: `juan@ruralgo.com` / `conductor123`

### Iniciar servidor de desarrollo

```bash
npm run dev
```

El backend estará disponible en: `http://localhost:3000`

---

## 3. Frontend (Vue 3)

### Instalar dependencias

```bash
cd frontend
npm install
```

### Iniciar servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 4. Ejecutar Todo Junto

Desde la raíz del proyecto, abrir dos terminales:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 5. URLs de la Aplicación

| Módulo | URL |
|--------|-----|
| Público (mapa) | http://localhost:5173/ |
| Login Conductor | http://localhost:5173/conductor/login |
| Login Admin | http://localhost:5173/admin/login |
| API Backend | http://localhost:3000/api |
| Swagger Docs | http://localhost:3000/api/docs |
| Swagger JSON | http://localhost:3000/api/docs.json |

---

## 6. Credenciales de Prueba

### Administrador
- Email: `admin@ruralgo.com`
- Contraseña: `admin123`

### Conductor
- Email: `juan@ruralgo.com`
- Contraseña: `conductor123`

---

## 7. Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar en modo desarrollo (con hot-reload) |
| `npm run start` | Iniciar en modo producción |
| `npm run seed` | Poblar BD con datos iniciales |
| `npm run build` | Compilar frontend para producción |

---

## 8. Puertos

| Servicio | Puerto |
|----------|--------|
| Frontend (Vite) | 5173 |
| Backend (Express) | 3000 |
| PostgreSQL | 5432 |

---

## Solución de Problemas

### Error: "database 'ruralgo' does not exist"
```bash
psql -U postgres -c "CREATE DATABASE ruralgo;"
```

### Error: "ECONNREFUSED" en PostgreSQL
Verificar que PostgreSQL esté corriendo:
```bash
# Windows
net start postgresql

# O desde servicios de Windows
services.msc
```

### Error: "port 5173 already in use"
```bash
# Matar proceso en ese puerto
npx kill-port 5173
```

### Error: "port 3000 already in use"
```bash
npx kill-port 3000
```
