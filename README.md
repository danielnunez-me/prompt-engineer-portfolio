# prompt-engineer-portfolio

Portfolio Next.js con CMS inline (Firebase), i18n y Featured Projects desde GitHub.

## Getting Started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## CMS Inline

El CMS usa el mismo modelo que Rancho Cocory:

1. Visita `http://localhost:3000/?edit_key=dev-edit-key` (o tu `EDIT_KEY`)
2. Si Firebase está vacío, se hace seed automático de `pageContent/main`
3. Ingresa la contraseña (`ADMIN_PASSWORD`)
4. Usa el FAB de edición (lápiz) y el FAB de traducciones

**Auth:** no es Firebase Authentication. Es `EDIT_KEY` + `ADMIN_PASSWORD` + cookie httpOnly `cms_session` en Firestore `adminSessions`.

### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `FIREBASE_PROJECT_ID` | ID del proyecto Firebase |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_PRIVATE_KEY` | Private key (`\n` escapados en Vercel) |
| `FIREBASE_STORAGE_BUCKET` | Bucket (opcional) |
| `EDIT_KEY` | Clave secreta en `?edit_key=` |
| `ADMIN_PASSWORD` | Contraseña del editor (plano o bcrypt `$2…`) |
| `GITHUB_USERNAME` | Usuario GitHub (default `danielnunez-me`) |
| `GITHUB_TOKEN` | Token opcional para rate limit |

### Firebase

1. Crea un proyecto y habilita **Firestore** (+ Storage si usas media)
2. Genera una service account key y mapea los campos a las env vars
3. **Reglas:** deniega todo acceso cliente; solo Admin SDK:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Sin credenciales Firebase la home sigue funcionando con contenido por defecto (lectura degradada); las mutaciones del CMS fallan hasta configurar Firebase.

### i18n

- Locale canónico: **`es`** en `pageContent/main`
- Overlays en `pageContentLocales/{code}`
- `?lang=en` o `Accept-Language` para resolver overlay
- En modo edición (`edit_key`) siempre se fuerza `es`

### Featured Projects (GitHub)

Hasta 3 repos públicos del usuario, ordenados por `pushed_at` descendente (no-forks). Cache con `revalidate: 3600`.

## API CMS

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/cms/content` | Contenido (soporta `?lang=`) |
| PATCH | `/api/cms/content` | Patch por path (sesión) |
| POST | `/api/cms/auth/login` | Login |
| GET | `/api/cms/auth/me` | Estado + seed |
| POST | `/api/cms/auth/logout` | Logout |
| GET/POST/DELETE | `/api/cms/locales` | Idiomas |
| GET/PATCH | `/api/cms/translations` | Overlays |
| POST/DELETE | `/api/cms/media` | Media library |

## Built with v0

This repository is linked to a [v0](https://v0.app) project.

[Continue working on v0 →](https://v0.app/chat/projects/prj_ywNP4Q1Hy6SNG46h7zA4yWg0eLR8)
