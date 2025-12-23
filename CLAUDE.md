# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a learning repository demonstrating three Node.js development approaches in separate subdirectories:

1. **node-basic/** - Vanilla Node.js with JavaScript
2. **ts-basic/** - Node.js with TypeScript (using ts-node)
3. **nest-basic/** - NestJS framework (Node.js + TypeScript + DI)

Each subdirectory is an independent project with its own `package.json` and dependencies.

## Working with Each Project

### node-basic/
Step-by-step Node.js learning path from basics to practical applications.

**Learning Structure:**
The project is organized into numbered directories (01-, 02-, etc.) representing progressive learning stages:
- `01-basics/` - Node.js fundamentals and module system
- `02-async/` - Asynchronous patterns (callbacks, promises, async/await)
- `03-fs/` - File system operations
- `04-path-process/` - Path utilities and process management
- `05-http/` - Building HTTP servers without frameworks
- `06-events/` - EventEmitter and event-driven patterns
- `07-streams/` - Stream processing
- `08-error-handling/` - Error handling strategies
- `09-npm-packages/` - Working with external packages
- `10-mini-projects/` - Practical mini-projects

**File Naming Convention:**
Each directory contains:
- `README.md` - Concept explanation and learning objectives
- `01-topic-name.js`, `02-topic-name.js` - Executable examples numbered by subtopic

```bash
cd node-basic/01-basics
node 01-hello-world.js
node 02-require-module.js
# ...and so on
```

### ts-basic/
TypeScript-enabled Node.js project.

```bash
cd ts-basic
# Run TypeScript files directly
npx ts-node src/index.ts

# Compile TypeScript
npx tsc

# Check types
npx tsc --noEmit
```

**TypeScript Configuration Notes:**
- Uses `module: "nodenext"` and `target: "esnext"`
- Strict type checking enabled
- Source maps and declaration files generated
- `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` enabled for stricter checks

### nest-basic/
Full NestJS application following the standard NestJS architecture.

```bash
cd nest-basic

# Development
npm run start:dev          # Start with auto-reload
npm run start:debug        # Start with debugger

# Build
npm run build              # Compile to dist/

# Production
npm run start:prod         # Run compiled code

# Code Quality
npm run format             # Format with Prettier
npm run lint               # Lint and auto-fix with ESLint

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run with coverage
npm run test:e2e           # Run end-to-end tests
npm run test:debug         # Debug tests
```

## NestJS Architecture

The NestJS project follows the standard three-layer architecture:

**Core Pattern: Controller → Service → Module**

- **Controllers** (`*.controller.ts`) - Handle HTTP requests, define routes using decorators (`@Get()`, `@Post()`, etc.)
- **Services** (`*.service.ts`) - Contain business logic, decorated with `@Injectable()` for dependency injection
- **Modules** (`*.module.ts`) - Organize related controllers and services, decorated with `@Module()`

**Entry Point:**
- `src/main.ts` - Application bootstrap (creates NestFactory, starts on port 3000 or `process.env.PORT`)

**Testing:**
- Unit tests: `*.spec.ts` files next to source files
- E2E tests: `test/*.e2e-spec.ts`
- Jest configuration embedded in `package.json`

**Nest CLI:**
The project uses `@nestjs/cli` for code generation:
```bash
cd nest-basic
nest generate controller <name>
nest generate service <name>
nest generate module <name>
nest generate resource <name>  # Creates controller, service, module, and DTOs
```

## Development Notes

- All projects use npm as the package manager
- The repository demonstrates progressive complexity: plain Node.js → TypeScript → full framework
- When working on NestJS code, maintain the Controller/Service/Module separation and use dependency injection
