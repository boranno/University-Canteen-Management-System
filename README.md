# DIU Canteen Hub - Setup Instructions for Local Development

This is a comprehensive university canteen management system built with React, Node.js, and PostgreSQL.

## Prerequisites

Before running this application on your PC, make sure you have the following installed:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **PostgreSQL** (version 12 or higher)
   - Download from: https://www.postgresql.org/downloads/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

3. **Git** (to clone the repository)
   - Download from: https://git-scm.com/

## Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd diu-canteen-hub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### Option A: Local PostgreSQL
1. Create a new database:
```sql
CREATE DATABASE diu_canteen_hub;
```

2. Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/diu_canteen_hub
SESSION_SECRET=your-super-secret-session-key-here
REPL_ID=local-development
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=localhost:5000
NODE_ENV=development
```

#### Option B: Using Docker
```bash
docker run --name diu-postgres \
  -e POSTGRES_DB=diu_canteen_hub \
  -e POSTGRES_USER=diu_user \
  -e POSTGRES_PASSWORD=diu_password \
  -p 5432:5432 \
  -d postgres

# Then use this DATABASE_URL:
# DATABASE_URL=postgresql://diu_user:diu_password@localhost:5432/diu_canteen_hub
```

### 4. Initialize Database Schema
```bash
npm run db:push
```

### 5. Start the Development Server
```bash
npm run dev
```

The application will be available at: http://localhost:5000

## Project Structure

```
diu-canteen-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Node.js backend
│   ├── db.ts              # Database connection
│   ├── storage.ts         # Data access layer
│   ├── routes.ts          # API routes
│   └── replitAuth.ts      # Authentication setup
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema
└── package.json
```

## Features

### For Students:
- Browse all DIU canteens with locations and hours
- Search for specific food items and canteens
- Read and write reviews for food items
- Save favorite canteens and menu items
- View ratings and recommendations

### For Administrators:
- Add new canteens and menu items
- Manage canteen information and availability
- Monitor reviews and ratings

## Authentication

The app uses Replit's authentication system. For local development:

1. **Note**: Full authentication requires Replit environment variables
2. For testing, you can modify the authentication flow in `client/src/App.tsx`
3. Or set up a local authentication system by replacing the Replit Auth components

## Database Schema

The application includes these main tables:
- **users**: User profiles and authentication data
- **canteens**: Canteen information, locations, and hours
- **menu_items**: Food items with prices and descriptions
- **reviews**: User reviews and ratings
- **favorites**: User's saved items and canteens
- **sessions**: Authentication session storage

## API Endpoints

### Public Endpoints:
- `GET /api/canteens` - List all canteens
- `GET /api/canteens/:id` - Get specific canteen
- `GET /api/menu-items` - List menu items
- `GET /api/reviews` - List reviews

### Protected Endpoints (require authentication):
- `POST /api/reviews` - Create review
- `GET /api/favorites` - User's favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites` - Remove from favorites

## Environment Variables

Create a `.env` file with these variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/diu_canteen_hub

# Session Security
SESSION_SECRET=generate-a-random-32-character-string

# Authentication (for Replit compatibility)
REPL_ID=local-development
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=localhost:5000

# Development
NODE_ENV=development
PORT=5000
```

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check if PostgreSQL is running
   - Verify DATABASE_URL is correct
   - Ensure database exists

2. **Authentication Issues**
   - For local development, authentication might not work fully
   - Consider implementing a simple local auth or bypass auth for testing

3. **Port Already in Use**
   - Change PORT in .env file
   - Or kill the process using the port: `lsof -ti:5000 | xargs kill`

4. **Module Not Found Errors**
   - Run `npm install` again
   - Delete `node_modules` and `package-lock.json`, then `npm install`

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Push database schema changes
npm run db:push

# Type checking
npm run check
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests and ensure everything works
5. Commit your changes: `git commit -m "Add feature"`
6. Push to your branch: `git push origin feature-name`
7. Submit a pull request

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **Build Tools**: Vite, esbuild
- **State Management**: TanStack Query

## License

This project is licensed under the MIT License.