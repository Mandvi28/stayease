import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

// Shared shell for the host and admin dashboards - a left nav + content area.
const DashboardLayout = ({ title, links }) => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <h1 className="mb-8 font-display text-2xl text-pine-900">{title}</h1>
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <nav className="flex gap-2 overflow-x-auto lg:flex-col">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-4 py-2 text-sm transition-colors ${
                isActive ? 'bg-pine-700 text-sand-50' : 'text-pine-600 hover:bg-pine-50'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  </div>
);

export default DashboardLayout;
