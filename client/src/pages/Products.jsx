import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

const API = 'http://localhost:5000/api';

const emptyForm = { name: '', barcode: '', quantity: 0, low_stock_threshold: 10, supplier_id: '' };

export default function Products() {
  const [products, setProducts]   = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showAdd, setShowAdd]     = useState(false);
  const [showEdit, setShowEdit]   = useState(null);
  const [showStock, setShowStock] = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [stockQty, setStockQty]   = useState(1);
  const [stockNote, setStockNote] = useState('');
  const [search, setSearch]       = useState('');
  const [error, setError]         = useState('');

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      axios.get(`${API}/products`),
      axios.get(`${API}/suppliers`)
    ]).then(([p, s]) => {
      setProducts(p.data);
      setSuppliers(s.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAddSubmit = async () => {
    if (!form.name.trim()) return setError('Product name is required');
    try {
      await axios.post(`${API}/products`, form);
      setShowAdd(false);
      setForm(emptyForm);
      setError('');
      fetchAll();
    } catch (e) { setError(e.response?.data?.error || 'Error adding product'); }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${API}/products/${showEdit.id}`, form);
      setShowEdit(null);
      setForm(emptyForm);
      fetchAll();
    } catch (e) { setError(e.response?.data?.error || 'Error updating product'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`${API}/products/${id}`);
    fetchAll();
  };

  const handleStockMove = async () => {
    try {
      await axios.post(`${API}/logs/${showStock.type}`, {
        product_id: showStock.product.id,
        quantity: Number(stockQty),
        note: stockNote
      });
      setShowStock(null);
      setStockQty(1);
      setStockNote('');
      fetchAll();
    } catch (e) { alert(e.response?.data?.error || 'Error'); }
  };

  const openEdit = (p) => {
    setForm({ name: p.name, barcode: p.barcode || '', quantity: p.quantity, low_stock_threshold: p.low_stock_threshold, supplier_id: p.supplier_id || '' });
    setShowEdit(p);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.barcode && p.barcode.includes(search))
  );

  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '8px',
    border: '1px solid #e2e8f0', fontSize: '14px', marginBottom: '12px', outline: 'none'
  };
  const btnPrimary = {
    background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px',
    padding: '8px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
  };
  const btnDanger = {
    background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
    borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer'
  };
  const btnGreen = {
    background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
    borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', marginRight: '4px'
  };
  const btnAmber = {
    background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a',
    borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', marginRight: '4px'
  };
  const btnEdit = {
    background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe',
    borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', marginRight: '4px'
  };

  const FormFields = () => (
    <>
      {error && <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '10px' }}>{error}</div>}
      <label style={{ fontSize: '12px', color: '#64748b' }}>Product Name *</label>
      <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Laptop" />
      <label style={{ fontSize: '12px', color: '#64748b' }}>Barcode</label>
      <input style={inputStyle} value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} placeholder="Scan or type barcode" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#64748b' }}>Quantity</label>
          <input type="number" style={inputStyle} value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} min="0" />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#64748b' }}>Low Stock Alert At</label>
          <input type="number" style={inputStyle} value={form.low_stock_threshold} onChange={e => setForm({ ...form, low_stock_threshold: Number(e.target.value) })} min="0" />
        </div>
      </div>
      <label style={{ fontSize: '12px', color: '#64748b' }}>Supplier</label>
      <select style={inputStyle} value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: e.target.value })}>
        <option value="">-- Select Supplier --</option>
        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
    </>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Products</h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '2px 0 0' }}>{products.length} total items</p>
        </div>
        <button style={btnPrimary} onClick={() => { setForm(emptyForm); setError(''); setShowAdd(true); }}>
          + Add Product
        </button>
      </div>

      {/* Search */}
      <input style={{ ...inputStyle, marginBottom: '16px', maxWidth: '320px' }}
        placeholder="🔍  Search by name or barcode..."
        value={search} onChange={e => setSearch(e.target.value)} />

      {/* Table */}
      {loading ? <p style={{ color: '#94a3b8' }}>Loading...</p> : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['ID', 'Name', 'Barcode', 'Qty', 'Alert At', 'Supplier', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '12px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No products found</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', color: '#94a3b8' }}>#{p.id}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 500, color: '#1e293b' }}>{p.name}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontFamily: 'monospace' }}>{p.barcode || '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      fontWeight: 700, fontSize: '14px',
                      color: p.quantity <= p.low_stock_threshold ? '#dc2626' : '#16a34a'
                    }}>{p.quantity}</span>
                    {p.quantity <= p.low_stock_threshold && (
                      <span style={{ marginLeft: '6px', fontSize: '10px', background: '#fef2f2', color: '#dc2626', padding: '2px 6px', borderRadius: '999px', fontWeight: 600 }}>LOW</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>{p.low_stock_threshold}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>{p.supplier_name || '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <button style={btnGreen} onClick={() => setShowStock({ product: p, type: 'in' })}>+ In</button>
                    <button style={btnAmber} onClick={() => setShowStock({ product: p, type: 'out' })}>- Out</button>
                    <button style={btnEdit} onClick={() => openEdit(p)}>Edit</button>
                    <button style={btnDanger} onClick={() => handleDelete(p.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Add New Product" onClose={() => setShowAdd(false)}>
          <FormFields />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowAdd(false)} style={{ ...btnPrimary, background: '#f1f5f9', color: '#475569' }}>Cancel</button>
            <button onClick={handleAddSubmit} style={btnPrimary}>Add Product</button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <Modal title={`Edit: ${showEdit.name}`} onClose={() => setShowEdit(null)}>
          <FormFields />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowEdit(null)} style={{ ...btnPrimary, background: '#f1f5f9', color: '#475569' }}>Cancel</button>
            <button onClick={handleEditSubmit} style={btnPrimary}>Save Changes</button>
          </div>
        </Modal>
      )}

      {/* Stock In/Out Modal */}
      {showStock && (
        <Modal
          title={`Stock ${showStock.type === 'in' ? 'In ➕' : 'Out ➖'} — ${showStock.product.name}`}
          onClose={() => setShowStock(null)}>
          <label style={{ fontSize: '12px', color: '#64748b' }}>Quantity</label>
          <input type="number" min="1" style={{ ...inputStyle }} value={stockQty}
            onChange={e => setStockQty(e.target.value)} />
          <label style={{ fontSize: '12px', color: '#64748b' }}>Note (optional)</label>
          <input style={inputStyle} value={stockNote} onChange={e => setStockNote(e.target.value)} placeholder="e.g. Received from supplier" />
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px' }}>
            Current stock: <strong>{showStock.product.quantity}</strong>
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowStock(null)} style={{ ...btnPrimary, background: '#f1f5f9', color: '#475569' }}>Cancel</button>
            <button onClick={handleStockMove}
              style={{ ...btnPrimary, background: showStock.type === 'in' ? '#16a34a' : '#d97706' }}>
              Confirm {showStock.type === 'in' ? 'Stock In' : 'Stock Out'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}