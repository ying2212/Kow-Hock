import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Menu,X } from 'lucide-react';
import './Header.css';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="headerLeft">
        <div className="menuBtn">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <h1 className="headerTitle">Tracking Delivery</h1>
      <button className="logoutBtn" onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};


export default Header;
