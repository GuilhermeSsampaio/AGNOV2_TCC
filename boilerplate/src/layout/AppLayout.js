import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../theme/global.css";

export default function AppLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">
        <Header />
        {children}
      </div>
    </div>
  );
}