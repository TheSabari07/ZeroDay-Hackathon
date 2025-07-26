# 🚀 Deployment Guide - ZeroDay Campus App

This guide will help you deploy the ZeroDay Campus App backend to Render and frontend to Netlify.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **MongoDB Atlas Account** - For database hosting
3. **Render Account** - For backend deployment
4. **Netlify Account** - For frontend deployment

## 🔧 Step 1: Prepare MongoDB Atlas

1. **Create MongoDB Atlas Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Set up database access (username/password)
   - Set up network access (allow all IPs: 0.0.0.0/0)
   - Get your connection string

2. **Connection String Format**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/zeroday?retryWrites=true&w=majority
   ```

## 🖥️ Step 2: Deploy Backend to Render

### 2.1 Create Render Account
- Go to [Render](https://render.com)
- Sign up with your GitHub account

### 2.2 Deploy Web Service
1. **Connect GitHub Repository**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `zeroday-backend`
   - **Root Directory**: `server` (if your backend is in a server folder)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**
   Add these environment variables in Render:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret_key
   JWT_EXPIRE=30d
   ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://zeroday-backend.onrender.com`)

## 🌐 Step 3: Deploy Frontend to Netlify

### 3.1 Create Netlify Account
- Go to [Netlify](https://netlify.com)
- Sign up with your GitHub account

### 3.2 Deploy Site
1. **Connect GitHub Repository**
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Configure Build Settings**
   - **Base directory**: `client` (if your frontend is in a client folder)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

3. **Environment Variables**
   Add these environment variables in Netlify:
   ```
   VITE_BACKEND_API_URL=https://your-render-backend-url.onrender.com/api
   VITE_NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Note your frontend URL (e.g., `https://zeroday-app.netlify.app`)

## 🔗 Step 4: Connect Frontend and Backend

### 4.1 Update Backend CORS
1. Go to your Render dashboard
2. Find your backend service
3. Go to "Environment" tab
4. Update `ALLOWED_ORIGINS` with your Netlify URL:
   ```
   ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
   ```
5. Redeploy the service

### 4.2 Update Frontend API URL
1. Go to your Netlify dashboard
2. Find your site
3. Go to "Site settings" → "Environment variables"
4. Update `VITE_BACKEND_API_URL` with your Render backend URL:
   ```
   VITE_BACKEND_API_URL=https://your-render-backend-url.onrender.com/api
   ```
5. Trigger a new deployment

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend
- Visit: `https://your-render-backend-url.onrender.com/api/health`
- Should return: `{"status":"OK","message":"Server is running"}`

### 5.2 Test Frontend
- Visit your Netlify URL
- Test login/registration
- Test all features

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `ALLOWED_ORIGINS` includes your Netlify URL
   - Check that the URL is exactly correct (including https://)

2. **MongoDB Connection Issues**
   - Verify your MongoDB Atlas connection string
   - Check network access settings in Atlas
   - Ensure username/password are correct

3. **Build Failures**
   - Check build logs in Render/Netlify
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

4. **Environment Variables**
   - Double-check all environment variable names
   - Ensure no extra spaces or quotes
   - Redeploy after changing environment variables

## 📞 Support

If you encounter issues:
1. Check the deployment logs in Render/Netlify
2. Verify all environment variables are set correctly
3. Test the API endpoints directly
4. Check browser console for frontend errors

## 🔄 Continuous Deployment

Both Render and Netlify will automatically redeploy when you push changes to your GitHub repository's main branch.

---

**Happy Deploying! 🎉** 