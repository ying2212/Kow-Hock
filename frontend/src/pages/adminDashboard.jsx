import React, { useState } from 'react';
import {
  Menu,
  X,
  Package,
  Truck,
  Users,
  Settings,
  Inbox,
  Search,
  MapPin
} from 'lucide-react';

import './adminDashboard.css';

const deliveriesMock = [
  {
    id: 1,
    customer: 'John Doe',
    address: '123 Main St',
    status: 'PENDING'
  },
  {
    id: 2,
    customer: 'Alice Tan',
    address: '45 Jalan Bukit',
    status: 'DELIVERING'
  },
  {
    id: 3,
    customer: 'Michael Lee',
    address: '78 Orchard Rd',
    status: 'DELIVERED'
  }
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [activeView, setActiveView] = useState('admin');

  const getStatusLabel = (status) => {
    return {
      PENDING: 'Pending',
      DELIVERING: 'Delivering',
      DELIVERED: 'Delivered',
      OUT_FOR_DELIVERY: 'In Transit'
    }[status] || status;
  };

  const getStatusClass = (status) => {
    return {
      PENDING: 'pending',
      DELIVERING: 'delivering',
      DELIVERED: 'delivered',
      OUT_FOR_DELIVERY: 'transit'
    }[status] || 'delivered';
  };

  const filteredDeliveries = deliveriesMock.filter((d) =>
    d.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${!sidebarOpen ? 'hidden' : ''}`}>
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
            <a href="#"><Package size={18} /> Orders</a>
            <a href="#"><Truck size={18} /> Drivers</a>
            <a href="#"><Users size={18} /> Customers</a>
            <a href="#"><Inbox size={18} /> Inbox</a>
            <a href="#"><Settings size={18} /> Settings</a>
          </nav>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        {/* Header */}
        <div className="header">
          <div className="headerLeft">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <h1>Tracking Delivery</h1>
          </div>

          <button
            className="primaryBtn"
            onClick={() =>
              setActiveView(activeView === 'admin' ? 'customer' : 'admin')
            }
          >
            View as {activeView === 'admin' ? 'Customer' : 'Admin'}
          </button>
        </div>

        {/* Content */}
        <div className="content">
          {/* List */}
          <div className="list">
            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className={`card ${
                  selectedOrder?.id === delivery.id ? 'active' : ''
                }`}
                onClick={() => setSelectedOrder(delivery)}
              >
                <h4>{delivery.customer}</h4>
                <p>{delivery.address}</p>
                <span
                  className={`badge ${getStatusClass(delivery.status)}`}
                >
                  {getStatusLabel(delivery.status)}
                </span>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="map">
            {selectedOrder ? (
              <div>
                <MapPin size={48} />
                <p>{selectedOrder.address}</p>
              </div>
            ) : (
              <p>Select a delivery to view location</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
