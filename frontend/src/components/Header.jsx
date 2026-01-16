import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="headerLeft">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>
        <h1>Tracking Delivery</h1>
      </div>

      <button
        className="primaryBtn"
        onClick={() => navigate('/customer')}
      >
        View as Customer
      </button>
    </div>
  );
};

export default Header;

