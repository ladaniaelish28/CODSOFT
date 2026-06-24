import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CirclePlus,
  Clock3,
  FolderKanban,
  Grid2X2,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings2,
  Sparkles,
  SquareKanban,
  Target,
  Users,
  BadgeCheck,
  Layers3,
  FileBarChart2,
  ArrowUpRight,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Activity,
  Heart,
  Link2,
  Download,
} from "lucide-react";

const THEME = {
  bg: "#FFFAF3",
  card: "#FFF2DB",
  card2: "#FFE5BF",
  accent: "#F62440",
  accentSoft: "#FDE3E7",
  text: "#2D1F1A",
  muted: "#7E6D63",
  border: "rgba(45,31,26,0.10)",
};

const projectsSeed = [
  {
    id: 1,
    name: "Website Revamp",
    owner: "Aelish",
    progress: 78,
    status: "On Track",
    due: "2026-06-28",
    tasks: 12,
    done: 9,
    tone: "linear-gradient(135deg, #F62440 0%, #FF6A7C 100%)",
  },
  {
    id: 2,
    name: "Mobile App Sprint",
    owner: "Team Alpha",
    progress: 46,
    status: "At Risk",
    due: "2026-07-03",
    tasks: 18,
    done: 8,
    tone: "linear-gradient(135deg, #F7A48B 0%, #F62440 100%)",
  },
  {
    id: 3,
    name: "Internship Portal",
    owner: "Design Squad",
    progress: 92,
    status: "Almost Done",
    due: "2026-06-24",
    tasks: 21,
    done: 19,
    tone: "linear-gradient(135deg, #FF8B94 0%, #F62440 100%)",
  },
];

const tasksSeed = [
  { id: 1, title: "Create landing page wireframe", project: "Website Revamp", assignee: "Meera", due: "Today", status: "In Progress", priority: "High" },
  { id: 2, title: "API endpoint for tasks", project: "Internship Portal", assignee: "Rahul", due: "Tomorrow", status: "Review", priority: "Medium" },
  { id: 3, title: "Add deadline reminder UI", project: "Website Revamp", assignee: "Aelish", due: "Jun 26", status: "Todo", priority: "High" },
  { id: 4, title: "Optimize dashboard cards", project: "Mobile App Sprint", assignee: "Karan", due: "Jun 29", status: "In Progress", priority: "Low" },
  { id: 5, title: "Finalize project metrics", project: "Internship Portal", assignee: "Meera", due: "Fri", status: "Done", priority: "Medium" },
];

const teamSeed = [
  { name: "Aelish", role: "Frontend", load: 72, initials: "AL" },
  { name: "Meera", role: "UI/UX", load: 54, initials: "ME" },
  { name: "Rahul", role: "Backend", load: 81, initials: "RH" },
  { name: "Karan", role: "QA", load: 38, initials: "KA" },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "team", label: "Team", icon: Users },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings2 },
];

