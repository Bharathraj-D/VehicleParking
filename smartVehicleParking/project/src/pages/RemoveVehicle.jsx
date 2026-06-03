import { useEffect, useState } from 'react';
import { ApiClient } from '../lib/api';
import { calculateFee, formatDateTime, formatDuration } from '../utils/parking';
import { FiSearch, FiLogOut } from 'react-icons/fi';

export default function RemoveVehicle() {
  const [search, setSearch] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  async function searchVehicles(q) {
    setLoading(true);
    try {
      if (q.trim()) {
        const data = await ApiClient.get(`/vehicles/search?q=${encodeURIComponent(q)}`);
        setVehicles(data);
      } else {
        const data = await ApiClient.get('/vehicles/active');
        setVehicles(data);
      }
    } catch (err) {
      console.error('Error searching vehicles:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { searchVehicles(''); }, []);

  function handleSearch(e) {
    e.preventDefault();
    searchVehicles(search);
  }

  async function removeVehicle(vehicleId) {
    setError('');
    setRemoving(vehicleId);
    try {
      const result = await ApiClient.post('/vehicles/remove', { vehicle_id: vehicleId });
      setReceipt({ ...result.vehicle, fee: result.fee, exitTime: result.exit_time });
      setVehicles(v => v.filter(x => x.id !== vehicleId));
    } catch (err) {
      setError(err.message);
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Remove Vehicle</h1>
          <p className="page-subtitle">Check out a vehicle and calculate parking fee</p>
        </div>
      </div>

      {receipt && (
        <div className="receipt-card">
          <div className="receipt-header">
            <h5>Parking Receipt</h5>
            <button className="btn-close-receipt" onClick={() => setReceipt(null)}>×</button>
          </div>
          <div className="receipt-body">
            <div className="receipt-row"><span>Vehicle</span><strong>{receipt.vehicleNumber}</strong></div>
            <div className="receipt-row"><span>Owner</span><strong>{receipt.ownerName}</strong></div>
            <div className="receipt-row"><span>Slot</span><strong>{receipt.slotNumber}</strong></div>
            <div className="receipt-row"><span>Entry</span><strong>{formatDateTime(receipt.entryTime)}</strong></div>
            <div className="receipt-row"><span>Exit</span><strong>{formatDateTime(receipt.exitTime)}</strong></div>
            <div className="receipt-divider" />
            <div className="receipt-row receipt-total"><span>Total Fee</span><strong className="fee-amount">₹{receipt.fee}</strong></div>
          </div>
          <p className="receipt-note">Rate: ₹50/hour · Minimum ₹50 · Partial hours rounded up</p>
        </div>
      )}

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <div className="section-card">
        <form onSubmit={handleSearch} className="d-flex gap-2 mb-4">
          <input
            className="form-control"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by vehicle number, owner name, or phone..."
          />
          <button type="submit" className="btn btn-primary px-4">
            <FiSearch size={16} />
          </button>
        </form>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : vehicles.length === 0 ? (
          <p className="text-center text-muted py-4">No active vehicles found</p>
        ) : (
          <div className="table-responsive">
            <table className="table sp-table">
              <thead>
                <tr>
                  <th>Vehicle No.</th>
                  <th>Owner</th>
                  <th>Phone</th>
                  <th>Slot</th>
                  <th>Type</th>
                  <th>Entry</th>
                  <th>Duration</th>
                  <th>Est. Fee</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id}>
                    <td><span className="vehicle-badge">{v.vehicleNumber}</span></td>
                    <td>{v.ownerName}</td>
                    <td>{v.phone}</td>
                    <td><span className="slot-badge">{v.slotNumber}</span></td>
                    <td>{v.vehicleType}</td>
                    <td>{formatDateTime(v.entryTime)}</td>
                    <td>{formatDuration(v.entryTime)}</td>
                    <td className="fw-semibold">₹{calculateFee(v.entryTime)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => removeVehicle(v.id)}
                        disabled={removing === v.id}
                      >
                        {removing === v.id ? <span className="spinner-border spinner-border-sm" /> : <><FiLogOut size={13} className="me-1" />Remove</>}
                      </button>
                    </td>
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
