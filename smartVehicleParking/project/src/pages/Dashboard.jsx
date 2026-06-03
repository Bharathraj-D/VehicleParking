import { useEffect, useState } from 'react';
import { ApiClient } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../utils/parking';
import { FiGrid, FiCheckCircle, FiAlertCircle, FiDollarSign, FiRefreshCw } from 'react-icons/fi';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}18`, color }}>
        <Icon size={22} />
      </div>
      <div className="stat-body">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ totalSlots: 200, availableSlots: 0, occupiedSlots: 0, revenueToday: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    setLoading(true);
    try {
      const statsData = await ApiClient.get('/parking/stats');
      setStats(statsData);

      const recentData = await ApiClient.get('/vehicles/recent?limit=6');
      setRecent(recentData);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStats(); }, []);

  const occupancyPct = stats.totalSlots ? Math.round((stats.occupiedSlots / stats.totalSlots) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {profile?.fullName || 'User'}</p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={loadStats} disabled={loading}>
          <FiRefreshCw size={14} className={loading ? 'spin me-1' : 'me-1'} /> Refresh
        </button>
      </div>

      <div className="stats-grid">
        <StatCard icon={FiGrid} label="Total Slots" value={stats.totalSlots} color="#1a56db" sub="A–D sections" />
        <StatCard icon={FiCheckCircle} label="Available" value={stats.availableSlots} color="#0e9f6e" sub="Ready to park" />
        <StatCard icon={FiAlertCircle} label="Occupied" value={stats.occupiedSlots} color="#e3a008" sub={`${occupancyPct}% full`} />
        <StatCard icon={FiDollarSign} label="Revenue Today" value={`₹${stats.revenueToday.toLocaleString('en-IN')}`} color="#e02424" sub="Completed sessions" />
      </div>

      <div className="occupancy-bar-card">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-semibold">Occupancy Rate</span>
          <span className="badge" style={{ background: occupancyPct > 80 ? '#fef3c7' : '#ecfdf5', color: occupancyPct > 80 ? '#92400e' : '#065f46' }}>
            {occupancyPct}%
          </span>
        </div>
        <div className="progress" style={{ height: '10px', borderRadius: '8px' }}>
          <div
            className="progress-bar"
            style={{
              width: `${occupancyPct}%`,
              background: occupancyPct > 80 ? '#e3a008' : occupancyPct > 50 ? '#1a56db' : '#0e9f6e',
              borderRadius: '8px',
              transition: 'width 0.6s ease',
            }}
          />
        </div>
        <div className="d-flex justify-content-between mt-2" style={{ fontSize: '12px', color: '#6b7280' }}>
          <span>{stats.occupiedSlots} occupied</span>
          <span>{stats.availableSlots} available</span>
        </div>
      </div>

      <div className="section-card">
        <h5 className="section-title">Recent Activity</h5>
        {recent.length === 0 ? (
          <p className="text-muted text-center py-4">No recent activity</p>
        ) : (
          <div className="table-responsive">
            <table className="table sp-table">
              <thead>
                <tr>
                  <th>Vehicle No.</th>
                  <th>Owner</th>
                  <th>Slot</th>
                  <th>Type</th>
                  <th>Entry</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(v => (
                  <tr key={v.id}>
                    <td><span className="vehicle-badge">{v.vehicleNumber}</span></td>
                    <td>{v.ownerName}</td>
                    <td><span className="slot-badge">{v.slotNumber}</span></td>
                    <td>{v.vehicleType}</td>
                    <td>{formatDateTime(v.entryTime)}</td>
                    <td><span className={`status-badge ${v.status.toLowerCase()}`}>{v.status}</span></td>
                    <td>{v.amount ? `₹${v.amount}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
