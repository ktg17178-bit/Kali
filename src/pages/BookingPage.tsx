import React, { useState } from 'react';
import { dbService } from '../services/db';
import { Booking } from '../types';
import { Calendar, Users, Clock, Mail, Phone, User, CheckCircle2, ShieldCheck, AlertCircle, Terminal, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingPageProps {
  onSelectTab: (tab: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onSelectTab }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: todayStr,
    time: '19:00',
    guests: 2,
    seating_preference: 'Offensive Ops Sandbox',
    special_requests: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const seatingOptions = [
    { id: 'Offensive Ops Sandbox', label: 'Offensive Ops Sandbox', desc: 'Air-gapped dual-display station with dedicated 10Gbps switch and malware detonation VLAN' },
    { id: 'Hardware & RF Workbench', label: 'Hardware & RF Workbench', desc: 'Equipped with HackRF SDR, Rigol oscilloscope, logic analyzer and micro-soldering station' },
    { id: 'CTF Competition Pod', label: 'CTF Competition Pod', desc: 'Collaborative 4-seat war-room pod with isolated bridge and high-speed packet capture' },
    { id: 'Binary Reversing Suite', label: 'Binary Reversing Suite', desc: '64-core high-memory compute node with headless Ghidra, IDA Pro, and symbolic execution' }
  ];

  const timeSlots = [
    { time: '09:00', label: '09:00 AM (Morning Sprint)' },
    { time: '11:00', label: '11:00 AM (Mid-Day Session)' },
    { time: '13:30', label: '1:30 PM (Afternoon Sandbox)' },
    { time: '15:30', label: '3:30 PM (Hardware Session)' },
    { time: '17:30', label: '5:30 PM (Twilight Wargame)' },
    { time: '19:00', label: '7:00 PM (Prime War Room)' },
    { time: '20:30', label: '8:30 PM (Night CTF Sprint)' },
    { time: '22:00', label: '10:00 PM (Zero-Day Late Lab)' }
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please provide an operator handle or name (minimum 2 characters)';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid comms email address';
    }
    const phoneClean = formData.phone.replace(/[\s()-]/g, '');
    if (!phoneClean || phoneClean.length < 7) {
      newErrors.phone = 'Please provide a valid contact phone number';
    }
    if (!formData.date || formData.date < todayStr) {
      newErrors.date = 'Reservation date cannot be in the past';
    }
    if (formData.guests < 1 || formData.guests > 12) {
      newErrors.guests = 'Operator count must be between 1 and 12';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const newBooking = await dbService.createBooking({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests),
        seating_preference: formData.seating_preference,
        special_requests: formData.special_requests.trim()
      });
      setConfirmedBooking(newBooking);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.55 },
          colors: ['#10b981', '#00ff88', '#00f0ff', '#ffffff']
        });
      } catch {
        // fallback
      }
    } catch {
      setErrors({ form: 'An unexpected error occurred while scheduling lab pod. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      date: todayStr,
      time: '19:00',
      guests: 2,
      seating_preference: 'Offensive Ops Sandbox',
      special_requests: ''
    });
    setErrors({});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
          <Terminal className="w-4 h-4" />
          <span>KALI Lab Access Terminal</span>
          <span aria-hidden="true">·</span>
          <span>Station Dispatch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-mono font-bold text-white tracking-tight">
          Reserve Cyber Lab Workstation
        </h1>
        <p className="text-sm text-slate-400 font-light leading-relaxed">
          Book dedicated compute nodes, air-gapped VLANs, and hardware JTAG extraction benches. Stations are held for 15 minutes past check-in time with automated isolated environment provisioning.
        </p>
      </div>

      {confirmedBooking ? (
        <div className="bg-[#0b0f17] border border-emerald-500/40 rounded-2xl p-8 sm:p-12 shadow-2xl space-y-8 animate-in fade-in duration-500 text-white">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Lab Clearance Confirmed & Logged to DB
            </span>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white">
              Workstation Reserved Successfully
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              An encrypted confirmation voucher has been generated and recorded in the operations database.
            </p>
          </div>

          <div className="max-w-xl mx-auto bg-black/60 border border-emerald-500/20 rounded-xl p-6 sm:p-8 space-y-6 font-mono">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Dispatch Reference ID</span>
                <p className="text-xl font-bold text-emerald-400">{confirmedBooking.id}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Status</span>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  {confirmedBooking.status} (Confirmed)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Operator Handle</span>
                <span className="font-semibold text-white">{confirmedBooking.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Operator Seats</span>
                <span className="font-semibold text-white">{confirmedBooking.guests} Operators</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Scheduled Slot</span>
                <span className="font-semibold text-white">{confirmedBooking.date} at {confirmedBooking.time}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Selected Station</span>
                <span className="font-semibold text-white">{confirmedBooking.seating_preference}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Comms Email</span>
                <span className="font-semibold text-slate-300 truncate block">{confirmedBooking.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Emergency Contact</span>
                <span className="font-semibold text-slate-300">{confirmedBooking.phone}</span>
              </div>
            </div>

            {confirmedBooking.special_requests && (
              <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800 text-xs text-slate-300">
                <span className="text-slate-500 text-[11px] block mb-0.5 font-medium">Sandbox Directives:</span>
                "{confirmedBooking.special_requests}"
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onSelectTab('menu')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>Browse Arsenal to Stage Payload Kits</span>
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-slate-300 hover:text-white text-xs font-mono font-medium tracking-wider uppercase transition-all border border-zinc-700 cursor-pointer"
            >
              Reserve Another Pod
            </button>
            <button
              onClick={() => onSelectTab('admin')}
              className="text-xs font-mono text-emerald-400 hover:underline transition-colors cursor-pointer"
            >
              Inspect in Operations Center →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#0b0f17] border border-emerald-500/20 rounded-2xl p-6 sm:p-10 shadow-xl space-y-8">
          {errors.form && (
            <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* 1. Lab Pod Selection */}
          <div className="space-y-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              1. Select Lab Pod or Specialized Station
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {seatingOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, seating_preference: opt.id })}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    formData.seating_preference === opt.id
                      ? 'bg-emerald-950/50 border-emerald-400 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-black/50 border-zinc-800 hover:border-zinc-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-white">{opt.label}</span>
                    <Cpu className={`w-4 h-4 ${formData.seating_preference === opt.id ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Date, Time & Operators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-emerald-500/10">
            {/* Date */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Session Date</span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full bg-black/70 border rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 ${
                  errors.date ? 'border-rose-500' : 'border-zinc-800'
                }`}
              />
              {errors.date && <p className="text-[11px] text-rose-400 font-mono">{errors.date}</p>}
            </div>

            {/* Time Slot */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Time Slot</span>
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-black/70 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                {timeSlots.map((slot) => (
                  <option key={slot.time} value={slot.time} className="bg-zinc-900 text-white">
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Operators Count */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Operator Count (1-12)</span>
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })}
                className={`w-full bg-black/70 border rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 ${
                  errors.guests ? 'border-rose-500' : 'border-zinc-800'
                }`}
              />
              {errors.guests && <p className="text-[11px] text-rose-400 font-mono">{errors.guests}</p>}
            </div>
          </div>

          {/* 3. Operator Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-emerald-500/10">
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Operator Handle / Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex 'Cipher' Rivera"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full bg-black/70 border rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 ${
                  errors.name ? 'border-rose-500' : 'border-zinc-800'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-400 font-mono">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Comms Email</span>
              </label>
              <input
                type="email"
                placeholder="operator@security-ops.net"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full bg-black/70 border rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 ${
                  errors.email ? 'border-rose-500' : 'border-zinc-800'
                }`}
              />
              {errors.email && <p className="text-[11px] text-rose-400 font-mono">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Signal / Phone</span>
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full bg-black/70 border rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 ${
                  errors.phone ? 'border-rose-500' : 'border-zinc-800'
                }`}
              />
              {errors.phone && <p className="text-[11px] text-rose-400 font-mono">{errors.phone}</p>}
            </div>
          </div>

          {/* 4. Special Directives */}
          <div className="space-y-2 pt-4 border-t border-emerald-500/10">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
              Special Directives & Hardware Prerequisites (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Air-gapped VLAN switch required, USB pass-through for hardware token, or dedicated GPU for hash cracking..."
              value={formData.special_requests}
              onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
              className="w-full bg-black/70 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Provisioning Lab Pod...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Lab Workstation Reservation</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
