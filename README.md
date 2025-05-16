# Node.js Boilerplate 🚀

A production-ready Node.js boilerplate with a modular, scalable architecture, integrated best practices, and developer productivity tools.

---

## ✅ Features

### 📁 Modular & Scalable Project Structure
- Clean separation of concerns using `controllers`, `routes`, `services`, `repositories`, `models`, and `utils`.
- Organized by feature for scalability and maintainability.

### 🌍 Environment Configuration
- Uses [`dotenv`](https://www.npmjs.com/package/dotenv) for managing environment variables.
- `.env` file support for different environments (development, testing, production).

### 🔀 API Versioning
- Organized routes using versioning (e.g., `/api/v1`, `/api/v2`).
- Enables backward compatibility for your API.

### 🌐 Express Routing
- Route files separated by feature and grouped under the API version directory.
- Middleware support for authentication, validation, and logging.

### ❗ Centralized Error Handling
- Custom error handler to catch and structure all errors in a unified response format.
- Custom `ApiError` and `errorMiddleware` for standardized error reporting.

### 🛡️ Validation (Joi or Zod)
- Request body and query validation using [`Joi`](https://joi.dev) or [`Zod`](https://zod.dev/).
- Central validation middleware for easy integration.

### 📜 Logging (Winston or Morgan)
- HTTP logging via [`morgan`](https://www.npmjs.com/package/morgan).
- Application logging using [`winston`](https://www.npmjs.com/package/winston).

### 🔐 Authentication & Authorization
- JWT-based authentication with support for role-based access control.
- Optional Passport strategies for OAuth integrations.

### 🗄️ Database Integration
- Supports:
  - [`Sequelize`](https://sequelize.org/) for SQL databases.
  - [`Mongoose`](https://mongoosejs.com/) for MongoDB.
  - [`Prisma`](https://www.prisma.io/) for type-safe DB access.
- Abstracted `repository` layer for DB operations.

### 🔧 Services & Repositories
- `Service` layer for business logic.
- `Repository` layer for DB interaction, promoting separation of concerns and testability.

### 🛡️ Security & Rate Limiting
- Rate limiting with [`express-rate-limit`](https://www.npmjs.com/package/express-rate-limit).
- Security best practices via [`helmet`](https://www.npmjs.com/package/helmet), CORS, and input sanitization.

---

## 🧹 Code Quality

### 🧪 Linting & Formatting
- Linting with [`ESLint`](https://eslint.org/)
- Code formatting with [`Prettier`](https://prettier.io/)

### 🔐 Pre-commit Hooks
- Pre-commit validation using [`husky`](https://typicode.github.io/husky/) and [`lint-staged`](https://github.com/okonet/lint-staged).
- Ensures only clean, tested code is committed.

---

## 🐳 Docker Support
- Dockerfile and `.dockerignore` provided.
- Optional `docker-compose.yml` for multi-container development (DB, backend).

---

## 📁 Folder Structure

```bash
.
├── src
│   ├── config
│   ├── controllers
│   ├── routes
│   │   └── v1
│   ├── middlewares
│   ├── models
│   ├── repositories
│   ├── services
│   ├── utils
│   └── validations
├── tests
├── .env
├── .eslintrc.js
├── .prettierrc
├── .husky/
├── Dockerfile
├── docker-compose.yml
└── README.md
