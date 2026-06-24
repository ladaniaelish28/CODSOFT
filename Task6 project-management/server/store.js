import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, 'data.json');

const baseData = {
  projects: [
    {
      id: 'project-launch-pad',
      name: 'Launch Pad Portal',
      owner: 'Aarav Mehta',
      dueDate: '2026-07-18',
      priority: 'High',
      status: 'In Progress',
      color: '#2fbf9b',
      summary: 'Build a polished portal for onboarding internship project submissions.'
    },
    {
      id: 'project-field-notes',
      name: 'Field Notes CRM',
      owner: 'Mira Shah',
      dueDate: '2026-08-05',
      priority: 'Medium',
      status: 'Planning',
      color: '#f59e62',
      summary: 'Track client conversations, follow-ups, and daily progress notes.'
    },
    {
      id: 'project-insight-board',
      name: 'Insight Board',
      owner: 'Dev Patel',
      dueDate: '2026-07-30',
      priority: 'High',
      status: 'Review',
      color: '#5271ff',
      summary: 'Create reporting screens that show delivery risks before deadlines slip.'
    }
  ],
  tasks: [
    {
      id: 'task-wireframes',
      projectId: 'project-launch-pad',
      title: 'Finalize dashboard wireframes',
      assignee: 'Aarav Mehta',
      dueDate: '2026-06-26',
      status: 'done',
      estimate: 4,
      label: 'Design'
    },
    {
      id: 'task-api',
      projectId: 'project-launch-pad',
      title: 'Connect project API endpoints',
      assignee: 'Riya Nair',
      dueDate: '2026-06-29',
      status: 'doing',
      estimate: 6,
      label: 'Backend'
    },
    {
      id: 'task-calendar',
      projectId: 'project-field-notes',
      title: 'Add follow-up calendar view',
      assignee: 'Mira Shah',
      dueDate: '2026-07-03',
      status: 'todo',
      estimate: 5,
      label: 'Frontend'
    },
    {
      id: 'task-risk-model',
      projectId: 'project-insight-board',
      title: 'Define project health scoring',
      assignee: 'Dev Patel',
      dueDate: '2026-06-27',
      status: 'doing',
      estimate: 3,
      label: 'Research'
    },
    {
      id: 'task-report',
      projectId: 'project-insight-board',
      title: 'Create weekly progress report',
      assignee: 'Isha Rao',
      dueDate: '2026-07-01',
      status: 'todo',
      estimate: 2,
      label: 'Reports'
    }
  ]
};

const projectSchema = new mongoose.Schema({
  id: String,
  name: String,
  owner: String,
  dueDate: String,
  priority: String,
  status: String,
  color: String,
  summary: String
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  id: String,
  projectId: String,
  title: String,
  assignee: String,
  dueDate: String,
  status: String,
  estimate: Number,
  label: String
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

const makeId = (prefix, value) => `${prefix}-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;

async function readJsonData() {
  try {
    const raw = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    await fs.writeFile(dataPath, JSON.stringify(baseData, null, 2));
    return structuredClone(baseData);
  }
}

async function writeJsonData(data) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

function cleanMongoDoc(doc) {
  const item = doc.toObject ? doc.toObject() : doc;
  delete item._id;
  delete item.__v;
  delete item.createdAt;
  delete item.updatedAt;
  return item;
}

export async function createStore() {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);

    return {
      kind: 'MongoDB',
      async getData() {
        const [projects, tasks] = await Promise.all([Project.find().lean(), Task.find().lean()]);
        return {
          projects: projects.map(cleanMongoDoc),
          tasks: tasks.map(cleanMongoDoc)
        };
      },
      async createProject(project) {
        const created = await Project.create({ ...project, id: makeId('project', project.name) });
        return cleanMongoDoc(created);
      },
      async createTask(task) {
        const created = await Task.create({ ...task, id: makeId('task', task.title) });
        return cleanMongoDoc(created);
      },
      async updateTask(id, patch) {
        const updated = await Task.findOneAndUpdate({ id }, patch, { new: true });
        return updated ? cleanMongoDoc(updated) : null;
      },
      async deleteTask(id) {
        const result = await Task.deleteOne({ id });
        return result.deletedCount > 0;
      }
    };
  }

  return {
    kind: 'local JSON',
    getData: readJsonData,
    async createProject(project) {
      const data = await readJsonData();
      const created = { ...project, id: makeId('project', project.name) };
      data.projects.push(created);
      await writeJsonData(data);
      return created;
    },
    async createTask(task) {
      const data = await readJsonData();
      const created = { ...task, id: makeId('task', task.title) };
      data.tasks.push(created);
      await writeJsonData(data);
      return created;
    },
    async updateTask(id, patch) {
      const data = await readJsonData();
      const index = data.tasks.findIndex((task) => task.id === id);
      if (index === -1) return null;
      data.tasks[index] = { ...data.tasks[index], ...patch };
      await writeJsonData(data);
      return data.tasks[index];
    },
    async deleteTask(id) {
      const data = await readJsonData();
      const nextTasks = data.tasks.filter((task) => task.id !== id);
      if (nextTasks.length === data.tasks.length) return false;
      data.tasks = nextTasks;
      await writeJsonData(data);
      return true;
    }
  };
}

export async function seedStore() {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
    await Promise.all([Project.deleteMany({}), Task.deleteMany({})]);
    await Promise.all([Project.insertMany(baseData.projects), Task.insertMany(baseData.tasks)]);
    await mongoose.disconnect();
    return 'MongoDB';
  }

  await writeJsonData(baseData);
  return 'local JSON';
}
