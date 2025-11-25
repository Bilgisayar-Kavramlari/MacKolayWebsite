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
- User schema with username/password fields (bcrypt hashed)
- Express-session for session management with JSON file storage
- Cookie-based session management with secure credential handling
- Protected routes redirect to /giris if not authenticated

**API Endpoints**
- POST /api/kayit - User registration (creates user with guvenilirlikPuani: 50)
- POST /api/giris - User login (sets session)
- GET /api/auth/durum - Check authentication status
- GET /api/profil - Get user profile (requires auth)
- POST /api/cikis - User logout
- GET /api/maclarim - Get user's matches (requires auth)

**Security Considerations**
- Passwords hashed with bcrypt (saltRounds: 10)
- Session-based authentication
- Credential handling configured in fetch requests

### Recent Changes (November 2025)

**Match Display Bug Fix**
- Fixed player count display to show "X oyuncu aranıyor" (X players needed) instead of misleading "current/total" format
- Badge now shows "X boş yer" (X available spots)

**Immediate Navigation Update**
- Login success now invalidates auth queries for instant UI update
- No page refresh required to see authenticated navigation

**New "Maçlarım" Feature**
- Route: /maclarim (protected)
- Shows matches user organized and joined
- Three tabs: Tümü (All), Organizatör (Organized), Katıldıklarım (Joined)

**Reliability Score Default**
- New users start with guvenilirlikPuani: 50 (was 100)
- Score range: 0-100, affects badge display on profile

**Homepage Search Integration**
- Hero section search form redirects to /mac-bul with URL query parameters
- Parameters: konum (location) and tarih (date)
- /mac-bul reads URL params and pre-fills search filters
- Automatic search execution based on URL parameters

**Profile Real Data Display**
- /api/profil returns actual user data from database
- Profile page displays fullName, username, phone, position, guvenilirlikPuani
- Badge display based on reliability score (Güvenilir/Orta/Düşük)

**Match-User Association**
- POST /api/maclar uses session.userId as organizatorId
- GET /api/maclarim returns organized and joined matches
- Proper user ID linkage for match ownership

**AuthContext with LocalStorage Caching (Latest)**
- client/src/lib/auth-context.tsx provides instant profile rendering after login
- User data cached in localStorage for immediate display without API delay
- Background API sync validates session; clears cache if session expired
- Login page caches user data from /api/profil before redirecting
- Navigation and Profile pages consume AuthContext for instant UI updates

**Secured Match Details Endpoint (Latest)**
- GET /api/maclar/:macId scrubs sensitive data for unauthenticated/non-involved users
- Public view returns only: macId, sahaAdi, konum, tarih, saat, oyuncuSayisi, mevcutOyuncuSayisi, seviye, fiyat, gerekliMevkiler
- organizatorId and katilanOyuncular hidden from non-involved users
- organizatorTelefon only exposed to joined participants (not organizers or public)
- Duplicate unsecured route removed to prevent security regression

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