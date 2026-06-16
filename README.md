# Multitécnicos

Directorio público de técnicos y profesionales de distintos rubros. Los administradores gestionan el contenido desde Strapi CMS y los visitantes buscan, filtran y contactan profesionales vía WhatsApp.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| **CMS / Backend** | Strapi 5 (SQLite) |
| **Frontend** | Vite + React 19 + TypeScript |
| **Routing** | React Router v7 (lazy loading) |
| **Data Fetching** | TanStack Query v5 |
| **Carousel** | Embla Carousel + Autoplay |
| **SEO** | react-helmet-async + JSON-LD |
| **Sitemap** | Build-time script (Node 20+) |
| **Estilos** | Tailwind CSS v4 |
| **Testing** | Vitest + MSW + Testing Library |

---

## Rutas de la app

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Home | Hero + especialidades + destacados + galería |
| `/profesionales` | Listado | Grid con filtro por especialidad |
| `/profesionales/:slug` | Detalle | Perfil completo + WhatsApp + galería + redes |
| `/nosotros` | About | Información estática del directorio |

---

## Desarrollo local

### Requisitos

- Node.js >= 20
- npm >= 9

### 1. Backend (Strapi)

```bash
cd backend
npm install
npm run develop
```

Strapi arranca en **http://localhost:1337**.

En la **primera ejecución**, apenas abras http://localhost:1337/admin, Strapi te va a pedir crear el usuario admin:

- **Email**: `admin@profesionales.com`
- **Password**: `Admin123!`

> Los content types (Professional, SocialLink, WorkGalleryEntry) ya están configurados via schema files. Los permisos de rol Public (`find`, `findOne`) se aplican automáticamente via bootstrap al iniciar Strapi. No necesitás configurar nada.

### 2. Frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

Vite arranca en **http://localhost:5173**.

Las llamadas a `/api/*` y `/uploads/*` se proxean automáticamente a Strapi (configurado en `vite.config.ts`).

### 3. Los dos juntos

```bash
# Terminal 1
cd backend && npm run develop

# Terminal 2
cd frontend && npm run dev
```

### 4. Sembrar datos

1. Andá a http://localhost:1337/admin
2. **Content Manager → Professional → Create new entry**
3. Completá los campos:
   - **Name**: obligatorio
   - **Specialty**: seleccioná del menú desplegable
   - **Photo**: subí una foto
   - **Phone**: formato internacional sin símbolos (ej. 5491123456789)
   - **Description**: contá sobre el profesional
   - **Social Links**: agregá redes sociales (Instagram, Facebook, etc.)
   - **Work Gallery**: agregá imágenes de trabajos realizados
4. **Publish** para que se vea en la web

### 5. Tests

```bash
cd frontend
npm test            # una sola vez
npm run test:watch  # modo watch
```

---

## Funcionalidades

### Cards de profesionales
Cada profesional se muestra como una card con foto, nombre y especialidad. Al hacer click va al detalle.

### Filtro por especialidad
En `/profesionales` podés filtrar por: Plomería, Electricidad, Gas, Pintura, Herrería, Carpintería, Jardinería, Climatización, Otros. El filtro se sincroniza con la URL (`?especialidad=plomeria`).

### Contacto WhatsApp con mensaje personalizado
En el detalle de cada profesional, al clickear **"Contactar por WhatsApp"** se abre un modal que permite al cliente:

1. Ver el nombre del profesional y su especialidad
2. Escribir su consulta en un textarea
3. Al enviar, se abre WhatsApp con el mensaje prefomateado:

> Hola, te contacto desde Multitécnicos.
> Especialidad: Electricidad
> Consulta: [mensaje del cliente]

### Galería de trabajos (carrusel)
Cada profesional puede tener imágenes de sus trabajos en una galería con carrusel (Embla), arrastrable, con autoplay y navegación por puntos.

