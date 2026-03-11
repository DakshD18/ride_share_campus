import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import RoleSelect from './pages/RoleSelect';
import PassengerDashboard from './pages/PassengerDashboard';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages WITH navbar */}
        <Route path="/" element={<><Navbar /><main className="main-content"><Landing /></main></>} />
        <Route path="/login" element={<><Navbar /><main className="main-content"><Login /></main></>} />

        {/* Pages WITHOUT navbar (full screen) */}
        <Route path="/role-select"          element={<RoleSelect />} />
        <Route path="/dashboard/passenger"  element={<PassengerDashboard />} />
        <Route path="/dashboard"            element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;