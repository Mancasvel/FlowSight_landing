# FlowSight Landing Page

A modern, responsive landing page for FlowSight built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── HeroSection.tsx
│   ├── ProblemSection.tsx
│   ├── SolutionSection.tsx
│   └── ...
public/                 # Static assets
├── flowsight_sinfondo.png
├── mc_profile.jpg
└── ...
```

## 🎨 Features

- **Responsive Design**: Mobile-first approach with responsive components
- **Modern UI**: Clean design inspired by Atlassian/Jira
- **TypeScript**: Full type safety
- **Optimized Images**: Using Next.js Image component
- **Accessibility**: Semantic HTML and ARIA attributes
- **Performance**: Optimized for Core Web Vitals

## 🚀 Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and configure the build settings
3. Images are served from the `public` directory

### Manual Deployment

```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Image Configuration

All images are stored in the `public` directory and served from the root path. The `next/image` component is used for optimization.

## 📱 Responsive Design

The landing page is fully responsive with the following breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Components automatically adapt their layout based on screen size.

## 🎯 Components

- **Navigation**: Sticky navigation with mobile menu
- **Hero**: Main landing section with CTA
- **Problem**: Problem statement with animated cards
- **Solution**: Solution overview with visual flow
- **Pricing**: Responsive pricing table/cards
- **Comparison**: Feature comparison table/cards
- **Team**: Founder profile section
- **Footer**: Comprehensive footer with links

## 📊 Performance

- Lighthouse scores: 90+ on all metrics
- Optimized images with next/image
- Code splitting and lazy loading
- Minimal bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary to FlowSight.
