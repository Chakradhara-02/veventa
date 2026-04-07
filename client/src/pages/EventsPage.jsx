import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { trpc } from '../lib/trpc';
import EventCard from '../components/EventCard';

const CATEGORIES = [
  'Technology', 'Music', 'Business', 'Sports', 'Art', 'Education', 'Lifestyle', 'Food'
];

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [teamFilter, setTeamFilter] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const eventsQuery = trpc.events.list.useQuery({
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    search: search || undefined,
  });

  const events = eventsQuery.data?.events || [];

  const filtered = useMemo(() => {
    let list = [...events];

    if (priceFilter === 'free') list = list.filter(e => e.price.type === 'free');
    if (priceFilter === 'paid') list = list.filter(e => e.price.type === 'paid');

    if (teamFilter === 'team') list = list.filter(e => e.isTeamEvent);
    if (teamFilter === 'solo') list = list.filter(e => !e.isTeamEvent);

    if (sortBy === 'date') list.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === 'popular') list.sort((a, b) => b.registered - a.registered);
    if (sortBy === 'price-low') list.sort((a, b) => (a.price.amount || 0) - (b.price.amount || 0));

    return list;
  }, [events, priceFilter, sortBy, teamFilter]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setPriceFilter('all');
    setSortBy('date');
    setTeamFilter('all');
  };

  const hasFilters = search || selectedCategory !== 'All' || priceFilter !== 'all' || teamFilter !== 'all';

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-deep)', padding: '32px 24px', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Discover Events
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Find your next unforgettable experience</p>
        </div>

        {/* Search + filter bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="events-search"
              type="text"
              className="input-field"
              style={{ paddingLeft: '42px' }}
              placeholder="Search events, venues, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <select
              id="events-sort"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="input-field"
              style={{ paddingRight: '32px', minWidth: '150px', appearance: 'none', cursor: 'pointer' }}
            >
              <option value="date">Sort: Upcoming</option>
              <option value="popular">Sort: Popular</option>
              <option value="price-low">Sort: Price Low</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          </div>

          <button
            id="events-filter-toggle"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={filtersOpen ? 'btn-primary' : 'btn-outline'}
            style={{ padding: '10px 16px', gap: '8px' }}
          >
            <SlidersHorizontal size={16} /> Filters {hasFilters && '•'}
          </button>

          {hasFilters && (
            <button className="btn-outline" style={{ padding: '10px 14px' }} onClick={clearFilters}>
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['All', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 16px',
                borderRadius: '999px',
                whiteSpace: 'nowrap',
                background: selectedCategory === cat ? 'linear-gradient(135deg, var(--primary-light), var(--accent))' : 'var(--bg-hover)',
                border: `1px solid ${selectedCategory === cat ? 'transparent' : 'var(--border-light)'}`,
                color: selectedCategory === cat ? '#F0F9FF' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.25s',
                flexShrink: 0,
                boxShadow: selectedCategory === cat ? '0 4px 12px rgba(14,165,233,0.25)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Advanced filters panel */}
        {filtersOpen && (
          <div className="glass-card" style={{
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            animation: 'scaleIn 0.2s ease',
          }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px' }}>Price</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[['all','All'],['free','Free'],['paid','Paid']].map(([val, label]) => (
                  <button key={val} onClick={() => setPriceFilter(val)} style={{
                    padding: '6px 14px', borderRadius: '10px',
                    background: priceFilter === val ? 'var(--primary)' : 'var(--bg-hover)',
                    border: `1px solid ${priceFilter === val ? 'transparent' : 'var(--border-light)'}`,
                    color: priceFilter === val ? '#FFF' : 'var(--text-muted)',
                    fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.25s',
                  }}>{label}</button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px' }}>Event Type</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[['all','All'],['team','Team Events'],['solo','Solo Events']].map(([val, label]) => (
                  <button key={val} onClick={() => setTeamFilter(val)} style={{
                    padding: '6px 14px', borderRadius: '10px',
                    background: teamFilter === val ? 'var(--primary)' : 'var(--bg-hover)',
                    border: `1px solid ${teamFilter === val ? 'transparent' : 'var(--border-light)'}`,
                    color: teamFilter === val ? '#FFF' : 'var(--text-muted)',
                    fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.25s',
                  }}>{label}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Showing <strong style={{ color: 'var(--primary)' }}>{filtered.length}</strong> events
        </p>

        {/* Grid */}
        {eventsQuery.isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading events...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No events found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search terms</p>
            <button className="btn-outline" style={{ marginTop: '16px' }} onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {filtered.map(event => (
              <EventCard key={event.id || event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
