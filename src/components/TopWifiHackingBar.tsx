import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Wifi, Radio, Terminal, ShieldAlert, Cpu, Zap, RefreshCw, Play, CheckCircle2 } from 'lucide-react';

export const TopWifiHackingBar: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeChannel, setActiveChannel] = useState(6);
  const [isDeauthing, setIsDeauthing] = useState(false);
  const [handshakeCaptured, setHandshakeCaptured] = useState(true);
  const [ivCount, setIvCount] = useState(14820);
  const [crackStatus, setCrackStatus] = useState<'idle' | 'cracking' | 'cracked'>('cracking');
  const [crackedKey, setCrackedKey] = useState<string | null>(null);

  // Terminal log lines
  const [logs, setLogs] = useState<string[]>([
    '[+] airmon-ng: interface wlan0mon created in monitor mode on 2.4GHz/5GHz',
    '[+] airodump-ng: channel hopping 1..14, detecting 9 AP beacons',
    '[*] BSSID: [7C:B0:C2:59:E1:4A]  PWR: -38dBm  CH: 6  ENC: WPA2 CCMP  ESSID: "TARGET_CORP_WIFI"',
    '[*] STATION: [A8:5E:45:90:12:F3] linked to BSSID [7C:B0:C2:59:E1:4A]',
    '[!] Injected 16 IEEE 802.11 Deauth broadcast frames on Ch 6',
    '[+] WPA 4-WAY HANDSHAKE CAPTURED: EAPOL-Key M1/M2/M3/M4 verified (MIC OK)',
    '[*] aircrack-ng: loading dictionary wordlist /usr/share/wordlists/rockyou.txt (14,344,392 words)',
    '[*] GPU Hashcat Hash Mode 22000 (WPA-PBKDF2-PMKID/EAPOL) @ 412.5 kH/s'
  ]);

  // Three.js 3D Wi-Fi Radar & Signal Waves
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 3, 11);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 1. Central 3D Wi-Fi AP Tower (Cylinder & Sphere)
    const apGroup = new THREE.Group();
    scene.add(apGroup);

    const poleGeom = new THREE.CylinderGeometry(0.12, 0.2, 2.5, 12);
    const poleMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true });
    const pole = new THREE.Mesh(poleGeom, poleMat);
    pole.position.y = 0.5;
    apGroup.add(pole);

    const emitterGeom = new THREE.IcosahedronGeometry(0.5, 1);
    const emitterMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
    const emitter = new THREE.Mesh(emitterGeom, emitterMat);
    emitter.position.y = 1.9;
    apGroup.add(emitter);

    // 2. Concentric 3D Wi-Fi Wave Rings radiating outwards
    const ringCount = 5;
    const waveRings: THREE.LineLoop[] = [];
    const ringSpeeds: number[] = [];

    for (let i = 0; i < ringCount; i++) {
      const ringGeom = new THREE.BufferGeometry();
      const segments = 48;
      const positions = new Float32Array(segments * 3);
      const initialRadius = (i + 1) * 1.1;

      for (let j = 0; j < segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        positions[j * 3] = Math.cos(angle) * initialRadius;
        positions[j * 3 + 1] = 0;
        positions[j * 3 + 2] = Math.sin(angle) * initialRadius;
      }
      ringGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const ringMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x10b981 : 0x00f0ff,
        transparent: true,
        opacity: 0.6
      });
      const ring = new THREE.LineLoop(ringGeom, ringMat);
      ring.position.y = 1.9;
      scene.add(ring);
      waveRings.push(ring);
      ringSpeeds.push(0.04 + i * 0.005);
    }

    // 3. 3D Target Client Nodes orbiting
    const clientsGroup = new THREE.Group();
    scene.add(clientsGroup);

    const clientGeom = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const clientMat = new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true });

    const client1 = new THREE.Mesh(clientGeom, clientMat);
    client1.position.set(-3.5, 1.2, 1.5);
    const client2 = new THREE.Mesh(clientGeom, clientMat);
    client2.position.set(3.2, 0.8, -2);
    clientsGroup.add(client1, client2);

    // Connecting 3D beam lines (Data packet flow)
    const beamMat = new THREE.LineDashedMaterial({
      color: 0x00f0ff,
      dashSize: 0.3,
      gapSize: 0.15,
      transparent: true,
      opacity: 0.75
    });

    const beamGeom1 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.9, 0),
      client1.position
    ]);
    const beam1 = new THREE.Line(beamGeom1, beamMat);
    beam1.computeLineDistances();
    scene.add(beam1);

    const beamGeom2 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.9, 0),
      client2.position
    ]);
    const beam2 = new THREE.Line(beamGeom2, beamMat);
    beam2.computeLineDistances();
    scene.add(beam2);

    // 4. Animation loop
    let frameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Spin AP emitter
      emitter.rotation.y += delta * 1.5;
      emitter.rotation.x += delta * 0.8;
      pole.rotation.y += delta * 0.2;

      // Expand wave rings
      waveRings.forEach((ring, idx) => {
        ring.scale.x += delta * 0.8;
        ring.scale.z += delta * 0.8;
        const mat = ring.material as THREE.LineBasicMaterial;
        mat.opacity = Math.max(0, 0.8 - (ring.scale.x * 0.25));

        if (ring.scale.x > 3.2) {
          ring.scale.set(0.2, 1, 0.2);
          mat.opacity = 0.8;
        }
      });

      // Subtle client float
      client1.position.y = 1.2 + Math.sin(time * 2) * 0.2;
      client2.position.y = 0.8 + Math.cos(time * 2) * 0.2;

      // Rotate whole client scene slightly
      clientsGroup.rotation.y = Math.sin(time * 0.5) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      poleGeom.dispose();
      poleMat.dispose();
      emitterGeom.dispose();
      emitterMat.dispose();
      clientGeom.dispose();
      clientMat.dispose();
      beamGeom1.dispose();
      beamGeom2.dispose();
      beamMat.dispose();
      waveRings.forEach(r => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Periodic IV count and live logs
  useEffect(() => {
    const interval = setInterval(() => {
      setIvCount(prev => prev + Math.floor(12 + Math.random() * 25));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Action: Trigger 802.11 Deauth Attack
  const handleTriggerDeauth = () => {
    setIsDeauthing(true);
    const newLog = `[!] [${new Date().toLocaleTimeString()}] INJECTING 64 DEAUTH PACKETS -> Target Client [A8:5E:45:90:12:F3] on CH ${activeChannel}...`;
    setLogs(prev => [...prev.slice(-8), newLog]);

    setTimeout(() => {
      setIsDeauthing(false);
      setHandshakeCaptured(true);
      setLogs(prev => [
        ...prev.slice(-8),
        `[✓] CLIENT DISCONNECTED & RE-AUTHENTICATED: WPA2 4-Way Handshake successfully dumped to /tmp/kali_wpa_${activeChannel}.cap`
      ]);
    }, 1200);
  };

  // Action: Run Aircrack Key Discovery
  const handleCrackKey = () => {
    setCrackStatus('cracking');
    setLogs(prev => [
      ...prev.slice(-8),
      `[*] Aircrack-ng 1.7: Cracking WPA2-PSK on BSSID [7C:B0:C2:59:E1:4A]... (keys tested: 2,410,000)`
    ]);

    setTimeout(() => {
      setCrackStatus('cracked');
      setCrackedKey('kali#shadow_net_2026!');
      setLogs(prev => [
        ...prev.slice(-8),
        `[+] KEY FOUND! [ kali#shadow_net_2026! ] - Master PMK verified (Transient Key: 8f2a...c01e)`,
        `[+] Decrypting WPA2 CCMP packet payload in real-time...`
      ]);
    }, 2000);
  };

  return (
    <div className="w-full bg-[#05080e] border-y border-emerald-500/30 overflow-hidden font-mono shadow-2xl relative select-none">
      {/* Background cyber scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Banner Indicator */}
      <div className="px-4 py-2 border-b border-emerald-500/20 bg-black/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-bold tracking-wider uppercase">
              3D RF WI-FI INTERCEPT & HANDSHAKE CRACKER
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded">
            MONITOR MODE: mon0 [CH {activeChannel}]
          </span>
          <span className="text-[11px] text-cyan-400 hidden sm:inline">
            IVs CAPTURED: {ivCount.toLocaleString()}
          </span>
        </div>

        {/* Quick Trigger Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerDeauth}
            disabled={isDeauthing}
            className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              isDeauthing
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
            }`}
            title="Inject IEEE 802.11 Deauth frame to capture handshake"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isDeauthing ? 'INJECTING DEAUTH...' : 'FIRE DEAUTH (CH 6)'}</span>
          </button>

          <button
            onClick={handleCrackKey}
            className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
            title="Run dictionary brute-force on captured WPA2 handshake"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>CRACK WPA2 KEY</span>
          </button>
        </div>
      </div>

      {/* Main Top Grid: 3D Wi-Fi Radar on left, Live Airodump/Aircrack Terminal on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[160px] relative">
        {/* Left: 3D Three.js Wi-Fi Tower & Wavefield (4 columns) */}
        <div className="lg:col-span-4 relative border-b lg:border-b-0 lg:border-r border-emerald-500/20 flex flex-col justify-between p-3 bg-black/40">
          <div className="flex items-center justify-between text-[10px] text-slate-400 z-10">
            <span className="flex items-center gap-1 text-emerald-400">
              <Wifi className="w-3 h-3" />
              <span>3D AP RADIO WAVE FIELD</span>
            </span>
            <span className="text-cyan-400 font-mono">2.412 GHz • 802.11ax</span>
          </div>

          {/* 3D Canvas Mount */}
          <div ref={canvasRef} className="w-full h-36 relative cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry Mini Strip */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-emerald-500/10 pt-1.5 z-10">
            <span>TARGET BSSID: <strong className="text-white">7C:B0:C2:59:E1:4A</strong></span>
            <span className="text-emerald-400 font-bold">RSSI: -38 dBm [99%]</span>
          </div>
        </div>

        {/* Right: Real-time Live Wi-Fi Hacking Code Stream (8 columns) */}
        <div className="lg:col-span-8 p-3 flex flex-col justify-between bg-[#070b12]/90">
          <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-emerald-500/10">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-bold uppercase">airodump-ng / aircrack-ng Live Frame Buffer</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400">
                CH HOPPING: <strong className="text-emerald-400">1, 6, 11 (2.4G) + 36, 149 (5G)</strong>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                handshakeCaptured
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-zinc-800 text-slate-400'
              }`}>
                {handshakeCaptured ? '✓ WPA HANDSHAKE CAPTURED' : 'WAITING FOR HANDSHAKE'}
              </span>
            </div>
          </div>

          {/* Scrolling Code Log */}
          <div className="py-2 space-y-1 font-mono text-[11px] overflow-hidden max-h-28 text-slate-300 leading-snug">
            {logs.slice(-5).map((line, idx) => (
              <div
                key={idx}
                className={`truncate ${
                  line.includes('[+]') || line.includes('[✓]')
                    ? 'text-emerald-400 font-semibold'
                    : line.includes('[!]')
                    ? 'text-rose-400 font-semibold'
                    : line.includes('KEY FOUND')
                    ? 'text-cyan-300 font-bold bg-cyan-950/40 px-1 py-0.5 rounded'
                    : 'text-slate-400'
                }`}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Cracked Password Reveal Bar */}
          <div className="pt-2 border-t border-emerald-500/15 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase text-slate-400">Decrypted WPA2 PSK:</span>
              {crackedKey ? (
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold tracking-wider text-xs flex items-center gap-1.5 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <code>{crackedKey}</code>
                </span>
              ) : (
                <span className="text-[11px] text-amber-400 animate-pulse font-mono">
                  [Testing dictionary phrases: 412k/s...]
                </span>
              )}
            </div>

            <div className="text-[10px] text-slate-500 flex items-center gap-2">
              <span>Channel:</span>
              {[1, 6, 11].map(ch => (
                <button
                  key={ch}
                  onClick={() => setActiveChannel(ch)}
                  className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                    activeChannel === ch ? 'bg-emerald-500 text-black font-bold' : 'bg-black text-slate-400'
                  }`}
                >
                  CH {ch}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
