import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>MyApp</h2>
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          {/* IA: Add more links here */}
        </ul>
      </nav>
    </aside>
  );
}