### Redes sociales
Cada profesional puede incluir links a: Instagram, Facebook, LinkedIn, Twitter/X, YouTube, TikTok.

### Panel administrador
El admin de Strapi permite CRUD completo de profesionales, manejo de imágenes, y control de draft/publish. Todo sin escribir código.

---

## SEO

La app está optimizada para motores de búsqueda **sin SSR** — todo funciona en la SPA con Vite + React.

### Meta tags por ruta
Cada página tiene su propio `<title>`, `<meta name="description">`, Open Graph y Twitter Cards vía `react-helmet-async`:

| Ruta | Title | Description |
|------|-------|-------------|
| `/` | Multitécnicos | Hero + especialidades + destacados |
| `/profesionales` | Profesionales — Multitécnicos | Grid con todos los profesionales |
| `/profesionales/:slug` | `{Nombre} — {Especialidad}` | Descripción dinámica del profesional |
| `/nosotros` | Nosotros — Multitécnicos | Info estática |

### JSON-LD Structured Data
Se inyectan schemas de Schema.org para rich snippets en Google:

- **WebSite** en HomePage
- **Organization** en Layout (global) y AboutPage
- **ProfessionalService + Person** en detalle de cada profesional (con nombre, foto, teléfono, descripción)

### Sitemap
Se genera automáticamente en cada build via `scripts/generate-sitemap.mjs`:
- Rutas estáticas: `/`, `/profesionales`, `/nosotros`
- Rutas dinámicas: slugs de todos los profesionales publicados (fetch a Strapi)
- **Graceful fallback**: si Strapi no responde, genera solo las rutas estáticas

```bash
# El build incluye la generación del sitemap:
npm run build
# → dist/sitemap.xml
```

### Open Graph images
- Los detalles de profesional usan su foto de perfil como `og:image`
- Si no tiene foto, se usa `/og-default.svg` como fallback
- Home y About usan el default OG image

### Performance SEO
- `loading="lazy"` en todas las imágenes del sitio
- `width` / `height` en componentes de imagen para evitar CLS
- `<link rel="preconnect">` y `<link rel="dns-prefetch">` al dominio de Strapi
- `lang="es"` en `<html>`
- Code splitting con `React.lazy()` en todas las rutas

### Robots
`public/robots.txt` permite el crawl completo y apunta al sitemap:

```
User-agent: *
Allow: /
Sitemap: https://multitecnicos.com.ar/sitemap.xml
```

> **Importante**: en producción, setear `VITE_SITE_URL` al buildear el frontend para que el sitemap y los OG images tengan URLs absolutas correctas.

---

## Estructura del proyecto

```
profesionales-directorio/
├── backend/                          # Strapi 5 CMS
│   ├── config/middlewares.ts         # CORS (localhost:5173)
│   ├── src/
│   │   ├── index.ts                  # Bootstrap de permisos
│   │   ├── api/professional/         # Collection type
│   │   │   └── content-types/professional/schema.json
│   │   └── components/shared/        # SocialLink, WorkGalleryEntry
│   └── package.json
├── frontend/                         # Vite + React + TS
│   ├── scripts/
│   │   └── generate-sitemap.mjs      # Build-time sitemap generator
│   ├── public/
│   │   ├── robots.txt                # Crawl instructions
│   │   └── og-default.svg            # Default OG image fallback
│   ├── src/
│   │   ├── types/                    # Professional, StrapiMedia
│   │   ├── lib/                      # strapi.ts, constants.ts
│   │   ├── hooks/                    # TanStack Query hooks
│   │   ├── router/                   # React Router config
│   │   ├── components/
│   │   │   ├── ui/                   # ImageWithFallback, LoadingSpinner, ErrorState
│   │   │   ├── layout/               # Header, Footer, Layout (con JSON-LD)
│   │   │   ├── home/                 # HeroSection, SpecialtyLinks, Featured, GalleryCarousel
│   │   │   ├── professionals/        # ProfessionalCard, Grid, SpecialtyFilter
│   │   │   └── profile/              # ProfileHeader, DescriptionBlock, WhatsAppButton, SocialLinks, WorkGallery
│   │   └── pages/                    # HomePage, ListPage, DetailPage, AboutPage (con Helmet)
│   └── package.json
├── .gitignore
└── README.md
```

