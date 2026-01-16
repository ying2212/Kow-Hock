// ============================================
// FILE: src/components/Sidebar.jsx
// ============================================
import { useState } from 'react';
import { Package, Truck, Users, Settings, Inbox, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const [search, setSearch] = useState('');

  return (
    <div className={`sidebar ${!isOpen ? 'hidden' : ''}`}>
      <div className="sidebarContent">
        <div className="brand">
          <div className="brandIcon">K</div>
          <div>
            <h3>Kow Hock</h3>
            <p>admin@kowhock.com</p>
          </div>
        </div>

        <div className="searchBox">
          <Search size={16} />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
