import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiGrid, FiTruck, FiLogOut, FiSearch, FiUser, FiClock } from 'react-icons/fi';

export default function Sidebar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isAdmin = profile?.role === 'ADMIN';

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <nav className="sidebar d-flex flex-column">
      <div className="sidebar-brand">
        <div className="brand-icon"><FiGrid size={22} /></div>
        <span className="brand-text">SmartParking</span>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar"><FiUser size={16} /></div>
        <div className="user-info">
          <div className="user-name">{profile?.fullName || 'User'}</div>
          <div className="user-role">{isAdmin ? 'Administrator' : 'Customer'}</div>
        </div>
      </div>

      <ul className="sidebar-nav flex-grow-1">
        <li className="nav-section-label">Main</li>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiHome size={18} />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/slots" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiGrid size={18} />
            <span>Parking Slots</span>
          </NavLink>
        </li>

        <li className="nav-section-label">Operations</li>
        <li>
          <NavLink to="/park" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiTruck size={18} />
            <span>Park Vehicle</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/remove" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiClock size={18} />
            <span>Remove Vehicle</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/search" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiSearch size={18} />
            <span>Search Vehicle</span>
          </NavLink>
        </li>
      </ul>

      <button className="sidebar-signout" onClick={handleSignOut}>
        <FiLogOut size={18} />
        <span>Sign Out</span>
      </button>
    </nav>
  );
}
