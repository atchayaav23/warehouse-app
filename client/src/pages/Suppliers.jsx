import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

const API = 'http://localhost:5000/api/products';
const empty = { name: '', email: '', phone: '', address: '' };

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showAdd, setShowAdd]     = useState(false);
  const [showEdit, setShowEdit]   = useState(null);
  const [form, setForm]           = useState(empty);
  const [error, setError]         = useState('');

  const fetchAll = () => {
    setLoading(true);
    axios.get(API).then(r => setSuppliers(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAdd = async () => {
    if (!form.name.trim()) return setError('Supplier name is required');
    try {
      await axios.post(API, form);
      setShowAdd(false); setForm(empty); setError(''); fetchAll();
    } catch (e) { setError(e.response?.data?.error || 'Error'); }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`${API}/${showEdit.id}`, form);
      setShowEdit(null); setForm(empty); fetchAll();
    } catch (e) { setError(e.response?.data?.error || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier? This may affect linked products.')) return;
    await axios.delete(`${API}/${id}`);
    fetchAll();
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '8px',
    border: '1px solid #e2e8f0', fontSize: '14px', marginBottom: '12px', outline: 'none'
  };
  const btnPrimary = {
    background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px',
    padding: '8px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
  };

  const FormFields = () => (
    <>
      {error && <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '10px' }}>{error}</div>}
      <label style={{ fontSize: '12px', color: '#64748b' }}>Supplier Name *</label>
      <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. TechWorld Pvt Ltd" />
      <label style={{ fontSize: '12px', color: '#64748b' }}>Email</label>
      <input style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="supplier@email.com" />
      <label style={{ fontSize: '12px', color: '#64748b' }}>Phone</label>
      <input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
      <label style={{ fontSize: '12px', color: '#64748b' }}>Address</label>
      <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }}
        value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
        placeholder="Full address..." />
    </>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Suppliers</h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '2px 0 0' }}>{suppliers.length} suppliers</p>
        </div>
        <button style={btnPrimary} onClick={() => { setForm(empty); setError(''); setShowAdd(true); }}>
          + Add Supplier
        </button>
      </div>

      {loading ? <p style={{ color: '#94a3b8' }}>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {suppliers.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No suppliers yet. Add one to get started.</p>
          ) : suppliers.map(s => (
            <div key={s.id} style={{
              background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: '#1e293b' }}>{s.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>ID #{s.id}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => { setForm({ name: s.name, email: s.email || '', phone: s.phone || '', address: s.address || '' }); setShowEdit(s); }}
                    style={{ background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(s.id)}
                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}>
                    Del
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
                {s.email && <div>✉ {s.email}</div>}
                {s.phone && <div>📞 {s.phone}</div>}
                {s.address && <div>📍 {s.address}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="Add Supplier" onClose={() => setShowAdd(false)}>
          <FormFields />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowAdd(false)} style={{ ...btnPrimary, background: '#f1f5f9', color: '#475569' }}>Cancel</button>
            <button onClick={handleAdd} style={btnPrimary}>Add Supplier</button>
          </div>
        </Modal>
      )}

      {showEdit && (
        <Modal title={`Edit: ${showEdit.name}`} onClose={() => setShowEdit(null)}>
          <FormFields />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowEdit(null)} style={{ ...btnPrimary, background: '#f1f5f9', color: '#475569' }}>Cancel</button>
            <button onClick={handleEdit} style={btnPrimary}>Save Changes</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
