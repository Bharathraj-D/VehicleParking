import { useState } from 'react';
import { ApiClient } from '../lib/api';
import { formatDateTime, formatDuration, calculateFee } from '../utils/parking';
import { FiSearch } from 'react-icons/fi';

export default function VehicleSearch() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function doSearch(e) {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      let endpoint = '/vehicles/search?q=' + encodeURIComponent(query);
      const data = await ApiClient.get(endpoint);
      const filtered = filter === 'all' ? data : data.filter(v => v.status === filter);
      setResults(filtered);
    } catch (err) {
      console.error('Error searching:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Vehicle Search</h1>
          <p className="page-subtitle">Search across all vehicle records</p>
        </div>
      </div>

      <div className="section-card mb-4">
        <form onSubmit={doSearch}>
          <div className="row g-3 align-items-end">
            <div className="col-md-7">
              <label className="form-label">Search</label>
              <div className="input-group">
                <span className="input-group-text"><FiSearch /></span>
                <input
                  className="form-control"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Vehicle number, owner, email, phone, slot..."
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="all">All Records</option>
                <option value="ACTIVE">Active (Parked)</option>
                <option value="COMPLETED">Completed (Exited)</option>
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm" /> : 'Search'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {searched && (
        <div className="section-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="section-title mb-0">Results</h5>
            <span className="badge bg-secondary">{results.length} record{results.length !== 1 ? 's' : ''}</span>
          </div>

          {results.length === 0 ? (
            <p className="text-center text-muted py-5">No records found</p>
          ) : (
            <div className="table-responsive">
              <table className="table sp-table">
                <thead>
                  <tr>
                    <th>Vehicle No.</th>
                    <th>Owner</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Slot</th>
                    <th>Entry</th>
                    <th>Exit / Duration</th>
                    <th>Status</th>
                    <th>Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(v => (
                    <tr key={v.id}>
                      <td><span className="vehicle-badge">{v.vehicleNumber}</span></td>
                      <td>{v.ownerName}</td>
                      <td className="text-muted small">{v.email}</td>
                      <td>{v.phone}</td>
                      <td>{v.vehicleType}</td>
                      <td><span className="slot-badge">{v.slotNumber}</span></td>
                      <td>{formatDateTime(v.entryTime)}</td>
                      <td>
                        {v.status === 'ACTIVE'
                          ? <span className="text-warning small">{formatDuration(v.entryTime)}</span>
                          : formatDateTime(v.exitTime)}
                      </td>
                      <td><span className={`status-badge ${v.status.toLowerCase()}`}>{v.status}</span></td>
                      <td className="fw-semibold">
                        {v.status === 'ACTIVE' ? <span className="text-muted">₹{calculateFee(v.entryTime)}</span> : v.amount ? `₹${v.amount}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
