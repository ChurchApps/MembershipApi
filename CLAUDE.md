# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

MembershipApi is the central authentication and people management service for a church management system microservices architecture. It handles authentication, user management, church management, people/household/group relationships, forms, and OAuth integrations.

## Development Commands

```bash
# Initial setup
npm install
npm run initdb              # Initialize database schema and demo data

# Development
npm run dev                 # Start development server with hot reload on port 8083
npm run dev:start          # Single dev build and start
npm run dev:watch          # Watch TypeScript files and restart

# Build and deployment
npm run clean              # Clean dist directory  
npm run lint               # Run linting (currently disabled - TSLint deprecated)
npm run tsc                # TypeScript compilation
npm run build              # Full build pipeline (clean + lint + tsc)
npm run copy-assets        # Copy template assets to dist

# Lambda layer management
npm run build-layer        # Build Lambda layer with production dependencies
npm run clean-layer        # Clean layer directory
npm run rebuild-layer      # Clean and rebuild Lambda layer

# Deployment
npm run deploy-staging     # Deploy to staging environment
npm run deploy-prod        # Deploy to production environment
npm run serverless-local   # Test serverless functions locally
```

## Architecture Overview

**Technology Stack:**
- Node.js 20.x + TypeScript + Express.js
- MySQL with custom repository pattern
- AWS Lambda deployment via Serverless Framework v3
- @codegenie/serverless-express for HTTP handling
- Inversify dependency injection with decorators
- JWT authentication with 2-day token expiration

**Key Architectural Patterns:**

1. **Dependency Injection**: Controllers use Inversify with `@controller`, `@httpGet`, `@httpPost` decorators
2. **Repository Pattern**: All data access via `Repositories.getCurrent()` singleton
3. **Base Controller**: All controllers extend `MembershipBaseController` for shared functionality
4. **Multi-tenant**: All operations scoped by `churchId` for tenant isolation
5. **Permission-based Security**: Check permissions via `au.checkAccess(Permissions.xxx)` before business logic

## Database Setup

1. Create MySQL database named `membership`
2. Copy `dotenv.sample.txt` to `.env` with database credentials:
   ```
   CONNECTION_STRING=mysql://user:password@host:port/membership
   ENCRYPTION_KEY=aSecretKeyOfExactly192BitsLength
   JWT_SECRET=this is a test key that is a sentence
   SERVER_PORT=8083
   ```
3. Run `npm run initdb` to execute schema scripts from `tools/dbScripts/`

## Configuration Management

Environment-specific configs:
- `config/dev.json` - Development settings
- `config/staging.json` - Staging environment  
- `config/prod.json` - Production environment

Access configuration via `Environment.ts` helper class, never directly from config files.

## Lambda Layer Architecture

**Layer Structure:**
- Runtime dependencies built into Lambda layer per deployment
- Layer contains `node_modules` in `/opt/nodejs/node_modules/` structure
- Application code excludes `node_modules` for smaller deployment packages

**Build Process:**
1. `npm run build-layer` creates `layer/nodejs/` directory structure
2. Copies `tools/layer-package.json` with production dependencies only
3. Runs `npm install --production` in layer directory
4. Serverless Framework deploys layer with function reference

## Key Development Patterns

**Controller Pattern:**
```typescript
@controller("/people")
export class PersonController extends MembershipBaseController {
  @httpGet("/timeline")
  public async timeline(req: express.Request, res: express.Response) {
    return this.actionWrapper(req, res, async (au) => {
      // Check permissions first
      if (!au.checkAccess(Permissions.people.view)) return this.denyAccess(['Access denied']);
      
      // Use repositories for data access
      const people = await this.repositories.person.loadByChurchId(au.churchId);
      return people;
    });
  }
}
```

**Repository Access:**
- Always use `this.repositories` in controllers
- All repositories accessed via `Repositories.getCurrent()` singleton
- Repositories handle all database operations

**Permission Checking:**
- Check permissions before any business logic operations
- Use `au.checkAccess(Permissions.xxx)` for standard permissions
- Use `this.formAccess(au, formId, action)` for form-specific permissions
- All operations must be scoped by `churchId` for multi-tenancy

**Authentication:**
- Uses CustomAuthProvider from @churchapps/apihelper
- JWT tokens have 2-day expiration by default
- AuthenticatedUser object provides churchId, personId, and permission checking

## Core Models and Relationships

**People Management:**
- Person → Household relationship (many-to-one)
- Person → Group membership via GroupMember
- Role-based permissions via RoleMember → RolePermission

**Forms System:**
- Form → Question hierarchy with typed answers
- FormSubmission → Answer responses
- Granular permissions via MemberPermission

**Authentication:**
- User → UserChurch for multi-tenant access
- OAuth integrations via OAuthClient, OAuthCode, OAuthToken

## Development Guidelines

- Always extend `MembershipBaseController` for controllers
- Use `Repositories.getCurrent()` for all data access
- Check permissions before business logic using `au.checkAccess(Permissions.xxx)`
- Scope all database operations by `churchId` for multi-tenancy
- Use Environment.ts for configuration access
- Follow existing TypeScript decorator patterns
- Provide database initialization scripts for new features
- Use `this.actionWrapper()` for authenticated endpoints
- Use `this.actionWrapperAnon()` for anonymous endpoints

## CORS Configuration

CORS is configured at both Express and Lambda levels:
- Express middleware handles preflight OPTIONS requests
- Lambda handler includes CORS headers for error responses
- Supports credentials and all standard headers/methods