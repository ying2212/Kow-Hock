import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Orders from "./pages/admin/Orders";
import Drivers from "./pages/admin/drivers";
import ProtectedRoute from "./components/ProtectedRoute";
import Analytics from "./pages/admin/Analytics";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/orders" replace />} />
        <Route path="orders" element={<Orders />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="customers" element={<div>Customers Page</div>} />
        <Route path="inbox" element={<div>Inbox Page</div>} />
        <Route path="settings" element={<div>Settings Page</div>} />
        <Route path="analytics" element={<Analytics />} />

      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;