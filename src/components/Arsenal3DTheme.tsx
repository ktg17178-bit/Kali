import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Layers, Shield, Cpu, Terminal, Sparkles } from 'lucide-react';

interface Arsenal3DThemeProps {
  activeCategory?: string;
}

export const Arsenal3DTheme: React.FC<Arsenal3DThemeProps> = ({ activeCategory = 'All' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hudMode, setHudMode] = useState<'vault' | 'tesseract' | 'payload'>('tesseract');
  const [telemetry, setTelemetry] = useState({ modules: 12, payloads: 48, integrity: '100% SECURE' });

  const activeCategoryRef = useRef(activeCategory);
  activeCategoryRef.current = activeCategory;

  const hudModeRef = useRef(hudMode);
  hudModeRef.current = hudMode;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a0f, 0.022);

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 4, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 2. ROOT ARSENAL GROUP
    const arsenalGroup = new THREE.Group();
    scene.add(arsenalGroup);

    // 3. OBJECT A: 3D CYBER TESSERACT (Outer + Inner Wireframe Hypercube)
    // Outer cube
    const outerBoxGeom = new THREE.BoxGeometry(7, 7, 7);
    const outerWireframe = new THREE.WireframeGeometry(outerBoxGeom);
    const outerMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.5
    });
    const outerCube = new THREE.LineSegments(outerWireframe, outerMat);
    arsenalGroup.add(outerCube);

    // Inner rotating diamond / octahedral payload core
    const innerGeom = new THREE.OctahedronGeometry(3.2, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const innerCore = new THREE.Mesh(innerGeom, innerMat);
    arsenalGroup.add(innerCore);

    // 4. OBJECT B: ORBITAL HOLOGRAPHIC DATA HEXAGONS
    const hexGroup = new THREE.Group();
    arsenalGroup.add(hexGroup);

    const hexCount = 6;
    const hexMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < hexCount; i++) {
      const hexGeom = new THREE.CircleGeometry(1.2, 6);
      const hexMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00f0ff : 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const hex = new THREE.Mesh(hexGeom, hexMat);
      const angle = (i / hexCount) * Math.PI * 2;
      hex.position.set(Math.cos(angle) * 7.5, Math.sin(i * 1.5) * 1.5, Math.sin(angle) * 7.5);
      hex.rotation.y = -angle;
      hexGroup.add(hex);
      hexMeshes.push(hex);
    }

    // 5. OBJECT C: 3D ARSENAL LASER HORIZON GRID
    const gridDim = 32;
    const gridStep = 2;
    const gridPos: number[] = [];
    for (let x = -gridDim; x <= gridDim; x += gridStep) {
      gridPos.push(x, -6, -gridDim, x, -6, gridDim);
    }
    for (let z = -gridDim; z <= gridDim; z += gridStep) {
      gridPos.push(-gridDim, -6, z, gridDim, -6, z);
    }
    const laserGridGeom = new THREE.BufferGeometry();
    laserGridGeom.setAttribute('position', new THREE.Float32BufferAttribute(gridPos, 3));
    const laserGridMat = new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.25
    });
    const laserGrid = new THREE.LineSegments(laserGridGeom, laserGridMat);
    scene.add(laserGrid);

    // 6. OBJECT D: 3D CYBER WEAPON MATRIX PARTICLES (600 nodes)
    const particleCount = 650;
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 28;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 28;

      const isCyan = Math.random() > 0.4;
      pColors[i * 3] = isCyan ? 0.0 : 0.06;
      pColors[i * 3 + 1] = isCyan ? 0.94 : 0.95;
      pColors[i * 3 + 2] = isCyan ? 1.0 : 0.5;
    }

    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeom.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const pPoints = new THREE.Points(pGeom, pMat);
    arsenalGroup.add(pPoints);

    // 7. MOUSE PARALLAX
    let mouseX = 0;
    let targetMouseX = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouseX = nx * 3;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 8. ANIMATION LOOP
    let frameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      mouseX += (targetMouseX - mouseX) * 0.05;
      camera.position.x = mouseX;
      camera.lookAt(0, 0, 0);

      // Rotate outer tesseract cube
      outerCube.rotation.x += delta * 0.25;
      outerCube.rotation.y += delta * 0.35;

      // Rotate inner payload diamond oppositely
      innerCore.rotation.x -= delta * 0.5;
      innerCore.rotation.z += delta * 0.4;

      // Orbit holographic hexagons
      hexGroup.rotation.y += delta * 0.3;
      hexMeshes.forEach((hex, idx) => {
        hex.rotation.z = time * (idx % 2 === 0 ? 1 : -1) * 0.5;
      });

      // Subtle float
      arsenalGroup.position.y = Math.sin(time * 1.5) * 0.3;

      // React to Category Color Swapping
      const cat = activeCategoryRef.current;
      if (cat === 'Offensive Tools') {
        outerMat.color.setHex(0xef4444); // red / offensive
        innerMat.color.setHex(0x10b981);
      } else if (cat === 'Defensive Ops') {
        outerMat.color.setHex(0x00f0ff); // cyan
        innerMat.color.setHex(0x3b82f6);
      } else if (cat === 'Zero-Day Labs') {
        outerMat.color.setHex(0xa855f7); // purple / zero-day
        innerMat.color.setHex(0xec4899);
      } else if (cat === 'Hardware Security') {
        outerMat.color.setHex(0xf59e0b); // amber / RF
        innerMat.color.setHex(0x10b981);
      } else {
        outerMat.color.setHex(0x00f0ff);
        innerMat.color.setHex(0x10b981);
      }

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

      outerBoxGeom.dispose();
      outerWireframe.dispose();
      outerMat.dispose();
      innerGeom.dispose();
      innerMat.dispose();
      hexMeshes.forEach(h => {
        h.geometry.dispose();
        (h.material as THREE.Material).dispose();
      });
      laserGridGeom.dispose();
      laserGridMat.dispose();
      pGeom.dispose();
      pMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-72 sm:h-84 bg-[#05080e] rounded-2xl border border-emerald-500/25 overflow-hidden shadow-2xl select-none font-mono">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Cyber Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05080e] via-transparent to-[#05080e]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Left Title Overlay */}
      <div className="absolute top-4 left-4 z-10 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <Box className="w-4 h-4 text-cyan-400" />
          <span>3D ARSENAL TESSERACT VAULT</span>
        </div>
        <p className="text-[11px] text-slate-400 font-sans max-w-sm hidden sm:block">
          Interactive weaponized module matrix. Rotates in real time and synchronizes with your active exploit category.
        </p>
      </div>

      {/* Top Right Live Telemetry */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="px-3 py-1 rounded bg-black/75 border border-cyan-500/30 text-[10px] text-cyan-300">
          FILTER: <strong className="text-white uppercase">{activeCategory}</strong>
        </div>
        <div className="px-3 py-1 rounded bg-black/75 border border-emerald-500/30 text-[10px] text-emerald-400 hidden sm:inline-block">
          VAULT: <strong className="text-white">12 ARSENAL MODULES</strong>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[10px] text-slate-500 border-t border-emerald-500/15 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">VECTOR MAPPING: <strong className="text-emerald-400">HEX-ORBIT ACTIVE</strong></span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">DRAG CURSOR TO TILT HOLOGRAPHIC VAULT</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>CYBER THEME 2.0</span>
        </div>
      </div>
    </div>
  );
};
