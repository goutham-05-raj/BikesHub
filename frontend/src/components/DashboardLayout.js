import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const DashboardLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="layout-root">
      {/* Cinematic bright animated background for the entire app */}
      <div className="layout-bg">
        <div className="ly-orb ly-orb--1" />
        <div className="ly-orb ly-orb--2" />
        <div className="ly-orb ly-orb--3" />
        <div className="ly-grid" />
        <div className="ly-vignette" />
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={`layout-main${sidebarOpen ? ' sidebar-open' : ''}`}>
        <TopBar
          title={title}
          subtitle={subtitle}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="layout-content">
          <div className="layout-content-inner">
            {children}
          </div>
        </div>
      </div>

      <style>{`
        .layout-root {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: linear-gradient(135deg, #FFF0F5 0%, #FFF5F8 50%, #FFFAF0 100%); /* Sparkle Pink base */
          font-family: 'Outfit', 'Inter', sans-serif;
          color: #212529; /* Dark text for light mode */
        }

        /* ── BACKGROUND ── */
        .layout-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
        }
        .ly-orb--1 {
          width: 70vw; height: 70vw; max-width: 800px; max-height: 800px;
          top: -20vh; left: -10vw;
          background: radial-gradient(circle, rgba(255,77,109,0.15) 0%, transparent 70%);
          animation: orbFloat 25s infinite alternate;
        }
        .ly-orb--2 {
          width: 60vw; height: 60vw; max-width: 600px; max-height: 600px;
          bottom: -10vh; right: -5vw;
          background: radial-gradient(circle, rgba(0,145,234,0.1) 0%, transparent 70%);
          animation: orbFloat2 28s infinite alternate;
        }
        .ly-orb--3 {
          width: 50vw; height: 50vw; max-width: 500px; max-height: 500px;
          top: 30%; left: 40%;
          background: radial-gradient(circle, rgba(0,200,83,0.08) 0%, transparent 70%);
          animation: orbFloat3 35s infinite alternate;
        }
        .ly-orb--1 {
          width: 70vw; height: 70vw; max-width: 800px; max-height: 800px;
          top: -20vh; left: -10vw;
          background: radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%);
          animation: orbFloat 25s infinite alternate;
        }
        .ly-orb--2 {
          width: 60vw; height: 60vw; max-width: 600px; max-height: 600px;
          bottom: -10vh; right: -5vw;
          background: radial-gradient(circle, rgba(0,145,234,0.1) 0%, transparent 70%);
          animation: orbFloat2 28s infinite alternate;
        }
        .ly-orb--3 {
          width: 50vw; height: 50vw; max-width: 500px; max-height: 500px;
          top: 30%; left: 40%;
          background: radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%);
          animation: orbFloat3 35s infinite alternate;
        }
        @keyframes orbFloat  { to { transform: translate(4vw, 6vh) scale(1.1); } }
        @keyframes orbFloat2 { to { transform: translate(-3vw, -4vh) scale(1.15); } }
        @keyframes orbFloat3 { to { transform: translate(3vw, -2vh) scale(0.9); } }

        .ly-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,105,180,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,105,180,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .ly-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, transparent 30%, rgba(255,240,245,0.85) 100%);
        }

        /* ── MAIN CONTENT AREA ── */
        .layout-main {
          position: relative;
          z-index: 10;
          margin-left: var(--sidebar-width);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          /* Remove the heavy dark tint overlay */
          background: transparent;
          transition: margin-left 0.3s ease;
        }

        .layout-content {
          flex: 1;
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
        }

        .layout-content-inner {
          padding: 3rem 2.5rem; /* slightly larger padding for premium feel */
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .layout-main {
            margin-left: 0;
          }
          .layout-content-inner {
            padding: 2rem 1.5rem;
          }
        }
        @media (max-width: 600px) {
          .layout-content-inner {
            padding: 1.5rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
