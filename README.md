# Unified NestJS Feature Application (Users CRUD + Auth + SMS + Telegram)

A production-ready NestJS application built with TypeScript, TypeORM, and PostgreSQL.

## Features
- 🔐 **Authentication Module (`AuthModule`)**: User registration, JWT login, `bcrypt` password hashing, and token validation guard (`JwtAuthGuard`).
- 👤 **Users CRUD Module (`UsersModule`)**: Complete User management endpoints (`GET`, `POST`, `PATCH`, `DELETE`).
- 📱 **SMS Module (`SmsModule`)**: Vendor-agnostic SMS dispatch (Twilio integration), phone format validation (E.164), and PostgreSQL audit logging (`SmsLog`).
- ✈️ **Telegram Module (`TelegramModule`)**: Telegram Bot API integration for broadcasting messages, structured HTML/MarkdownV2 alerts, photo sending, and secret header-validated webhooks.
- 🗄️ **Database**: TypeORM + PostgreSQL.

---

## 🛠️ Environment Configuration (`.env`)

Create a `.env` file based on `.env.example`:

```env
PORT=3000

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nest_modules_db

# JWT Configuration
JWT_SECRET=super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=1d

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890

# Telegram Configuration
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
TELEGRAM_DEFAULT_CHANNEL_ID=-100123456789
TELEGRAM_PARSE_MODE=HTML
TELEGRAM_WEBHOOK_SECRET=your_random_webhook_secret
```

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev

# Build production bundle
npm run build

# Start production server
npm run start:prod
```

---

## 📑 API Endpoints Summary

### Authentication (`/auth`)
| Method | Endpoint | Description | Guard |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user | Public |
| `POST` | `/auth/login` | Authenticate and obtain JWT token | Public |
| `GET` | `/auth/profile` | Get current logged-in user profile | `JwtAuthGuard` |

### Users Management (`/users`)
| Method | Endpoint | Description | Guard |
| :--- | :--- | :--- | :--- |
| `POST` | `/users` | Create user | `JwtAuthGuard` |
| `GET` | `/users` | List all users | `JwtAuthGuard` |
| `GET` | `/users/:id` | Get user by ID | `JwtAuthGuard` |
| `PATCH` | `/users/:id` | Update user | `JwtAuthGuard` |
| `DELETE` | `/users/:id` | Delete user | `JwtAuthGuard` |

### SMS Operations (`/sms`)
| Method | Endpoint | Description | Guard |
| :--- | :--- | :--- | :--- |
| `POST` | `/sms/send` | Send SMS to recipient phone number | `JwtAuthGuard` |
| `GET` | `/sms/logs` | List all SMS audit logs | `JwtAuthGuard` |
| `GET` | `/sms/logs/:id` | Get specific SMS audit log | `JwtAuthGuard` |

### Telegram Integration (`/telegram`)
| Method | Endpoint | Description | Guard |
| :--- | :--- | :--- | :--- |
| `POST` | `/telegram/broadcast` | Post formatted message to channel | `JwtAuthGuard` |
| `POST` | `/telegram/send-photo` | Post photo with caption to channel | `JwtAuthGuard` |
| `POST` | `/telegram/webhook` | Receive webhook updates from Telegram | Secret Token Header |
