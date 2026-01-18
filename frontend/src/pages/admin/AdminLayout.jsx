import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import Header from "../../components/Header";
import "./adminDashboard.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;


