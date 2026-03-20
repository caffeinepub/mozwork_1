# MozWork

## Current State
Project scaffolded with empty backend actor and no frontend App.tsx. Backend is a blank Motoko actor. Frontend has UI components but no pages.

## Requested Changes (Diff)

### Add
- User registration and login (phone/email + name + profession + city)
- Worker profiles with skills, location, ratings, work history
- Service search with filters (price, rating, availability)
- Job posting by clients with description, price, location
- Internal chat between client and worker
- Rating system (quality, punctuality, price)
- Trust badges: Confiavel, Profissional, Novo
- Top 10 professionals ranking per city
- Company area for posting jobs and hiring
- Light mode UI optimized for low data usage

### Modify
- Backend: Replace empty actor with full MozWork data model and API
- Frontend: Create App.tsx and all page components

### Remove
- Nothing to remove

## Implementation Plan
1. Generate Motoko backend with: user registration, profiles, job posts, messages, ratings
2. Select authorization and blob-storage components
3. Build React frontend with: Login, Register, Home/Search, Profile, JobPost, Chat, Rankings pages
