# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Start Next.js development server
- **Build**: `npm run build` - Build production application
- **Lint**: `npm run lint` - Run ESLint to check code quality
- **Production**: `npm run start` - Start production server

## Project Architecture

This is a Next.js 15 application for "HEY PAPASITO", a premium escort platform with the following architecture:

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **Payments**: Stripe integration
- **Email**: Brevo (Sendinblue) for notifications
- **Type Safety**: TypeScript with strict configuration
- **State Management**: React Context for theme and language

### Project Structure

**Dual Component Organization**: The project has components in both `/components` and `/src/components` directories. When adding new components, follow the existing pattern in the specific area you're working on.

**App Router Structure**:
- `/app` - Next.js App Router pages and API routes
- `/app/api` - API endpoints for auth, payments, notifications
- `/types/index.ts` - Centralized TypeScript type definitions

**Key Features**:
- Multi-language support (French primary) via context provider
- Theme system with light/dark mode support
- Payment processing with commission calculation
- Booking system with availability management
- User verification system (levels 0-3)
- Messaging system between users
- Review and rating system
- Advanced filtering capabilities

### API Routes
- `/api/auth/signin/google` - Google OAuth authentication
- `/api/payment/stripe/create` - Stripe payment session creation
- `/api/payment/webhook` - Payment webhook handling
- `/api/notifications/send-reminder` - Email notification system

### Key Configuration Files
- `components.json` - shadcn/ui configuration with custom aliases
- `tailwind.config.ts` - Extended with custom gold/purple color scheme
- `next.config.mjs` - Image optimization disabled, strict TypeScript/ESLint

### Path Aliases
- `@/*` - Root directory
- `@/components` - UI components
- `@/lib` - Utility libraries
- `@/hooks` - Custom React hooks

### Custom Hooks
- `use-cached-data.ts` - Data caching functionality
- `use-lazy-load.ts` - Lazy loading implementation
- `use-media-query.ts` - Responsive design helper
- `use-mobile.tsx` - Mobile detection

### Environment Requirements
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` - Stripe public key
- `NEXT_PUBLIC_BASE_URL` - Application base URL

### Code Conventions
- Use TypeScript strict mode
- Follow shadcn/ui component patterns
- CSS-in-JS via Tailwind with CSS variables
- French as primary language with i18n support
- Custom color scheme: purple primary, gold accent