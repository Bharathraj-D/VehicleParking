import { useEffect, useState } from 'react';
import { ApiClient } from '../lib/api';
import { FiRefreshCw } from 'react-icons/fi';

const SECTIONS = ['A', 'B', 'C', 'D'];

function SlotCell({ slot }) {
  const isOccupied = slot.status === 'OCCUPIED';
  return (
    <div className={`slot-cell ${isOccupied ? 'occupied' : 'available'}`} title={`${slot.slotNumber} — ${slot.status}`}>
      <span className="slot-num">{slot.slotNumber}</span>
      <span className="slot-dot" />
    </div>
  );
}

export default function ParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('A');

  async function loadSlots() {
    setLoading(true);
    try {
      const data = await ApiClient.get('/parking/slots');
      setSlots(data);
    } catch (err) {
      console.error('Error loading slots:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSlots(); }, []);

  const sectionSlots = slots.filter(s => s.slotNumber.startsWith(activeSection));
  const totalOccupied = slots.filter(s => s.status === 'OCCUPIED').length;
  const totalAvailable = slots.length - totalOccupied;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Parking Slots</h1>
          <p className="page-subtitle">View real-time slot availability across all sections</p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={loadSlots} disabled={loading}>
          <FiRefreshCw size={14} className={loading ? 'spin me-1' : 'me-1'} /> Refresh
        </button>
      </div>

      <div className="slot-summary-row">
        <div className="slot-summary-item available-summary">
          <div className="summary-dot available-dot" />
          <span>Available: <strong>{totalAvailable}</strong></span>
        </div>
        <div className="slot-summary-item occupied-summary">
          <div className="summary-dot occupied-dot" />
          <span>Occupied: <strong>{totalOccupied}</strong></span>
        </div>
        <div className="slot-summary-item total-summary">
          <span>Total: <strong>{slots.length}</strong></span>
        </div>
      </div>

      <div className="section-tabs">
        {SECTIONS.map(sec => {
          const secSlots = slots.filter(s => s.slotNumber.startsWith(sec));
          const occ = secSlots.filter(s => s.status === 'OCCUPIED').length;
          const avail = secSlots.length - occ;
          return (
            <button
              key={sec}
              className={`section-tab ${activeSection === sec ? 'active' : ''}`}
              onClick={() => setActiveSection(sec)}
            >
              <span className="section-label">Section {sec}</span>
              <div className="section-meta">
                <span className="avail-count">{avail} free</span>
                <span className="occ-count">{occ} used</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="section-card">
        <h5 className="section-title mb-3">Section {activeSection} — Slots {activeSection}1 to {activeSection}50</h5>
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="slots-grid">
            {sectionSlots.map(slot => <SlotCell key={slot.id} slot={slot} />)}
          </div>
        )}
      </div>
    </div>
  );
}
