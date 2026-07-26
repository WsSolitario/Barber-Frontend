# Barber-Frontend

Aplicación web para reservas y operación administrativa de barberías. Ofrece una landing pública orientada a conversión, un flujo de reserva por disponibilidad y un panel para gestionar la operación diaria.

## Capacidades

- Landing pública con portafolio, información de contacto y CTA de reserva.
- Reserva de servicios, selección de horario y seguimiento de la cita.
- Panel administrativo para calendario, pagos, reportes, usuarios, sucursales y media.
- Autenticación con renovación de sesión mediante refresh token HTTP-only.
- Integración con la API de Barber Backend y soporte de Stripe Checkout.

## Tecnología

- Next.js App Router y TypeScript
- Tailwind CSS
- TanStack Query para datos remotos
- Zustand para estado de autenticación

## Requisitos

- Node.js 20 o superior
- Barber Backend ejecutándose localmente o en un entorno accesible
- Archivo `.env.local` con la URL de la API, basada en `.env.example`

## Desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` para la experiencia pública y `http://localhost:3000/admin` para el panel administrativo.

## Calidad

```bash
npm run lint
npm run build
```

## Estructura

- `src/app`: rutas públicas y administrativas.
- `src/components`: calendario, shell administrativo y proveedores.
- `src/services`: clientes HTTP y servicios de API.
- `src/stores`: estado local de sesión.

No incluyas secretos, archivos `.env.local` ni credenciales de proveedores en commits.

## Despliegue Con PM2

En el LXC frontend, desde el directorio clonado, ejecuta:

```bash
bash scripts/deploy.sh
```

El script actualiza `main`, instala dependencias, crea el build de producción con un heap de 1.5 GB y reinicia `barber-frontend` en PM2. Para la configuración con Nginx, el proceso se inicia en `127.0.0.1:3000`.
