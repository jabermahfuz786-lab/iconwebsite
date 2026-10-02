import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Save, AlertCircle, Search, ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

type FormData = {
  title: string;
  description: string;
  price: string;
  image_url: string;
};

const emptyForm: FormData = { title: '', description: '', price: '', image_url: '' };

export default function ContentAdminPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setItems((data || []) as ContentItem[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: ContentItem) => {
    setForm({
      title: item.title,
      description: item.description || '',
      price: item.price != null ? String(item.price) : '',
      image_url: item.image_url || '',
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    setSaving(true);
    setError('');

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      price: form.price ? parseFloat(form.price) : null,
      image_url: form.image_url.trim() || null,
    };

    try {
      if (editingId) {
        const { error: err } = await supabase
          .from('content')
          .update(payload)
          .eq('id', editingId);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('content')
          .insert([payload]);
        if (err) throw err;
      }
      closeForm();
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError('');
    try {
      const { error: err } = await supabase.from('content').delete().eq('id', id);
      if (err) throw err;
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item.');
    }
    setDeletingId(null);
  };

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    (i.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (price: number | null) => {
    if (price == null) return '—';
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="pt-24 pb-20 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: '#FFC300' }}>
              Content Manager
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Add, edit, and delete items from the content table.
            </p>
          </div>
          <button
            onClick={openAdd}
            className="ca-btn-primary inline-flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {error && (
          <div className="ca-error mb-4 flex items-start gap-2 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto opacity-50 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search */}
        <div className="ca-search-wrap mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,195,0,0.5)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or description..."
            className="ca-search-input"
          />
        </div>

        {/* Items grid */}
        {loading ? (
          <div className="ca-card h-48 skeleton" />
        ) : filtered.length === 0 ? (
          <div className="ca-card p-10 text-center">
            <ImageIcon className="w-12 h-12 mx-auto mb-3" style={{ color: 'rgba(255,195,0,0.3)' }} />
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>
              {search ? 'No items match your search.' : 'No items yet. Click "Add Item" to create one.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="ca-card overflow-hidden flex flex-col">
                {/* Image */}
                <div className="h-40 flex items-center justify-center shrink-0" style={{ background: '#0F1A35' }}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-10 h-10" style={{ color: 'rgba(255,195,0,0.2)' }} />
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-base mb-1" style={{ color: '#FFFFFF' }}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <span className="ca-price">{formatPrice(item.price)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="ca-icon-btn"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="ca-icon-btn ca-icon-btn-danger"
                        title="Delete"
                      >
                        {deletingId === item.id ? (
                          <span className="block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
          <div className="ca-modal w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#FFC300' }}>
                {editingId ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button onClick={closeForm} className="ca-close-btn">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="ca-label">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="ca-input"
                  placeholder="Item title"
                />
              </div>

              <div>
                <label className="ca-label">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="ca-input"
                  placeholder="Item description (optional)"
                />
              </div>

              <div>
                <label className="ca-label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="ca-input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="ca-label">Image URL</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="ca-input"
                  placeholder="https://example.com/image.jpg"
                />
                {form.image_url && (
                  <div className="mt-2 h-28 rounded-lg overflow-hidden" style={{ background: '#0F1A35' }}>
                    <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="ca-btn-primary flex-1 inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <span className="block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> {editingId ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
                <button type="button" onClick={closeForm} className="ca-btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
