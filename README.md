# FlowSight Landing Page

A modern, high-performance landing page for **FlowSight** - the privacy-first AI project manager that runs locally on your device. Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Privacy-First Architecture**: Emphasizes local processing (Qwen3-VL 2B) and GDPR compliance.
- **Interactive Flow**: "Zero Friction" section with animated mockups (Agent, AI, Dashboard, Privacy).
- ** responsive Design**: Fully optimized for Mobile, Tablet, and Desktop.
- **Dark & Light Modes**: Clean, professional UI with slate/navy accents.
- **Performance**: Optimized Core Web Vitals with Next.js Image and dynamic imports.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Directory)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── features/       # Features page
│   ├── invite/         # Invite flow
│   ├── login/          # Login page
│   ├── pricing/        # Pricing page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/         # UI Components
│   ├── Hero.tsx        # Main hero with animated canvas
│   ├── FlowSection.tsx # "Zero Friction" animated steps
│   ├── ComparisonTable.tsx # Feature comparison
│   ├── Pricing.tsx     # Pricing tiers
│   └── ui/             # Reusable UI elements (buttons, etc.)
└── lib/                # Utilities & Supabase client
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open:** [http://localhost:3000](http://localhost:3000)

## 📦 Build & Deploy

To create a production build:
```bash
npm run build
npm start
```

## 🔐 Environment Variables

Create a `.env.local` file for local development:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## 📄 License

Proprietary software. All rights reserved.
