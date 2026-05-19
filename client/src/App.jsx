import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Logs from './pages/Logs';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get('https://gunakani3005-project.onrender.com/api/products/alerts/low-stock')
      .then(res => setAlerts(res.data))
      .catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f5f6fa' }}>

        {/* Navbar */}
        <nav style={{
          background: '#fff', borderBottom: '1px solid #e2e8f0',
          padding: '0 24px', display: 'flex', alignItems: 'center', gap: '32px', height: '56px'
        }}>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#1e293b' }}>📦 Inventory</span>
          {['/', '/suppliers', '/logs'].map((path, i) => (
            <NavLink key={path} to={path} end={path === '/'}
              style={({ isActive }) => ({
                textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                color: isActive ? '#3b82f6' : '#64748b',
                borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                paddingBottom: '2px'
              })}>
              {['Products', 'Suppliers', 'Logs'][i]}
            </NavLink>
          ))}
          {alerts.length > 0 && (
            <span style={{
              marginLeft: 'auto', background: '#fef2f2', color: '#dc2626',
              fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '999px',
              border: '1px solid #fecaca'
            }}>
              ⚠ {alerts.length} low stock
            </span>
          )}
        </nav>

        {/* Page Content */}
        <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
