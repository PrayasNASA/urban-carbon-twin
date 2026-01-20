# Urban Carbon Twin: Dream Dashboard (Frontend) 🏙️🌌✨

This is the **Next.js** frontend for the Urban Carbon Twin platform. It features a premium, glassmorphic UI designed for high-end urban carbon simulation and optimization.

## 🚀 Key Features
- **Tailwind CSS v4 Integration**: Uses the latest CSS-first engine for styling and design tokens.
- **Glassmorphism Design**: High-end aesthetic with `backdrop-blur` and deep space color palettes.
- **Micro-animations**: Subtle entrance and interaction animations for a premium feel.
- **3D Grid Visualization**: Interactive spatial hub powered by custom React components.
- **Real-time Sync**: Live connection to the backend microservices for simulation results.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Fonts**: Inter (Self-optimized)

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

### 3. Build for Production
```bash
npm run build
```

## 🏗️ Project Structure
- `app/`: Contains the main page, layouts, and global styles.
- `components/`: Modular UI components (ScenarioPanel, CityGrid, ResultsPanel).
- `public/`: Static assets and icons.
- `lib/`: Utility functions and API helpers.

---
> [!TIP]
> This frontend is optimized for deployment on **Vercel**. Ensure all environment variables for the API Gateway are correctly configured in the deployment settings.
