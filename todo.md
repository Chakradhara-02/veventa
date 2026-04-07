# V'eventa Roadmap

## Completed

- MongoDB model layer finalized (`User`, `Event`, `Registration`, `Memory`, `Chat`, `Group`)
- tRPC routers implemented for all core modules
- JWT auth + role-based middleware in place
- Login/register flows stabilized in frontend
- Deployment configs prepared for Vercel/GitHub Pages + hosted backend
- Type checks and auth tests passing

## Next Priority

- Add integration tests for events/registrations/memories/chats/groups/analytics
- Add pagination UI state syncing across dashboard views
- Add production-ready file upload pipeline for memory media
- Add rate-limiting + request logging middleware

## Performance / Quality Improvements

- Split large frontend bundles with route-level code-splitting
- Remove duplicate schema index warnings in Mongoose
- Add API response caching where appropriate
- Add error boundaries for major page sections

## DevOps Enhancements

- CI pipeline: check + test + build on pull requests
- Staging deployment branch with separate environment
- Health monitoring and uptime checks for backend
- Structured release notes and version tags
