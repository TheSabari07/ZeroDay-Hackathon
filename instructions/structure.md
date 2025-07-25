/your_project_root
|
├── instructions/
│   ├── structure.md        // This file
│   ├── setup_prompt.md     // Your detailed setup prompt for Cursor AI
│   ├── auth_feature_prompts.md // Prompts related to authentication features
│   ├── task_crud_prompts.md    // Prompts related to task management (CRUD)
│   └── deployment_notes.md // Notes or prompts for deployment
└── client/                 // React Frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── assets/
    │   │   ├── images/
    │   │   └── icons/
    │   ├── components/
    │   │   ├── common/         // Reusable components (e.g., Button, Modal, LoadingSpinner)
    │   │   ├── auth/           // Auth-specific components (e.g., LoginForm, RegisterForm)
    │   │   └── tasks/          // Task-specific components (e.g., TaskCard, TaskList)
    │   ├── context/            // React Context API for global state
    │   │   ├── AuthContext.js
    │   │   └── TaskContext.js
    │   ├── hooks/              // Custom React Hooks
    │   │   ├── useAuth.js
    │   │   └── useTasks.js
    │   ├── layouts/            // Page layouts (e.g., AuthLayout, DashboardLayout)
    │   │   ├── AuthLayout.js
    │   │   └── DashboardLayout.js
    │   ├── pages/              // Top-level page components (routed components)
    │   │   ├── Auth/
    │   │   │   ├── LoginPage.js
    │   │   │   └── RegisterPage.js
    │   │   ├── Dashboard/
    │   │   │   └── DashboardPage.js
    │   │   ├── Tasks/
    │   │   │   └── TaskManagementPage.js
    │   │   └── NotFoundPage.js
    │   ├── services/           // API service calls
    │   │   ├── authService.js
    │   │   └── taskService.js
    │   ├── styles/             // Tailwind CSS configuration and global styles
    │   │   ├── index.css       // Main Tailwind CSS import
    │   │   └── tailwind.config.js
    │   ├── utils/              // Utility functions (e.g., formatters, validators)
    │   │   └── helpers.js
    │   ├── App.js              // Main application component
    │   ├── index.js            // Entry point for React app
    │   └── routes.js           // Centralized route definitions
    └── package.json
└── server/                 // Node.js/Express Backend
    ├── config/             // Configuration files (DB, environment variables, JWT secrets)
    │   ├── db.js           // Database connection setup
    │   └── index.js        // Central config export
    ├── controllers/        // Request handlers for routes
    │   ├── authController.js
    │   └── taskController.js
    ├── middleware/         // Express middleware functions
    │   ├── authMiddleware.js // JWT verification
    │   └── errorHandler.js   // Centralized error handling
    ├── models/             // Mongoose schemas and models
    │   ├── User.js
    │   └── Task.js
    ├── routes/             // API route definitions
    │   ├── authRoutes.js
    │   └── taskRoutes.js
    ├── services/           // Business logic, complex operations
    │   ├── authService.js
    │   └── taskService.js
    ├── utils/              // Utility functions (e.g., validators, formatters, logger)
    │   ├── jwt.js          // JWT token generation/verification helpers
    │   └── validators.js
    ├── .env                // Environment variables (local)
    ├── server.js           // Main application entry point
    └── package.json

# Project Structure

## Client-Side (React)
- `/client`
  - `tailwind.config.js`
  - `postcss.config.js`
  - `/src`
    - `index.js`
    - `App.js`
    - `/components`
    - `/pages`
    - `/services`
    - `/hooks`
    - `/utils`

## Server-Side (Node/Express)
- `/server`
  - `index.js`
  - `.env`
  - `/controllers`
  - `/routes`
  - `/models`
  - `/middlewares`
  - `/config`

