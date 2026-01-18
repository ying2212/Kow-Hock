import { useState } from 'react';
import { Package, Truck, Users, Settings, Inbox, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [search, setSearch] = useState('');

  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <div className={`sidebar ${!isOpen ? 'hidden' : ''}`}>
      <div className="sidebarContent">
        {/* Brand + User Info */}
        <div className="brandUserWrapper">
          <div className="brandIcon">{firstLetter}</div>
          <div className="sidebarUserInfo">
            <div className="userName">{user.name || "Admin"}</div>
            <div className="userPhone">{user.phone || "No Phone"}</div>
          </div>
        </div>

        {/* Search */}
        <div className="searchBox">
          <Search size={16} />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Navigation */}
        <nav className="nav">
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
            <Package size={18} /> Orders
          </NavLink>
          <NavLink to="/admin/drivers" className={({ isActive }) => isActive ? 'active' : ''}>
            <Truck size={18} /> Drivers
          </NavLink>
          <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'active' : ''}>
            <Users size={18} /> Customers
          </NavLink>
          <NavLink to="/admin/inbox" className={({ isActive }) => isActive ? 'active' : ''}>
            <Inbox size={18} /> Inbox
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            <Settings size={18} /> Settings
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
