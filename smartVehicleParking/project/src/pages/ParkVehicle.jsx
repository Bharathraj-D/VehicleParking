import { useEffect, useState } from 'react';
import { ApiClient } from '../lib/api';
import { FiTruck } from 'react-icons/fi';

const VEHICLE_TYPES = ['Car', 'Bike', 'SUV', 'Truck', 'Bus', 'Auto'];
const SECTIONS = ['A', 'B', 'C', 'D'];

export default function ParkVehicle() {
  const [form, setForm] = useState({
    ownerName: '', email: '', phone: '', vehicleNumber: '', vehicleType: 'Car', slotNumber: '',
  });
  const [slots, setSlots] = useState([]);
  const [filterSection, setFilterSection] = useState('A');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => { loadAvailableSlots(); }, []);

  async function loadAvailableSlots() {
    try {
      const allSlots = await ApiClient.get('/parking/slots');
      const available = allSlots.filter(s => s.status === 'AVAILABLE');
      setSlots(available);
    } catch (err) {
      console.error('Error loading slots:', err);
    }
  }

  function update(field, val) {
    setForm(f => ({ ...f, [field]: val }));
  }

  const filteredSlots = slots.filter(s => s.slotNumber.startsWith(filterSection));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(null);
    if (!form.slotNumber) { setError('Please select a parking slot'); return; }
    setLoading(true);
    try {
      const result = await ApiClient.post('/vehicles/park', form);
      setSuccess(result.vehicle);
      setForm({ ownerName: '', email: '', phone: '', vehicleNumber: '', vehicleType: 'Car', slotNumber: '' });
      await loadAvailableSlots();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Park Vehicle</h1>
          <p className="page-subtitle">Register a vehicle and assign a parking slot</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="section-card">
            <h5 className="section-title">Vehicle Details</h5>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {success && (
              <div className="alert alert-success py-2 small">
                Vehicle <strong>{success.vehicleNumber}</strong> parked at slot <strong>{success.slotNumber}</strong>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Owner Name</label>
                <input className="form-control" value={form.ownerName} onChange={e => update('ownerName', e.target.value)} placeholder="Full name" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={form.email} onChange={e => update('email', e.target.value)} placeholder="owner@email.com" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-control" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 9876543210" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Vehicle Number</label>
                <input className="form-control" value={form.vehicleNumber} onChange={e => update('vehicleNumber', e.target.value.toUpperCase())} placeholder="KA-01-AB-1234" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Vehicle Type</label>
                <select className="form-select" value={form.vehicleType} onChange={e => update('vehicleType', e.target.value)}>
                  {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label">Selected Slot</label>
                <input className="form-control" value={form.slotNumber} readOnly placeholder="Click a slot from the grid →" required />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <FiTruck className="me-2" />}
                Park Vehicle
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="section-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="section-title mb-0">Available Slots</h5>
              <div className="d-flex gap-2">
                {SECTIONS.map(s => (
                  <button key={s} className={`btn btn-sm ${filterSection === s ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilterSection(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-muted small mb-3">{filteredSlots.length} slots available in section {filterSection}</p>
            {filteredSlots.length === 0 ? (
              <p className="text-center text-muted py-4">No available slots in section {filterSection}</p>
            ) : (
              <div className="slots-select-grid">
                {filteredSlots.map(slot => (
                  <button
                    key={slot.slotNumber}
                    type="button"
                    className={`slot-select-btn ${form.slotNumber === slot.slotNumber ? 'selected' : ''}`}
                    onClick={() => update('slotNumber', slot.slotNumber)}
                  >
                    {slot.slotNumber}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
