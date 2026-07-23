# Zero to Subscriber — Full-Stack SaaS Snippet/Prompt Library

Implementation plan to build a complete snippet/prompt library SaaS application.

## User Review Required

> [!IMPORTANT]
> **Stripe Webhooks & Local Development:** For Phase 4 (Stripe Integration), a Stripe CLI listener will be required to forward webhooks to `http://localhost:8000/webhook/stripe`.
> We will need to verify the Stripe webhook secret (`STRIPE_WEBHOOK_SECRET`) inside `backend/.env`.

> [!WARNING]
> **Free Tier Limits Enforcement:** Free tier users will be strictly limited to:
> - Maximum of 10 snippets.
> - Maximum of 3 tags per snippet.
> - No folder creation.
> - No public shareable links.
> 
> Trying to perform these actions will return a `403 Forbidden` response unless the user upgrades to Pro.

## Resolved Design Decisions

- **Public Slug Format:** Use an 8-character URL-safe token generated via `secrets.token_urlsafe(6)`.
- **Default Folders:** None. Users start with no folders, and `folder_id` is nullable (allowing uncategorized snippets).
- **Tag Creation:** Implemented as a "get-or-create" helper on the backend when creating/updating snippets so the frontend does not need a separate tag management screen.
- **Stripe Session Tracking:** Pass the FastAPI user ID as the `client_reference_id` when creating a Stripe Checkout Session to reliably match the database user during webhook processing.

---

## Proposed Changes

### Backend Scaffolding

We will implement custom JWT authentication, SQLAlchemy models, Pydantic schemas, and endpoints using FastAPI.

#### [MODIFY] [database.py](file:///c:/Users/Hp/Desktop/saas-snippet/backend/app/database.py)
Ensure that the DB connection is fully operational and loads variables from `.env`.

#### [NEW] [models.py](file:///c:/Users/Hp/Desktop/saas-snippet/backend/app/models.py)
Define the database models:
- **`User`**: `id`, `email`, `hashed_password`, `is_pro` (boolean, default False), `created_at`.
- **`Folder`**: `id`, `name`, `user_id` (foreign key), `created_at`.
- **`Tag`**: `id`, `name`, `user_id` (foreign key), `created_at`.
- **`Snippet`**: `id`, `title`, `content`, `language` (default `plaintext`), `is_public` (boolean, default False), `slug` (unique string, nullable), `folder_id` (foreign key, nullable), `user_id` (foreign key), `created_at`.
- **`snippet_tags`**: Many-to-many relationship/association table between `Snippet` and `Tag`.

#### [NEW] [schemas.py](file:///c:/Users/Hp/Desktop/saas-snippet/backend/app/schemas.py)
Pydantic v2 schemas:
- **User**: `UserCreate`, `UserResponse`, `Token`, `TokenData`
- **Folder**: `FolderCreate`, `FolderResponse`
- **Tag**: `TagCreate`, `TagResponse`
- **Snippet**: `SnippetCreate`, `SnippetUpdate`, `SnippetResponse`, `PublicSnippetResponse`

#### [NEW] [auth.py](file:///c:/Users/Hp/Desktop/saas-snippet/backend/app/auth.py)
Utility functions for authentication:
- Password hashing & verification using `passlib` with `bcrypt`.
- JWT creation and validation using `python-jose`.
- FastAPI security dependency `get_current_user` to authenticate endpoints.

#### [NEW] [crud.py](file:///c:/Users/Hp/Desktop/saas-snippet/backend/app/crud.py)
Database operations & tier limits check:
- Create users, verify credentials.
- Folders, Tags, and Snippets creation, reading, updating, and deleting.
- Gating rules:
  - Check user `is_pro` status before creating a folder, sharing a snippet publicly, exceeding 10 snippets, or adding > 3 tags.

#### [NEW] [main.py](file:///c:/Users/Hp/Desktop/saas-snippet/backend/app/main.py)
FastAPI application setup:
- CORS middleware configured to allow `http://localhost:5173` and `http://127.0.0.1:5173`.
- Authentication routers: `POST /signup`, `POST /login`, `GET /me`.
- Snippet & Tag routers.
- Stripe router: `POST /create-checkout-session`, `POST /webhook/stripe`.
- Public viewer route: `GET /s/{slug}`.

---

### Frontend React Application

Build out Vite + React with Tailwind styling.

#### [NEW] [api.js](file:///c:/Users/Hp/Desktop/saas-snippet/frontend/src/lib/api.js)
Axios setup with request interceptors to automatically attach the Bearer JWT token from `localStorage` if it exists.

#### [MODIFY] [App.jsx](file:///c:/Users/Hp/Desktop/saas-snippet/frontend/src/App.jsx)
React router configuration:
- `/` - Landing Page
- `/login` - User Login
- `/signup` - User Signup
- `/dashboard` - Protected User Dashboard
- `/s/:slug` - Public Read-Only Snippet View

#### [NEW] Pages & Components
Create structured pages in `frontend/src/pages` and `frontend/src/components` with high-quality design aesthetics (glassmorphism, clean layouts, code highlights):
- `LandingPage`: Marketing with pricing comparison.
- `Dashboard`: Side menu with folders, tag lists, search bar, active feed, and Pro status banner.
- `SnippetEditor`: Editor modal with syntax options.
- `PublicSnippet`: Code display with copy capability.

---

## Verification Plan

### Automated Tests
We will write a verification script under `backend/tests` or a simple verification script to call the endpoints and assert responses:
- Sign up and log in a user.
- Test limit validation (attempt to add 11 snippets on free tier, attempt to add 4 tags on a snippet).
- Test folder creation blocker.

### Manual Verification
- Launch backend with `uvicorn app.main:app --reload`.
- Run frontend with `npm run dev`.
- Complete user registration, snippet creation, tagging, and search flow.
- Simulate a Stripe checkout completion webhook to verify `is_pro` status switch.
