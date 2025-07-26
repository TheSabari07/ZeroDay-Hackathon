# 🚀 Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] Code is pushed to GitHub repository
- [ ] MongoDB Atlas cluster is set up
- [ ] Render account created
- [ ] Netlify account created

## 🔧 Backend (Render) Setup

- [ ] Create new Web Service in Render
- [ ] Connect GitHub repository
- [ ] Set Root Directory: `server`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Add Environment Variables:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=your_mongodb_connection_string`
  - [ ] `JWT_SECRET=your_secure_secret`
  - [ ] `JWT_EXPIRE=30d`
  - [ ] `ALLOWED_ORIGINS=https://your-netlify-app.netlify.app`
- [ ] Deploy and get backend URL

## 🌐 Frontend (Netlify) Setup

- [ ] Create new site from Git in Netlify
- [ ] Connect GitHub repository
- [ ] Set Base Directory: `client`
- [ ] Set Build Command: `npm run build`
- [ ] Set Publish Directory: `dist`
- [ ] Add Environment Variables:
  - [ ] `VITE_BACKEND_API_URL=https://your-render-backend-url.onrender.com/api`
  - [ ] `VITE_NODE_ENV=production`
- [ ] Deploy and get frontend URL

## 🔗 Connect Services

- [ ] Update backend CORS with Netlify URL
- [ ] Update frontend API URL with Render URL
- [ ] Test health endpoint: `/api/health`
- [ ] Test frontend functionality

## 🎉 Success!

Your app should now be live at your Netlify URL! 