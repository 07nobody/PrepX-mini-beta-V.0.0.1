# PrepX-mini-beta-V.0.0.1

## Modern AI-Powered Exam Preparation Platform

PrepX is an advanced exam preparation platform leveraging AI to generate high-quality practice questions while providing students with an intuitive test-taking interface and comprehensive performance analytics.

![PrepX Logo](https://via.placeholder.com/500x100?text=PrepX+Logo)

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Folder Organization](#folder-organization)
- [Component Documentation](#component-documentation)
- [API Documentation](#api-documentation)
- [State Management](#state-management)
- [Styling System](#styling-system)
- [Authentication Flow](#authentication-flow)
- [Development Workflow](#development-workflow)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Deployment](#deployment)

## 🏗️ Architecture Overview

PrepX consists of two integrated systems:

1. **Exam Platform** - User-facing application for test-taking and analytics
2. **Question Bank Generator** - Admin-facing AI system for question creation and management

These systems communicate through a shared database and API layer. The architecture follows a modular, component-based design pattern with clear separation of concerns.

## 📂 Project Structure

The monorepo contains two main projects:

```
prepx/
├── exam-platform/           # User-facing application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── contexts/        # React contexts
│   │   └── styles/          # Global styles and theme
│   └── backend/             # Express.js API server
│       ├── controllers/     # Request handlers
│       ├── models/          # Data models
│       ├── routes/          # API routes
│       ├── middleware/      # Express middleware
│       ├── services/        # Business logic
│       └── utils/           # Utility functions
│
└── question-generator/      # AI-powered question generation system
    ├── src/
    │   ├── admin-ui/        # Admin interface components
    │   ├── ai/              # AI integration services
    │   ├── validation/      # Question validation workflows
    │   ├── api/             # API endpoints
    │   └── utils/           # Utility functions
    └── models/              # AI model configurations
```

## 🔧 Tech Stack

### Exam Platform
- **Frontend:**
  - React 18 with JavaScript
  - Vite build system
  - Tailwind CSS for styling
  - React Router v6 for routing
  - React Query for data fetching
  - Zustand for state management
- **Backend:**
  - Express.js
  - Supabase PostgreSQL
  - Clerk.dev for authentication
  - Jest for testing
- **Hosting:**
  - Netlify for frontend
  - Render for backend

### Question Bank Generator
- **Backend:**
  - Node.js
  - Hugging Face Inference API
  - Supabase PostgreSQL (shared instance)
- **Admin UI:**
  - React with JavaScript
  - Tailwind CSS with shadcn/ui components

## 📁 Folder Organization

### Components Structure
Components follow an atomic design methodology:

```
components/
├── atoms/           # Basic UI elements (Button, Input, etc.)
├── molecules/       # Combinations of atoms (Form fields, etc.)
├── organisms/       # Complex UI sections (Navigation, TestCard, etc.)
├── templates/       # Page layouts
└── pages/           # Full page components
```

Each component has its own directory:

```
Button/
├── Button.jsx       # Component implementation
├── Button.test.js   # Unit tests
└── index.js         # Export file
```

## 🧩 Component Documentation

### Core Components

#### `<ExamInterface />`
The main test-taking interface for students.

**Props:**
```javascript
/**
 * @typedef {Object} ExamInterfaceProps
 * @property {string} examId - The unique identifier for the exam
 * @property {number} timeLimit - Time limit in minutes
 * @property {function} onComplete - Callback when exam is completed
 * @property {function} onTimeExpired - Callback when time expires
 */

/**
 * Exam Interface Component
 * @param {ExamInterfaceProps} props
 */
```

**Usage:**
```jsx
<ExamInterface 
  examId="abc123"
  timeLimit={60}
  onComplete={handleExamComplete}
  onTimeExpired={handleTimeExpired}
/>
```

#### `<QuestionEditor />`
Admin component for creating and editing questions.

**Props:**
```javascript
/**
 * @typedef {Object} QuestionEditorProps
 * @property {Object} [initialQuestion] - Optional question object to edit
 * @property {function} onSave - Callback when question is saved
 * @property {function} onCancel - Callback when editing is canceled
 * @property {Array} categories - Available question categories
 * @property {Array} difficultyLevels - Available difficulty levels
 */

/**
 * Question Editor Component
 * @param {QuestionEditorProps} props
 */
```

**Usage:**
```jsx
<QuestionEditor
  initialQuestion={existingQuestion}
  onSave={handleSaveQuestion}
  onCancel={handleCancel}
  categories={availableCategories}
  difficultyLevels={availableDifficulties}
/>
```

## 📡 API Documentation

The application uses RESTful API endpoints with the following base URLs:

- Exam Platform API: `/api/v1`
- Question Generator API: `/api/question-gen/v1`

### Key Endpoints

#### Exam Platform API

```
GET    /api/v1/exams                # List available exams
GET    /api/v1/exams/:id            # Get specific exam
POST   /api/v1/exams/:id/start      # Start an exam session
POST   /api/v1/exams/:id/submit     # Submit exam answers
GET    /api/v1/users/me/progress    # Get user progress
```

#### Question Generator API

```
POST   /api/question-gen/v1/generate         # Generate new questions
GET    /api/question-gen/v1/questions        # List questions
PUT    /api/question-gen/v1/questions/:id    # Update a question
POST   /api/question-gen/v1/validate         # Validate a question
```

## 🔄 State Management

The application uses Zustand for global state management with the following stores:

```javascript
// exam-platform/src/stores/examStore.js
/**
 * Creates the exam store
 * @param {function} set - Zustand set function
 * @param {function} get - Zustand get function
 * @returns {Object} Store actions and state
 */
const createExamStore = (set, get) => ({
  currentExam: null,
  answers: {},
  timeRemaining: 0,
  setCurrentExam: (exam) => set({ currentExam: exam }),
  setAnswer: (questionId, answer) => set((state) => ({ 
    answers: { ...state.answers, [questionId]: answer }
  })),
  decrementTime: () => set((state) => ({ 
    timeRemaining: state.timeRemaining - 1 
  })),
  // other actions...
});

// question-generator/src/stores/questionStore.js
/**
 * Creates the question bank store
 * @param {function} set - Zustand set function
 * @param {function} get - Zustand get function
 * @returns {Object} Store actions and state
 */
const createQuestionBankStore = (set, get) => ({
  questions: [],
  filters: { category: 'all', difficulty: 'all', status: 'all' },
  isGenerating: false,
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  generateQuestions: async (params) => {
    set({ isGenerating: true });
    // implementation...
    set({ isGenerating: false });
  },
  // other actions...
});
```

## 🎨 Styling System

The application uses Tailwind CSS with a custom theme:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ...other shades
          900: '#0c4a6e',
        },
        secondary: {
          // ...color definitions
        },
        // ...other color definitions
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      // ...other theme extensions
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

## 🔒 Authentication Flow

The application uses Clerk.dev for authentication:

1. User signs up/logs in through Clerk UI
2. Clerk provides JWT token
3. Token is stored in memory and sent with API requests
4. Backend validates token using Clerk middleware
5. User session and roles determine available features

```javascript
// exam-platform/src/utils/api.js
/**
 * Configured axios instance with auth headers
 */
const api = axios.create({
  baseURL: process.env.VITE_API_URL,
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = window.Clerk?.session?.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🛠️ Development Workflow

### Prerequisites
- Node.js v16+
- npm or yarn
- Supabase account
- Clerk.dev account
- Hugging Face API access

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/prepx.git
cd prepx

# Install dependencies
npm run setup
```

### Configuration

Create a `.env` file in each project directory:

#### Exam Platform
```
VITE_APP_TITLE=PrepX
VITE_API_URL=http://localhost:3001/api/v1
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

#### Question Generator
```
PORT=3002
HUGGINGFACE_API_KEY=your_huggingface_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### Development Server

```bash
# Start all services in development mode
npm run dev

# Start only the exam platform
npm run dev:exam

# Start only the question generator
npm run dev:generator
```

### Model Schemas

Use JSDoc for documenting object shapes:

```javascript
/**
 * @typedef {Object} Question
 * @property {string} id - Unique identifier
 * @property {string} text - Question text
 * @property {string[]} options - Answer options
 * @property {string} correctAnswer - The correct answer
 * @property {string} explanation - Explanation of the answer
 * @property {string} category - Question category
 * @property {'easy'|'medium'|'hard'} difficulty - Question difficulty
 * @property {string[]} tags - Question tags
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 * @property {string} createdBy - Creator ID
 * @property {'pending'|'approved'|'rejected'} validationStatus - Validation status
 */

/**
 * @typedef {Object} Exam
 * @property {string} id - Unique identifier
 * @property {string} title - Exam title
 * @property {string} description - Exam description
 * @property {number} timeLimit - Time limit in minutes
 * @property {Question[]} questions - Array of questions
 */
```

## 🧪 Testing

### Unit Testing
```bash
# Run unit tests
npm run test

# Generate coverage report
npm run test:coverage
```

Example test:

```javascript
// components/Button/Button.test.js
import { render, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick}>Click me</Button>
    );
    fireEvent.click(getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Testing
```bash
# Run Cypress tests
npm run test:e2e
```

## 🚀 Deployment

### CI/CD Pipeline
The project uses GitHub Actions for CI/CD:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

### Deployment Instructions

```bash
# Build for production
npm run build

# Deploy to Netlify (frontend)
npm run deploy:frontend

# Deploy to Render (backend)
npm run deploy:backend
```

## 📈 Performance Optimization

- React.memo for expensive components
- Lazy loading for routes
- Code splitting with dynamic imports
- Image optimization
- Service worker for offline capability

```javascript
// Example of code splitting in routing
// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/atoms/LoadingSpinner';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ExamPage = lazy(() => import('./pages/ExamPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/exam/:examId" element={<ExamPage />} />
        <Route path="/results/:resultId" element={<ResultsPage />} />
      </Routes>
    </Suspense>
  );
}
```

## 👥 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
