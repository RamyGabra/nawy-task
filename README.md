# Nawy Apartment Listings

A full-stack application for managing and browsing apartment listings, built with Next.js (frontend) and Express.js (backend) with PostgreSQL database.

## Project Structure

```
nawy-task/
├── be/          # Backend (Express.js + TypeScript + Sequelize)
├── fe/          # Frontend (Next.js + TypeScript + React Query)
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (if running locally)

### Setup

1. **Start all services with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - **PostgreSQL** database on port `5432`
   - **Backend API** on port `4000`
   - **Frontend** on port `3000`

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Swagger Docs: http://localhost:4000/api-docs

### Stop Services

```bash
docker-compose down
```

To remove volumes (database data):
```bash
docker-compose down -v
```

## Running Backend Tests

```bash
cd be
npm test              # Run all tests
```

## Database Schema

### Tables

#### `apartments`

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `unit_name` | VARCHAR(255) | Apartment unit name |
| `unit_number` | VARCHAR(50) | Unit number/identifier |
| `price` | DECIMAL | Price in EGP |
| `project_name` | VARCHAR(255) | Project name |
| `unit_location` | VARCHAR(255) | Location |
| `area` | INTEGER | Area in m² |
| `bathrooms` | INTEGER | Number of bathrooms |
| `bedrooms` | INTEGER | Number of bedrooms |
| `floor_number` | VARCHAR(255) | Floor number |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Indexes

- `idx_apartments_project_name` on `project_name`
- `idx_apartments_name` on `unit_name`
- `idx_apartments_unit_number` on `unit_number`

The database is automatically seeded with 100 sample apartments on first startup.

## API Endpoints

### Base URL
```
http://localhost:4000
```

### Available Endpoints

- `GET /health` - Health check
- `GET /apartments` - List apartments (supports pagination and search)
  - Query params: `limit`, `offset`, `q` (search term)
- `GET /apartments/:id` - Get apartment by ID
- `POST /apartments` - Create new apartment

For detailed API documentation including request/response schemas, see Swagger documentation.

## Swagger Documentation

The API documentation is available at:

**http://localhost:4000/api-docs**

This interactive documentation provides:
- Complete endpoint descriptions
- Request/response schemas
- Try-it-out functionality
- Validation rules

## Tech Stack

**Backend:**
- Node.js + Express.js
- TypeScript
- Sequelize ORM
- PostgreSQL
- Jest (testing)
- Swagger/OpenAPI

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- React Icons

