Backend (Spring Boot)
=====================

This folder contains a minimal Spring Boot backend using JPA and Flyway migrations targeting PostgreSQL.

How to run (PowerShell, host-based backend connecting to Docker Postgres):

1. Set environment variables to point at your Docker Postgres instance:

```powershell
$env:DB_HOST = 'host.docker.internal'
$env:DB_PORT = '5432'
$env:DB_NAME = 'appdb'
$env:DB_USER = 'postgres'
$env:DB_PASSWORD = 'password'
```

2. Build and run with Maven:
```powershell
mvn -f .\pom.xml spring-boot:run
```

3. Endpoints:
- `GET http://localhost:8081/api/health` -> `ok`
- `GET http://localhost:8081/api/publications` -> JSON list of publications

Notes:
- If you run the backend inside Docker compose alongside Postgres, set `DB_HOST` to the Postgres service name (e.g. `postgres`).
- Adjust `server.port` in `application.yml` if you prefer another port.
