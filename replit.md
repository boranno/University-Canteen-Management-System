# DIU Canteen Hub - University Food Management System

## Overview

DIU Canteen Hub is a comprehensive university canteen food management system built as a full-stack web application. The system connects students with all DIU canteens, allows them to discover menu items, read reviews, and make informed food choices for a healthier campus dining experience.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component-based React application** using TypeScript for type safety
- **Modern UI components** from shadcn/ui built on Radix UI primitives
- **Responsive design** with Tailwind CSS and custom gradient themes
- **Client-side routing** with Wouter for navigation between pages
- **State management** using TanStack Query for server state and React hooks for local state
- **Form handling** with React Hook Form and Zod validation

### Backend Architecture
- **Express.js REST API** with TypeScript support
- **Modular route handling** with centralized error handling
- **Authentication middleware** using Replit Auth and Passport.js
- **Session management** with PostgreSQL session store
- **Database abstraction** through a storage interface pattern

### Database Design
- **User management** with mandatory tables for Replit Auth (users, sessions)
- **Canteen system** with locations, operating hours, and ratings
- **Menu management** with items, pricing, and availability
- **Review system** with user ratings and comments
- **Favorites functionality** for personalized user experience

## Data Flow

1. **Authentication Flow**: Users authenticate through Replit Auth OIDC, creating sessions stored in PostgreSQL
2. **API Communication**: Frontend makes authenticated requests to Express.js REST endpoints
3. **Database Operations**: Server uses Drizzle ORM to interact with PostgreSQL database
4. **State Management**: TanStack Query manages server state caching and synchronization
5. **Real-time Updates**: Query invalidation ensures data consistency across components

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection for Neon serverless
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework

### Authentication
- **openid-client**: OpenID Connect client for Replit Auth
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for server development
- **esbuild**: JavaScript bundler for production builds

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds the React application to `dist/public`
2. **Server Build**: esbuild bundles the Express.js server to `dist/index.js`
3. **Database Migration**: Drizzle Kit handles schema migrations

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Session encryption key
- **REPL_ID**: Replit environment identifier
- **ISSUER_URL**: OIDC issuer URL for authentication

### Production Deployment
- **Static Assets**: Frontend served from `dist/public`
- **API Server**: Express.js server running on Node.js
- **Database**: PostgreSQL with connection pooling
- **Sessions**: Persistent session storage in PostgreSQL

The application is designed for deployment on Replit with integrated database provisioning and authentication, but can be adapted for other cloud platforms with minimal configuration changes.