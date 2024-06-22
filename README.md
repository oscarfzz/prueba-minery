# Prueba Minery


## Requisitos
- Node.js
- pnpm

## Instrucciones
- Clonar el repositorio
- `cd` al directorio del proyecto
- `npm install -g pnpm` para instalar pnpm

## Comandos
- `pnpm install` para instalar las dependencias
- `pnpm dev` para compilar y ver los cambios en tiempo real (hot reload)
- `pnpm build` para compilar el proyecto
- `pnpm serve` para servir el proyecto en un servidor local
- `pnpm lint` para correr el linter
- `pnpm swagger` para generar la documentación de la API
- `pnpm seed` para poblar la base de datos con datos de prueba con prisma
- `pnpm migrate` para correr las migraciones de la base de datos con prisma
- `pnpm generate` para generar los archivos de la base de datos con prisma

**Nota:** Usar `pnpm dev` para desarrollo y `pnpm build` para producción.

## Estructura de archivos
- `src/` contiene los archivos fuente
- `dist/` contiene los archivos compilados
- `public/` contiene los archivos estáticos

## Tecnologías
- Node.js
- Express
- Typescript
- Prisma
- Sqlite
- Swagger

# Instrucciones de la prueba

- Ejecutar el comando `pnpm dev` para compilar y ver los cambios en tiempo real (hot reload)
- Acceder a la URL `http://localhost:3000/docs` para ver la documentación de la API. Desde aquí se pueden probar los endpoints.
- La base de datos se encuentra en el archivo `./prisma/dev.db` y se puede abrir con cualquier cliente de SQLite, este contiene datos de prueba.
