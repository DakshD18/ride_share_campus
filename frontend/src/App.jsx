import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import RoleSelect from './pages/RoleSelect';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { GoogleMapsProvider } from './components/GoogleMapsProvider';
import './App.css';

function App() {
  return (
    <GoogleMapsProvider>
      <Router>
        <Routes>
          {/* Pages WITH Navbar */}
          <Route path="/"      element={<><Navbar /><main className="main-content"><Landing /></main></>} />
          <Route path="/login" element={<><Navbar /><main className="main-content"><Login /></main></>} />

          {/* Full-screen pages — no Navbar */}
          <Route path="/role-select"         element={<RoleSelect />} />
          <Route path="/dashboard/passenger" element={<PassengerDashboard />} />
          <Route path="/dashboard/driver"    element={<DriverDashboard />} />
          <Route path="/dashboard"           element={<Dashboard />} />
          <Route path="/admin"               element={<AdminDashboard />} />
        </Routes>
      </Router>
    </GoogleMapsProvider>
  );
}

export default App;