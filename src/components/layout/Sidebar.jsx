import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-header">
        <i className="bi bi-box-seam-fill me-2"></i>
        Invento
      </h1>
      <ul className="nav flex-column sidebar-nav">
        <li className="nav-item">
          <NavLink className="nav-link" to="/dashboard">
            <i className="bi bi-grid-1x2-fill"></i> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/inventory">
            <i className="bi bi-archive-fill"></i> Inventory
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/reports">
            <i className="bi bi-bar-chart-line-fill"></i> Reports
          </NavLink>
        </li>
       
      </ul>
    </aside>
  );
};

export default Sidebar;