# Halı Saha Maç Uygulaması

## Overview

This is a Turkish football (soccer) field booking and match-finding web application called "Halı Saha Maç" (Artificial Turf Match). The platform helps users discover nearby matches, join games, and rent football fields. It's designed with an energetic, community-focused approach inspired by Airbnb's booking experience and Meetup's social features.

The application is built as a full-stack TypeScript project with a React frontend and Express backend, featuring a modern UI component library (shadcn/ui) and PostgreSQL database integration through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Design system follows "new-york" style variant
- Component aliases configured for clean imports (@/components, @/lib, etc.)

**Design Philosophy**
- Mobile-first responsive design
- Action-oriented UX with "Find Match" as primary journey
- Typography using Inter font family for headlines and body text
- Energetic, sports-focused visual language with vibrant colors
- Hero-driven landing page with full-width imagery

**State Management**
- React Query handles all server state with infinite stale time
- Local component state with React hooks
- Toast notifications for user feedback
- No global state management library (keeping it simple)

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- TypeScript throughout the backend
- Separate development and production entry points (index-dev.ts, index-prod.ts)
- Custom request logging middleware

**Development vs Production**
- Development: Vite dev server integrated via middleware for HMR
- Production: Static file serving from compiled assets
- Hot module replacement in development with Vite integration

**API Design**
- RESTful endpoints under /api prefix
- Query parameter filtering for matches (location, date, skillLevel)
- JSON request/response format
- Error handling with appropriate HTTP status codes

**Storage Layer**
- Currently using in-memory storage (MemStorage class)
- Interface-based design (IStorage) allows easy swap to database
- Pre-populated with mock data for venues, matches, and testimonials
- UUID-based identifiers for all entities

### Data Storage Solutions

**Database Configuration**
- Drizzle ORM configured for PostgreSQL
- Neon serverless PostgreSQL driver (@neondatabase/serverless)
- Schema definition in shared/schema.ts for type sharing between client/server
- Migration support through drizzle-kit

**Data Models**
- Users: Authentication with username/password
- Matches: Core entity with venue details, timing, player capacity, skill level
- Venues: Football field information with amenities and availability
- Testimonials: User reviews and social proof

**Schema Features**
- Zod validation schemas generated from Drizzle tables
- UUID primary keys with PostgreSQL gen_random_uuid()
- Type inference for insert and select operations
- Shared types across frontend and backend via @shared path alias

### Authentication & Authorization

**Current Implementation**
- User schema with username/password fields
- No active authentication middleware (prepared for future implementation)
- Session storage configured with connect-pg-simple
- Cookie-based session management ready but not enforced

**Security Considerations**
- Password field exists in schema (should be hashed before production)
- HTTPS enforcement pending
- CORS and credential handling configured in fetch requests

### External Dependencies

**Third-Party UI Libraries**
- Radix UI: Headless accessible components (20+ primitives)
- Lucide React: Icon library for consistent iconography
- cmdk: Command palette component
- date-fns: Date manipulation and formatting
- embla-carousel-react: Touch-friendly carousels
- class-variance-authority: Component variant management
- tailwind-merge: Smart Tailwind class merging

**Development Tools**
- Replit-specific plugins: vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner
- esbuild: Production server bundling
- tsx: TypeScript execution for development server
- drizzle-kit: Database migrations and schema management

**Database & Validation**
- @neondatabase/serverless: PostgreSQL client for edge/serverless
- drizzle-orm: Type-safe SQL query builder
- drizzle-zod: Automatic Zod schema generation from DB schema
- zod: Runtime type validation
- connect-pg-simple: PostgreSQL session store for Express

**Build & Bundling**
- Vite handles client-side bundling
- esbuild bundles server code for production
- PostCSS with Tailwind and Autoprefixer
- Path aliases resolved through tsconfig and vite config

**Asset Management**
- Static assets stored in attached_assets/generated_images
- Vite alias for @assets path
- Image imports in components for type safety and optimization