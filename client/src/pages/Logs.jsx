import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/logs';
export default function Logs() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all'); // all | in | out

  useEffect(() => {
    axios.get(API).then(r => setLogs(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? logs : logs.filter(l => l.type === filter);

  const formatDate = (dt) => new Date(dt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Stock Logs</h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '2px 0 0' }}>{logs.length} total movements</p>
        </div>
        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'in', 'out'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              background: filter === f ? '#3b82f6' : '#f1f5f9',
              color: filter === f ? '#fff' : '#475569',
              border: 'none'
            }}>
              {f === 'all' ? 'All' : f === 'in' ? '+ Stock In' : '- Stock Out'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total movements', value: logs.length, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Stock in', value: logs.filter(l => l.type === 'in').length, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Stock out', value: logs.filter(l => l.type === 'out').length, color: '#d97706', bg: '#fffbeb' },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: '10px', padding: '14px 18px' }}>
            <div style={{ fontSize: '12px', color: c.color, fontWeight: 500 }}>{c.label}</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {loading ? <p style={{ color: '#94a3b8' }}>Loading...</p> : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['#', 'Product', 'Type', 'Qty', 'Note', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '12px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No logs found</td></tr>
              ) : filtered.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', color: '#94a3b8' }}>#{l.id}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 500, color: '#1e293b' }}>{l.product_name}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                      background: l.type === 'in' ? '#f0fdf4' : '#fffbeb',
                      color: l.type === 'in' ? '#16a34a' : '#d97706'
                    }}>
                      {l.type === 'in' ? '▲ IN' : '▼ OUT'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: l.type === 'in' ? '#16a34a' : '#d97706' }}>
                    {l.type === 'in' ? '+' : '-'}{l.quantity}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>{l.note || '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: '12px' }}>{formatDate(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
