import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Search,
  Sparkles,
  UsersRound
} from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || '';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'tasks', label: 'Tasks', icon: ClipboardList },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'team', label: 'Team', icon: UsersRound },
  { id: 'reports', label: 'Reports', icon: BarChart3 }
];

const statusLabels = {
  todo: 'To do',
  doing: 'Doing',
  done: 'Done'
};

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function daysUntil(value) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date - today) / 86400000);
}

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed.' }));
    throw new Error(error.message);
  }
  if (response.status === 204) return null;
  return response.json();
}

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const [projectData, taskData, summaryData] = await Promise.all([
      request('/api/projects'),
      request('/api/tasks'),
      request('/api/summary')
    ]);
    setProjects(projectData);
    setTasks(taskData);
    setSummary(summaryData);
    setLoading(false);
  }

  useEffect(() => {
    loadData().catch((error) => {
      setNotice(error.message);
      setLoading(false);
    });
  }, []);

  const filteredTasks = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return tasks;
    return tasks.filter((task) =>
      [task.title, task.assignee, task.label, statusLabels[task.status]]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [query, tasks]);

  const projectMap = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);

  async function addProject(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    await request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    formElement.reset();
    setNotice('Project created.');
    await loadData();
  }

  async function addTask(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    await request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    formElement.reset();
    setNotice('Task added.');
    await loadData();
  }

  async function updateTask(id, status) {
    await request(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    await loadData();
  }

  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brandMark"><Sparkles size={20} /></span>
          <div>
            <strong>FlowForge</strong>
            <small>Project Studio</small>
          </div>
        </div>

        <nav className="navList" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activePage === item.id ? 'active' : ''}
                key={item.id}
                onClick={() => setActivePage(item.id)}
                title={item.label}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Internship Task Build</p>
            <h1>{navItems.find((item) => item.id === activePage)?.label}</h1>
          </div>
          <label className="searchBox">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, people, labels" />
          </label>
        </header>

        {notice && <button className="notice" onClick={() => setNotice('')}>{notice}</button>}
        {loading ? (
          <section className="emptyState">Loading your workspace...</section>
        ) : (
          <>
            {activePage === 'dashboard' && <Dashboard summary={summary} projects={projects} tasks={tasks} projectMap={projectMap} />}
            {activePage === 'projects' && <Projects projects={projects} onAddProject={addProject} />}
            {activePage === 'tasks' && <Tasks tasks={filteredTasks} projects={projects} projectMap={projectMap} onAddTask={addTask} onUpdateTask={updateTask} />}
            {activePage === 'calendar' && <Calendar tasks={tasks} projectMap={projectMap} />}
            {activePage === 'team' && <Team tasks={tasks} />}
            {activePage === 'reports' && <Reports projects={projects} tasks={tasks} summary={summary} />}
          </>
        )}
      </main>
    </div>
  );
}

