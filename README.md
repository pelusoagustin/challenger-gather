# API Rest - Jokes and Math

Solucion completa al challenge: API REST (chistes + matematica) en Express/TypeScript, documentacion OpenAPI YAML, persistencia SQL con datos y consultas, tests unitarios, autenticacion JWT/OAuth mock, notificaciones desacopladas y endpoint `/jokes/paired` con llamadas paralelas a APIs externas.

## Requisitos

- Node.js 18+
- Microsoft SQL Server

## Instalacion

```
npm install
```

## Configuracion

Crear un archivo `.env` con (o renombrar `.env.example` a `.env`):

```
MSSQL_CONNECTION_STRING=Server=localhost,1433;Database=Challenger;User Id=sa;Password=Password123;Encrypt=true;TrustServerCertificate=true;
CHUCK_API_URL=https://api.chucknorris.io/jokes/random
DAD_API_URL=https://icanhazdadjoke.com
SQL_JOKES_TABLE=Jokes
JWT_SECRET=supersecret
JWT_EXPIRES_IN=1h
NOTIFICATION_CHANNEL=sms
```

Crear la estructura de base y datos iniciales:

```
npx ts-node scripts/run-init-sql.ts
```

## Como lanzar la app

```
npm run build
npm run start
```

## Como probar el endpoint

Importa `docs/openapi.yaml` en Postman (File -> Import) para generar la coleccion y ejecutar las requests.

Endpoints:

```
GET /api/jokes
GET /api/jokes/{provider}
GET /api/jokes/paired
POST /api/jokes
PUT /api/jokes/{number}
DELETE /api/jokes/{number}
GET /api/math/lcm
GET /api/math/increment
POST /api/alert
POST /api/auth/login
GET /api/auth/external/callback
GET /api/user
GET /api/admin
```

### Autenticacion (JWT)

Usuarios de prueba:

- Admin: `manolito` / `secret123`
- User: `pepe` / `secret123`

OAuth mock (Google):

```
GET /api/auth/external/callback?provider=google&code=valid-google-code
```

Login y uso de token: ver ejemplos en OpenAPI.

## Tests unitarios

Jest valida el emparejamiento de chistes y el resto de endpoints:

```
npm run test
```

## Documentacion

- OpenAPI: `docs/openapi.yaml`
