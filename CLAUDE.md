# Vesper Project Context

## Project
Vesper is a social media platform.

Frontend:
- Next.js
- TypeScript
- Existing UI already implemented

Backend:
- Express.js
- MongoDB
- Socket.IO

## Rules
- Do not migrate backend to Next.js API routes.
- Do not use React Query.
- Use existing fetch API layer.
- Do not redesign UI.
- Explain architecture changes before implementing.

## Authentication
Current auth system:
- JWT authentication
- accessToken stored in localStorage as vesper_token
- User stored as vesper_user

Backend:
- API runs on localhost:3300
- Frontend runs on localhost:3000

## Completed
Phase 1:
- CORS configured
- Socket.IO CORS configured
- API client created
- Auth Context created
- Login/Register connected
- Logout fixed

## Current Goal
Phase 2:
- Remove fake user/session data
- Add protected routes
- Connect frontend with real backend data
- Keep changes minimal