Here's a comprehensive README for your frontend web portal:

```markdown
# Insighta Labs+ Web Portal

A secure, role-based web application for profile management and analytics with GitHub OAuth authentication.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Authentication Flow](#authentication-flow)
- [Role-Based Access Control](#role-based-access-control)
- [Pages Overview](#pages-overview)
- [API Integration](#api-integration)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Building for Production](#building-for-production)

## Overview

The Insighta Labs+ Web Portal provides a secure interface for managing and analyzing profile data. Built with Next.js 14 and Tailwind CSS, it features GitHub OAuth authentication, role-based access control, and comprehensive profile management capabilities.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Authentication:** HTTP-only cookies + GitHub OAuth
- **State Management:** React Context API
- **HTTP Client:** Native Fetch API with interceptors
- **Security:** CSRF protection, HTTP-only cookies
- **Language:** JavaScript (ES6+)

## Features

### ✅ Implemented

- **Authentication**
  - GitHub OAuth login
  - HTTP-only cookie-based sessions
  - CSRF protection
  - Automatic token refresh
  - Protected routes with middleware

- **Profile Management**
  - List profiles with pagination
  - Advanced filtering (gender, age group, age range, probability)
  - Sort by multiple fields
  - Profile detail view
  - Create new profiles (Admin only)
  - Delete profiles (Admin only)
  - Export to CSV with filters

- **Search & Discovery**
  - Natural language search
    - "female adults from Nigeria"
    - "male teenagers over 18"
    - "senior citizens"
  - Intelligent query interpretation

- **Dashboard**
  - Key metrics overview
  - Gender distribution
  - Age group distribution
  - Recent activity feed

- **Role-Based Access**
  - **Analyst Role:** View, search, export data
  - **Admin Role:** Create, delete, full CRUD operations

### 🔒 Security Features

- HTTP-only cookies (tokens inaccessible via JavaScript)
- CSRF token validation
- PKCE flow for GitHub OAuth
- Protected route middleware
- Rate limiting (backend)
- Secure session management

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.17.0 or later
- npm or yarn package manager
- Backend API server running on `http://localhost:8000`
- GitHub OAuth App configured (for authentication)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Sevenwings26/insighta-web-portal.git
cd insighta-web-portal
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Ensure backend is running

Make sure your FastAPI backend is running on `http://localhost:8000` with:
- GitHub OAuth configured
- Database migrations applied
- CORS properly configured for `http://localhost:3000`

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint URL | Yes | `http://localhost:8000` |

## Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
web/
├── app/                        # Next.js App Router pages
│   ├── layout.js              # Root layout with AuthProvider
│   ├── page.js                # Landing page
│   ├── login/                 # Login page
│   ├── dashboard/             # Dashboard page
│   ├── profiles/              # Profiles section
│   │   ├── page.js           # Profiles list
│   │   ├── create/           # Create profile (admin)
│   │   ├── export/           # Export data page
│   │   └── [id]/             # Profile detail
│   ├── auth/                  # Authentication routes
│   │   └── callback/         # OAuth callback handler
│   └── unauthorized/          # Access denied page
│
├── components/                 # Reusable components
│   ├── layout/               # Layout components
│   │   ├── Header.js
│   │   └── Sidebar.js        # Navigation with role-based links
│   ├── auth/                 # Authentication components
│   │   └── ProtectedRoute.js # Route guard
│   └── ui/                   # UI components
│
├── context/                   # React Context providers
│   └── AuthContext.js        # Authentication state management
│
├── hooks/                     # Custom React hooks
│   ├── useAuth.js            # Authentication hook
│   └── useDebounce.js        # Debounced search
│
├── lib/                       # Utility libraries
│   ├── api.js                # API client with interceptors
│   ├── config.js             # Configuration
│   └── storage.js            # Local storage utilities
│
├── middleware.js              # Next.js middleware for route protection
├── styles/                    # Global styles
│   └── globals.css           # Tailwind imports
│
└── public/                    # Static assets
```

## Authentication Flow

### 1. **Login Process**

```mermaid
User → Login Page → Click GitHub → Backend OAuth → GitHub Auth → Callback → Dashboard
```

### 2. **Token Management**

- **Access Token:** 30 minutes (stored in HTTP-only cookie)
- **Refresh Token:** 7 days (stored in HTTP-only cookie)
- **Automatic Refresh:** 401 responses trigger token refresh

### 3. **Protected Routes**

Middleware automatically checks for authentication:
- `/dashboard` → Redirects to login if unauthenticated
- `/profiles` → Redirects to login if unauthenticated
- `/admin` → Requires admin role
- `/login` → Redirects to dashboard if authenticated

## Role-Based Access Control

### Analyst Role
- ✅ View profiles list
- ✅ View profile details
- ✅ Search profiles
- ✅ Export data to CSV
- ✅ Apply filters and sorting
- ❌ Create profiles
- ❌ Delete profiles

### Admin Role
- ✅ Everything in Analyst role
- ✅ Create new profiles
- ✅ Delete profiles
- ✅ Access all administrative features

## Pages Overview

### Landing Page (`/`)
- Hero section with platform overview
- Call-to-action buttons
- Feature highlights

### Login Page (`/login`)
- GitHub OAuth button
- Demo credentials info
- Automatic redirect to intended page after login

### Dashboard (`/dashboard`)
- Total profiles count
- Gender distribution
- Age group breakdown
- Recent profiles list
- Quick action buttons

### Profiles List (`/profiles`)
- **Filters:**
  - Gender (Male/Female)
  - Age group (Child/Teenager/Adult/Senior)
  - Age range (Min/Max)
  - Gender probability threshold
  - Country probability threshold

- **Sorting:**
  - Name
  - Age
  - Gender probability
  - Creation date (default)

- **Features:**
  - Pagination (10/25/50 per page)
  - View details
  - Delete (admin only)
  - Export filtered data

### Profile Detail (`/profiles/[id]`)
- Complete profile information
- Probability confidence indicators
- Age group badge
- Metadata (created date, ID)
- Data confidence visualization
- Back to list navigation

### Create Profile (`/profiles/create`) - Admin Only
- Name input form
- Automatic API data enrichment
- Duplicate prevention
- Progress indicators

### Export Data (`/profiles/export`)
- Filter configuration
- CSV export generation
- Download with timestamp filename

### Search (`/profiles?q=...`)
- Natural language queries:
  - "female adults"
  - "male teenagers from Nigeria"
  - "senior citizens above 65"
  - "young adults 18-25"

## API Integration

### API Client Features

```javascript
// Automatic token refresh on 401
// Credentials included automatically
// Error handling and retry logic

