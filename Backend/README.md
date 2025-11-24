# HRMS Backend API

Human Resource Management System (HRMS) - Production-Ready Backend Application

## Overview

A robust RESTful API built with Node.js and PostgreSQL for managing employees, teams, and organizational operations with comprehensive audit logging.

## Features

- **Authentication & Authorization**: JWT-based secure authentication
- **Employee Management**: Complete CRUD operations for employee records
- **Team Management**: Create and manage teams with multiple employees
- **Team Assignments**: Many-to-many relationship between employees and teams
- **Audit Logging**: Comprehensive logging of all system operations
- **Security**: Helmet.js, input validation, password hashing with bcrypt
- **Database**: PostgreSQL with connection pooling and optimized indexes

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors
- **Logging**: morgan

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── employeeController.js # Employee operations
│   │   ├── teamController.js    # Team operations
│   │   └── logController.js     # Audit log retrieval
│   ├── middlewares/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validation.js        # Request validation rules
│   ├── models/
│   │   ├── Organization.js      # Organization model
│   │   ├── Employee.js          # Employee model
│   │   └── Team.js              # Team model
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── employeeRoutes.js    # Employee endpoints
│   │   ├── teamRoutes.js        # Team endpoints
│   │   └── logRoutes.js         # Audit log endpoints
│   ├── utils/
│   │   └── logger.js            # Audit logging utility
│   ├── db.js                    # Database initialization
│   └── index.js                 # Application entry point
├── .env.example                 # Environment variables template
├── .gitignore
└── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation & Setup

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download and install from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE hrms_db;
CREATE USER hrms_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE hrms_db TO hrms_user;
\q
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms_db
DB_USER=hrms_user
DB_PASSWORD=your_secure_password

JWT_SECRET=your_jwt_secret_key_min_32_characters_long
JWT_EXPIRES_IN=24h

CLIENT_URL=http://localhost:3000
```

### 5. Start the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new organization | No |
| POST | `/api/auth/login` | Login to organization account | No |
| POST | `/api/auth/logout` | Logout and log action | Yes |
| GET | `/api/auth/profile` | Get organization profile | Yes |

### Employees

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/employees` | Create new employee | Yes |
| GET | `/api/employees` | Get all employees | Yes |
| GET | `/api/employees/:id` | Get employee by ID | Yes |
| PUT | `/api/employees/:id` | Update employee | Yes |
| DELETE | `/api/employees/:id` | Delete employee | Yes |
| GET | `/api/employees/:id/teams` | Get employee's teams | Yes |

### Teams

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/teams` | Create new team | Yes |
| GET | `/api/teams` | Get all teams | Yes |
| GET | `/api/teams/:id` | Get team by ID | Yes |
| PUT | `/api/teams/:id` | Update team | Yes |
| DELETE | `/api/teams/:id` | Delete team | Yes |
| GET | `/api/teams/:id/members` | Get team members | Yes |
| POST | `/api/teams/assign` | Assign employee to team | Yes |
| POST | `/api/teams/unassign` | Unassign employee from team | Yes |

### Audit Logs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/logs` | Get all audit logs | Yes |
| GET | `/api/logs/:entity_type/:entity_id` | Get logs by entity | Yes |

## API Usage Examples

### 1. Register Organization

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Corp",
    "email": "admin@techcorp.com",
    "password": "securepassword123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techcorp.com",
    "password": "securepassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "organization": {
      "id": 1,
      "name": "Tech Corp",
      "email": "admin@techcorp.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Create Employee

```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@techcorp.com",
    "phone": "+1234567890",
    "position": "Software Engineer",
    "department": "Engineering",
    "hire_date": "2024-01-15"
  }'
```

### 4. Create Team

```bash
curl -X POST http://localhost:5000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Backend Team",
    "description": "Backend development team"
  }'
```

### 5. Assign Employee to Team

```bash
curl -X POST http://localhost:5000/api/teams/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "employee_id": 1,
    "team_id": 1
  }'
```

### 6. Get Audit Logs

```bash
curl -X GET http://localhost:5000/api/logs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Schema

### Tables

**organizations**
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR UNIQUE)
- password (VARCHAR)
- created_at, updated_at (TIMESTAMP)

**employees**
- id (SERIAL PRIMARY KEY)
- organization_id (FK)
- first_name, last_name, email, phone
- position, department
- hire_date (DATE)
- created_at, updated_at (TIMESTAMP)

**teams**
- id (SERIAL PRIMARY KEY)
- organization_id (FK)
- name, description
- created_at, updated_at (TIMESTAMP)

**employee_teams** (Junction Table)
- id (SERIAL PRIMARY KEY)
- employee_id (FK)
- team_id (FK)
- assigned_at (TIMESTAMP)

**audit_logs**
- id (SERIAL PRIMARY KEY)
- organization_id (FK)
- user_id (FK)
- action, entity_type, entity_id
- details, ip_address
- created_at (TIMESTAMP)

## Security Features

1. **Password Security**: Bcrypt hashing with salt rounds
2. **JWT Authentication**: Secure token-based authentication
3. **Input Validation**: express-validator for all inputs
4. **SQL Injection Prevention**: Parameterized queries
5. **CORS Protection**: Configurable CORS policies
6. **Helmet.js**: Security headers
7. **Error Handling**: No sensitive data in error responses

## Logging System

All operations are logged to the `audit_logs` table:

- User login/logout
- Employee creation/update/deletion
- Team creation/update/deletion
- Employee-team assignments

Example log entry:
```
[2024-01-20T10:30:00.000Z] User '1' added a new employee with ID 5
```

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Performance Optimizations

1. Database connection pooling
2. Indexed foreign keys
3. Efficient JOIN queries
4. JSON aggregation for related data
5. Optimized query structure

## Testing

Check API health:
```bash
curl http://localhost:5000/health
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use strong JWT secret (minimum 32 characters)
3. Use environment variables for all sensitive data
4. Enable PostgreSQL SSL connections
5. Set up proper CORS origins
6. Use process manager (PM2)
7. Set up reverse proxy (Nginx)
8. Enable database backups

## Troubleshooting

**Database Connection Issues:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U hrms_user -d hrms_db
```

**Port Already in Use:**
```bash
# Find process using port 5000
lsof -i :5000

# Change PORT in .env file
```

## License

ISC

## Support

For issues and questions, please create an issue in the project repository.
