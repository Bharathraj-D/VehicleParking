import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user]);

  function update(field, val) {
    setForm(f => ({ ...f, [field]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signUp(form.email, form.password, {
        full_name: form.full_name,
        phone: form.phone,
        role: 'CUSTOMER',
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
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
          <p className="auth-subtitle">Join thousands of users managing parking effortlessly</p>
          <div className="auth-features">
            <div className="auth-feature"><span className="feature-dot"></span>Find available slots instantly</div>
            <div className="auth-feature"><span className="feature-dot"></span>Track your parking history</div>
            <div className="auth-feature"><span className="feature-dot"></span>Transparent fee calculation</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create account</h2>
            <p>Register to get started</p>
          </div>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {success && <div className="alert alert-success py-2 small">Account created! Redirecting to login...</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" value={form.full_name} onChange={e => update('full_name', e.target.value)} placeholder="John Doe" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input type="email" className="form-control" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-control" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 9876543210" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min 6 characters" required />
            </div>
            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" value={form.confirm} onChange={e => update('confirm', e.target.value)} placeholder="Repeat password" required />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Create Account
            </button>
          </form>

          <div className="auth-divider"><span>Already have an account?</span></div>
          <Link to="/login" className="btn btn-outline-secondary w-100">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
