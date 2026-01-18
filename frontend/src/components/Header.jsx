import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="header">
      <h1 className="headerTitle">Tracking Delivery</h1>
      <button className="logoutBtn" onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default Header;
