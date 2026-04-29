Folder Structure... 
web/
├── app/
│   ├── layout.js
│   ├── page.js
│   │-- globals.css
│   ├── login/
│   │   └── page.js
│   │
│   ├── dashboard/
│   │   └── page.js
│   │
│   ├── profiles/
│   │   ├── page.js
│   │   ├── loading.js
│   │   └── [id]/
│   │       └── page.js
│   │
│   ├── admin/
│   │   └── page.js
│   │
│   └── unauthorized/
│       └── page.js
│
├── components/
│   ├── layout/
│   │   ├── Header.js
│   │   ├── Sidebar.js
│   │   └── DashboardShell.js
│   │
│   ├── profiles/
│   │   ├── ProfilesTable.js
│   │   ├── FilterBar.js
│   │   ├── Pagination.js
│   │   ├── SearchBar.js
│   │   └── ExportButton.js
│   │
│   ├── auth/
│   │   └── ProtectedRoute.js
│   │
│   └── ui/
│       ├── Button.js
│       ├── Loader.js
│       ├── Input.js
│       └── EmptyState.js
│
├── context/
│   └── AuthContext.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useProfiles.js
│   └── useDebounce.js
│
├── lib/
│   ├── api.js
│   ├── auth.js
│   ├── constants.js
│   ├── storage.js
│   └── types.js
│
├── middleware.js
├── public/
│
└── .env.local

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



web/
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   ├── login/
│   │   └── page.js        # /login route
│   ├── dashboard/
│   │   └── page.js        # /dashboard route
│   ├── profiles/
│   │   └── page.js        # /profiles route
│   └── admin/
│       └── page.js        # /admin route
├── components/
│   ├── Header.js
│   ├── Sidebar.js
│   └── ...
├── lib/
│   ├── api.js             # API calls
│   ├── auth.js            # Authentication logic
│   └── types.js           # JSDoc types (since no TypeScript)
├── hooks/
├── middleware.js          # Route protection
├── public/                # Static files
└── styles/
    └── globals.css        # Tailwind imports

