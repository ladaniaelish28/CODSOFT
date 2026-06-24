# FlowForge Project Management

FlowForge is an original project management tool for creating projects, assigning tasks, setting deadlines, and tracking progress. It uses React for the interface, Node.js and Express for the API, and MongoDB for hosted database storage. For local demos without a database account, it falls back to a JSON data file.

## Features

- Dashboard with progress, overdue work, upcoming deadlines, and workload metrics
- Project creation with owner, due date, priority, and status
- Task assignment with due dates, estimates, labels, and progress states
- Calendar-style deadline view
- Team workload page
- Reports page with completion and project health indicators
- Clean responsive interface with a custom color palette

## Run Locally

```bash
npm install
npm run seed
npm run dev
```

Open `http://localhost:5173`.

## MongoDB Setup

Create a free MongoDB Atlas database, copy its connection string, and place it in `.env`:

```bash
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/flowforge
PORT=5001
```

Then run:

```bash
npm run seed
npm run dev
```

## Free Hosting

Good free options:

- Render: easiest for a single Node app that serves the React build
- Netlify: good for the frontend, but the Node API needs a separate service
- Vercel: good for frontend/serverless, but this app is structured as Express

For Render:

1. Push this project to GitLab.
2. Create a new Web Service from the GitLab repository.
3. Use `npm install` as the build command.
4. Use `npm run build && npm start` as the start command if Render separates build/start, or set build command to `npm install && npm run build` and start command to `npm start`.
5. Add `MONGODB_URI` in the environment variables.

## GitLab Submission

```bash
git init
git add .
git commit -m "Build FlowForge project management tool"
git branch -M main
git remote add origin YOUR_GITLAB_REPOSITORY_URL
git push -u origin main
```
