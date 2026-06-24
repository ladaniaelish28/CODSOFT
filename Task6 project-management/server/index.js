import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createStore } from './store.js';

const app = express();
const port = process.env.PORT || 5001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const store = await createStore();

app.use(cors());
app.use(express.json());

const asyncRoute = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};

app.get('/api/health', asyncRoute(async (_req, res) => {
  res.json({ ok: true, storage: store.kind });
}));

app.get('/api/summary', asyncRoute(async (_req, res) => {
  const data = await store.getData();
  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter((task) => task.status === 'done').length;
  const overdueTasks = data.tasks.filter((task) => task.status !== 'done' && new Date(task.dueDate) < new Date()).length;
  const activeProjects = data.projects.filter((project) => project.status !== 'Completed').length;

  res.json({
    totalTasks,
    completedTasks,
    overdueTasks,
    activeProjects,
    completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
  });
}));

app.get('/api/projects', asyncRoute(async (_req, res) => {
  const data = await store.getData();
  const projects = data.projects.map((project) => {
    const tasks = data.tasks.filter((task) => task.projectId === project.id);
    const done = tasks.filter((task) => task.status === 'done').length;
    return {
      ...project,
      taskCount: tasks.length,
      completedTasks: done,
      progress: tasks.length ? Math.round((done / tasks.length) * 100) : 0
    };
  });
  res.json(projects);
}));

app.post('/api/projects', asyncRoute(async (req, res) => {
  const { name, owner, dueDate, priority, status, color, summary } = req.body;
  if (!name || !owner || !dueDate) {
    res.status(400).json({ message: 'Project name, owner, and due date are required.' });
    return;
  }

  const project = await store.createProject({
    name,
    owner,
    dueDate,
    priority: priority || 'Medium',
    status: status || 'Planning',
    color: color || '#2fbf9b',
    summary: summary || ''
  });

  res.status(201).json(project);
}));

app.get('/api/tasks', asyncRoute(async (_req, res) => {
  const data = await store.getData();
  res.json(data.tasks);
}));

app.post('/api/tasks', asyncRoute(async (req, res) => {
  const { title, projectId, assignee, dueDate, status, estimate, label } = req.body;
  if (!title || !projectId || !assignee || !dueDate) {
    res.status(400).json({ message: 'Task title, project, assignee, and due date are required.' });
    return;
  }

  const task = await store.createTask({
    title,
    projectId,
    assignee,
    dueDate,
    status: status || 'todo',
    estimate: Number(estimate) || 1,
    label: label || 'General'
  });

  res.status(201).json(task);
}));

app.patch('/api/tasks/:id', asyncRoute(async (req, res) => {
  const task = await store.updateTask(req.params.id, req.body);
  if (!task) {
    res.status(404).json({ message: 'Task not found.' });
    return;
  }
  res.json(task);
}));

app.delete('/api/tasks/:id', asyncRoute(async (req, res) => {
  const removed = await store.deleteTask(req.params.id);
  if (!removed) {
    res.status(404).json({ message: 'Task not found.' });
    return;
  }
  res.status(204).end();
}));

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong.' });
});

app.listen(port, () => {
  console.log(`FlowForge API running on port ${port} using ${store.kind} storage`);
});
