import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./pages/admin/adminLayout";
import Orders from "./pages/admin/orders";
import Drivers from "./pages/admin/drivers";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="orders" replace />} />
        <Route path="orders" element={<Orders />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="customers" element={<div style={{padding: 24}}>Customers Page</div>} />
        <Route path="inbox" element={<div style={{padding: 24}}>Inbox Page</div>} />
        <Route path="settings" element={<div style={{padding: 24}}>Settings Page</div>} />
      </Route>
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default App;