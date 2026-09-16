# 🎯 Habitize — Collaborative Habit Tracker

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-v7.10-2d3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=for-the-badge&logo=postgresql)

<p align="center">
  <strong>Build positive habits and stay accountable together in shared, distraction-free workspaces.</strong>
</p>

</div>

---

## 📖 Overview

**Habitize** is a collaborative habit-tracking web application designed for teams, friends, and accountability partners. Instead of complex sign-up flows or individual silos, Habitize enables instant shared spaces through simple invite codes, daily 1–10 scoring check-ins, and interactive progress visualization.

---

## ✨ Features

- 🤝 **Shared Workspaces**: Create or join dedicated spaces instantly with a 6-character room code.
- 📊 **Interactive Daily Grid**: Rate daily progress on a 1–10 scale across a dynamic 14-day tracking matrix.
- 📈 **Visual Progress & Analytics**: Real-time trends, consistency charts, and averages powered by Recharts.
- 🗂️ **Habit Lifecycle Management**: Add new habits, archive completed ones, or restore past goals anytime.
- ⚡ **Optimistic UI Updates**: Immediate interface feedback with background database synchronization.
- 🎨 **Minimalist & Responsive Design**: Custom glassmorphism and modern typography styled with Tailwind CSS v4.

---

## 🏗️ Project Structure

```text
habitize/
├── app/
│   ├── api/                      # REST API Endpoints
│   │   └── spaces/
│   │       ├── route.ts          # Space creation & retrieval
│   │       └── [code]/
│   │           ├── route.ts      # Space details by code
│   │           ├── entries/
│   │           │   └── route.ts  # Daily rating CRUD operations
│   │           └── habits/
│   │               ├── route.ts  # Add & list space habits
│   │               └── [habitId]/
│   │                   └── route.ts # Archive / update habit
│   ├── components/               # React UI Components
│   │   ├── HabitGrid.tsx         # 14-day interactive habit score matrix
│   │   ├── ProgressCharts.tsx    # Consistency & performance analytics
│   │   └── SpaceDashboardClient.tsx # Space dashboard state orchestrator
│   ├── space/
│   │   └── [code]/
│   │       └── page.tsx          # Space room dynamic page
│   ├── globals.css               # Global theme & typography styles
│   ├── layout.tsx                # Root layout container
│   └── page.tsx                  # Home landing & space entry screen
├── lib/
│   └── prisma.ts                 # Prisma Client singleton & pg adapter
├── prisma/
│   └── schema.prisma             # PostgreSQL data model definitions
├── public/                       # Static public assets
├── .env.example                  # Environment configuration template
├── package.json                  # Dependencies and project scripts
├── prisma.config.ts              # Prisma 7 configuration file
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Frontend** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **ORM & Database** | [Prisma ORM 7](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/) (`@prisma/adapter-pg`) |
| **Utilities** | [date-fns](https://date-fns.org/), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge) |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **PostgreSQL**: Local instance or hosted database (e.g. Supabase, Neon, Railway)

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/Natraj16/habitize.git
cd habitize
npm install
```

### 3. Configure Environment Variables
Copy the sample environment file and configure your database URL:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/habitize?schema=public"
```

### 4. Database Migration & Generation
Push the schema to your database and generate the Prisma Client:

```bash
npx prisma db push
npx prisma generate
```

### 5. Run the Development Server
Start the local Next.js server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema

```mermaid
erDiagram
    SPACE ||--o{ HABIT : contains
    HABIT ||--o{ ENTRY : logs

    SPACE {
        string id PK
        string code UK
        datetime createdAt
    }

    HABIT {
        string id PK
        string spaceId FK
        string name
        boolean archived
        datetime createdAt
    }

    ENTRY {
        string id PK
        string habitId FK
        datetime date
        int value "Rating (1-10)"
        datetime createdAt
    }
```

---

## 🔌 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/spaces` | `POST` | Create a new space or find an existing room code |
| `/api/spaces/:code` | `GET` | Get space information and active habits |
| `/api/spaces/:code/habits` | `POST` | Add a new habit to a space |
| `/api/spaces/:code/habits/:habitId` | `PATCH` | Update or toggle habit archive status |
| `/api/spaces/:code/entries` | `GET` | Fetch entries within date range |
| `/api/spaces/:code/entries` | `POST` | Log or update a habit score for a day |
| `/api/spaces/:code/entries?habitId=:id` | `DELETE` | Clear/delete a habit score for today |

---

## 💻 Available Scripts

- `npm run dev` — Start the local development server with Turbopack.
- `npm run build` — Generate Prisma Client and create an optimized production build.
- `npm run start` — Run the built application in production mode.
- `npm run lint` — Run ESLint checks.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
