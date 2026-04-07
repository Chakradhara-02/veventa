# Frontend Integration Guide

This guide explains how the frontend connects to the backend and how to wire API calls correctly.

## 1) Environment Setup

Create `.env` (frontend build context):

```env
# Empty in local full-stack mode (same host)
VITE_API_URL=

# For static frontend deployment
# VITE_API_URL=https://your-backend-domain.com

VITE_USE_HASH_ROUTER=false
VITE_BASE_PATH=/
```

## 2) tRPC Client Flow

Current behavior:

1. Frontend reads `VITE_API_URL`.
2. If present, API endpoint becomes `${VITE_API_URL}/api/trpc`.
3. If absent, frontend uses relative `/api/trpc`.
4. `Authorization: Bearer <authToken>` is attached from `localStorage`.

## 3) Auth Integration

### Register

```ts
const result = await trpc.auth.register.mutate({
  name,
  email,
  password,
  role,
  interests,
});

localStorage.setItem("authToken", result.token);
```

### Login

```ts
const result = await trpc.auth.login.mutate({ email, password });
localStorage.setItem("authToken", result.token);
```

### Current User

```ts
const me = trpc.auth.me.useQuery(undefined, {
  enabled: !!localStorage.getItem("authToken"),
});
```

### Logout

```ts
localStorage.removeItem("authToken");
queryClient.clear();
```

## 4) Event APIs

- `events.list` for listing + filters
- `events.getById` for details
- `events.create` organizer/admin only
- `events.update` organizer/admin only
- `events.delete` organizer/admin only

Example:

```ts
const eventsQuery = trpc.events.list.useQuery({
  category,
  search,
  page: 1,
  limit: 20,
});
```

## 5) Registration APIs

- `registrations.register(eventId)`
- `registrations.cancel(eventId)`
- `registrations.isRegistered(eventId)`
- `registrations.getUserEvents()`

Invalidate related queries after mutation to keep UI in sync.

## 6) Chat, Memories, Groups

- Chat: `chats.getMessages`, `chats.sendMessage`
- Memories: `memories.create`, `memories.getByEvent`, `memories.like`, `memories.addComment`, `memories.delete`
- Groups: `groups.create`, `groups.getByEvent`, `groups.addMember`, `groups.removeMember`, `groups.delete`

## 7) Error Handling Pattern

Use normalized error parsing in UI handlers:

```ts
const message =
  error?.message || error?.shape?.message || "Something went wrong";
```

Show this message in inline alerts and toast notifications.

## 8) Production Integration Checklist

1. Deploy backend and verify `/api/trpc/system.health`.
2. Set `VITE_API_URL` in frontend host.
3. Set backend `CORS_ORIGIN` to frontend URL(s).
4. Test register, login, and protected route access.
// - activeEvents
// - totalRevenue
// - newUsersThisMonth
```

### Get Registration Trends

```typescript
const { data: trends } = trpc.analytics.getRegistrationTrends.useQuery();

// trends is array of { month, count }
```

### Get Category Breakdown

```typescript
const { data: breakdown } = trpc.analytics.getCategoryBreakdown.useQuery();

// breakdown is array of { category, pct }
```

### Get Organizer Stats

```typescript
const { data: organizerStats } = trpc.analytics.getOrganizerStats.useQuery();

// organizerStats contains:
// - totalEventsCreated
// - totalRegistrations
// - totalRevenue
// - upcomingEvents
```

## Token Management

### Automatic Token Injection

Create a tRPC link that automatically adds the token to all requests:

```typescript
// client/src/lib/trpc.ts
import { httpBatchLink } from '@trpc/client';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL}/api/trpc`,
      headers() {
        return {
          authorization: `Bearer ${localStorage.getItem('authToken')}`,
        };
      },
    }),
  ],
});
```

## Error Handling

```typescript
const mutation = trpc.events.create.useMutation({
  onError: (error) => {
    if (error.data?.code === 'UNAUTHORIZED') {
      // Redirect to login
      navigate('/login');
    } else if (error.data?.code === 'FORBIDDEN') {
      // Show permission error
      showError('You do not have permission to perform this action');
    } else {
      showError(error.message);
    }
  },
});
```

## Loading States

```typescript
const { data, isLoading, error } = trpc.events.list.useQuery(params);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <EventsList events={data.events} />;
```

## Optimistic Updates

```typescript
const utils = trpc.useUtils();

const registerMutation = trpc.registrations.register.useMutation({
  onMutate: async (eventId) => {
    // Cancel outgoing refetches
    await utils.registrations.isRegistered.cancel(eventId);
    
    // Snapshot previous data
    const previousData = utils.registrations.isRegistered.getData(eventId);
    
    // Update cache optimistically
    utils.registrations.isRegistered.setData(eventId, true);
    
    return { previousData };
  },
  onError: (err, eventId, context) => {
    // Rollback on error
    if (context?.previousData !== undefined) {
      utils.registrations.isRegistered.setData(eventId, context.previousData);
    }
  },
});
```

## Migration from Mock Data

### Before (Mock Data)

```typescript
import { mockEvents } from '../data/mockData';

const events = mockEvents;
```

### After (API)

```typescript
const { data: eventsData } = trpc.events.list.useQuery({
  page: 1,
  limit: 10,
});

const events = eventsData?.events || [];
```

## Common Patterns

### Paginated List

```typescript
const [page, setPage] = useState(1);

const { data, isLoading } = trpc.events.list.useQuery({
  page,
  limit: 10,
});

return (
  <>
    <EventsList events={data?.events || []} />
    <Pagination
      current={page}
      total={data?.pages || 1}
      onChange={setPage}
    />
  </>
);
```

### Search with Debounce

```typescript
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

const { data } = trpc.events.list.useQuery({
  search: debouncedSearch,
  page: 1,
  limit: 10,
});
```

### Infinite Scroll

```typescript
const { data, hasNextPage, fetchNextPage } = trpc.events.list.useInfiniteQuery(
  { limit: 10 },
  { getNextPageParam: (lastPage) => lastPage.nextCursor }
);
```

## Troubleshooting

### CORS Issues

Ensure the backend is configured to accept requests from your frontend domain.

### Token Expiration

Implement token refresh logic:

```typescript
const refreshToken = async () => {
  try {
    const response = await fetch(`${API_URL}/api/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('authToken', token);
    }
  } catch (error) {
    // Redirect to login
  }
};
```

### Network Errors

Implement retry logic in tRPC links:

```typescript
httpBatchLink({
  url: `${API_URL}/api/trpc`,
  fetch: async (input, init?) => {
    const response = await fetch(input, init);
    if (!response.ok && response.status >= 500) {
      // Retry logic
    }
    return response;
  },
})
```

## Next Steps

1. Update your frontend environment variables
2. Replace mock data imports with tRPC queries
3. Implement authentication flows
4. Test all endpoints with your frontend
5. Deploy both frontend and backend
