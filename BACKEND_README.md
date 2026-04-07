# V'eventa Backend

Backend service for V'eventa, built with Express + tRPC + MongoDB.

## Backend Responsibilities

- User authentication and profile management
- Event CRUD and discovery data
- Event registrations and ticket capacity handling
- Group/team module for team events
- Chat and memory APIs
- Organizer/admin analytics endpoints

## Runtime Architecture

1. Express server bootstraps from `server/_core/index.ts`.
2. MongoDB connection initializes via `server/db/connection.ts`.
3. tRPC middleware is mounted on `/api/trpc`.
4. `createVeventaContext` extracts JWT user identity from `Authorization: Bearer <token>`.
5. Routers enforce permissions using `publicProcedure`, `protectedProcedure`, `organizerProcedure`, and `adminProcedure`.

## Routers

- `auth`: register, login, me, updateProfile, logout
- `events`: list, getById, create, update, delete, getCategories
- `registrations`: register, cancel, isRegistered, getUserEvents, getParticipants
- `memories`: create, getByEvent, like, addComment, delete
- `chats`: getMessages, sendMessage
- `groups`: create, getByEvent, addMember, removeMember, delete
- `analytics`: dashboard and trend endpoints
- `system`: health endpoint

## Data Models

- `User`: account profile, role, password hash, interests
- `Event`: schedule, pricing, organizer, capacity
- `Registration`: event-user mapping with status
- `Memory`: event memories, likes, comments
- `Chat`: event chat messages
- `Group`: team entities and members

## Environment Variables

Create `.env` in the project root:

```env
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-strong-secret
NODE_ENV=development
PORT=3000

# For deployed frontend access
CORS_ORIGIN=
```

Notes:

- `MONGODB_URI` is required.
- `JWT_SECRET` signs and verifies auth tokens.
- On Render or other managed hosts, `PORT` is assigned by platform.

## Local Run

```bash
corepack pnpm install
corepack pnpm dev
```

## Quality Gates

```bash
corepack pnpm run check
corepack pnpm run test
corepack pnpm run build
```

## Auth Flow

1. `auth.register` creates user and returns JWT.
2. `auth.login` verifies password and returns JWT.
3. Frontend stores token in `localStorage` (`authToken`).
4. Client sends token in `Authorization` header.
5. Backend context validates token and attaches user to request context.

## Error Handling

- Zod validates inputs at router boundary.
- Business logic failures return `TRPCError` codes (`UNAUTHORIZED`, `FORBIDDEN`, `CONFLICT`, etc.).
- Frontend consumes error messages and displays user-facing alerts.

## Deployment Notes

- Backend can be deployed as a Node web service (Render/Railway/Fly/VM).
- Frontend deployment is separate; configure `VITE_API_URL` to backend public URL.
- Keep secrets in environment variables only.

```typescript
// Get dashboard stats
const stats = await trpc.analytics.getDashboard.query();

// Get registration trends
const trends = await trpc.analytics.getRegistrationTrends.query();

// Get category breakdown
const breakdown = await trpc.analytics.getCategoryBreakdown.query();
```

## Authentication & Authorization

### Token-based Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Role-based Access Control

- **Participant:** Can register for events, create memories, chat, and join teams
- **Organizer:** Can create/manage events, view participants, and access analytics
- **Admin:** Has full access to all operations

### Protected Procedures

- `protectedProcedure` - Requires authentication
- `organizerProcedure` - Requires organizer or admin role
- `adminProcedure` - Requires admin role

## Error Handling

The API returns standardized error responses:

```typescript
{
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'BAD_REQUEST' | 'CONFLICT' | 'INTERNAL_SERVER_ERROR',
  message: 'Error description'
}
```

## Performance Optimizations

- **Indexing:** MongoDB indexes on frequently queried fields (email, eventId, userId, timestamp)
- **Pagination:** All list endpoints support pagination
- **Filtering:** Events support category and search filtering
- **Caching:** Frontend can cache user and event data

## Future Enhancements

- Socket.io integration for real-time chat
- Payment processing with Stripe
- Email notifications
- Advanced search with Elasticsearch
- File upload to S3
- Event recommendations
- User reputation system
- Event reviews and ratings

## Testing

Run the test suite:

```bash
pnpm test
```

Tests are located in `server/routers/*.test.ts` files and cover:
- Authentication (registration, login, profile)
- Event management (CRUD operations)
- Registrations (registration, cancellation, capacity)
- Memories (create, like, comment, delete)
- Groups (create, add/remove members)

## Deployment

### Production Build

```bash
pnpm build
```

This creates an optimized build in the `dist` directory.

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/veventa
JWT_SECRET=your-production-secret-key
NODE_ENV=production
```

### Running in Production

```bash
pnpm start
```

## Troubleshooting

### MongoDB Connection Issues

Ensure MongoDB is running and the connection string is correct:

```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017/veventa"
```

### Port Already in Use

The server will automatically find an available port starting from 3000.

### TypeScript Errors

Run type checking:

```bash
pnpm check
```

## Contributing

When adding new features:

1. Create MongoDB models in `server/models/`
2. Add tRPC routers in `server/routers/`
3. Write tests in `*.test.ts` files
4. Update this README with new endpoints
5. Ensure TypeScript passes with `pnpm check`

## License

MIT
