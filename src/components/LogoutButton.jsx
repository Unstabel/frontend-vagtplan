import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login'); // Skift til din login-rute
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        padding: '8px 16px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Log ud
    </button>
  );
};

export default LogoutButton;
