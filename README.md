# 👋 Welcome to Habitize

Hey there! **Habitize** is a collaborative habit-tracking app designed to help you and your friends (or team!) build better routines together. Whether you're trying to drink more water, code every day, or finally start reading, it's always easier when you have a shared space to keep each other accountable.

## ✨ What makes it special?

- **Shared Spaces:** Hop into a shared workspace with a simple invite code. No complicated setups.
- **Track Together:** Add the habits you want to focus on. Want to retire an old habit? Just archive it.
- **Daily Check-ins:** Log how you did today on a simple 1-10 scale. 
- **See Your Growth:** Beautiful, easy-to-read charts that show your consistency and help you celebrate your wins!

## 🛠️ What's under the hood?

We love using modern, snappy tools to build things. Here's what powers Habitize:
- **Next.js 15** for a lightning-fast React experience.
- **Tailwind CSS v4** to keep things looking gorgeous and responsive.
- **Prisma & PostgreSQL** to safely store all your data.
- **Recharts & Lucide** for those sweet visuals and icons.

---

## 🚀 Want to run it yourself?

Awesome! Getting Habitize running on your own machine is super straightforward. Just follow these steps:

### 1. Grab the code
First, let's get the project onto your computer:
```bash
git clone <repository-url>
cd habitize
```

### 2. Install the goodies
Next, pull down all the necessary packages:
```bash
npm install
```

### 3. Connect the database
You'll need a PostgreSQL database. Once you have one, create a file named `.env` right in the main folder and paste your connection string like this:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/habitize?schema=public"
```

### 4. Set up the tables
Let's get your database ready for action with Prisma:
```bash
npx prisma db push
```
*(Psst: If you prefer using migrations, `npx prisma migrate dev` works too!)*

### 5. Generate the client
```bash
npx prisma generate
```

### 6. Fire it up!
You're all set! Start the app:
```bash
npm run dev
```
Now just head over to [http://localhost:3000](http://localhost:3000) in your browser and start tracking! 🎉

---

## 📚 A quick look at the data

Curious about how we organize things? It's pretty simple:
- **Spaces:** The rooms where the magic happens (accessed via unique invite codes).
- **Habits:** The actual goals you're tracking inside a space.
- **Entries:** Your daily 1-10 scores.

## 💻 Handy Commands

If you're poking around the code, these might be useful:
- `npm run dev` - Jump into development mode.
- `npm run build` - Package it all up for production.
- `npm run lint` - Keep the code clean and tidy.

Happy tracking! 🚀
