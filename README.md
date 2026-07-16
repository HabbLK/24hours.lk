# 24hours.lk - Sri Lanka's Unified Service Hub

A comprehensive service discovery platform connecting Sri Lankans with essential services across the island. Built with modern web technologies to provide fast, intuitive access to services categorized by need.

![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Building & Deployment](#building--deployment)
- [Database](#database)
- [Authentication](#authentication)
- [API Routes](#api-routes)
- [Styling](#styling)
- [Contributing](#contributing)

## ✨ Features

### Core Features
- **Service Search & Discovery** - Full-text search across 500+ services
- **Category Navigation** - Organized service categories for easy browsing
- **Service Guides** - Step-by-step guides for complex services
- **24/7 Access** - Available anytime, anywhere across Sri Lanka
- **AI Assistant** - Chat-based service booking assistance
- **Mobile Responsive** - Optimized for all device sizes

### Admin Features
- **Service Management** - Add, edit, delete services
- **Category Management** - Organize and manage service categories
- **Guide Management** - Create and publish service guides
- **Settings Dashboard** - Configure platform-wide settings
- **Authentication** - Secure admin login with NextAuth.js

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB database (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HabbLK/24hours.lk.git
   cd 24hours.lk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   ADMIN_EMAIL=admin@24hours.lk
   ADMIN_PASSWORD=secure_password
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
24hours.lk/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx            # Home page
│   │   ├── admin/              # Admin dashboard
│   │   ├── category/[slug]/    # Category pages
│   │   ├── guide/[slug]/       # Guide pages
│   │   ├── search/             # Search results page
│   │   ├── assistant/          # AI assistant page
│   │   ├── api/                # API routes
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── Hero.tsx            # Hero section
│   │   ├── SearchClient.tsx    # Search interface
│   │   └── ...
│   ├── models/                 # MongoDB schemas
│   │   ├── Category.ts
│   │   ├── Service.ts
│   │   ├── TaskGuide.ts
│   │   └── Settings.ts
│   ├── lib/                    # Utility functions
│   │   ├── db.ts               # Database connection
│   │   └── ...
│   └── styles/                 # Global styles
├── public/                     # Static assets
├── scripts/                    # Build & utility scripts
├── .env.local                  # Environment variables
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🔧 Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/24hours
# or for MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/24hours

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-secret-key

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@24hours.lk
ADMIN_PASSWORD=your_secure_password

# Optional: AI Assistant Configuration
OPENAI_API_KEY=your_openai_key
```

### Generating NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Migrate icons
npm run migrate:icons
```

### Development Tips

- **Hot Reload** - Changes auto-reflect at [http://localhost:3000](http://localhost:3000)
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality checks on save
- **Tailwind CSS** - Utility-first CSS framework

### File Modifications

The app auto-updates when you modify files in:
- `src/app/page.tsx` - Home page
- `src/components/*.tsx` - Components
- `src/app/api/` - API routes

## 🏗️ Building & Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy on Vercel

The easiest deployment option:

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy with one click

```bash
# Or deploy via CLI
vercel deploy --prod
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🗄️ Database

### MongoDB Models

**Category**
- Name, slug, description
- Icon, color, sort order
- Active status

**Service**
- Name, slug, description
- Category, icon, website
- Contact details, hours
- Active status

**TaskGuide**
- Title, description
- Category, service
- Step-by-step instructions
- Estimated time

**Settings**
- Platform configuration
- Hero headline & subtext
- Footer tagline
- Feature flags

### Database Seeding

```bash
# Seed initial data
npm run seed
```

## 🔐 Authentication

### NextAuth.js Integration

The platform uses NextAuth.js for admin authentication:

- **Provider**: Credentials (email/password)
- **Session Type**: JWT
- **Protected Routes**: `/admin/*`
- **Session Duration**: Configurable

### Admin Login

Access admin dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default credentials (configure in `.env.local`):
- Email: `admin@24hours.lk`
- Password: `your_secure_password`

## 🔌 API Routes

All API routes are located in `src/app/api/`

### Public Routes

```
GET  /api/categories          # List all categories
GET  /api/services            # List all services
GET  /api/guides              # List all guides
POST /api/search              # Search services & guides
GET  /api/settings            # Get platform settings
```

### Admin Routes (Protected)

```
POST   /api/admin/services    # Create service
PUT    /api/admin/services/[id] # Update service
DELETE /api/admin/services/[id] # Delete service
```

### Auth Routes

```
POST /api/auth/signin         # Login
POST /api/auth/signout        # Logout
GET  /api/auth/session        # Get session info
```

## 🎨 Styling

### Tailwind CSS Configuration

Global color scheme defined in `tailwind.config.ts`:

```javascript
colors: {
  'brand-red': '#EF2D47',      // Primary red
  'brand-gold': '#D4A574',     // Accent gold
  'brand-night': '#1A1A1A',    // Dark background
  'brand-ink': '#2D2D2D',      // Secondary dark
  'brand-mist': '#F5F5F5'      // Light background
}
```

### Component Styling

- Components use Tailwind utility classes
- Global styles in `src/app/globals.css`
- Animation utilities in `tw-animate-css`

## 📱 Responsive Design

Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Use Tailwind's responsive prefixes:
```jsx
// Mobile first
className="text-sm sm:text-base md:text-lg lg:text-xl"
```

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Test your changes locally before pushing

## 📦 Dependencies

### Core
- **Next.js 16.2.9** - React framework
- **React 19.2.4** - UI library
- **TypeScript 5** - Type safety
- **MongoDB/Mongoose** - Database

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS
- **Lucide React** - Icon library
- **Shadcn/ui** - Component library

### Authentication & Security
- **NextAuth.js** - Authentication
- **Bcrypt** - Password hashing

### Utilities
- **Fuse.js** - Fuzzy search
- **clsx** - Class name utilities
- **Tailwind Merge** - CSS class merging

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env.local`
- Verify network access for Atlas

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Port Already in Use
```bash
# Change default port
npm run dev -- -p 3001
```

## 📄 License

This project is private and proprietary to HABB PVT LTD.

## 📞 Support

For issues, questions, or suggestions:
- Email: support@24hours.lk
- GitHub Issues: [Report a bug](https://github.com/HabbLK/24hours.lk/issues)

---

**Made with ❤️ by HABB PVT LTD**

Last Updated: July 2026