---

## Deploy en VPS

### Prerrequisitos (VPS limpio)

| Requisito | Versión / Configuración |
|-----------|------------------------|
| **SO** | Ubuntu 22.04+ o Debian 12+ |
| **Firewall** | `ufw` con puertos **22**, **80**, **443** habilitados |
| **Node.js** | 20, 22 o 24 (via [fnm](https://github.com/Schniz/fnm) o [nvm](https://github.com/nvm-sh/nvm)) |
| **build-essential** | Necesario para compilar `better-sqlite3` (lo usa Strapi) |
| **nginx** | Servidor web y reverse proxy |
| **pm2** | `npm install -g pm2` — gestor de procesos |

```bash
# Firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Node.js con fnm (recomendado)
curl -fsSL https://fnm.vercel.app/install | bash
exec zsh
fnm install 22
fnm default 22

# build-essential + nginx
apt update && apt install -y build-essential nginx
```

### DNS

Creá dos registros **A** en tu proveedor de DNS apuntando a la IP de la VPS:

| Dominio | Registro | Destino |
|---------|----------|---------|
| `multitecnicos.com.ar` | A | < IP de la VPS > |
| `api.multitecnicos.com.ar` | A | < IP de la VPS > |

### Backend (Strapi)

```bash
git clone <tu-repo> profesionales-directorio
cd profesionales-directorio/backend

# Variables de entorno
cp .env.example .env
```

Editar `.env` con estos valores:

| Variable | Valor |
|----------|-------|
| `HOST` | `0.0.0.0` |
| `PORT` | `1337` |
| `DATABASE_CLIENT` | `sqlite` |
| `NODE_ENV` | `production` |
| `URL` | `https://api.multitecnicos.com.ar` |
| `CORS_ORIGIN` | `https://multitecnicos.com.ar` |
| `APP_KEYS` | Generar nuevo (ver abajo) |
| `JWT_SECRET` | Generar nuevo (ver abajo) |
| `API_TOKEN_SALT` | Generar nuevo (ver abajo) |

```bash
# Generar claves
node -e "
  const crypto = require('crypto');
  console.log('APP_KEYS=', crypto.randomBytes(16).toString('base64'));
  console.log('JWT_SECRET=', crypto.randomBytes(16).toString('base64'));
  console.log('API_TOKEN_SALT=', crypto.randomBytes(16).toString('base64'));
"

# Instalar y construir
npm ci
npm run build

# PM2
pm2 start npm --name "strapi" -- run start
pm2 save
pm2 startup
```

Configurá **Nginx** como reverse proxy:

```nginx
server {
    listen 80;
    server_name api.multitecnicos.com.ar;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 50M;  # para subir fotos
}
```

### CORS en producción

Strapi necesita saber qué dominio puede consumir la API. En desarrollo se usa `http://localhost:5173`, pero en producción hay que configurar `CORS_ORIGIN` en el `.env` del backend:

```
CORS_ORIGIN=https://multitecnicos.com.ar
```

Si necesitás múltiples orígenes, separalos con coma:

```
CORS_ORIGIN=https://multitecnicos.com.ar,https://www.multitecnicos.com.ar
```

Strapi lee esta variable desde `config/middlewares.ts` y permite que el frontend haga fetch a la API sin errores de CORS.

### Frontend (Vite)

```bash
cd profesionales-directorio/frontend

# Build con variables de entorno
VITE_SITE_URL=https://multitecnicos.com.ar \
VITE_STRAPI_URL=https://api.multitecnicos.com.ar \
npm run build
# → Se genera en frontend/dist/
```

Servilo con Nginx:

```nginx
server {
    listen 80;
    server_name multitecnicos.com.ar;
    root /ruta/a/profesionales-directorio/frontend/dist;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;   # SPA fallback
    }

    # Cacheo de assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

> Estas variables también están en `.env.production` como referencia. Si no se setea `VITE_STRAPI_URL`, el frontend asume que Strapi está en el mismo dominio. Si no se setea `VITE_SITE_URL`, el sitemap y OG images pueden generar URLs incompletas.

### SSL / HTTPS con Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d multitecnicos.com.ar -d api.multitecnicos.com.ar
```

Esto edita automáticamente los server blocks de Nginx y configura el redirect HTTP → HTTPS. La renovación es automática via systemd timer.

```bash
# Verificar que la renovación automática funciona
certbot renew --dry-run
```

### Backup de la base de datos

Strapi con SQLite almacena los datos en `backend/.tmp/data.db`. Copiá este archivo periódicamente:

```bash
#!/bin/bash
# /root/backup-strapi.sh
BACKUP_DIR=/root/backups/strapi
mkdir -p "$BACKUP_DIR"
cp /ruta/a/profesionales-directorio/backend/.tmp/data.db \
   "$BACKUP_DIR/data-$(date +%F).db"
# Opcional: rsync a otro servidor, subir a S3, etc.
```

Agregalo al cron para que se ejecute todos los días:

```bash
crontab -e
# 0 3 * * * /root/backup-strapi.sh
```

> Si no usás un provider externo para imágenes, también deberías respaldar `public/uploads/`.

### Deploy loop

Cuando hacés cambios en el repo, el ciclo de deploy es:

```bash
cd /ruta/a/profesionales-directorio
git pull origin main

# Si cambió backend/
cd backend
npm ci                     # solo si cambió package-lock.json
npm run build
pm2 restart strapi

# Si cambió frontend/
cd ../frontend
npm ci                     # solo si cambió package-lock.json
VITE_SITE_URL=https://multitecnicos.com.ar \
VITE_STRAPI_URL=https://api.multitecnicos.com.ar \
npm run build
# nginx ya sirve los archivos nuevos automáticamente
```

Podés automatizarlo con un script `deploy.sh` en la raíz del proyecto o con un webhook (GitHub Actions, Git hooks, etc.).

### Diagrama de la VPS

```
                            Nginx
                    ┌───────────────────┐
                    │  multitecnicos.com.ar     │  → frontend/dist/ (estático)
                    │  api.multitecnicos.com.ar │  → proxy_pass localhost:1337 (Strapi)
                    └───────────────────┘
                            │
                    Strapi (PM2)
                    puerto 1337
                        │
                    SQLite (.tmp/data.db)
```

---

## Variables de entorno

### Backend (backend/.env)

| Variable | Descripción | Default |
|----------|-------------|---------|
| `HOST` | IP donde escucha Strapi | `0.0.0.0` |
| `PORT` | Puerto | `1337` |
| `DATABASE_CLIENT` | Motor de BD | `sqlite` |
| `URL` | URL pública del backend | — |
| `JWT_SECRET` | Secreto JWT | (generado) |
| `APP_KEYS` | Claves de app | (generadas) |
| `API_TOKEN_SALT` | Salt para tokens | (generado) |

### Frontend (frontend/.env)

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_STRAPI_URL` | URL del backend Strapi en producción | `''` (mismo origen) |
| `VITE_SITE_URL` | URL pública del sitio (para sitemap + OG) | `''` (rutas relativas) |

---

## Scripts disponibles

### Backend
```bash
npm run develop    # Dev con recarga automática
npm run start      # Producción
npm run build      # Build de producción
```

### Frontend
```bash
npm run dev        # Dev server (Vite)
npm run build      # Build producción (tsc + vite)
npm run preview    # Preview del build
npm test           # Tests (Vitest)
npm run test:watch # Tests en modo watch
```
