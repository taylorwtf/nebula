# Nebula Chat Development Guide

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Code Style
- **Imports**: Group imports by type (React, external libraries, internal)
- **Components**: Use functional components with named exports
- **Types**: Define interfaces and types in `src/types/`, use TypeScript's strict mode
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Formatting**: Use 2-space indentation, single quotes for strings
- **CSS**: Use Tailwind classes following theme color variables
- **Error Handling**: Use try/catch with descriptive error messages
- **State Management**: Use Zustand for global state
- **UI**: Prefer Framer Motion for animations, use appropriate aria attributes