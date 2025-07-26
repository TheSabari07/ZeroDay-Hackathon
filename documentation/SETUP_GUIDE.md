# Development Setup Guide

## Prerequisites
Before setting up the ZeroDay Campus App, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Code Editor** (VS Code recommended)

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/TheSabari07/ZeroDay-Hackathon.git
cd ZeroDay-Hackathon
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd server
npm install
```

#### Frontend Dependencies
```bash
cd ../client
npm install
```

### 3. Environment Configuration

#### Backend Environment (.env)
Create a `.env` file in the `server` directory:
```bash
cd server
touch .env
```

Add the following environment variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/zeroday
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zeroday?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=30d

# CORS Origins
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/
```

#### Frontend Environment (.env)
Create a `.env` file in the `client` directory:
```bash
cd client
touch .env
```

Add the following environment variables:
```env
# Backend API URL
VITE_BACKEND_API_URL=http://localhost:5000/api

# Environment
VITE_NODE_ENV=development
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create database: `zeroday`

#### Option B: MongoDB Atlas (Recommended)
1. Create MongoDB Atlas account
2. Create a new cluster
3. Set up database access (username/password)
4. Set up network access (allow all IPs: 0.0.0.0/0)
5. Get connection string and update `MONGODB_URI` in backend `.env`

### 5. Start Development Servers

#### Start Backend Server
```bash
cd server
npm run dev
```
The backend will start on `http://localhost:5000`

#### Start Frontend Server
```bash
cd client
npm run dev
```
The frontend will start on `http://localhost:5173`

## Development Workflow

### Project Structure
```
zeroday/
├── client/          # Frontend React application
├── server/          # Backend Node.js application
├── documentation/   # Project documentation
└── instructions/    # Development instructions
```

### Available Scripts

#### Backend Scripts (server/)
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm test            # Run tests (if configured)
```

#### Frontend Scripts (client/)
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

### Development Best Practices

#### Code Organization
- **Frontend**: Feature-based component organization
- **Backend**: MVC pattern with clear separation
- **Services**: Centralized API communication
- **Components**: Reusable and modular design

#### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
```

#### Code Quality
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (if configured)
- **TypeScript**: Type safety (future enhancement)
- **Testing**: Unit and integration tests (future enhancement)

## Common Issues and Solutions

### Port Already in Use
If port 5000 or 5173 is already in use:
```bash
# Find process using port
lsof -i :5000
lsof -i :5173

# Kill process
kill -9 <PID>
```

### MongoDB Connection Issues
1. Check MongoDB service is running
2. Verify connection string in `.env`
3. Check network access settings (for Atlas)
4. Ensure database exists

### CORS Errors
1. Verify `ALLOWED_ORIGINS` in backend `.env`
2. Check frontend API URL configuration
3. Restart both servers after changes

### Build Errors
1. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Clear build cache:
```bash
npm run build -- --force
```

## Testing the Setup

### 1. Backend Health Check
Visit: `http://localhost:5000/api/health`
Expected response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 2. Frontend Application
Visit: `http://localhost:5173`
Should see the login page

### 3. Database Connection
Check backend console for MongoDB connection success message

### 4. API Endpoints
Test registration endpoint:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'
```

## Development Tools

### Recommended VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **MongoDB for VS Code**
- **Thunder Client** (API testing)
- **GitLens**
- **Prettier**

### Useful Commands
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB version
mongod --version

# View running processes
ps aux | grep node

# Monitor file changes
nodemon --watch server/

# Build and watch for changes
npm run build -- --watch
```

## Deployment Preparation

### Environment Variables
Before deploying, ensure all environment variables are properly configured:
- **Production API URL**
- **Database connection string**
- **JWT secret**
- **CORS origins**

### Build Optimization
```bash
# Frontend build
cd client
npm run build

# Check build output
ls -la dist/
```

### Database Migration
Ensure database schema is up to date:
- Check all models are properly defined
- Verify indexes are created
- Test data relationships

## Contributing

### Code Style
- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages
Use conventional commit format:
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: maintenance tasks
```

### Pull Request Process
1. Create feature branch
2. Make changes with tests
3. Update documentation
4. Create pull request
5. Code review
6. Merge to main

## Support

### Getting Help
1. Check documentation in `/documentation`
2. Review existing issues on GitHub
3. Create new issue with detailed description
4. Contact maintainers

### Debugging
1. Check browser console for frontend errors
2. Check server logs for backend errors
3. Use browser dev tools for network requests
4. Add console.log statements for debugging

### Performance Monitoring
- Monitor API response times
- Check database query performance
- Optimize bundle size
- Monitor memory usage 