function App() {
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projects, setProjects] = useState(projectsSeed);
  const [tasks, setTasks] = useState(tasksSeed);
  const [projectForm, setProjectForm] = useState({ name: "", owner: "", due: "", progress: "" });
  const [taskForm, setTaskForm] = useState({ title: "", project: "", assignee: "", due: "", priority: "Medium" });

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "Done").length;
    const active = tasks.filter((t) => t.status !== "Done").length;
    const progressAvg = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);
    return [
      { label: "Active Projects", value: projects.length, icon: Layers3, hint: "+1 this week" },
      { label: "Open Tasks", value: active, icon: ListTodo, hint: "Needs attention" },
      { label: "Done Tasks", value: completed, icon: BadgeCheck, hint: "Recently closed" },
      { label: "Avg Progress", value: `${progressAvg}%`, icon: Target, hint: "Across all projects" },
    ];
  }, [projects, tasks]);

  const addProject = () => {
    if (!projectForm.name.trim() || !projectForm.owner.trim()) return;
    setProjects((prev) => [
      {
        id: Date.now(),
        name: projectForm.name,
        owner: projectForm.owner,
        progress: Number(projectForm.progress || 0),
        status: Number(projectForm.progress || 0) >= 75 ? "On Track" : "Planned",
        due: projectForm.due || "—",
        tasks: 0,
        done: 0,
        tone: [
          "linear-gradient(135deg, #F62440 0%, #FF6A7C 100%)",
          "linear-gradient(135deg, #F7A48B 0%, #F62440 100%)",
          "linear-gradient(135deg, #FF8B94 0%, #F62440 100%)",
          "linear-gradient(135deg, #FBE0B2 0%, #F62440 100%)",
        ][prev.length % 4],
      },
      ...prev,
    ]);
    setProjectForm({ name: "", owner: "", due: "", progress: "" });
    setPage("projects");
  };

  const addTask = () => {
    if (!taskForm.title.trim() || !taskForm.project.trim() || !taskForm.assignee.trim()) return;
    setTasks((prev) => [
      {
        id: Date.now(),
        title: taskForm.title,
        project: taskForm.project,
        assignee: taskForm.assignee,
        due: taskForm.due || "Soon",
        status: "Todo",
        priority: taskForm.priority,
      },
      ...prev,
    ]);
    setTaskForm({ title: "", project: "", assignee: "", due: "", priority: "Medium" });
    setPage("tasks");
  };

  const renderPage = () => {
    switch (page) {
      case "projects":
        return <ProjectsPage projects={projects} projectForm={projectForm} setProjectForm={setProjectForm} addProject={addProject} />;
      case "tasks":
        return <TasksPage tasks={tasks} taskForm={taskForm} setTaskForm={setTaskForm} addTask={addTask} projects={projects} />;
      case "calendar":
        return <CalendarPage tasks={tasks} />;
      case "team":
        return <TeamPage />;
      case "reports":
        return <ReportsPage projects={projects} tasks={tasks} />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage stats={stats} projects={projects} tasks={tasks} setPage={setPage} />;
    }
  };

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{
        background: `radial-gradient(circle at top left, #FFF2DB 0%, #FFFAF3 35%, #FDE3E7 100%)`,
        color: THEME.text,
      }}
    >
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-4rem] top-[-4rem] h-80 w-80 rounded-full bg-[#F62440]/10 blur-3xl" />
        <div className="absolute right-[-5rem] top-20 h-96 w-96 rounded-full bg-[#FFE5BF]/60 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/4 h-96 w-96 rounded-full bg-[#FFF2DB]/80 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main className="relative flex-1">
          <Topbar page={page} setMobileOpen={setMobileOpen} />
          <div className="px-4 pb-8 sm:px-6 lg:px-8">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ page, setPage, mobileOpen, setMobileOpen }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-[#2D1F1A]/30 backdrop-blur-sm transition-opacity lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={`fixed z-40 flex h-full w-72 flex-col border-r transition-transform lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "rgba(255,250,243,0.82)", borderColor: THEME.border, backdropFilter: "blur(24px)" }}
      >
        <div className="border-b p-5" style={{ borderColor: THEME.border }}>
          <div className="flex items-center gap-3">
            <div
              className="grid h-12 w-12 place-items-center rounded-2xl shadow-lg"
              style={{ background: `linear-gradient(135deg, ${THEME.accent} 0%, #FF7B8A 100%)` }}
            >
              <SquareKanban className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight" style={{ color: THEME.text }}>FlowStack</div>
              <div className="text-xs" style={{ color: THEME.muted }}>Warm palette workspace</div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4 rounded-[1.6rem] border p-4 shadow-sm" style={{ background: THEME.card, borderColor: THEME.border }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium" style={{ color: THEME.text }}>Sprint 2</div>
                <div className="text-xs" style={{ color: THEME.muted }}>6 active tasks</div>
              </div>
              <div className="rounded-2xl p-2" style={{ background: THEME.accentSoft }}>
                <ArrowUpRight className="h-4 w-4" style={{ color: THEME.accent }} />
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/70">
              <div className="h-full w-[68%] rounded-full" style={{ background: `linear-gradient(90deg, ${THEME.accent} 0%, #FF7B8A 100%)` }} />
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = page === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setPage(id);
                    setMobileOpen(false);
                  }}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${active ? "shadow-md" : "hover:bg-white/60"}`}
                  style={{
                    background: active ? "white" : "transparent",
                    color: active ? THEME.text : THEME.muted,
                  }}
                >
                  <Icon className={`h-4 w-4 ${active ? "" : "group-hover:opacity-80"}`} style={{ color: active ? THEME.accent : THEME.muted }} />
                  <span className="flex-1 text-left">{label}</span>
                  {active && <ChevronRight className="h-4 w-4" style={{ color: THEME.accent }} />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t p-4" style={{ borderColor: THEME.border }}>
          <div className="rounded-[1.6rem] border p-4 shadow-sm" style={{ background: THEME.card2, borderColor: THEME.border }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: THEME.text }}>
              <Sparkles className="h-4 w-4" style={{ color: THEME.accent }} />
              Palette-inspired design
            </div>
            <p className="mt-2 text-xs leading-5" style={{ color: THEME.muted }}>
              Warm ivory, cream, and coral-red for a fresh website look.
            </p>
          </div>
          <button className="mt-4 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition hover:shadow-sm" style={{ background: "white", color: THEME.text, borderColor: THEME.border }}>
            <LogOut className="h-4 w-4" style={{ color: THEME.accent }} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function Topbar({ page, setMobileOpen }) {
  const titles = {
    dashboard: "Dashboard Overview",
    projects: "Projects",
    tasks: "Tasks",
    calendar: "Calendar",
    team: "Team",
    reports: "Reports",
    settings: "Settings",
  };

  return (
    <header className="sticky top-0 z-20 border-b" style={{ borderColor: THEME.border, background: "rgba(255,250,243,0.78)", backdropFilter: "blur(24px)" }}>
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <button onClick={() => setMobileOpen(true)} className="rounded-2xl border p-2.5 lg:hidden" style={{ background: "white", borderColor: THEME.border }}>
          <Menu className="h-5 w-5" style={{ color: THEME.text }} />
        </button>

        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs" style={{ background: THEME.accentSoft, color: THEME.accent }}>
            <Star className="h-3.5 w-3.5" />
            Internship project demo
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: THEME.text }}>{titles[page]}</h1>
          <p className="mt-1 text-sm" style={{ color: THEME.muted }}>Create projects, assign tasks, set deadlines, and track progress in a warm elegant workspace.</p>
        </div>

        <div className="hidden max-w-lg flex-1 items-center rounded-2xl border px-4 py-3 md:flex" style={{ background: "white", borderColor: THEME.border }}>
          <Search className="mr-3 h-4 w-4" style={{ color: THEME.muted }} />
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Search tasks, projects, members..." />
        </div>

        <button className="rounded-2xl border p-3 transition hover:shadow-sm" style={{ background: "white", borderColor: THEME.border }}>
          <Bell className="h-4 w-4" style={{ color: THEME.text }} />
        </button>
      </div>
    </header>
  );
}

function SectionCard({ title, subtitle, children, action }) {
  return (
    <section className="rounded-[2rem] border p-5 shadow-[0_20px_60px_rgba(45,31,26,0.08)] sm:p-6" style={{ background: "rgba(255,255,255,0.62)", borderColor: THEME.border, backdropFilter: "blur(18px)" }}>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl" style={{ color: THEME.text }}>{title}</h2>
          {subtitle && <p className="mt-1 text-sm" style={{ color: THEME.muted }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function DashboardPage({ stats, projects, tasks, setPage }) {
  return (
    <div className="mt-6 grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, idx) => (
          <div key={s.label} className="group relative overflow-hidden rounded-[1.8rem] border p-5 shadow-[0_16px_40px_rgba(45,31,26,0.06)]" style={{ background: idx === 0 ? THEME.card : idx === 1 ? THEME.card2 : "rgba(255,255,255,0.7)", borderColor: THEME.border }}>
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: idx === 0 ? `linear-gradient(90deg, ${THEME.accent} 0%, #FF7B8A 100%)` : idx === 1 ? "linear-gradient(90deg, #FFB39B 0%, #F62440 100%)" : idx === 2 ? "linear-gradient(90deg, #FBE0B2 0%, #F62440 100%)" : "linear-gradient(90deg, #FFC4CC 0%, #F62440 100%)" }} />
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm" style={{ color: THEME.muted }}>{s.label}</div>
                <div className="mt-2 text-3xl font-semibold tracking-tight" style={{ color: THEME.text }}>{s.value}</div>
                <div className="mt-2 text-xs" style={{ color: THEME.muted }}>{s.hint}</div>
              </div>
              <div className="rounded-2xl border p-3 shadow-sm" style={{ background: "white", borderColor: THEME.border }}>
                <s.icon className="h-5 w-5" style={{ color: THEME.accent }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr_0.8fr]">
        <SectionCard title="Work Overview" subtitle="A visual snapshot of your projects and deadlines." action={<button onClick={() => setPage("reports")} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition" style={{ background: THEME.accentSoft, color: THEME.accent }}><SlidersHorizontal className="h-4 w-4" /> Reports</button>}>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="rounded-[1.5rem] border p-4 transition hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,0.75)", borderColor: THEME.border }}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold" style={{ color: THEME.text }}>{project.name}</h3>
                      <span className="rounded-full border px-2 py-1 text-[11px]" style={{ background: THEME.accentSoft, color: THEME.accent, borderColor: "rgba(246,36,64,0.12)" }}>{project.status}</span>
                    </div>
                    <div className="mt-1 text-xs" style={{ color: THEME.muted }}>Owner: {project.owner} • Due {project.due}</div>
                  </div>
                  <div className="rounded-2xl border px-3 py-2 text-right" style={{ background: "white", borderColor: THEME.border }}>
                    <div className="text-xs" style={{ color: THEME.muted }}>Progress</div>
                    <div className="text-sm font-semibold" style={{ color: THEME.accent }}>{project.progress}%</div>
                  </div>
                </div>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-black/5">
                  <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: project.tone }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Today’s Focus" subtitle="Tasks that deserve attention first.">
          <div className="space-y-3">
            {tasks.slice(0, 4).map((task) => (
              <div key={task.id} className="rounded-[1.4rem] border p-4" style={{ background: "rgba(255,255,255,0.75)", borderColor: THEME.border }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium leading-6" style={{ color: THEME.text }}>{task.title}</div>
                    <div className="mt-1 text-xs" style={{ color: THEME.muted }}>{task.project} • {task.assignee}</div>
                  </div>
                  <div className="text-right text-xs" style={{ color: THEME.muted }}>
                    <div className="rounded-full px-2 py-1" style={{ background: THEME.accentSoft, color: THEME.accent }}>{task.priority}</div>
                    <div className="mt-2">{task.due}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Activity Pulse" subtitle="Recent team movement at a glance.">
          <div className="space-y-4">
            {[
              { icon: TrendingUp, text: "Project progress increased this week." },
              { icon: CheckCircle2, text: "Two tasks were completed today." },
              { icon: Activity, text: "Task reviews are in progress." },
              { icon: Sparkles, text: "Deadline reminders are set." },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 rounded-[1.3rem] border p-4" style={{ background: idx % 2 ? THEME.card : "rgba(255,255,255,0.75)", borderColor: THEME.border }}>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl" style={{ background: THEME.accentSoft }}>
                  <item.icon className="h-4 w-4" style={{ color: THEME.accent }} />
                </div>
                <div className="text-sm" style={{ color: THEME.text }}>{item.text}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function ProjectsPage({ projects, projectForm, setProjectForm, addProject }) {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <SectionCard title="Projects" subtitle="Create, review, and monitor your active workspaces." action={<button onClick={addProject} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${THEME.accent} 0%, #FF7B8A 100%)` }}><Plus className="h-4 w-4" /> Add project</button>}>
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="group relative overflow-hidden rounded-[1.7rem] border p-5 transition hover:-translate-y-1" style={{ background: "rgba(255,255,255,0.78)", borderColor: THEME.border }}>
              <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: project.tone }} />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-tight" style={{ color: THEME.text }}>{project.name}</h3>
                    <span className="rounded-full border px-2 py-1 text-[11px]" style={{ background: THEME.accentSoft, color: THEME.accent, borderColor: "rgba(246,36,64,0.12)" }}>{project.status}</span>
                  </div>
                  <p className="mt-2 text-sm" style={{ color: THEME.muted }}>Owner: {project.owner}</p>
                </div>
                <div className="rounded-2xl border px-3 py-2 text-right" style={{ background: THEME.card2, borderColor: THEME.border }}>
                  <div className="text-xs" style={{ color: THEME.muted }}>Due</div>
                  <div className="text-sm font-medium" style={{ color: THEME.text }}>{project.due}</div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                <MetricBox value={project.tasks} label="Tasks" />
                <MetricBox value={project.done} label="Done" />
                <MetricBox value={`${project.progress}%`} label="Progress" />
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/5">
                <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: project.tone }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Create New Project" subtitle="A clean form for quick demo input.">
        <FormField label="Project name" value={projectForm.name} onChange={(v) => setProjectForm((p) => ({ ...p, name: v }))} placeholder="e.g. Client Dashboard" />
        <FormField label="Owner" value={projectForm.owner} onChange={(v) => setProjectForm((p) => ({ ...p, owner: v }))} placeholder="e.g. Aelish" />
        <FormField label="Deadline" value={projectForm.due} onChange={(v) => setProjectForm((p) => ({ ...p, due: v }))} placeholder="2026-07-01" />
        <FormField label="Progress %" value={projectForm.progress} onChange={(v) => setProjectForm((p) => ({ ...p, progress: v }))} placeholder="0 - 100" />
        <button onClick={addProject} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[1.2rem] px-4 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01]" style={{ background: `linear-gradient(135deg, ${THEME.accent} 0%, #FF7B8A 100%)` }}>
          <CirclePlus className="h-4 w-4" /> Create project
        </button>
      </SectionCard>
    </div>
  );
}

function TasksPage({ tasks, taskForm, setTaskForm, addTask, projects }) {
  const columns = ["Todo", "In Progress", "Review", "Done"];
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <SectionCard title="Create Task" subtitle="Assign work, deadlines, and priority in one flow.">
        <FormField label="Task title" value={taskForm.title} onChange={(v) => setTaskForm((t) => ({ ...t, title: v }))} placeholder="Design login page" />
        <FormField label="Project" value={taskForm.project} onChange={(v) => setTaskForm((t) => ({ ...t, project: v }))} placeholder={projects[0]?.name || "Select a project"} />
        <FormField label="Assignee" value={taskForm.assignee} onChange={(v) => setTaskForm((t) => ({ ...t, assignee: v }))} placeholder="Team member name" />
        <FormField label="Due date" value={taskForm.due} onChange={(v) => setTaskForm((t) => ({ ...t, due: v }))} placeholder="2026-06-30" />
        <div className="mt-3">
          <label className="mb-2 block text-sm" style={{ color: THEME.muted }}>Priority</label>
          <select value={taskForm.priority} onChange={(e) => setTaskForm((t) => ({ ...t, priority: e.target.value }))} className="w-full rounded-[1.2rem] border px-4 py-3 outline-none" style={{ background: "white", borderColor: THEME.border, color: THEME.text }}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <button onClick={addTask} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[1.2rem] px-4 py-3 font-semibold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${THEME.accent} 0%, #FF7B8A 100%)` }}>
          <CirclePlus className="h-4 w-4" /> Add task
        </button>
      </SectionCard>

      <SectionCard title="Kanban Board" subtitle="The task pipeline looks polished and easy to scan.">
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {columns.map((col, idx) => (
            <div key={col} className="rounded-[1.6rem] border p-4" style={{ background: idx % 2 ? THEME.card : "rgba(255,255,255,0.75)", borderColor: THEME.border }}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: [THEME.muted, THEME.accent, "#D77D6B", "#4A8F77"][idx] }} />
                  <h3 className="font-semibold" style={{ color: THEME.text }}>{col}</h3>
                </div>
                <span className="rounded-full bg-white px-2 py-1 text-xs" style={{ color: THEME.muted }}>{tasks.filter((t) => t.status === col).length}</span>
              </div>
              <div className="space-y-3">
                {tasks.filter((t) => t.status === col).map((task) => (
                  <div key={task.id} className="rounded-[1.35rem] border p-4" style={{ background: "white", borderColor: THEME.border }}>
                    <div className="text-sm font-medium leading-6" style={{ color: THEME.text }}>{task.title}</div>
                    <div className="mt-2 text-xs" style={{ color: THEME.muted }}>{task.project}</div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="rounded-full px-2 py-1" style={{ background: THEME.accentSoft, color: THEME.accent }}>{task.assignee}</span>
                      <span style={{ color: THEME.muted }}>{task.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function CalendarPage({ tasks }) {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <SectionCard title="Deadlines" subtitle="A crisp timeline for upcoming work.">
        <div className="space-y-4">
          {tasks.map((task, idx) => (
            <div key={task.id} className="flex items-start gap-4 rounded-[1.4rem] border p-4" style={{ background: idx % 2 ? THEME.card : "rgba(255,255,255,0.75)", borderColor: THEME.border }}>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-sm font-semibold" style={{ background: THEME.accentSoft, color: THEME.accent }}>{idx + 1}</div>
              <div className="flex-1">
                <div className="font-medium" style={{ color: THEME.text }}>{task.title}</div>
                <div className="text-xs" style={{ color: THEME.muted }}>{task.project} • {task.assignee}</div>
              </div>
              <div className="text-sm" style={{ color: THEME.muted }}>{task.due}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Monthly Snapshot" subtitle="A beautiful calendar-style layout for demos.">
        <div className="grid grid-cols-7 gap-2 text-center text-xs" style={{ color: THEME.muted }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i + 1;
            const active = [3, 8, 11, 17, 21, 26, 30].includes(day);
            return (
              <div key={i} className={`aspect-square rounded-[1rem] border grid place-items-center text-sm ${active ? "shadow-sm" : ""}`} style={{ background: active ? THEME.accentSoft : "white", color: active ? THEME.accent : THEME.text, borderColor: THEME.border }}>
                {day <= 31 ? day : ""}
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-xs" style={{ color: THEME.muted }}>
          <span className="rounded-full border px-3 py-2" style={{ background: "white", borderColor: THEME.border }}>Project review</span>
          <span className="rounded-full border px-3 py-2" style={{ background: "white", borderColor: THEME.border }}>Deadline reminders</span>
          <span className="rounded-full border px-3 py-2" style={{ background: "white", borderColor: THEME.border }}>Team check-in</span>
        </div>
      </SectionCard>
    </div>
  );
}

function TeamPage() {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <SectionCard title="Team Members" subtitle="Stylish people cards with strong hierarchy.">
        <div className="grid gap-4 md:grid-cols-2">
          {teamSeed.map((member) => (
            <div key={member.name} className="rounded-[1.6rem] border p-5 shadow-sm" style={{ background: "rgba(255,255,255,0.78)", borderColor: THEME.border }}>
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl font-semibold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${THEME.accent} 0%, #FF7B8A 100%)` }}>
                  {member.initials}
                </div>
                <div>
                  <div className="text-lg font-semibold" style={{ color: THEME.text }}>{member.name}</div>
                  <div className="text-sm" style={{ color: THEME.muted }}>{member.role}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs" style={{ color: THEME.muted }}><span>Workload</span><span>{member.load}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-black/5">
                  <div className="h-full rounded-full" style={{ width: `${member.load}%`, background: `linear-gradient(90deg, ${THEME.accent} 0%, #FF7B8A 100%)` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Collaboration Notes" subtitle="Future Node.js integration placeholders.">
        <div className="space-y-4 text-sm" style={{ color: THEME.muted }}>
          <InfoRow icon={Users} title="Member roles" text="Frontend, backend, design, QA, and admin access." />
          <InfoRow icon={Clock3} title="Daily standup" text="Track availability and meeting notes from one place." />
          <InfoRow icon={CheckCircle2} title="Task ownership" text="Each task can be assigned clearly and tracked easily." />
        </div>
      </SectionCard>
    </div>
  );
}

function ReportsPage({ projects, tasks }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Done").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const review = tasks.filter((t) => t.status === "Review").length;

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
      <SectionCard title="Reports Summary" subtitle="Analytics presented in a clean and modern format.">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Total tasks", value: total },
            { label: "Completed", value: done },
            { label: "In progress", value: inProgress },
            { label: "In review", value: review },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.35rem] border p-5" style={{ background: "rgba(255,255,255,0.78)", borderColor: THEME.border }}>
              <div className="text-sm" style={{ color: THEME.muted }}>{item.label}</div>
              <div className="mt-2 text-3xl font-semibold" style={{ color: THEME.text }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.7rem] border p-5" style={{ background: THEME.card, borderColor: THEME.border }}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="font-semibold" style={{ color: THEME.text }}>Task Distribution</div>
              <div className="text-xs" style={{ color: THEME.muted }}>A readable summary chart for weekly review.</div>
            </div>
            <FileBarChart2 className="h-5 w-5" style={{ color: THEME.accent }} />
          </div>
          <div className="space-y-3">
            {[["Completed", 48], ["In Progress", 27], ["Review", 15], ["Todo", 10]].map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-xs" style={{ color: THEME.muted }}><span>{label}</span><span>{value}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-black/5"><div className="h-full rounded-full" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${THEME.accent} 0%, #FF7B8A 100%)` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Project Health" subtitle="Attractive progress cards for your presentation.">
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="rounded-[1.45rem] border p-5" style={{ background: "rgba(255,255,255,0.78)", borderColor: THEME.border }}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold" style={{ color: THEME.text }}>{project.name}</div>
                  <div className="text-xs" style={{ color: THEME.muted }}>Owner {project.owner} • {project.status}</div>
                </div>
                <div className="text-sm" style={{ color: THEME.accent }}>{project.progress}%</div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/5">
                <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: project.tone }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <SectionCard title="Appearance" subtitle="Fine-tune the interface for a warm premium dashboard look.">
        <div className="space-y-4">
          <SettingRow title="Glass cards" desc="Light, airy panels with soft shadows and cream surfaces." />
          <SettingRow title="Coral accent" desc="A bold red accent inspired by the palette screenshot." />
          <SettingRow title="Responsive layout" desc="Sidebar, cards, and content adapt beautifully on mobile." />
        </div>
      </SectionCard>

      <SectionCard title="Deployment Notes" subtitle="Suggested hosting for internship delivery.">
        <div className="space-y-4 text-sm" style={{ color: THEME.muted }}>
          <InfoRow icon={Grid2X2} title="Frontend hosting" text="Netlify or GitHub Pages for the React UI." />
          <InfoRow icon={Layers3} title="Backend hosting" text="Render for Node.js API and database integration." />
          <InfoRow icon={Sparkles} title="Original code" text="Keep the structure clean, maintainable, and unique." />
        </div>
      </SectionCard>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder }) {
  return (
    <div className="mt-3">
      <label className="mb-2 block text-sm" style={{ color: THEME.muted }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[1.15rem] border px-4 py-3.5 outline-none placeholder:text-slate-400"
        style={{ background: "white", borderColor: THEME.border, color: THEME.text }}
      />
    </div>
  );
}

function MetricBox({ value, label }) {
  return (
    <div className="rounded-[1.2rem] border p-3" style={{ background: "white", borderColor: THEME.border }}>
      <div className="text-lg font-semibold" style={{ color: THEME.text }}>{value}</div>
      <div className="text-xs" style={{ color: THEME.muted }}>{label}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-4 rounded-[1.35rem] border p-4" style={{ background: "rgba(255,255,255,0.78)", borderColor: THEME.border }}>
      <div className="rounded-2xl border p-3" style={{ background: THEME.accentSoft, borderColor: "rgba(246,36,64,0.10)" }}>
        <Icon className="h-4 w-4" style={{ color: THEME.accent }} />
      </div>
      <div>
        <div className="font-medium" style={{ color: THEME.text }}>{title}</div>
        <div className="mt-1 text-sm" style={{ color: THEME.muted }}>{text}</div>
      </div>
    </div>
  );
}

function SettingRow({ title, desc }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.35rem] border p-4" style={{ background: "rgba(255,255,255,0.78)", borderColor: THEME.border }}>
      <div>
        <div className="font-medium" style={{ color: THEME.text }}>{title}</div>
        <div className="mt-1 text-sm" style={{ color: THEME.muted }}>{desc}</div>
      </div>
      <div className="h-6 w-11 rounded-full p-1" style={{ background: THEME.accentSoft }}>
        <div className="ml-auto h-4 w-4 rounded-full" style={{ background: THEME.accent }} />
      </div>
    </div>
  );
}

export default App;
