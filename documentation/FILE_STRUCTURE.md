# File Structure Documentation

## Project Overview
ZeroDay Campus App is a full-stack web application built with React (frontend) and Node.js/Express (backend), featuring a modern UI with Tailwind CSS and comprehensive campus management features.

## Root Directory Structure
```
zeroday/
├── client/                 # Frontend React application
├── server/                 # Backend Node.js/Express application
├── documentation/          # Project documentation
├── instructions/           # Development instructions
├── package.json           # Root package.json
├── README.md              # Main project README
├── DEPLOYMENT.md          # Deployment guide
└── DEPLOYMENT_CHECKLIST.md # Quick deployment checklist
```

## Frontend Structure (client/)

### Core Files
```
client/
├── index.html             # Main HTML entry point
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite build configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── eslint.config.js       # ESLint configuration
├── netlify.toml           # Netlify deployment configuration
└── public/
    ├── vite.svg           # Vite logo
    └── _redirects         # Netlify redirects for React Router
```

### Source Code (src/)
```
client/src/
├── main.jsx               # React application entry point
├── index.js               # DOM rendering entry point
├── index.css              # Global CSS styles
├── App.css                # App component styles
├── App.jsx                # Main App component with routing
├── components/            # Reusable UI components
│   ├── NavBar.jsx         # Navigation bar component
│   └── README.md          # Components documentation
├── pages/                 # Page components organized by feature
│   ├── Auth/              # Authentication pages
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── Dashboard/         # Dashboard pages
│   │   └── DashboardPage.jsx
│   ├── Admin/             # Admin-only pages
│   │   ├── AdminDashboardPage.jsx
│   │   ├── AnnouncementManagementPage.jsx
│   │   ├── ComplaintManagementPage.jsx
│   │   ├── FeedManagementPage.jsx
│   │   └── PollManagementPage.jsx
│   ├── Announcements/     # Announcement pages
│   │   └── AnnouncementsPage.jsx
│   ├── Complaints/        # Complaint pages
│   │   ├── ComplaintRegistrationPage.jsx
│   │   └── MyComplaintsPage.jsx
│   ├── Feed/              # Feed pages
│   │   └── FeedPage.jsx
│   ├── LostFound/         # Lost & Found pages
│   │   ├── BrowseItemsPage.jsx
│   │   ├── ItemDetailsPage.jsx
│   │   └── ReportItemPage.jsx
│   ├── Polls/             # Poll pages
│   │   └── PollsPage.jsx
│   ├── Skills/            # Skills pages
│   │   ├── BrowseSkillsPage.jsx
│   │   ├── ListSkillPage.jsx
│   │   ├── MyBookingsPage.jsx
│   │   ├── MySkillsPage.jsx
│   │   └── SkillDetailsPage.jsx
│   ├── Tasks/             # Task pages
│   │   └── TaskManagementPage.jsx
│   ├── Timetable/         # Timetable pages
│   │   ├── ScheduleFormPage.jsx
│   │   └── TimetablePage.jsx
│   ├── NotFoundPage.jsx   # 404 error page
│   └── README.md          # Pages documentation
├── context/               # React Context providers
│   └── AuthContext.jsx    # Authentication context
├── hooks/                 # Custom React hooks
│   ├── useAuth.js         # Authentication hook
│   └── README.md          # Hooks documentation
├── services/              # API service functions
│   ├── announcementService.js
│   ├── authService.js
│   ├── bookingService.js
│   ├── complaintService.js
│   ├── feedItemService.js
│   ├── lostFoundService.js
│   ├── pollService.js
│   ├── scheduleService.js
│   ├── skillService.js
│   ├── voteService.js
│   └── README.md          # Services documentation
├── utils/                 # Utility functions
│   └── README.md          # Utils documentation
└── middleware/            # Frontend middleware
    └── README.md          # Middleware documentation
```

## Backend Structure (server/)

### Core Files
```
server/
├── index.js               # Main server entry point
├── package.json           # Backend dependencies
└── uploads/               # File upload directory
    └── [uploaded files]   # User uploaded files
```

### Configuration (config/)
```
server/config/
├── db.js                  # MongoDB connection configuration
└── README.md              # Config documentation
```

### Models (models/)
```
server/models/
├── Announcement.js        # Announcement data model
├── Booking.js             # Booking data model
├── Complaint.js           # Complaint data model
├── FeedItem.js            # Feed item data model
├── LostFoundItem.js       # Lost & Found item model
├── Poll.js                # Poll data model
├── ScheduleItem.js        # Schedule item model
├── Skill.js               # Skill data model
├── User.js                # User data model
├── Vote.js                # Vote data model
└── README.md              # Models documentation
```

### Controllers (controllers/)
```
server/controllers/
├── announcementController.js
├── authController.js
├── bookingController.js
├── complaintController.js
├── feedItemController.js
├── lostFoundController.js
├── pollController.js
├── scheduleController.js
├── skillController.js
├── voteController.js
└── README.md              # Controllers documentation
```

### Routes (routes/)
```
server/routes/
├── announcementRoutes.js
├── authRoutes.js
├── bookingRoutes.js
├── complaintRoutes.js
├── feedItemRoutes.js
├── lostFoundRoutes.js
├── pollRoutes.js
├── scheduleRoutes.js
├── skillRoutes.js
├── voteRoutes.js
└── README.md              # Routes documentation
```

### Middleware (middlewares/)
```
server/middlewares/
├── authMiddleware.js      # Authentication middleware
├── errorHandler.js        # Global error handling
└── README.md              # Middleware documentation
```

## Documentation Structure (documentation/)
```
documentation/
├── FILE_STRUCTURE.md      # This file - detailed file structure
├── PROJECT_FEATURES.md    # Comprehensive feature documentation
├── API_DOCUMENTATION.md   # Backend API endpoints
├── SETUP_GUIDE.md         # Development setup instructions
└── CONTRIBUTING.md        # Contribution guidelines
```

## Key Architectural Patterns

### Frontend Architecture
- **Component-Based**: Modular React components organized by feature
- **Service Layer**: Centralized API communication through service files
- **Context API**: Global state management for authentication
- **Custom Hooks**: Reusable logic extraction
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend Architecture
- **MVC Pattern**: Models, Views (Controllers), Routes separation
- **Middleware Chain**: Authentication, error handling, CORS
- **Service Layer**: Business logic in controllers
- **Database Abstraction**: Mongoose ODM for MongoDB
- **RESTful API**: Standard HTTP methods and status codes

### File Organization Principles
- **Feature-Based**: Related files grouped by functionality
- **Separation of Concerns**: Clear boundaries between layers
- **Scalability**: Easy to add new features and modules
- **Maintainability**: Consistent naming and structure
- **Documentation**: README files in each directory

## Technology Stack

### Frontend
- **React 19**: UI library
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API calls
- **Framer Motion**: Animation library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **cors**: Cross-origin resource sharing

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Git**: Version control
- **npm**: Package management

## Deployment Structure
- **Frontend**: Netlify (static hosting)
- **Backend**: Render (server hosting)
- **Database**: MongoDB Atlas (cloud database)
- **Environment**: Production and development configurations 