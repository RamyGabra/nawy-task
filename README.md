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

**B-tree indexes** (for exact matches and prefix searches):
- `idx_apartments_project_name` on `project_name`
- `idx_apartments_name` on `unit_name`
- `idx_apartments_unit_number` on `unit_number`

**Trigram indexes** (for substring searches with `%term%`):
- `idx_apartments_project_name_trgm` on `project_name` (GIN)
- `idx_apartments_unit_name_trgm` on `unit_name` (GIN)

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

## Performance Considerations

### indexing strategy

When searching with wildcards on both sides (`%term%`), traditional B-tree indexes cannot be used efficiently because they require a known starting point. This would force PostgreSQL to perform a full table scan, which becomes slow as the dataset grows.

Trigram indexes break text into 3-character sequences and create an inverted index, allowing PostgreSQL to quickly find rows containing the search term anywhere within the text. This enables fast substring matching without scanning every row in the table.

**Example**: Searching for "dina" in "Madinaty" uses the trigram index to find matches efficiently, rather than scanning all apartment records. 

While trigram indexes take up more space and have higher overhead with writes, this is a worthy compromise as Nawy is a read-heavy application. We perform significantly more reads compared to writes. 

### Real-World Search Challenges

In production, Nawy's search functionality faces complex requirements. Users can filter properties by multiple criteria simultaneously:
- **Financial filters**: Down payment, price range
- **Status filters**: Delivered/Not delivered
- **Location filters**: City, district, neighborhood
- **Project filters**: Specific development projects
- **Property attributes**: Bedrooms, bathrooms, area, amenities

As the number of filters increases, traditional database queries become increasingly complex and expensive. This represents a **multi-filter, multi-sort, full-text + numeric + categorical query** that challenges PostgreSQL's optimization capabilities.

#### PostgreSQL Limitations

When handling complex searches, PostgreSQL would need to:
- Perform multiple joins across related tables (locations, amenities, projects)
- Apply range filters on numeric fields (price, down payment, area)
- Execute text matching on titles and descriptions
- Sort results by one or more columns (price, date, relevance)
- Handle pagination with `OFFSET`/`LIMIT`

**The Problem**: As more filters are combined, the query optimizer becomes less likely to use a single efficient index. This often results in:
- Sequential table scans
- Multiple index scans that must be combined
- Degraded query performance as data grows
- Increased database load

### Real world Search Solution: Elasticsearch/OpenSearch

For production-scale search with complex filtering, **Elasticsearch** (or **OpenSearch**) is an ideal solution. Unlike relational databases that scan rows, Elasticsearch uses an inverted index architecture similar to search engines.

#### How Elasticsearch Solves This

1. **Document-based storage**: Each property is stored as a single JSON document containing all searchable data, eliminating the need for complex joins.

2. **Inverted indexes**: Every field gets its own inverted index (like a search engine dictionary), allowing fast lookups regardless of query complexity.

3. **Efficient filtering**: Elasticsearch retrieves matching document IDs from each field's posting list, then performs set intersections using bitsets for extremely fast multi-filter queries.

4. **Built-in features**: 
   - Full-text search with relevance scoring
   - Faceted search (aggregations)
   - Geospatial queries
   - Real-time updates
   - Horizontal scalability

This architecture makes Elasticsearch particularly well-suited for dynamic, multi-criteria search scenarios where performance and scalability are critical.

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

