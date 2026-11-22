import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Wifi, Radio, Terminal, Zap, ShieldAlert, Cpu, Activity, Play, Pause, Layers } from 'lucide-react';

export const BottomWifiHacking3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [attackMode, setAttackMode] = useState<'sniff' | 'deauth' | 'eviltwin' | 'pmkid'>('sniff');
  const [packetRate, setPacketRate] = useState(840);
  const [handshakeFound, setHandshakeFound] = useState(false);
  const [selectedAP, setSelectedAP] = useState('CORP_NET_5G [CH 36]');

  // Live 802.11 Wi-Fi frames stream
  const [frames, setFrames] = useState([
    { id: 1, type: 'BEACON', bssid: 'F4:F2:6D:88:91:AA', ssid: 'CORP_NET_5G', ch: 36, pwr: '-41 dBm', enc: 'WPA2' },
    { id: 2, type: 'PROBE_REQ', bssid: 'Broadcast', ssid: 'CORP_NET_5G', ch: 36, pwr: '-55 dBm', enc: '—' },
    { id: 3, type: 'DEAUTH', bssid: 'F4:F2:6D:88:91:AA', ssid: 'Deauth Reason: 0x07', ch: 36, pwr: '-40 dBm', enc: 'ATTACK' },
    { id: 4, type: 'EAPOL M1', bssid: 'F4:F2:6D:88:91:AA', ssid: 'Anonce Sent -> STA', ch: 36, pwr: '-42 dBm', enc: 'EAPOL' },
    { id: 5, type: 'EAPOL M2', bssid: 'A8:5E:45:90:12:F3', ssid: 'Snonce + MIC Validated', ch: 36, pwr: '-48 dBm', enc: 'EAPOL' }
  ]);

  // Hex dump stream
  const [hexDump, setHexDump] = useState([
    '0000   80 00 00 00 ff ff ff ff ff ff f4 f2 6d 88 91 aa   ................',
    '0010   f4 f2 6d 88 91 aa 80 d1 b8 59 18 20 00 00 00 00   ...Y. ..........',
    '0020   64 00 11 04 00 0b 43 4f 52 50 5f 4e 45 54 5f 35   d.....CORP_NET_5',
    '0030   30 14 01 00 00 0f ac 04 01 00 00 0f ac 04 01 00   0...............'
  ]);

  // 3D Three.js Wi-Fi Waterfall & RF Surface
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a0f, 0.02);

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 8, 22);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 1. 3D Wi-Fi RF SPECTRUM WATERFALL (Plane geometry with undulating peaks)
    const gridX = 40;
    const gridZ = 30;
    const spectrumGeom = new THREE.PlaneGeometry(36, 24, gridX, gridZ);
    spectrumGeom.rotateX(-Math.PI / 2.2);

    const spectrumMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });

    const spectrumMesh = new THREE.Mesh(spectrumGeom, spectrumMat);
    scene.add(spectrumMesh);

    // 2. 3D Wi-Fi Channel Pillars (representing Ch 1, Ch 6, Ch 11, Ch 36, Ch 149)
    const channelPillars: THREE.Mesh[] = [];
    const channels = [
      { name: 'CH 1 (2.412G)', x: -12, color: 0x059669 },
      { name: 'CH 6 (2.437G)', x: -6, color: 0x10b981 },
      { name: 'CH 11 (2.462G)', x: 0, color: 0x34d399 },
      { name: 'CH 36 (5.180G)', x: 6, color: 0x00f0ff },
      { name: 'CH 149 (5.745G)', x: 12, color: 0x0284c7 }
    ];

    channels.forEach((ch, idx) => {
      const geom = new THREE.BoxGeometry(1.2, 4.5 + (idx % 2) * 2, 1.2);
      const wireMat = new THREE.MeshBasicMaterial({
        color: ch.color,
        wireframe: true,
        transparent: true,
        opacity: 0.75
      });
      const mesh = new THREE.Mesh(geom, wireMat);
      mesh.position.set(ch.x, 2, -2);
      scene.add(mesh);
      channelPillars.push(mesh);
    });

    // 3. 3D Airborne Wi-Fi Packet Particles (Floating packet headers)
    const packetCount = 450;
    const packetPositions = new Float32Array(packetCount * 3);
    const packetColors = new Float32Array(packetCount * 3);

    for (let i = 0; i < packetCount; i++) {
      packetPositions[i * 3] = (Math.random() - 0.5) * 36;
      packetPositions[i * 3 + 1] = Math.random() * 8;
      packetPositions[i * 3 + 2] = (Math.random() - 0.5) * 24;

      const isBeacon = Math.random() > 0.5;
      packetColors[i * 3] = isBeacon ? 0.06 : 0.0;
      packetColors[i * 3 + 1] = isBeacon ? 0.95 : 0.94;
      packetColors[i * 3 + 2] = isBeacon ? 0.5 : 1.0;
    }

    const packetGeom = new THREE.BufferGeometry();
    packetGeom.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));
    packetGeom.setAttribute('color', new THREE.BufferAttribute(packetColors, 3));

    const packetMat = new THREE.PointsMaterial({
      size: 0.55,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const packetPoints = new THREE.Points(packetGeom, packetMat);
    scene.add(packetPoints);

    // 4. Mouse interaction
    let mouseX = 0;
    let targetMouseX = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouseX = normX * 4;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 5. Animation loop
    let frameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const delta = clock.getDelta();

      mouseX += (targetMouseX - mouseX) * 0.05;
      camera.position.x = mouseX;
      camera.lookAt(0, 1, 0);

      // Deform spectrum terrain with RF waves
      const pos = spectrumGeom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        // Wi-Fi RF carrier frequency wave equation
        const wave = Math.sin(u * 0.4 + time * 3) * Math.cos(v * 0.3 + time * 2) * 1.6;
        pos.setZ(i, wave);
      }
      pos.needsUpdate = true;

      // Pulse channel pillars
      channelPillars.forEach((pillar, i) => {
        const scaleY = 1 + Math.sin(time * 3 + i) * 0.25;
        pillar.scale.y = scaleY;
      });

      // Float packet particles upwards like a wireless data stream
      const pPos = packetGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < packetCount; i++) {
        pPos[i * 3 + 1] += 0.04;
        if (pPos[i * 3 + 1] > 10) {
          pPos[i * 3 + 1] = 0;
          pPos[i * 3] = (Math.random() - 0.5) * 36;
        }
      }
      packetGeom.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      spectrumGeom.dispose();
      spectrumMat.dispose();
      channelPillars.forEach(p => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });
      packetGeom.dispose();
      packetMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Frame ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setPacketRate(prev => Math.floor(780 + Math.random() * 220));
      // Rotate hex dump
      const randomByte = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
      const newHex = `00${Math.floor(Math.random() * 90 + 10)}   ${randomByte()} ${randomByte()} ${randomByte()} ${randomByte()} ${randomByte()} ${randomByte()} ${randomByte()} ${randomByte()} ${randomByte()} ${randomByte()} ${randomByte()} ${randomByte()} ${randomByte()} ${randomByte()} ${randomByte()} ${randomByte()}   ...802.11.FRAME...`;
      setHexDump(prev => [...prev.slice(1), newHex]);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  const triggerAttack = (mode: 'sniff' | 'deauth' | 'eviltwin' | 'pmkid') => {
    setAttackMode(mode);
    if (mode === 'deauth') {
      setHandshakeFound(true);
    }
  };

  return (
    <section className="w-full bg-[#05080e] border-t border-emerald-500/25 relative font-mono text-xs overflow-hidden select-none">
      {/* Top Banner Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Radio className="w-4 h-4 text-emerald-400" />
              <span className="font-bold tracking-wider uppercase text-sm">
                3D IEEE 802.11 WI-FI SPECTRUM & AIRCRACK WORKSTATION
              </span>
            </div>
            <p className="text-slate-400 text-xs font-sans">
              Real-time 3D radio frequency waterfall, packet injection simulator, and WPA2/WPA3 4-way handshake sniffer.
            </p>
          </div>

          {/* Real-time Telemetry Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3 py-1.5 rounded bg-black/60 border border-emerald-500/30 text-[11px] text-slate-300">
              PACKET RATE: <strong className="text-emerald-400">{packetRate} pkts/sec</strong>
            </div>
            <div className="px-3 py-1.5 rounded bg-black/60 border border-cyan-500/30 text-[11px] text-slate-300">
              INTERCEPT: <strong className="text-cyan-400">mon0 [RF INJECTION ENABLED]</strong>
            </div>
          </div>
        </div>

        {/* 3D Attack Mode Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase text-slate-400 mr-1">3D Offensive Vector:</span>
            <button
              onClick={() => triggerAttack('sniff')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                attackMode === 'sniff'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-zinc-900 border border-zinc-700 text-slate-300 hover:text-white'
              }`}
            >
              1. Airodump RF Sniff
            </button>
            <button
              onClick={() => triggerAttack('deauth')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                attackMode === 'deauth'
                  ? 'bg-rose-500 text-white shadow-md animate-pulse'
                  : 'bg-zinc-900 border border-zinc-700 text-slate-300 hover:text-white'
              }`}
            >
              2. Aireplay Deauth Blast
            </button>
            <button
              onClick={() => triggerAttack('eviltwin')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                attackMode === 'eviltwin'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-zinc-900 border border-zinc-700 text-slate-300 hover:text-white'
              }`}
            >
              3. Rogue AP Evil Twin
            </button>
            <button
              onClick={() => triggerAttack('pmkid')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                attackMode === 'pmkid'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'bg-zinc-900 border border-zinc-700 text-slate-300 hover:text-white'
              }`}
            >
              4. Clientless PMKID Dump
            </button>
          </div>

          <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive 3D Waveform Active</span>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative w-full h-[320px] rounded-2xl bg-black/60 border border-emerald-500/30 overflow-hidden shadow-2xl">
          {/* Canvas Mount */}
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Overlay Channel Legends */}
          <div className="absolute top-4 left-4 z-10 bg-[#05080e]/85 backdrop-blur-md border border-emerald-500/30 rounded-xl p-3 space-y-1 text-[11px]">
            <div className="flex items-center gap-2 text-white font-bold uppercase">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Access Points In Range</span>
            </div>
            <div className="text-slate-400 space-y-0.5 pt-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-emerald-400 font-semibold">• CORP_NET_5G [CH 36]</span>
                <span className="text-slate-500">-41 dBm</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-cyan-400 font-semibold">• KALI_IOT_MESH [CH 6]</span>
                <span className="text-slate-500">-48 dBm</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300 font-semibold">• LAB_SANDBOX_GUEST [CH 1]</span>
                <span className="text-slate-500">-62 dBm</span>
              </div>
            </div>
          </div>

          {/* Bottom Right 3D Overlay Tooltip */}
          <div className="absolute bottom-4 right-4 z-10 bg-[#05080e]/90 backdrop-blur-md border border-emerald-500/30 rounded-xl px-3 py-2 text-[10px] text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>3D Spectrogram: 2.4GHz (Ch 1-11) & 5.8GHz (Ch 36-149)</span>
          </div>
        </div>
      </div>

      {/* Live Dissected Wi-Fi Frames & Hexadecimal Buffer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Box 1: Live Captured 802.11 Frame Table */}
          <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Captured 802.11 Frames (Wireshark/TShark Stream)</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                PROMISCUOUS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead className="text-[10px] text-slate-500 uppercase border-b border-zinc-800">
                  <tr>
                    <th className="pb-2">Frame</th>
                    <th className="pb-2">BSSID</th>
                    <th className="pb-2">Payload / SSID</th>
                    <th className="pb-2">CH</th>
                    <th className="pb-2">PWR</th>
                    <th className="pb-2">ENC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {frames.map(f => (
                    <tr key={f.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-1.5 font-bold text-cyan-400">{f.type}</td>
                      <td className="py-1.5 font-mono text-slate-400">{f.bssid}</td>
                      <td className="py-1.5 text-white">{f.ssid}</td>
                      <td className="py-1.5 text-emerald-400">{f.ch}</td>
                      <td className="py-1.5 text-slate-400">{f.pwr}</td>
                      <td className="py-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          f.enc === 'ATTACK'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : f.enc === 'EAPOL'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-slate-300'
                        }`}>
                          {f.enc}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Box 2: Live Raw Hexadecimal Decryption Matrix */}
          <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Hexadecimal Radio Packet Payload Dissector</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">
                MIC: VALID [0x8f4d9c]
              </span>
            </div>

            <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 text-[11px] font-mono text-emerald-400 space-y-1 overflow-x-auto leading-relaxed">
              {hexDump.map((hex, idx) => (
                <div key={idx} className="whitespace-pre">{hex}</div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>WPA Key Exchange: <strong className="text-white">HMAC-SHA1-128 / AES-CCMP</strong></span>
              <span className="text-emerald-400">STATUS: RECOVERED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
