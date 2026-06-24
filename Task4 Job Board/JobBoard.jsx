import { useState, useEffect, useRef } from "react";

const COLORS = {
  navy: "#0B1628",
  navyMid: "#162236",
  navyLight: "#1E3050",
  teal: "#00C9A7",
  tealDark: "#00A589",
  amber: "#F5A623",
  amberLight: "#FDE9C0",
  slate: "#8899AA",
  slateLight: "#C8D6E5",
  bg: "#F4F7FB",
  white: "#FFFFFF",
  danger: "#E05252",
  success: "#2ECC71",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');`;

const JOBS = [
  { id: 1, title: "Senior Frontend Developer", company: "NovaTech Labs", logo: "NT", logoColor: "#4F46E5", location: "Bangalore, India", type: "Full-time", salary: "₹18–28 LPA", tags: ["React", "TypeScript", "GraphQL"], posted: "2d ago", featured: true, category: "Engineering", desc: "We're looking for a seasoned Frontend Developer to lead our product UI initiatives. You'll work closely with design and backend teams to build scalable, beautiful interfaces used by millions.", requirements: ["5+ years React experience", "TypeScript proficiency", "GraphQL/REST API integration", "Strong UI/UX sensibility"], remote: "Hybrid" },
  { id: 2, title: "Product Designer", company: "Pixel Studio", logo: "PS", logoColor: "#E91E8C", location: "Mumbai, India", type: "Full-time", salary: "₹12–20 LPA", tags: ["Figma", "Design Systems", "Prototyping"], posted: "1d ago", featured: true, category: "Design", desc: "Join our design team to craft world-class digital experiences. You'll own end-to-end design for key product areas, from user research to final pixel-perfect specs.", requirements: ["4+ years product design", "Proficiency in Figma", "Portfolio showcasing mobile/web", "System design experience"], remote: "Remote" },
  { id: 3, title: "Backend Engineer – Node.js", company: "CloudPeak", logo: "CP", logoColor: "#0097A7", location: "Hyderabad, India", type: "Full-time", salary: "₹15–25 LPA", tags: ["Node.js", "MongoDB", "AWS"], posted: "3d ago", featured: false, category: "Engineering", desc: "Build and scale the APIs that power CloudPeak's infrastructure serving 500k+ daily active users.", requirements: ["3+ years Node.js", "MongoDB or PostgreSQL", "AWS services knowledge", "REST & WebSocket APIs"], remote: "On-site" },
  { id: 4, title: "Data Scientist", company: "Analytica", logo: "AN", logoColor: "#FF6D00", location: "Pune, India", type: "Full-time", salary: "₹14–22 LPA", tags: ["Python", "ML", "TensorFlow"], posted: "5d ago", featured: false, category: "Data", desc: "Turn raw data into actionable insights. You'll develop ML models, build dashboards, and work with cross-functional teams to drive data-informed decisions.", requirements: ["Python, Pandas, NumPy", "ML model deployment", "SQL proficiency", "Communication skills"], remote: "Hybrid" },
  { id: 5, title: "DevOps Engineer", company: "Infra360", logo: "I3", logoColor: "#00897B", location: "Chennai, India", type: "Contract", salary: "₹10–18 LPA", tags: ["Docker", "Kubernetes", "CI/CD"], posted: "1w ago", featured: false, category: "Engineering", desc: "Design, implement, and manage our cloud infrastructure. You'll automate deployments, monitor systems, and ensure 99.9% uptime.", requirements: ["Kubernetes & Docker", "Jenkins or GitHub Actions", "Linux systems administration", "Security practices"], remote: "Remote" },
  { id: 6, title: "Marketing Manager", company: "BrandLift", logo: "BL", logoColor: "#8E24AA", location: "Delhi, India", type: "Full-time", salary: "₹10–16 LPA", tags: ["SEO", "Content", "Analytics"], posted: "3d ago", featured: false, category: "Marketing", desc: "Own our go-to-market strategy and build campaigns that drive brand awareness and user acquisition.", requirements: ["5+ years digital marketing", "SEO/SEM expertise", "Content strategy", "Google Analytics"], remote: "On-site" },
  { id: 7, title: "iOS Developer", company: "AppCraft", logo: "AC", logoColor: "#D32F2F", location: "Bengaluru, India", type: "Full-time", salary: "₹16–26 LPA", tags: ["Swift", "SwiftUI", "CoreData"], posted: "4d ago", featured: true, category: "Engineering", desc: "Build beautiful native iOS experiences used by 1M+ users. You'll own features from ideation through App Store launch.", requirements: ["3+ years Swift", "SwiftUI or UIKit", "App Store publishing", "MVVM architecture"], remote: "Hybrid" },
  { id: 8, title: "UX Researcher", company: "Insights Co", logo: "IC", logoColor: "#F57F17", location: "Remote", type: "Part-time", salary: "₹8–12 LPA", tags: ["User Research", "Usability", "Surveys"], posted: "6d ago", featured: false, category: "Design", desc: "Conduct qualitative and quantitative research to understand user needs and inform product decisions.", requirements: ["User interviews & surveys", "Usability testing", "Research synthesis", "Figma for reporting"], remote: "Remote" },
];

const EMPLOYER_JOBS = [
  { id: 1, title: "Senior Frontend Developer", applicants: 24, status: "Active", posted: "Jan 15, 2025", views: 1240 },
  { id: 2, title: "Product Designer", applicants: 18, status: "Active", posted: "Jan 10, 2025", views: 890 },
  { id: 3, title: "iOS Developer", applicants: 7, status: "Closed", posted: "Dec 20, 2024", views: 560 },
];

const APPLICATIONS = [
  { id: 1, job: "Senior Frontend Developer", company: "NovaTech Labs", status: "Interview Scheduled", date: "Jan 20, 2025", logo: "NT", logoColor: "#4F46E5" },
  { id: 2, job: "Product Designer", company: "Pixel Studio", status: "Under Review", date: "Jan 18, 2025", logo: "PS", logoColor: "#E91E8C" },
  { id: 3, job: "iOS Developer", company: "AppCraft", status: "Applied", date: "Jan 15, 2025", logo: "AC", logoColor: "#D32F2F" },
];

// ─── Inline Styles ───────────────────────────────────────────────────────────

const css = `
${FONTS}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: ${COLORS.bg}; color: #1a2940; }
h1,h2,h3,h4,h5 { font-family: 'Syne', sans-serif; }

.app { min-height: 100vh; }

/* NAV */
.nav { background: ${COLORS.navy}; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; }
.nav-logo { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: ${COLORS.white}; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.nav-logo span { color: ${COLORS.teal}; }
.nav-links { display: flex; gap: 8px; align-items: center; }
.nav-btn { background: none; border: none; color: ${COLORS.slateLight}; font-size: 14px; font-family: 'Inter', sans-serif; cursor: pointer; padding: 8px 14px; border-radius: 8px; transition: all 0.2s; }
.nav-btn:hover { color: ${COLORS.white}; background: rgba(255,255,255,0.08); }
.nav-btn.active { color: ${COLORS.teal}; }
.nav-cta { background: ${COLORS.teal}; color: ${COLORS.navy}; font-weight: 600; border: none; border-radius: 8px; padding: 9px 18px; font-size: 14px; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.2s; }
.nav-cta:hover { background: ${COLORS.tealDark}; transform: translateY(-1px); }

/* HERO */
.hero { background: ${COLORS.navy}; padding: 80px 40px 100px; text-align: center; position: relative; overflow: hidden; }
.hero::before { content: ''; position: absolute; top: -100px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(0,201,167,0.08) 0%, transparent 70%); pointer-events: none; }
.hero::after { content: ''; position: absolute; bottom: -80px; left: -80px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%); pointer-events: none; }
.hero-tag { display: inline-block; background: rgba(0,201,167,0.12); color: ${COLORS.teal}; font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; margin-bottom: 20px; border: 1px solid rgba(0,201,167,0.2); }
.hero h1 { font-size: clamp(36px, 5vw, 62px); font-weight: 800; color: ${COLORS.white}; line-height: 1.15; margin-bottom: 18px; }
.hero h1 em { color: ${COLORS.teal}; font-style: normal; }
.hero p { color: ${COLORS.slateLight}; font-size: 18px; max-width: 540px; margin: 0 auto 36px; line-height: 1.7; }

/* SEARCH BOX */
.search-box { background: ${COLORS.white}; border-radius: 16px; padding: 8px 8px 8px 20px; display: flex; align-items: center; gap: 8px; max-width: 700px; margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.25); }
.search-box input { flex: 1; border: none; outline: none; font-size: 15px; font-family: 'Inter', sans-serif; color: #1a2940; background: transparent; }
.search-box select { border: none; outline: none; font-size: 14px; font-family: 'Inter', sans-serif; color: #6b7c93; background: transparent; padding: 0 8px; border-left: 1px solid #e8edf5; cursor: pointer; }
.search-btn { background: ${COLORS.teal}; color: ${COLORS.navy}; font-weight: 700; font-family: 'Inter', sans-serif; font-size: 15px; border: none; border-radius: 12px; padding: 12px 28px; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
.search-btn:hover { background: ${COLORS.tealDark}; }
.hero-stats { display: flex; gap: 40px; justify-content: center; margin-top: 32px; }
.hero-stat { text-align: center; }
.hero-stat strong { display: block; font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: ${COLORS.white}; }
.hero-stat span { font-size: 13px; color: ${COLORS.slate}; }

/* SECTIONS */
.section { padding: 64px 40px; max-width: 1200px; margin: 0 auto; }
.section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 32px; }
.section-title { font-size: 28px; font-weight: 700; color: #0B1628; }
.section-link { font-size: 14px; color: ${COLORS.teal}; cursor: pointer; font-weight: 500; text-decoration: none; }
.section-link:hover { color: ${COLORS.tealDark}; }

/* JOB CARDS */
.jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
.job-card { background: ${COLORS.white}; border-radius: 16px; padding: 24px; border: 1px solid #e8edf5; cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden; }
.job-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: ${COLORS.teal}; transform: scaleY(0); transition: transform 0.25s; border-radius: 0; }
.job-card:hover { border-color: ${COLORS.teal}; transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,201,167,0.1); }
.job-card:hover::before { transform: scaleY(1); }
.job-card.featured { border-color: #e0f5f0; }
.card-top { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
.company-logo { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: white; flex-shrink: 0; }
.card-meta { flex: 1; }
.card-meta h3 { font-size: 16px; font-weight: 600; color: #0B1628; margin-bottom: 3px; line-height: 1.3; }
.card-meta p { font-size: 13px; color: #6b7c93; }
.featured-badge { background: ${COLORS.amberLight}; color: #b36800; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px; }
.card-info { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.info-chip { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #6b7c93; background: #f4f7fb; padding: 4px 10px; border-radius: 20px; }
.card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.tag { font-size: 12px; background: #eef2ff; color: #4f5fb3; padding: 4px 10px; border-radius: 6px; font-weight: 500; }
.card-footer { display: flex; align-items: center; justify-content: space-between; }
.salary { font-size: 15px; font-weight: 700; color: #0B1628; font-family: 'Syne', sans-serif; }
.card-time { font-size: 12px; color: #aab8c8; }

/* CATEGORIES */
.categories-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.cat-card { background: ${COLORS.white}; border: 1px solid #e8edf5; border-radius: 14px; padding: 20px 16px; text-align: center; cursor: pointer; transition: all 0.2s; }
.cat-card:hover { border-color: ${COLORS.teal}; background: #f0fdf8; transform: translateY(-2px); }
.cat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 20px; }
.cat-card h4 { font-size: 14px; font-weight: 600; color: #0B1628; margin-bottom: 4px; }
.cat-card span { font-size: 12px; color: #8899aa; }

/* FILTERS BAR */
.filters-bar { background: ${COLORS.white}; border-bottom: 1px solid #e8edf5; padding: 16px 40px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.filter-chip { background: none; border: 1px solid #e8edf5; border-radius: 20px; padding: 7px 16px; font-size: 13px; font-family: 'Inter', sans-serif; cursor: pointer; color: #6b7c93; transition: all 0.2s; }
.filter-chip:hover, .filter-chip.active { background: ${COLORS.teal}; color: ${COLORS.navy}; border-color: ${COLORS.teal}; font-weight: 600; }

/* PAGE LAYOUT */
.page-hero { background: ${COLORS.navy}; padding: 40px 40px 0; color: white; }
.page-hero h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
.page-hero p { color: ${COLORS.slateLight}; font-size: 15px; margin-bottom: 32px; }
.page-tabs { display: flex; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
.page-tab { background: none; border: none; color: rgba(255,255,255,0.5); font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; padding: 12px 20px; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; }
.page-tab.active { color: ${COLORS.teal}; border-bottom-color: ${COLORS.teal}; }

/* DASHBOARD CARD */
.dash-card { background: ${COLORS.white}; border: 1px solid #e8edf5; border-radius: 16px; padding: 24px; }
.dash-metric { }
.dash-metric strong { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; color: #0B1628; display: block; }
.dash-metric span { font-size: 13px; color: #8899aa; }
.metrics-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; font-size: 12px; font-weight: 600; color: #8899aa; text-transform: uppercase; letter-spacing: 0.8px; padding: 0 0 12px; border-bottom: 1px solid #e8edf5; }
.table td { padding: 14px 0; border-bottom: 1px solid #f0f4f8; font-size: 14px; color: #1a2940; vertical-align: middle; }
.status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.status-active { background: #d1fae5; color: #065f46; }
.status-closed { background: #fee2e2; color: #991b1b; }
.status-review { background: #fef3c7; color: #92400e; }
.status-interview { background: #dbeafe; color: #1e40af; }
.status-applied { background: #f3f4f6; color: #374151; }

/* FORMS */
.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 13px; font-weight: 600; color: #4a5568; margin-bottom: 6px; }
.form-input { width: 100%; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 11px 14px; font-size: 14px; font-family: 'Inter', sans-serif; color: #1a2940; outline: none; transition: border 0.2s; background: ${COLORS.white}; }
.form-input:focus { border-color: ${COLORS.teal}; box-shadow: 0 0 0 3px rgba(0,201,167,0.1); }
.form-input::placeholder { color: #a0aec0; }
textarea.form-input { min-height: 100px; resize: vertical; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.btn { border: none; border-radius: 10px; padding: 12px 24px; font-size: 14px; font-weight: 600; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.2s; }
.btn-primary { background: ${COLORS.teal}; color: ${COLORS.navy}; }
.btn-primary:hover { background: ${COLORS.tealDark}; transform: translateY(-1px); }
.btn-outline { background: none; border: 1.5px solid #e2e8f0; color: #4a5568; }
.btn-outline:hover { border-color: ${COLORS.teal}; color: ${COLORS.teal}; }
.btn-danger { background: ${COLORS.danger}; color: white; }

/* JOB DETAIL */
.detail-hero { background: ${COLORS.navy}; padding: 48px 40px; color: white; }
.detail-top { display: flex; align-items: flex-start; gap: 20px; max-width: 900px; margin: 0 auto; }
.detail-logo { width: 72px; height: 72px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; color: white; flex-shrink: 0; }
.detail-info h1 { font-size: 28px; font-weight: 800; margin-bottom: 6px; }
.detail-info p { color: ${COLORS.slateLight}; font-size: 16px; margin-bottom: 16px; }
.detail-chips { display: flex; flex-wrap: wrap; gap: 10px; }
.detail-chip { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 6px 14px; font-size: 13px; color: ${COLORS.slateLight}; }
.detail-body { max-width: 900px; margin: 40px auto; padding: 0 40px; display: grid; grid-template-columns: 1fr 320px; gap: 32px; }
.detail-section h2 { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #0B1628; }
.detail-section p { font-size: 15px; line-height: 1.8; color: #4a5568; margin-bottom: 20px; }
.detail-section ul { list-style: none; }
.detail-section ul li { padding: 8px 0; padding-left: 20px; position: relative; font-size: 15px; color: #4a5568; line-height: 1.6; }
.detail-section ul li::before { content: '→'; position: absolute; left: 0; color: ${COLORS.teal}; font-weight: 700; }
.detail-sidebar { }
.apply-card { background: ${COLORS.white}; border: 1px solid #e8edf5; border-radius: 16px; padding: 24px; position: sticky; top: 80px; }
.apply-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 16px; color: #0B1628; }
.apply-meta { margin-bottom: 20px; }
.meta-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f4f8; font-size: 14px; }
.meta-row span:first-child { color: #8899aa; }
.meta-row span:last-child { font-weight: 600; color: #1a2940; }

/* UPLOAD */
.upload-area { border: 2px dashed #e2e8f0; border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; }
.upload-area:hover { border-color: ${COLORS.teal}; background: #f0fdf8; }
.upload-icon { font-size: 32px; margin-bottom: 8px; }
.upload-area p { font-size: 14px; color: #6b7c93; }
.upload-area strong { color: ${COLORS.teal}; }

/* TOAST */
.toast { position: fixed; bottom: 32px; right: 32px; background: #0B1628; color: white; border-radius: 12px; padding: 14px 20px; font-size: 14px; display: flex; align-items: center; gap: 10px; box-shadow: 0 12px 40px rgba(0,0,0,0.3); z-index: 1000; animation: slideUp 0.3s ease; }
.toast-icon { color: ${COLORS.teal}; font-size: 20px; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* PROFILE */
.avatar-big { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark}); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px; color: white; }
.skill-tag { display: inline-block; background: #eef2ff; color: #4f5fb3; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 6px; margin: 4px; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: white; border-radius: 20px; padding: 32px; max-width: 580px; width: 100%; max-height: 90vh; overflow-y: auto; }
.modal h2 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
.modal-sub { font-size: 14px; color: #6b7c93; margin-bottom: 24px; }
.modal-close { float: right; background: none; border: none; font-size: 22px; cursor: pointer; color: #8899aa; margin-top: -4px; }

/* EMPTY / LOADING */
.empty-state { text-align: center; padding: 60px 20px; color: #8899aa; }
.empty-state h3 { font-size: 18px; color: #4a5568; margin-bottom: 8px; }

/* FOOTER */
.footer { background: ${COLORS.navy}; color: ${COLORS.slate}; padding: 48px 40px 24px; margin-top: 80px; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
.footer-brand h3 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: white; margin-bottom: 10px; }
.footer-brand h3 span { color: ${COLORS.teal}; }
.footer-brand p { font-size: 14px; line-height: 1.7; max-width: 260px; }
.footer-col h4 { font-size: 13px; font-weight: 600; color: white; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.8px; }
.footer-col a { display: block; font-size: 14px; color: ${COLORS.slate}; cursor: pointer; margin-bottom: 8px; transition: color 0.2s; }
.footer-col a:hover { color: ${COLORS.teal}; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
.footer-bottom a { color: ${COLORS.slate}; cursor: pointer; margin-left: 20px; }
.footer-bottom a:hover { color: ${COLORS.teal}; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .nav { padding: 0 16px; }
  .hero { padding: 48px 16px 64px; }
  .section { padding: 40px 16px; }
  .hero-stats { gap: 24px; flex-wrap: wrap; }
  .form-row { grid-template-columns: 1fr; }
  .detail-body { grid-template-columns: 1fr; padding: 0 16px; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .metrics-row { grid-template-columns: 1fr 1fr; }
  .jobs-grid { grid-template-columns: 1fr; }
  .filters-bar { padding: 12px 16px; }
  .page-hero { padding: 32px 16px 0; }
}
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function CompanyLogo({ abbr, color, size = 48, radius = 12 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: size * 0.29, color: "white", flexShrink: 0 }}>
      {abbr}
    </div>
  );
}

function JobCard({ job, onClick }) {
  return (
    <div className={`job-card ${job.featured ? "featured" : ""}`} onClick={() => onClick(job)}>
      <div className="card-top">
        <CompanyLogo abbr={job.logo} color={job.logoColor} />
        <div className="card-meta">
          <h3>{job.title}</h3>
          <p>{job.company}</p>
        </div>
        {job.featured && <span className="featured-badge">⭐ Featured</span>}
      </div>
      <div className="card-info">
        <span className="info-chip">📍 {job.location}</span>
        <span className="info-chip">🕒 {job.type}</span>
        <span className="info-chip">🏠 {job.remote}</span>
      </div>
      <div className="card-tags">
        {job.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <div className="card-footer">
        <span className="salary">{job.salary}</span>
        <span className="card-time">{job.posted}</span>
      </div>
    </div>
  );
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return <div className="toast"><span className="toast-icon">✓</span>{msg}</div>;
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function HomePage({ navigate, setSelectedJob }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    { name: "Engineering", icon: "💻", count: 320 },
    { name: "Design", icon: "🎨", count: 145 },
    { name: "Marketing", icon: "📣", count: 98 },
    { name: "Data", icon: "📊", count: 212 },
    { name: "Finance", icon: "💼", count: 76 },
    { name: "Product", icon: "🚀", count: 134 },
  ];

  const featured = JOBS.filter(j => j.featured);

  const handleSearch = () => navigate("jobs");

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-tag">🔥 10,000+ New Jobs This Week</div>
        <h1>Find Your <em>Dream Job</em><br />Without the Guesswork</h1>
        <p>Search across thousands of verified opportunities at top companies. Built for the ambitious professional.</p>

        <div className="search-box">
          <span style={{ fontSize: 20, flexShrink: 0 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Job title, skill, or company…" onKeyDown={e => e.key === "Enter" && handleSearch()} />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Locations</option>
            <option>Bangalore</option>
            <option>Mumbai</option>
            <option>Delhi</option>
            <option>Remote</option>
          </select>
          <button className="search-btn" onClick={handleSearch}>Search Jobs</button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat"><strong>84K+</strong><span>Active Jobs</span></div>
          <div className="hero-stat"><strong>12K+</strong><span>Top Companies</span></div>
          <div className="hero-stat"><strong>4.2M+</strong><span>Job Seekers</span></div>
          <div className="hero-stat"><strong>96%</strong><span>Satisfaction Rate</span></div>
        </div>
      </section>

      {/* Categories */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Browse by Category</h2>
          <span className="section-link" onClick={() => navigate("jobs")}>View all →</span>
        </div>
        <div className="categories-row">
          {categories.map(c => (
            <div key={c.name} className="cat-card" onClick={() => navigate("jobs")}>
              <div className="cat-icon" style={{ background: "#f0fdf8" }}>{c.icon}</div>
              <h4>{c.name}</h4>
              <span>{c.count} jobs</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Jobs */}
      <div style={{ background: "#f4f7fb", paddingBottom: 64 }}>
        <div className="section" style={{ paddingBottom: 0 }}>
          <div className="section-header">
            <h2 className="section-title">Featured Opportunities</h2>
            <span className="section-link" onClick={() => navigate("jobs")}>See all jobs →</span>
          </div>
          <div className="jobs-grid">
            {featured.map(j => (
              <JobCard key={j.id} job={j} onClick={job => { setSelectedJob(job); navigate("detail"); }} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ background: COLORS.navy, padding: "64px 40px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800, color: "white", marginBottom: 12 }}>Hiring Great Talent?</h2>
        <p style={{ color: COLORS.slateLight, fontSize: 16, marginBottom: 28 }}>Post your jobs and reach millions of qualified candidates instantly.</p>
        <button className="nav-cta" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => navigate("employer")}>
          Post a Job — Free →
        </button>
      </div>
    </>
  );
}

function JobsPage({ navigate, setSelectedJob }) {
  const [filter, setFilter] = useState("All");
  const [searchQ, setSearchQ] = useState("");
  const types = ["All", "Full-time", "Part-time", "Contract", "Remote"];

  const filtered = JOBS.filter(j => {
    const matchType = filter === "All" || j.type === filter || (filter === "Remote" && j.remote === "Remote");
    const matchSearch = !searchQ || j.title.toLowerCase().includes(searchQ.toLowerCase()) || j.company.toLowerCase().includes(searchQ.toLowerCase()) || j.tags.some(t => t.toLowerCase().includes(searchQ.toLowerCase()));
    return matchType && matchSearch;
  });

  return (
    <>
      <div className="page-hero" style={{ paddingBottom: 24 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1>All Job Listings</h1>
          <p>{JOBS.length} opportunities across top companies in India</p>
        </div>
      </div>
      <div className="filters-bar" style={{ maxWidth: "100%", position: "sticky", top: 64, zIndex: 50 }}>
        <div style={{ position: "relative", marginRight: 8 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input className="form-input" placeholder="Search jobs…" value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ width: 220, paddingLeft: 36, height: 38 }} />
        </div>
        {types.map(t => (
          <button key={t} className={`filter-chip ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>{t}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#8899aa" }}>{filtered.length} results</span>
      </div>
      <div className="section">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>🔍</div>
            <h3>No jobs found</h3>
            <p>Try different keywords or filters.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {filtered.map(j => (
              <JobCard key={j.id} job={j} onClick={job => { setSelectedJob(job); navigate("detail"); }} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function JobDetailPage({ job, navigate, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", cover: "" });
  const [fileUploaded, setFileUploaded] = useState(false);
  const fileRef = useRef();

  const handleApply = () => {
    if (!form.name || !form.email) return;
    setShowModal(false);
    setApplied(true);
    showToast("Application submitted! Check your email for confirmation.");
  };

  if (!job) return <div className="section"><p>No job selected.</p></div>;

  return (
    <>
      <div className="detail-hero">
        <div className="detail-top">
          <CompanyLogo abbr={job.logo} color={job.logoColor} size={72} radius={16} />
          <div className="detail-info">
            <h1>{job.title}</h1>
            <p>{job.company} · {job.location}</p>
            <div className="detail-chips">
              <span className="detail-chip">🕒 {job.type}</span>
              <span className="detail-chip">💰 {job.salary}</span>
              <span className="detail-chip">🏠 {job.remote}</span>
              <span className="detail-chip">📅 Posted {job.posted}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-section">
          <h2>About This Role</h2>
          <p>{job.desc}</p>

          <h2>Requirements</h2>
          <ul>
            {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
          </ul>

          <h2 style={{ marginTop: 28 }}>What You'll Do</h2>
          <ul>
            <li>Lead technical design and implementation of major product features</li>
            <li>Collaborate closely with cross-functional teams across design, product, and backend</li>
            <li>Conduct code reviews and mentor junior team members</li>
            <li>Contribute to engineering best practices and documentation</li>
            <li>Participate in sprint planning, retrospectives, and architecture discussions</li>
          </ul>

          <h2 style={{ marginTop: 28 }}>About {job.company}</h2>
          <p>We're a fast-growing startup on a mission to redefine how technology shapes everyday life. With a culture built on curiosity, ownership, and speed, we're backed by top-tier investors and looking for exceptional people to join our journey.</p>

          <div className="card-tags" style={{ marginTop: 16 }}>
            {job.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="apply-card">
            <h3>Apply for this Role</h3>
            <div className="apply-meta">
              {[["Salary", job.salary], ["Type", job.type], ["Work Mode", job.remote], ["Location", job.location], ["Category", job.category]].map(([k, v]) => (
                <div key={k} className="meta-row"><span>{k}</span><span>{v}</span></div>
              ))}
            </div>
            {applied ? (
              <div style={{ background: "#d1fae5", borderRadius: 10, padding: "12px 16px", color: "#065f46", fontSize: 14, fontWeight: 600 }}>
                ✓ Application Submitted!
              </div>
            ) : (
              <button className="btn btn-primary" style={{ width: "100%", padding: "14px" }} onClick={() => setShowModal(true)}>
                Apply Now →
              </button>
            )}
            <button className="btn btn-outline" style={{ width: "100%", marginTop: 10 }} onClick={() => navigate("jobs")}>← Back to Listings</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Apply for {job.title}</h2>
            <p className="modal-sub">{job.company} · {job.location}</p>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="Rahul Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" placeholder="rahul@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Resume</label>
              <div className="upload-area" onClick={() => fileRef.current?.click()}>
                <div className="upload-icon">{fileUploaded ? "✅" : "📄"}</div>
                <p>{fileUploaded ? <><strong>resume.pdf</strong> — ready to submit</> : <><strong>Click to upload</strong> or drag & drop<br />PDF, DOC, DOCX (max 5MB)</>}</p>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={e => e.target.files?.length && setFileUploaded(true)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cover Letter</label>
              <textarea className="form-input" placeholder="Tell us why you're a great fit for this role…" value={form.cover} onChange={e => setForm({ ...form, cover: e.target.value })} />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleApply} disabled={!form.name || !form.email}>Submit Application →</button>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EmployerDashboard({ showToast }) {
  const [tab, setTab] = useState("overview");
  const [showPostModal, setShowPostModal] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", location: "", type: "Full-time", salary: "", desc: "" });

  const handlePost = () => {
    setShowPostModal(false);
    setNewJob({ title: "", location: "", type: "Full-time", salary: "", desc: "" });
    showToast("Job posted successfully! It will go live within 30 minutes.");
  };

  return (
    <>
      <div className="page-hero">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1>Employer Dashboard</h1>
              <p>Welcome back, NovaTech Labs 👋</p>
            </div>
            <button className="nav-cta" style={{ marginTop: 8 }} onClick={() => setShowPostModal(true)}>+ Post a Job</button>
          </div>
          <div className="page-tabs">
            {["overview", "listings", "applicants", "settings"].map(t => (
              <button key={t} className={`page-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        {tab === "overview" && (
          <>
            <div className="metrics-row">
              {[["49", "Total Applications"], ["3", "Active Listings"], ["1,240", "Profile Views"], ["78%", "Response Rate"]].map(([v, l]) => (
                <div key={l} className="dash-card dash-metric">
                  <strong>{v}</strong>
                  <span>{l}</span>
                </div>
              ))}
            </div>
            <div className="dash-card">
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recent Applications</h3>
              <table className="table">
                <thead><tr><th>Applicant</th><th>Position</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {[["Priya Mehta", "Senior Frontend Developer", "Jan 22"],
                    ["Arjun Singh", "Senior Frontend Developer", "Jan 21"],
                    ["Kavya Nair", "Product Designer", "Jan 20"]].map(([n, p, d], i) => (
                    <tr key={i}>
                      <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: ["#4F46E5","#E91E8C","#00897B"][i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white" }}>{n[0]}</div>
                        {n}
                      </div></td>
                      <td style={{ color: "#6b7c93" }}>{p}</td>
                      <td style={{ color: "#8899aa" }}>{d}</td>
                      <td><span className={`status-badge ${["status-interview","status-review","status-applied"][i]}`}>{["Interview","Under Review","Applied"][i]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "listings" && (
          <div className="dash-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700 }}>Your Job Listings</h3>
              <button className="btn btn-primary" onClick={() => setShowPostModal(true)}>+ Post New Job</button>
            </div>
            <table className="table">
              <thead><tr><th>Job Title</th><th>Applicants</th><th>Views</th><th>Posted</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {EMPLOYER_JOBS.map(j => (
                  <tr key={j.id}>
                    <td style={{ fontWeight: 600 }}>{j.title}</td>
                    <td>{j.applicants} applicants</td>
                    <td>{j.views.toLocaleString()}</td>
                    <td style={{ color: "#8899aa" }}>{j.posted}</td>
                    <td><span className={`status-badge ${j.status === "Active" ? "status-active" : "status-closed"}`}>{j.status}</span></td>
                    <td>
                      <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 13 }} onClick={() => showToast("Job settings opened!")}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "applicants" && (
          <div className="dash-card">
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>All Applicants</h3>
            <p style={{ color: "#8899aa", fontSize: 14 }}>Showing 49 applicants across 3 active listings</p>
            <div style={{ marginTop: 16 }}>
              {[["Priya Mehta", "React, TypeScript, 5 yrs", "Interview", "#4F46E5"],
                ["Arjun Singh", "Node.js, MongoDB, 4 yrs", "Under Review", "#00897B"],
                ["Kavya Nair", "Figma, Design Systems, 3 yrs", "Applied", "#E91E8C"],
                ["Rahul Verma", "React, GraphQL, 6 yrs", "Shortlisted", "#F57F17"]].map(([n, skills, status, color]) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid #f0f4f8" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "white", flexShrink: 0 }}>{n[0]}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{n}</p>
                    <p style={{ fontSize: 13, color: "#8899aa" }}>{skills}</p>
                  </div>
                  <span className={`status-badge ${status === "Interview" ? "status-interview" : status === "Shortlisted" ? "status-active" : status === "Under Review" ? "status-review" : "status-applied"}`}>{status}</span>
                  <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 13 }} onClick={() => showToast(`Viewing ${n}'s profile`)}>View Profile</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="dash-card" style={{ maxWidth: 600 }}>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Company Settings</h3>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input className="form-input" defaultValue="NovaTech Labs" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Website</label>
                <input className="form-input" defaultValue="https://novatech.in" />
              </div>
              <div className="form-group">
                <label className="form-label">Company Size</label>
                <select className="form-input">
                  <option>51–200 employees</option>
                  <option>1–50 employees</option>
                  <option>201–500 employees</option>
                  <option>500+ employees</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">About the Company</label>
              <textarea className="form-input" defaultValue="NovaTech Labs is a product-first company building enterprise SaaS for the modern era." />
            </div>
            <div className="form-group">
              <label className="form-label">Industry</label>
              <select className="form-input">
                <option>Software / Technology</option>
                <option>Finance</option>
                <option>Healthcare</option>
                <option>EdTech</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-primary" onClick={() => showToast("Company profile updated!")}>Save Changes</button>
              <button className="btn btn-outline">Discard</button>
            </div>
          </div>
        )}
      </div>

      {showPostModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowPostModal(false)}>
          <div className="modal">
            <button className="modal-close" onClick={() => setShowPostModal(false)}>×</button>
            <h2>Post a New Job</h2>
            <p className="modal-sub">Fill in the details and reach thousands of candidates</p>
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input className="form-input" placeholder="e.g. Senior React Developer" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="e.g. Bangalore, India" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select className="form-input" value={newJob.type} onChange={e => setNewJob({ ...newJob, type: e.target.value })}>
                  <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Salary Range</label>
                <input className="form-input" placeholder="e.g. ₹15–25 LPA" value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Work Mode</label>
                <select className="form-input">
                  <option>On-site</option><option>Hybrid</option><option>Remote</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea className="form-input" placeholder="Describe the role, responsibilities, and what you're looking for…" value={newJob.desc} onChange={e => setNewJob({ ...newJob, desc: e.target.value })} style={{ minHeight: 120 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Required Skills (comma separated)</label>
              <input className="form-input" placeholder="e.g. React, TypeScript, Node.js" />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePost} disabled={!newJob.title || !newJob.desc}>Post Job →</button>
              <button className="btn btn-outline" onClick={() => setShowPostModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CandidateDashboard({ navigate, showToast }) {
  const [tab, setTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const skills = ["React", "TypeScript", "Node.js", "GraphQL", "MongoDB", "Figma", "Python"];

  return (
    <>
      <div className="page-hero">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1>My Dashboard</h1>
          <p>Track your applications and manage your profile</p>
          <div className="page-tabs">
            {["overview", "applications", "profile", "saved"].map(t => (
              <button key={t} className={`page-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        {tab === "overview" && (
          <>
            <div className="metrics-row">
              {[["3", "Applications Sent"], ["1", "Interview Pending"], ["12", "Jobs Saved"], ["68%", "Profile Strength"]].map(([v, l]) => (
                <div key={l} className="dash-card dash-metric">
                  <strong>{v}</strong><span>{l}</span>
                </div>
              ))}
            </div>
            <div className="dash-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Application Status</h3>
              {APPLICATIONS.map(a => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid #f0f4f8" }}>
                  <CompanyLogo abbr={a.logo} color={a.logoColor} size={40} radius={10} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{a.job}</p>
                    <p style={{ fontSize: 13, color: "#8899aa" }}>{a.company} · {a.date}</p>
                  </div>
                  <span className={`status-badge ${a.status === "Interview Scheduled" ? "status-interview" : a.status === "Under Review" ? "status-review" : "status-applied"}`}>{a.status}</span>
                </div>
              ))}
            </div>
            <div className="dash-card">
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recommended for You</h3>
              <div className="jobs-grid">
                {JOBS.slice(0, 2).map(j => <JobCard key={j.id} job={j} onClick={() => {}} />)}
              </div>
            </div>
          </>
        )}

        {tab === "applications" && (
          <div className="dash-card">
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>All Applications</h3>
            <table className="table">
              <thead><tr><th>Job</th><th>Company</th><th>Applied On</th><th>Status</th></tr></thead>
              <tbody>
                {APPLICATIONS.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.job}</td>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CompanyLogo abbr={a.logo} color={a.logoColor} size={28} radius={6} />
                      {a.company}
                    </div></td>
                    <td style={{ color: "#8899aa" }}>{a.date}</td>
                    <td><span className={`status-badge ${a.status === "Interview Scheduled" ? "status-interview" : a.status === "Under Review" ? "status-review" : "status-applied"}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "profile" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div className="dash-card">
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div className="avatar-big">RS</div>
                <div>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700 }}>Rahul Sharma</h3>
                  <p style={{ color: "#8899aa", fontSize: 14 }}>Frontend Developer · Bangalore</p>
                </div>
              </div>
              {editMode ? (
                <>
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" defaultValue="Rahul Sharma" /></div>
                  <div className="form-group"><label className="form-label">Title</label><input className="form-input" defaultValue="Frontend Developer" /></div>
                  <div className="form-group"><label className="form-label">Location</label><input className="form-input" defaultValue="Bangalore, India" /></div>
                  <div className="form-group"><label className="form-label">Bio</label><textarea className="form-input" defaultValue="Passionate frontend dev with 4 years of experience building scalable web applications." /></div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn btn-primary" onClick={() => { setEditMode(false); showToast("Profile updated!"); }}>Save</button>
                    <button className="btn btn-outline" onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 14, color: "#4a5568", lineHeight: 1.7, marginBottom: 16 }}>Passionate frontend dev with 4 years of experience building scalable web applications with React and TypeScript.</p>
                  <button className="btn btn-outline" onClick={() => setEditMode(true)}>Edit Profile</button>
                </>
              )}
            </div>
            <div>
              <div className="dash-card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Skills</h3>
                <div>{skills.map(s => <span key={s} className="skill-tag">{s}</span>)}</div>
                <button className="btn btn-outline" style={{ marginTop: 14, fontSize: 13, padding: "7px 14px" }} onClick={() => showToast("Skill added!")}>+ Add Skill</button>
              </div>
              <div className="dash-card">
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Resume</h3>
                <div className="upload-area" style={{ padding: "20px" }}>
                  <div>📄</div>
                  <p style={{ marginTop: 6 }}><strong>rahul_sharma_resume.pdf</strong></p>
                  <p style={{ fontSize: 12 }}>Uploaded Jan 10, 2025</p>
                </div>
                <button className="btn btn-outline" style={{ marginTop: 12, width: "100%" }} onClick={() => showToast("Resume updated!")}>Update Resume</button>
              </div>
            </div>
          </div>
        )}

        {tab === "saved" && (
          <div className="dash-card">
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Saved Jobs</h3>
            <div className="jobs-grid">
              {JOBS.slice(2, 6).map(j => <JobCard key={j.id} job={j} onClick={() => showToast("Opening job details…")} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function AuthModal({ type, onClose, onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "candidate" });
  const isLogin = type === "login";

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="modal-sub">{isLogin ? "Sign in to access your dashboard" : "Join thousands of professionals on HireFlow"}</p>

        {!isLogin && (
          <>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">I am a</label>
              <div style={{ display: "flex", gap: 10 }}>
                {["candidate", "employer"].map(r => (
                  <button key={r} onClick={() => setForm({ ...form, role: r })} style={{ flex: 1, padding: "10px", border: `2px solid ${form.role === r ? COLORS.teal : "#e2e8f0"}`, borderRadius: 10, background: form.role === r ? "#f0fdf8" : "white", cursor: "pointer", fontFamily: "Inter", fontWeight: 600, fontSize: 14, color: form.role === r ? COLORS.tealDark : "#6b7c93", textTransform: "capitalize" }}>
                    {r === "candidate" ? "👤 Job Seeker" : "🏢 Employer"}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>

        <button className="btn btn-primary" style={{ width: "100%", padding: 14, marginBottom: 12 }} onClick={onSuccess}>
          {isLogin ? "Sign In →" : "Create Account →"}
        </button>

        {isLogin && <p style={{ textAlign: "center", fontSize: 13, color: "#8899aa" }}>Forgot password? <span style={{ color: COLORS.teal, cursor: "pointer" }}>Reset here</span></p>}
        <p style={{ textAlign: "center", fontSize: 13, color: "#8899aa", marginTop: 8 }}>
          {isLogin ? "New here?" : "Already have an account?"} <span style={{ color: COLORS.teal, cursor: "pointer" }} onClick={onClose}>{isLogin ? "Create account" : "Sign in"}</span>
        </p>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedJob, setSelectedJob] = useState(null);
  const [auth, setAuth] = useState(null); // null | "login" | "signup"
  const [loggedIn, setLoggedIn] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = msg => setToast(msg);

  const navigate = p => { setPage(p); window.scrollTo(0, 0); };

  const handleLogin = () => { setLoggedIn(true); setAuth(null); showToast("Welcome back! You're signed in."); };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo" onClick={() => navigate("home")}>Hire<span>Flow</span></div>
          <div className="nav-links">
            <button className={`nav-btn ${page === "jobs" ? "active" : ""}`} onClick={() => navigate("jobs")}>Find Jobs</button>
            <button className={`nav-btn ${page === "employer" ? "active" : ""}`} onClick={() => navigate("employer")}>For Employers</button>
            {loggedIn && <button className={`nav-btn ${page === "candidate" ? "active" : ""}`} onClick={() => navigate("candidate")}>Dashboard</button>}
            {!loggedIn ? (
              <>
                <button className="nav-btn" onClick={() => setAuth("login")}>Sign In</button>
                <button className="nav-cta" onClick={() => setAuth("signup")}>Get Started</button>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: COLORS.teal, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: COLORS.navy, cursor: "pointer" }} onClick={() => navigate("candidate")}>RS</div>
                <button className="nav-btn" onClick={() => { setLoggedIn(false); navigate("home"); showToast("Signed out successfully."); }}>Sign Out</button>
              </div>
            )}
          </div>
        </nav>

        {/* PAGES */}
        {page === "home" && <HomePage navigate={navigate} setSelectedJob={setSelectedJob} />}
        {page === "jobs" && <JobsPage navigate={navigate} setSelectedJob={setSelectedJob} />}
        {page === "detail" && <JobDetailPage job={selectedJob} navigate={navigate} showToast={showToast} />}
        {page === "employer" && <EmployerDashboard showToast={showToast} />}
        {page === "candidate" && (loggedIn ? <CandidateDashboard navigate={navigate} showToast={showToast} /> : <div className="section"><div className="empty-state"><h3>Please sign in to view your dashboard</h3><button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setAuth("login")}>Sign In</button></div></div>)}

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-grid" style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="footer-brand">
              <h3>Hire<span>Flow</span></h3>
              <p>The modern job platform connecting ambitious professionals with the companies building tomorrow.</p>
            </div>
            <div className="footer-col">
              <h4>For Job Seekers</h4>
              <a onClick={() => navigate("jobs")}>Browse Jobs</a>
              <a>Career Advice</a>
              <a onClick={() => navigate("candidate")}>My Dashboard</a>
              <a>Resume Builder</a>
            </div>
            <div className="footer-col">
              <h4>For Employers</h4>
              <a onClick={() => navigate("employer")}>Post a Job</a>
              <a>Pricing Plans</a>
              <a>Talent Search</a>
              <a>Employer Branding</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a>About Us</a>
              <a>Blog</a>
              <a>Privacy Policy</a>
              <a>Contact</a>
            </div>
          </div>
          <div className="footer-bottom" style={{ maxWidth: 1200, margin: "0 auto" }}>
            <span>© 2025 HireFlow. All rights reserved.</span>
            <div>
              <a>Terms</a>
              <a>Privacy</a>
              <a>Cookies</a>
            </div>
          </div>
        </footer>

        {/* AUTH MODALS */}
        {auth && <AuthModal type={auth} onClose={() => setAuth(null)} onSuccess={handleLogin} />}

        {/* TOAST */}
        {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      </div>
    </>
  );
}
