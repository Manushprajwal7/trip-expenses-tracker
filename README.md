# 🌍 Trip Expenses Tracker

A **Trip Expenses Tracker** built with **Next.js** to help you manage and split travel costs with friends, family, or colleagues during trips.

🌐 [Live Demo →](https://trip-expens-tracker.vercel.app/)

---

## 🧭 Overview

Keeping track of shared expenses on a trip can be tricky. This web app makes it simple to:

- 💸 Add and categorize expenses
- 👥 Track who paid and who owes what
- 🧾 Get an overall summary of trip expenses
- 🔄 Easily split costs among multiple participants

---

## ✨ Features

- ➕ Add/edit/delete trip expenses
- 🗂️ Categorize by expense type (food, travel, stay, etc.)
- 👤 Multi-user support for splitting
- 📊 Summary dashboard
- 💾 Data persistence with Supabase
- 🔐 User authentication (optional)

---

## 🧰 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Database:** [Supabase](https://supabase.io/)
- **Styling:** Tailwind CSS
- **Hosting:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Manushprajwal7/V2-trip-expenses-tracker
cd trip-expenses-tracker
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file and add your Supabase project credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> You can find these credentials in your Supabase project dashboard under API settings.

### 4. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 📁 Project Structure

```
.
├── components/       # Reusable UI components
├── pages/            # Application routes
├── lib/              # Supabase client setup
├── styles/           # Tailwind or global styles
├── utils/            # Utility functions
├── .env.local        # Environment variables
└── README.md
```

---

## 🛠️ Contributing

Want to improve the app or fix a bug? Contributions are welcome!

1. Fork this repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---



## 🙌 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)

---

### ✈️ Built to make trips more enjoyable by eliminating expense confusion.
