# BrainyKids Deployment Guide

This guide provides step-by-step instructions for deploying the BrainyKids platform to production.

## 1. Database & Auth (Firebase)
BrainyKids uses Firebase for Authentication and Firestore. 
- Ensure your `firebase-applet-config.json` is correctly configured.
- Deploy your Firestore rules: `firebase deploy --only firestore:rules`.

## 2. Backend Deployment (Railway / Render)
The backend is a Node.js Express server with Socket.io.

### Railway (Recommended)
1. Connect your GitHub repository to Railway.
2. Railway will automatically detect the `Dockerfile`.
3. Add the following Environment Variables:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `APP_URL`: The URL where your backend will be hosted.
   - `NODE_ENV`: `production`.
4. Ensure the port is set to `3000`.

### Render
1. Create a new "Web Service" on Render.
2. Connect your GitHub repository.
3. Set the build command to `npm install && npm run build`.
4. Set the start command to `tsx server.ts`.
5. Add the Environment Variables mentioned above.

## 3. Frontend Deployment (Vercel)
Vercel is ideal for the React frontend.

1. Connect your GitHub repository to Vercel.
2. Set the Framework Preset to `Vite`.
3. Set the Output Directory to `dist`.
4. Add the following Environment Variables (prefixed with `VITE_` for client-side access):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_FIRESTORE_DATABASE_ID`
5. **Important**: Since this is a full-stack app, you may need to point your frontend API calls to the backend URL hosted on Railway/Render.

## 4. Docker Deployment
If you prefer to use Docker:
1. Build the image: `docker build -t brainykids .`
2. Run the container: `docker run -p 3000:3000 --env-file .env brainykids`

## 5. CI/CD with GitHub Actions
The project includes a `.github/workflows/deploy.yml` file. 
1. Add your secrets to the GitHub repository settings (Settings > Secrets and variables > Actions).
2. Every push to the `main` branch will trigger a build and (if configured) a deployment.

## 6. Real-time Features
- Ensure your production environment supports WebSockets (Railway and Render do by default).
- If using a load balancer, enable session affinity (sticky sessions).
