# Overview

The Venus Project is a conceptual web application representing an autonomous AI city-building initiative. The project appears to be a platform where users can contribute GPU power to accelerate the development of AI-powered sustainable cities. The application presents itself as a futuristic project combining artificial intelligence, distributed computing, and urban planning concepts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Single-page application built with React 18+ using TypeScript for type safety
- **Routing**: Client-side routing implemented with Wouter library for lightweight navigation
- **UI Framework**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Express.js Server**: Node.js backend using Express framework with TypeScript
- **Development Setup**: Hot module replacement and development middleware integrated with Vite
- **API Structure**: RESTful API endpoints prefixed with `/api`
- **Error Handling**: Centralized error handling middleware with structured JSON responses

## Data Layer
- **Database**: PostgreSQL database with Drizzle ORM for type-safe database operations
- **Schema Management**: Database migrations managed through Drizzle Kit
- **Connection**: Neon Database serverless PostgreSQL connection
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

## Styling and Design System
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Custom Theme**: Venus Project branded color scheme with lime accent colors
- **Typography**: Inter font family for consistent branding
- **Component Library**: Comprehensive UI component system with consistent styling patterns

## Development Workflow
- **Monorepo Structure**: Client and server code organized in separate directories with shared schema
- **Path Aliases**: TypeScript path mapping for clean imports (`@/`, `@shared/`)
- **Hot Reloading**: Full-stack development with automatic reload capabilities
- **Type Safety**: End-to-end TypeScript coverage from database schema to frontend components

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production database
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL operations
- **Drizzle Kit**: Database migration and schema management tooling

## UI and Styling
- **Radix UI**: Headless UI component primitives for accessibility and behavior
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating component variants

## Frontend Libraries
- **TanStack Query**: Server state management and data synchronization
- **React Hook Form**: Form handling with validation support
- **Wouter**: Lightweight client-side routing solution
- **Date-fns**: Date manipulation and formatting utilities

## Development Tools
- **Vite**: Build tool and development server with hot module replacement
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility

## Server Dependencies
- **Express.js**: Web application framework for Node.js
- **Connect-PG-Simple**: PostgreSQL session store for Express sessions
- **Zod**: Runtime type validation and schema definition
- **Nanoid**: URL-safe unique string ID generator