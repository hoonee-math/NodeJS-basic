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
- `01-basics/` - Node.js fundamentals (global, process, require/exports, __dirname/__filename, built-in modules)
- `02-async/` - Asynchronous patterns (callbacks, promises, async/await, Promise.all/race)
- `03-fs/` - File system operations (read/write, directories, stats, fs.promises)
- `04-path-process/` - Path utilities and process management (path module, argv, env, stdin, events)
- `05-http/` - Building HTTP servers without frameworks (planned)
- `06-events/` - EventEmitter and event-driven patterns (planned)
- `07-streams/` - Stream processing (planned)
- `08-error-handling/` - Error handling strategies (planned)
- `09-npm-packages/` - Working with external packages (planned)
- `10-mini-projects/` - Practical mini-projects (planned)

**Current Status:** Folders 01-05 completed with full examples and documentation.

**File Naming Convention:**
Each directory contains:
- `README.md` - Detailed documentation with clickable table of contents, method explanations, and code examples
- `01-topic-name.js`, `02-topic-name.js`, etc. - Executable examples numbered by subtopic

**README.md Structure:**
Each folder's README follows a consistent format:
- **학습 목표 (Learning Objectives)** - What you will learn in this section
- **목차 (Table of Contents)** - Clickable anchor links to jump to specific example files
- **예제 파일 상세 (Example File Details)** - Each file section includes:
  - Brief description of what the file teaches
  - Key methods/concepts covered
  - Practical use cases
- **실습 가이드 (Practice Guide)** - Commands to run examples
- **핵심 정리 (Key Summary)** - Quick reference with code snippets
- **참고 자료 (References)** - Links to official documentation and related resources

```bash
# Navigate to a folder
cd node-basic/01-basics

# Run examples in order
node 01-hello-world.js
node 02-global-objects.js
# ...and so on

# Each example is self-contained and runnable
```

**Learning Progression:**
1. **01-basics** → Learn CommonJS modules, global objects, built-in modules
2. **02-async** → Master callback → Promise → async/await progression
3. **03-fs** → Handle files synchronously, async callbacks, and promises API
4. **04-path-process** → Work with paths (cross-platform), process info, CLI arguments, environment variables, stdin, and process events
5. **05-http** → Build HTTP servers, routing, methods, headers, JSON API, static file serving

**Example File Writing Style:**

When creating new example files, aim for **concise, code-focused examples**:

- **Keep it short**: Prefer 100-200 lines per file (avoid excessive verbosity like 03-fs/04-path-process became)
- **Code over explanations**: Use inline comments and bottom-of-file summaries instead of long `console.log()` explanations
- **Log user actions**: Always add simple logs when user actions/events occur (e.g., HTTP requests, file operations, event triggers)
  ```javascript
  // Example: HTTP server
  console.log(`→ ${req.method} ${req.url}`);

  // Example: File operations
  console.log(`→ Reading ${filename}...`);
  ```
- **Stay flexible**: Use `console.log()` explanations, `'='.repeat()` separators, or other formatting when it genuinely helps clarity—just avoid overdoing it

Reference **01-basics** for good balance between explanation and code.

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
