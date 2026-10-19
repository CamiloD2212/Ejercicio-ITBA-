import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import ToastContainer from '../ui/Toast.jsx';

export function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <Outlet />
      </main>
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.25rem 0',
          backgroundColor: 'var(--bg-secondary)',
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>DevBoard Kanban &bull; ITBA FSD 2026</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            SDD Architecture &bull; Modern SaaS Edition
          </span>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
}

export default Layout;
