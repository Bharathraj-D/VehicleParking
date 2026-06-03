import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ParkingSlots from './pages/ParkingSlots';
import ParkVehicle from './pages/ParkVehicle';
import RemoveVehicle from './pages/RemoveVehicle';
import VehicleSearch from './pages/VehicleSearch';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>}
          />
          <Route
            path="/slots"
            element={<ProtectedRoute><Layout><ParkingSlots /></Layout></ProtectedRoute>}
          />
          <Route
            path="/park"
            element={<ProtectedRoute><Layout><ParkVehicle /></Layout></ProtectedRoute>}
          />
          <Route
            path="/remove"
            element={<ProtectedRoute><Layout><RemoveVehicle /></Layout></ProtectedRoute>}
          />
          <Route
            path="/search"
            element={<ProtectedRoute><Layout><VehicleSearch /></Layout></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
