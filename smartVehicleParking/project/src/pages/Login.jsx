import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiClient, API_URL } from '../lib/api';

export default function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user]);

  async function seedAdmin() {
    setSeeding(true);
    try {
      await ApiClient.post('/auth/seed-admin', {});
      setEmail('admin@smartparking.com');
      setPassword('Admin@123');
      setError('');
    } catch {
      // ignore
    } finally {
      setSeeding(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-branding">
          <div className="auth-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#1a56db" />
              <path d="M14 34V16h8c2.2 0 3.9.6 5.1 1.7 1.2 1.2 1.8 2.7 1.8 4.6 0 1.9-.6 3.5-1.8 4.6-1.2 1.1-2.9 1.7-5.1 1.7H17.5V34H14zm3.5-8.7h4.3c1.1 0 2-.3 2.6-.9.6-.6.9-1.4.9-2.4 0-1-.3-1.8-.9-2.4-.6-.6-1.5-.9-2.6-.9H17.5v6.6z" fill="white" />
            </svg>
          </div>
          <h1 className="auth-title">SmartParking</h1>
          <p className="auth-subtitle">Intelligent parking management system for modern facilities</p>
          <div className="auth-features">
            <div className="auth-feature"><span className="feature-dot"></span>Real-time slot monitoring</div>
            <div className="auth-feature"><span className="feature-dot"></span>Automated fee calculation</div>
            <div className="auth-feature"><span className="feature-dot"></span>Complete vehicle history</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account</p>
          </div>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Sign In
            </button>
          </form>

          <div className="auth-divider"><span>New customer?</span></div>
          <Link to="/register" className="btn btn-outline-secondary w-100 mb-3">
            Create an account
          </Link>

          <div className="admin-seed-section">
            <p className="text-muted small text-center mb-2">First time setup?</p>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary w-100"
              onClick={seedAdmin}
              disabled={seeding}
            >
              {seeding ? <span className="spinner-border spinner-border-sm me-1" /> : null}
              Initialize Admin Account
            </button>
            <p className="text-muted" style={{ fontSize: '11px', textAlign: 'center', marginTop: '6px' }}>
              admin@smartparking.com / Admin@123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
