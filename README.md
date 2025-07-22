# Visual AI Discovery Lab

A modern web application that transforms your content into engaging visual formats using AI-powered generation. Create infographics, visual notes, flash cards, and more from text, URLs, or file inputs.

## 🚀 Features

### Content Generation Types
- **Info Graphics** - Transform data and concepts into compelling visual representations
- **Visual Notes** - Convert text into structured, visually appealing notes
- **Flash Cards** - Generate study materials with questions and answers
- **Key Points** - Extract and highlight the most important information
- **Smart Summary** - Create concise, well-structured summaries
- **Social Media Post** - Design engaging posts for various platforms

### Input Sources
- **Text Input** - Paste or type your content directly
- **URL Input** - Provide a URL to extract and process content
- **File Upload** - Upload documents for content processing (Future Scope)

### User Experience
- **Credit System** - Track usage with an integrated credit system
- **History View** - Access and manage your previously generated content
- **Real-time Preview** - See your content being generated in real-time
- **Responsive Design** - Works seamlessly across desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React and Remix Icons

## 📦 Installation

### Prerequisites
- Node.js (version 18 or higher)
- npm or bun package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd visual-ai-discovery-lab
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 🚀 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/            # Reusable UI components (shadcn/ui)
│   ├── CanvasArea.tsx # Main content generation area
│   ├── InputControls.tsx # Content type and input controls
│   └── ...
├── contexts/           # React context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
├── pages/             # Page components
├── services/          # API and external service integrations
├── types/             # TypeScript type definitions
└── ...
```

## 🎨 Key Components

### ContentGeneratorApp
The main application component that orchestrates the entire user experience, including navigation, credit management, and view switching.

### HomeView
The primary workspace where users can:
- Select content types (infographics, visual notes, etc.)
- Input content via text, URL, or file upload
- Generate and preview content in real-time

### CanvasArea
The dynamic content generation area that displays the AI-generated visual content based on user inputs and selected content type.

### InputControls
Provides the interface for:
- Content type selection with visual indicators
- Input method selection (text, URL, file)
- Content input and validation

## 🔧 Configuration

The application uses several configuration files:

- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS styling configuration
- `tsconfig.json` - TypeScript compiler options
- `eslint.config.js` - Code linting rules

## 🚀 Deployment

### Using Lovable (Recommended)
1. Visit your [Lovable Project](https://lovable.dev/projects/2cfe9f9b-e3bc-4949-9b82-0c9cb43c4339)
2. Click on Share → Publish
3. Your application will be deployed automatically

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred hosting service
3. Configure your domain in Project Settings → Domains

## 🔗 Custom Domain Setup

To connect a custom domain:
1. Navigate to Project → Settings → Domains
2. Click "Connect Domain"
3. Follow the DNS configuration instructions
4. Wait for DNS propagation (up to 24 hours)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Visit the [Lovable Project](https://lovable.dev/projects/2cfe9f9b-e3bc-4949-9b82-0c9cb43c4339)
- Check the [Lovable Documentation](https://docs.lovable.dev)
- Contact the development team

---

**Visual AI Discovery Lab** - Transform your content into engaging visual experiences with AI-powered generation.