function Dashboard({ summary, projects, tasks, projectMap }) {
  const stats = summary || { activeProjects: 0, completionRate: 0, totalTasks: 0, completedTasks: 0, overdueTasks: 0 };
  const upcoming = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);
  return (
    <div className="pageGrid">
      <section className="metricGrid">
        <Metric label="Active projects" value={stats.activeProjects} tone="green" />
        <Metric label="Tasks complete" value={`${stats.completionRate}%`} tone="blue" />
        <Metric label="Open tasks" value={stats.totalTasks - stats.completedTasks} tone="amber" />
        <Metric label="Overdue" value={stats.overdueTasks} tone="rose" />
      </section>

      <section className="splitGrid">
        <div className="panel">
          <div className="panelTitle">
            <h2>Project pulse</h2>
            <CheckCircle2 size={20} />
          </div>
          <div className="projectStack">
            {projects.map((project) => <ProjectRow project={project} key={project.id} />)}
          </div>
        </div>

        <div className="panel">
          <div className="panelTitle">
            <h2>Next deadlines</h2>
            <CalendarDays size={20} />
          </div>
          <div className="timeline">
            {upcoming.map((task) => (
              <article key={task.id}>
                <span className={`dot ${task.status}`} />
                <div>
                  <strong>{task.title}</strong>
                  <p>{projectMap.get(task.projectId)?.name || 'Unassigned'} · {formatDate(task.dueDate)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, tone }) {
  return (
    <article className={`metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Projects({ projects, onAddProject }) {
  return (
    <div className="pageGrid">
      <section className="projectBoard">
        {projects.map((project) => (
          <article className="projectCard" key={project.id} style={{ '--accent': project.color }}>
            <div className="cardRibbon" />
            <div className="projectHeader">
              <div>
                <h2>{project.name}</h2>
                <p>{project.summary}</p>
              </div>
              <span className="chip">{project.priority}</span>
            </div>
            <ProjectRow project={project} compact />
            <dl className="detailsGrid">
              <div><dt>Owner</dt><dd>{project.owner}</dd></div>
              <div><dt>Due</dt><dd>{formatDate(project.dueDate)}</dd></div>
              <div><dt>Status</dt><dd>{project.status}</dd></div>
              <div><dt>Tasks</dt><dd>{project.completedTasks}/{project.taskCount}</dd></div>
            </dl>
          </article>
        ))}
      </section>

      <FormPanel title="Create project" onSubmit={onAddProject} button="Add project">
        <input name="name" placeholder="Project name" required />
        <input name="owner" placeholder="Owner name" required />
        <input name="dueDate" type="date" required />
        <select name="priority" defaultValue="Medium">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select name="status" defaultValue="Planning">
          <option>Planning</option>
          <option>In Progress</option>
          <option>Review</option>
          <option>Completed</option>
        </select>
        <select name="color" defaultValue="#2fbf9b">
          <option value="#2fbf9b">Mint</option>
          <option value="#f59e62">Coral</option>
          <option value="#5271ff">Blue</option>
          <option value="#e8c547">Gold</option>
        </select>
        <textarea name="summary" placeholder="Short project summary" />
      </FormPanel>
    </div>
  );
}

function Tasks({ tasks, projects, projectMap, onAddTask, onUpdateTask }) {
  const statuses = ['todo', 'doing', 'done'];
  return (
    <div className="pageGrid">
      <section className="kanban">
        {statuses.map((status) => (
          <div className="lane" key={status}>
            <h2>{statusLabels[status]}</h2>
            {tasks.filter((task) => task.status === status).map((task) => (
              <article className="taskCard" key={task.id}>
                <div>
                  <span className="label">{task.label}</span>
                  <h3>{task.title}</h3>
                  <p>{projectMap.get(task.projectId)?.name || 'Unknown project'}</p>
                </div>
                <div className="taskMeta">
                  <span>{task.assignee}</span>
                  <span>{formatDate(task.dueDate)}</span>
                  <span>{task.estimate}h</span>
                </div>
                <select value={task.status} onChange={(event) => onUpdateTask(task.id, event.target.value)}>
                  {statuses.map((option) => <option key={option} value={option}>{statusLabels[option]}</option>)}
                </select>
              </article>
            ))}
          </div>
        ))}
      </section>

      <FormPanel title="Assign task" onSubmit={onAddTask} button="Add task">
        <input name="title" placeholder="Task title" required />
        <select name="projectId" required defaultValue="">
          <option value="" disabled>Select project</option>
          {projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}
        </select>
        <input name="assignee" placeholder="Assignee" required />
        <input name="dueDate" type="date" required />
        <select name="status" defaultValue="todo">
          <option value="todo">To do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
        <input name="estimate" type="number" min="1" max="80" defaultValue="3" />
        <input name="label" placeholder="Label" defaultValue="General" />
      </FormPanel>
    </div>
  );
}

function Calendar({ tasks, projectMap }) {
  const sorted = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  return (
    <section className="calendarList">
      {sorted.map((task) => {
        const distance = daysUntil(task.dueDate);
        return (
          <article key={task.id} className="dateRow">
            <time dateTime={task.dueDate}>
              <strong>{new Date(task.dueDate).getDate()}</strong>
              <span>{new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(task.dueDate))}</span>
            </time>
            <div>
              <h2>{task.title}</h2>
              <p>{projectMap.get(task.projectId)?.name || 'Unknown project'} · {task.assignee}</p>
            </div>
            <span className={distance < 0 ? 'pill danger' : 'pill'}>{distance < 0 ? `${Math.abs(distance)}d late` : `${distance}d left`}</span>
          </article>
        );
      })}
    </section>
  );
}

function Team({ tasks }) {
  const people = Object.values(tasks.reduce((acc, task) => {
    acc[task.assignee] ||= { name: task.assignee, tasks: 0, hours: 0, done: 0 };
    acc[task.assignee].tasks += 1;
    acc[task.assignee].hours += task.estimate;
    acc[task.assignee].done += task.status === 'done' ? 1 : 0;
    return acc;
  }, {}));

  return (
    <section className="teamGrid">
      {people.map((person) => (
        <article className="personCard" key={person.name}>
          <div className="avatar">{person.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
          <h2>{person.name}</h2>
          <p>{person.tasks} tasks · {person.hours} planned hours</p>
          <div className="progressTrack"><span style={{ width: `${Math.round((person.done / person.tasks) * 100)}%` }} /></div>
        </article>
      ))}
    </section>
  );
}

function Reports({ projects, tasks, summary }) {
  const stats = summary || { completionRate: 0, overdueTasks: 0 };
  const totalHours = tasks.reduce((sum, task) => sum + task.estimate, 0);
  return (
    <div className="pageGrid">
      <section className="metricGrid">
        <Metric label="Planned hours" value={totalHours} tone="green" />
        <Metric label="Completion" value={`${stats.completionRate}%`} tone="blue" />
        <Metric label="Projects tracked" value={projects.length} tone="amber" />
        <Metric label="Late tasks" value={stats.overdueTasks} tone="rose" />
      </section>
      <section className="panel">
        <div className="panelTitle">
          <h2>Delivery health</h2>
          <BarChart3 size={20} />
        </div>
        <div className="reportBars">
          {projects.map((project) => (
            <div key={project.id}>
              <span>{project.name}</span>
              <div className="progressTrack"><span style={{ width: `${project.progress}%`, background: project.color }} /></div>
              <strong>{project.progress}%</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProjectRow({ project, compact = false }) {
  return (
    <article className={compact ? 'projectRow compact' : 'projectRow'}>
      <div>
        <strong>{project.name}</strong>
        <span>{project.status} · due {formatDate(project.dueDate)}</span>
      </div>
      <div className="progressTrack" aria-label={`${project.progress}% complete`}>
        <span style={{ width: `${project.progress}%`, background: project.color }} />
      </div>
      <b>{project.progress}%</b>
    </article>
  );
}

function FormPanel({ title, onSubmit, button, children }) {
  return (
    <form className="formPanel" onSubmit={onSubmit}>
      <h2>{title}</h2>
      {children}
      <button type="submit">
        <Plus size={18} />
        {button}
      </button>
    </form>
  );
}

createRoot(document.getElementById('root')).render(<App />);
