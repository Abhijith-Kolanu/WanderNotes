## Setting the API Base URL for Deployment

1. Copy `.env.example` to `.env` in the `frontend` folder:
   
   ```sh
   cp .env.example .env
   ```

2. Edit `.env` and set `VITE_API_BASE_URL` to your deployed backend URL, e.g.:
   
   ```env
   VITE_API_BASE_URL=https://your-backend-domain.com
   ```

3. Rebuild and redeploy your frontend:
   
   ```sh
   npm run build
   # then deploy the build output
   ```

If you do not set this variable, the frontend will default to `http://localhost:8000`.