import { api } from '@/lib/api';

// GET request
const response = await api.get('/profiles?page=1');

// POST request (admin only)
const response = await api.post('/profiles', { name: 'John' });

// DELETE request (admin only)
const response = await api.delete('/profiles/123');
```

### Endpoints Used

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/logout` | Logout | Yes |
| POST | `/auth/refresh` | Refresh tokens | Yes |
| GET | `/profiles` | List profiles | Analyst+ |
| POST | `/profiles` | Create profile | Admin only |
| GET | `/profiles/{id}` | Get profile | Analyst+ |
| DELETE | `/profiles/{id}` | Delete profile | Admin only |
| GET | `/profiles/export` | Export CSV | Analyst+ |
| GET | `/profiles/search` | Natural search | Analyst+ |

## Security Features

### 1. **HTTP-Only Cookies**

```javascript
// Backend sets cookies that JavaScript cannot access
response.set_cookie(
    key="access_token",
    value=access_token,
    httponly=True,  // ✅ Not accessible via JavaScript
    secure=False,   // Set to True in production (HTTPS)
    samesite="lax",
    max_age=1800
);
```

### 2. **CSRF Protection**

- Double-submit cookie pattern
- State parameter validation
- PKCE flow for OAuth

### 3. **Route Protection**

- Middleware-level authentication check
- Server-side redirects
- Client-side ProtectedRoute component

### 4. **CORS Configuration**

```python
# Backend CORS settings
allow_origins=["http://localhost:3000"]
allow_credentials=True
allow_methods=["*"]
allow_headers=["*"]
```

## Troubleshooting

### Common Issues and Solutions

#### 1. **"Failed to fetch" errors**

```bash
# Check if backend is running
curl http://localhost:8000/health

# Verify API URL in .env.local
echo $NEXT_PUBLIC_API_URL
```

#### 2. **Authentication loops**

```bash
# Clear browser cookies
# Check that backend is setting cookies correctly
# Verify CORS configuration
```

#### 3. **"403 CSRF validation failed"**

```bash
# Clear browser cookies and localStorage
# Restart both frontend and backend servers
```

#### 4. **Pages not found**

```bash
# Verify Next.js App Router structure
# Check that file names are correct (page.js, not index.js)
# Restart dev server
```

#### 5. **Styles not loading**

```bash
# Verify Tailwind CSS installation
# Check globals.css contains @tailwind directives
# Run npm run dev -- --turbo for faster refresh
```

### Debug Mode

Add environment variable for debugging:

```bash
# .env.local
NEXT_PUBLIC_DEBUG=true
```

This enables:
- Console logging for API requests
- Authentication state changes
- Middleware decision logging

## Development

### Code Style

- ESLint with Next.js recommended rules
- Prettier for code formatting
- Component-based organization

### Adding New Features

1. **Create new page:** Add folder in `app/` with `page.js`
2. **Add new component:** Place in appropriate subfolder of `components/`
3. **Add new API call:** Use `api` utility from `@/lib/api`
4. **Add protected route:** Update `middleware.js` and use `ProtectedRoute`

### Testing Authentication Locally

1. Ensure backend is running on port 8000
2. Frontend running on port 3000
3. Test with GitHub OAuth
4. Verify cookies are set (DevTools → Application → Cookies)

## Building for Production

### 1. **Update Environment Variables**

```bash
# Production .env.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. **Build the application**

```bash
npm run build
```

### 3. **Start production server**

```bash
npm start
```

### 4. **Optimize for production**

- Enable compression
- Configure CDN for static assets
- Use environment-specific CORS settings
- Set secure cookie flags (`secure=True`, `sameSite='strict'`)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend API documentation
3. Verify network requests in DevTools
4. Check console for error messages

## License

Proprietary - All rights reserved

---

## Quick Start Commands

```bash
# Clone and install
git clone <repo>
cd web
npm install

# Setup environment
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev

# Build for production
npm run build && npm start
```

## Environment Checklist

- [ ] Node.js 18+ installed
- [ ] Backend API running on port 8000
- [ ] `.env.local` file created
- [ ] GitHub OAuth configured in backend
- [ ] Dependencies installed
- [ ] Development server running on port 3000

---

**Note:** This frontend requires the backend API to be running. Make sure to start the backend server first before accessing the web portal.
```
