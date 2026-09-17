# Intern Bangla — Backend

Backend API for **Intern Bangla**, an internship discovery and application platform, built with [NestJS](https://nestjs.com/) and PostgreSQL.

## Features

- JWT-based authentication with role-based authorization
- User, company, and internship management
- Internship applications and interview scheduling
- Resume management
- Transactional email notifications

## Tech stack

- [NestJS](https://nestjs.com/) (TypeScript)
- PostgreSQL + TypeORM
- Passport / JWT
- Nodemailer

## Project setup

```bash
npm install
```

## Environment

The app connects to a local PostgreSQL database (see `src/app.module.ts`). Update the connection options there or move them to environment variables before deploying.

## Run

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

## License

UNLICENSED — private project.
