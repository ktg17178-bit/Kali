import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Terminal, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  onNavigateToMenu: () => void;
  onNavigateToBooking: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateToMenu, onNavigateToBooking }) => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total
  } = useCart();

  const [deploymentMode, setDeploymentMode] = useState<'sandbox' | 'offline'>('sandbox');
  const [targetHost, setTargetHost] = useState('');
  const [operatorHandle, setOperatorHandle] = useState('');
  const [orderCompleted, setOrderCompleted] = useState<{ id: string } | null>(null);

  if (!isOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `KALI-LOAD-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderCompleted({ id: orderId });
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#00ff88', '#00f0ff', '#ffffff']
      });
    } catch {
      // confetti fallback
    }
    clearCart();
  };

  const handleResetOrder = () => {
    setOrderCompleted(null);
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0b0f17] border-l border-emerald-500/20 text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Staged Arsenal Loadout</h2>
                <p className="text-[11px] text-slate-400">
                  {items.length} {items.length === 1 ? 'module' : 'modules'} queued for deployment
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {orderCompleted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                    Loadout Staged & Provisioned
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Ready for Deployment
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dispatch Token: <span className="text-emerald-400 font-bold">{orderCompleted.id}</span>
                  </p>
                </div>
                <p className="text-xs text-slate-400 font-sans max-w-xs leading-relaxed">
                  Your selected offensive kits and whitepapers have been isolated in an ephemeral sandbox container.
                </p>
                <div className="pt-2 flex flex-col gap-2 w-full">
                  <button
                    onClick={() => {
                      handleResetOrder();
                      onNavigateToBooking();
                    }}
                    className="w-full py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    Attach to Lab Pod Session
                  </button>
                  <button
                    onClick={handleResetOrder}
                    className="w-full py-2 rounded bg-zinc-900 border border-zinc-800 text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    Close Drawer
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-slate-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Loadout Staging Empty</h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    Browse the KALI community arsenal and stage offensive modules, reverse engineering kits, or CVE dossiers.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    onNavigateToMenu();
                  }}
                  className="px-5 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Explore Arsenal Toolkits
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* List Items */}
                <div className="space-y-3">
                  {items.map(({ menuItem, quantity }) => (
                    <div
                      key={menuItem.id}
                      className="p-3 rounded-lg bg-black/50 border border-emerald-500/20 flex gap-3 items-center justify-between"
                    >
                      <div className="w-12 h-12 rounded overflow-hidden bg-black shrink-0 border border-zinc-800">
                        <img
                          src={menuItem.image_url}
                          alt={menuItem.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{menuItem.name}</h4>
                        <span className="text-[10px] text-emerald-400 block">${menuItem.price} · {menuItem.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                          className="w-6 h-6 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-300 flex items-center justify-center text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center text-white">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                          className="w-6 h-6 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-300 flex items-center justify-center text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(menuItem.id)}
                          className="w-6 h-6 rounded text-slate-500 hover:text-rose-400 flex items-center justify-center ml-1"
                          title="Remove module"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Deployment Options */}
                <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-emerald-500/15">
                  <div className="grid grid-cols-2 p-1 bg-black/60 rounded border border-zinc-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setDeploymentMode('sandbox')}
                      className={`py-1.5 rounded text-[11px] font-bold ${
                        deploymentMode === 'sandbox' ? 'bg-emerald-500 text-black' : 'text-slate-400'
                      }`}
                    >
                      Lab Sandbox Node
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeploymentMode('offline')}
                      className={`py-1.5 rounded text-[11px] font-bold ${
                        deploymentMode === 'offline' ? 'bg-emerald-500 text-black' : 'text-slate-400'
                      }`}
                    >
                      Offline Payload Pack
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">Operator Handle</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cipher_99"
                      value={operatorHandle}
                      onChange={(e) => setOperatorHandle(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">Target Host / Subnet Range</label>
                    <input
                      type="text"
                      placeholder="e.g. 10.10.11.0/24 or Station #A1"
                      value={targetHost}
                      onChange={(e) => setTargetHost(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Summary Totals */}
                  <div className="p-3 rounded bg-black/50 border border-zinc-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Module Subtotal:</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Lab Compute Allocation (10%):</span>
                      <span className="text-white">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-white pt-1.5 border-t border-zinc-800">
                      <span>Total Allocation:</span>
                      <span className="text-emerald-400">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Deploy & Stage Loadout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
