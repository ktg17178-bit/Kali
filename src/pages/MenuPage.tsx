import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { dbService } from '../services/db';
import { useCart } from '../context/CartContext';
import { 
  Search, 
  Plus, 
  Check, 
  Clock, 
  X, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Crosshair, 
  Radio, 
  ShieldAlert,
  Binary,
  Layers,
  Sparkles,
  Download,
  Key
} from 'lucide-react';
import { Arsenal3DTheme } from '../components/Arsenal3DTheme';

interface MenuPageProps {
  onSelectTab: (tab: string) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onSelectTab }) => {
  const { addItem } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<MenuItem | null>(null);
  const [specialOnly, setSpecialOnly] = useState(false);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      const items = await dbService.getMenuItems();
      setMenuItems(items);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const categories = ['All', 'Offensive Tools', 'Defensive Ops', 'Zero-Day Labs', 'Hardware Security'];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSpecial = !specialOnly || item.is_special;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSpecial && matchesSearch;
  });

  const handleAddToCart = (item: MenuItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem(item, 1);
    setAddedMap(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [item.id]: false }));
    }, 1600);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Offensive Tools':
        return <Crosshair className="w-4 h-4 text-rose-400" />;
      case 'Defensive Ops':
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
      case 'Zero-Day Labs':
        return <Binary className="w-4 h-4 text-purple-400" />;
      case 'Hardware Security':
        return <Radio className="w-4 h-4 text-amber-400" />;
      default:
        return <Terminal className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Offensive Tools':
        return 'bg-rose-950/60 border-rose-500/30 text-rose-300';
      case 'Defensive Ops':
        return 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300';
      case 'Zero-Day Labs':
        return 'bg-purple-950/60 border-purple-500/30 text-purple-300';
      case 'Hardware Security':
        return 'bg-amber-950/60 border-amber-500/30 text-amber-300';
      default:
        return 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-mono">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs text-emerald-400 uppercase tracking-wider font-semibold">
          <Terminal className="w-4 h-4" />
          <span>KALI Red Team Repository</span>
          <span aria-hidden="true">·</span>
          <span>Open Cyber Arsenal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Community Arsenal & Products
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed font-sans">
          All audited offensive security toolkits, defense monitoring sensors, zero-day lab environments, and hardware testing rigs with dedicated 3D interactive Tesseract Vault visualization.
        </p>
      </div>

      {/* DISTINCT 3D THEME FOR PRODUCTS: 3D CYBER TESSERACT ARSENAL VAULT */}
      <Arsenal3DTheme activeCategory={selectedCategory} />

      {/* Filter and Search Bar */}
      <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/60 rounded-lg border border-emerald-500/20 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat !== 'All' && getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Metasploit, Ghidra, Flipper..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/70 border border-emerald-500/20 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Secondary Toggles */}
        <div className="flex items-center justify-between pt-3 border-t border-emerald-500/10 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSpecialOnly(!specialOnly)}
              className={`flex items-center gap-2 px-3 py-1 rounded border transition-all cursor-pointer ${
                specialOnly
                  ? 'bg-emerald-500/15 border-emerald-400 text-emerald-400 font-semibold'
                  : 'bg-black/30 border-zinc-800 text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Flagship Releases Only</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            Showing <strong className="text-white">{filteredItems.length}</strong> of {menuItems.length} weaponized modules
          </div>
        </div>
      </div>

      {/* Product / Arsenal Module Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest">Querying arsenal index...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-[#0b0f17] rounded-xl border border-emerald-500/20 space-y-3">
          <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No toolkits match your query</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
            Try adjusting your search terms or selecting a broader category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setSpecialOnly(false);
            }}
            className="px-4 py-2 bg-zinc-800 text-white rounded text-xs font-semibold hover:bg-zinc-700 cursor-pointer"
          >
            Reset Query
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedTool(item)}
              className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl overflow-hidden hover:border-emerald-400/60 transition-all flex flex-col group cursor-pointer shadow-lg hover:shadow-2xl relative"
            >
              {/* Tactical Cyber Blueprint Banner (Clean, high-tech, no culinary look) */}
              <div className="relative aspect-[16/9] overflow-hidden bg-black/90 p-4 flex flex-col justify-between border-b border-emerald-500/15">
                {/* Background matrix scanlines & blueprint grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                {/* Top Badge Strip */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 ${getCategoryBadgeClass(item.category)}`}>
                    {getCategoryIcon(item.category)}
                    <span>{item.category}</span>
                  </span>

                  <span className="font-mono text-sm font-bold text-white bg-black/80 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    ${item.price}
                  </span>
                </div>

                {/* Center Vector Schematics Icon */}
                <div className="relative z-10 flex items-center justify-center my-auto py-2">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-400 transition-all shadow-xl shadow-emerald-500/10">
                    {getCategoryIcon(item.category)}
                  </div>
                </div>

                {/* Bottom Blueprint Tag */}
                <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-500">
                  <span>ID: <strong className="text-slate-300">{item.id}</strong></span>
                  <span className="text-emerald-400 font-bold uppercase">{item.is_special ? '★ Critical Tier' : 'Audited Release'}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-sans">
                    {item.description}
                  </p>
                  {item.wine_pairing && (
                    <p className="text-[11px] text-cyan-300 font-mono flex items-center gap-1.5 mt-2.5">
                      <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">Env: {item.wine_pairing}</span>
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-emerald-500/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {item.prep_time || 'Instant'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.calories || 1024} KB</span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(item, e)}
                    className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      addedMap[item.id]
                        ? 'bg-emerald-500 text-black'
                        : 'bg-zinc-800 hover:bg-emerald-500 hover:text-black text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {addedMap[item.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Staged</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Stage</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedTool && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-mono"
          onClick={() => setSelectedTool(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#0b0f17] border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Banner */}
            <div className="relative p-6 bg-black/80 border-b border-emerald-500/20">
              <button
                onClick={() => setSelectedTool(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-900 text-white hover:bg-emerald-500 hover:text-black transition-colors cursor-pointer border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-start justify-between gap-4 pr-12">
                <div className="space-y-1">
                  <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5 ${getCategoryBadgeClass(selectedTool.category)}`}>
                    {getCategoryIcon(selectedTool.category)}
                    <span>{selectedTool.category}</span>
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white pt-1">
                    {selectedTool.name}
                  </h2>
                  <span className="text-[11px] text-slate-500">ID: {selectedTool.id} · Verified Release</span>
                </div>
                <span className="text-xl font-bold text-emerald-400 bg-black/80 px-3 py-1 rounded border border-emerald-500/30">
                  ${selectedTool.price}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {selectedTool.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-black/60 border border-emerald-500/20 text-xs">
                <div>
                  <span className="text-slate-500 block">Deploy / Initialization</span>
                  <span className="font-semibold text-slate-200">{selectedTool.prep_time || 'Instant Deploy'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Memory Footprint</span>
                  <span className="font-semibold text-slate-200">{selectedTool.calories || 1024} KB</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Execution Clearance</span>
                  <span className="font-semibold text-emerald-400">
                    {selectedTool.is_special ? 'Ring-0 / Elevated' : 'User Space / Sandbox'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                <Cpu className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-emerald-300">Environment Compatibility Matrix</span>
                  <p className="text-slate-300 mt-0.5 font-sans">
                    {selectedTool.wine_pairing || 'Pre-calibrated for Kali Linux Rolling 2026.1, Arch Linux x86_64, and isolated Docker container sandboxes.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    handleAddToCart(selectedTool);
                    setSelectedTool(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Stage in Loadout</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedTool(null);
                    onSelectTab('book');
                  }}
                  className="px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border border-zinc-700"
                >
                  Book Lab Pod
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
