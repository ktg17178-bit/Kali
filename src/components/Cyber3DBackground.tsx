import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Cyber3DBackgroundProps {
  interactiveHUD?: boolean;
}

export const Cyber3DBackground: React.FC<Cyber3DBackgroundProps> = ({ interactiveHUD = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visMode, setVisMode] = useState<'threat-core' | 'neural-mesh' | 'matrix-stream' | 'wifi-crack'>('threat-core');
  const [hudStats, setHudStats] = useState({ fps: 60, nodes: 1420, packets: 'LIVE' });
  const [isRotating, setIsRotating] = useState(true);

  // References to keep animation loop clean
  const visModeRef = useRef(visMode);
  visModeRef.current = visMode;
  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a0f, 0.018);

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 38);

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 4. PROCEDURAL GLOWING PARTICLE TEXTURE
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(0, 255, 170, 1)');
      grad.addColorStop(0.3, 'rgba(16, 185, 129, 0.8)');
      grad.addColorStop(0.6, 'rgba(0, 240, 255, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);

      // Core bright square
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(28, 28, 8, 8);

      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      return texture;
    };

    const particleTexture = createGlowTexture();

    // 5. MASTER GROUP TO ROTATE & PARALLAX
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 6. OBJECT A: CENTRAL CYBER THREAT GLOBE (Geodesic Wireframe + Vertices)
    const globeRadius = 11;
    const globeGeom = new THREE.IcosahedronGeometry(globeRadius, 2);
    
    // Wireframe lines
    const wireframeGeom = new THREE.WireframeGeometry(globeGeom);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.38,
      linewidth: 1
    });
    const globeWireframe = new THREE.LineSegments(wireframeGeom, wireframeMat);
    worldGroup.add(globeWireframe);

    // Inner glowing core
    const innerCoreGeom = new THREE.OctahedronGeometry(globeRadius * 0.45, 1);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const innerCore = new THREE.Mesh(innerCoreGeom, innerCoreMat);
    worldGroup.add(innerCore);

    // Nodes at globe vertices
    const globePosAttr = globeGeom.attributes.position;
    const nodeCount = globePosAttr.count;
    const globeNodesGeom = new THREE.BufferGeometry();
    globeNodesGeom.setAttribute('position', globePosAttr);

    const globeNodesMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 1.4,
      map: particleTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const globeNodes = new THREE.Points(globeNodesGeom, globeNodesMat);
    worldGroup.add(globeNodes);

    // 7. OBJECT B: CONCENTRIC ORBITAL HACKING RINGS
    const ringGroup = new THREE.Group();
    worldGroup.add(ringGroup);

    const createCyberRing = (radius: number, color: number, tiltX: number, tiltY: number) => {
      const segments = 90;
      const ringGeom = new THREE.BufferGeometry();
      const ringPositions = new Float32Array(segments * 3);
      for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        ringPositions[i * 3] = Math.cos(theta) * radius;
        ringPositions[i * 3 + 1] = Math.sin(theta) * radius;
        ringPositions[i * 3 + 2] = 0;
      }
      ringGeom.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));

      const ringMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.45
      });
      const ring = new THREE.LineLoop(ringGeom, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      return ring;
    };

    const ring1 = createCyberRing(globeRadius * 1.45, 0x10b981, Math.PI / 3, 0.4);
    const ring2 = createCyberRing(globeRadius * 1.7, 0x00f0ff, -Math.PI / 4, -0.6);
    const ring3 = createCyberRing(globeRadius * 1.95, 0x059669, Math.PI / 6, Math.PI / 3);
    ringGroup.add(ring1, ring2, ring3);

    // 7B. 3D WI-FI RF BROADCAST WAVE LOOPS
    const wifiWaveGroup = new THREE.Group();
    worldGroup.add(wifiWaveGroup);

    const wifiWaves: THREE.LineLoop[] = [];
    const wifiWaveCount = 4;
    for (let i = 0; i < wifiWaveCount; i++) {
      const wGeom = new THREE.BufferGeometry();
      const segs = 64;
      const pos = new Float32Array(segs * 3);
      const r = (i + 1) * 3.8;
      for (let j = 0; j < segs; j++) {
        const a = (j / segs) * Math.PI * 2;
        pos[j * 3] = Math.cos(a) * r;
        pos[j * 3 + 1] = 0;
        pos[j * 3 + 2] = Math.sin(a) * r;
      }
      wGeom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const wMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x00f0ff : 0x10b981,
        transparent: true,
        opacity: 0.5
      });
      const wRing = new THREE.LineLoop(wGeom, wMat);
      wifiWaveGroup.add(wRing);
      wifiWaves.push(wRing);
    }

    // 8. OBJECT C: PACKET STREAM MATRIX PARTICLES (1,200 Cyber nodes)
    const particleCount = 1400;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cEmerald = new THREE.Color(0x10b981);
    const cCyan = new THREE.Color(0x00f0ff);
    const cDim = new THREE.Color(0x064e3b);

    for (let i = 0; i < particleCount; i++) {
      // Distribute in a spherical cloud around the central node
      const radius = 12 + Math.random() * 32;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Velocities
      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.04;
      particleVelocities[i * 3 + 1] = -0.06 - Math.random() * 0.08; // downward matrix stream drift
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.04;

      // Color variation
      const randColor = Math.random();
      const chosenColor = randColor > 0.65 ? cCyan : randColor > 0.25 ? cEmerald : cDim;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 1.25,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeom, particlesMat);
    worldGroup.add(particles);

    // 9. OBJECT D: CYBER RADAR HORIZON (Lower scanning grid)
    const gridDim = 50;
    const gridStep = 2.5;
    const gridPositions: number[] = [];
    for (let x = -gridDim; x <= gridDim; x += gridStep) {
      gridPositions.push(x, -16, -gridDim, x, -16, gridDim);
    }
    for (let z = -gridDim; z <= gridDim; z += gridStep) {
      gridPositions.push(-gridDim, -16, z, gridDim, -16, z);
    }
    const cyberGridGeom = new THREE.BufferGeometry();
    cyberGridGeom.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
    const cyberGridMat = new THREE.LineBasicMaterial({
      color: 0x047857,
      transparent: true,
      opacity: 0.22
    });
    const cyberGrid = new THREE.LineSegments(cyberGridGeom, cyberGridMat);
    scene.add(cyberGrid);

    // 10. MOUSE & POINTER INTERACTION
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x * 8;
      targetMouseY = y * 5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 11. RESIZE HANDLER
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 12. ANIMATION LOOP
    let animFrameId: number;
    let lastTime = performance.now();
    let frameCounter = 0;
    let fpsTimer = performance.now();

    const animate = (now: number) => {
      animFrameId = requestAnimationFrame(animate);

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // FPS tracking for HUD
      frameCounter++;
      if (now - fpsTimer >= 1000) {
        setHudStats(prev => ({
          ...prev,
          fps: frameCounter,
          nodes: nodeCount + particleCount
        }));
        frameCounter = 0;
        fpsTimer = now;
      }

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX * 0.8;
      camera.position.y = 5 + mouseY * 0.8;
      camera.lookAt(0, 0, 0);

      // Handle visualization modes
      const currentMode = visModeRef.current;
      const shouldRotate = isRotatingRef.current;

      if (shouldRotate) {
        globeWireframe.rotation.y += delta * 0.15;
        globeWireframe.rotation.x += delta * 0.05;
        globeNodes.rotation.y += delta * 0.15;
        globeNodes.rotation.x += delta * 0.05;

        innerCore.rotation.y -= delta * 0.35;
        innerCore.rotation.z += delta * 0.2;

        ring1.rotation.z += delta * 0.22;
        ring2.rotation.z -= delta * 0.18;
        ring3.rotation.z += delta * 0.14;
      }

      // Pulse and scale 3D Wi-Fi broadcast wave loops
      wifiWaves.forEach((wRing, idx) => {
        const speed = (idx + 1) * 0.25;
        const waveScale = 1 + ((now * 0.001 * speed) % 2.5);
        wRing.scale.set(waveScale, 1, waveScale);
        const mat = wRing.material as THREE.LineBasicMaterial;
        mat.opacity = Math.max(0, 0.7 - (waveScale - 1) * 0.4);
      });

      // Mode-specific animations
      if (currentMode === 'wifi-crack') {
        // High-frequency Wi-Fi deauth shockwaves and packet bursts
        const deauthPulse = 1 + Math.sin(now * 0.015) * 0.2;
        innerCore.scale.set(deauthPulse * 1.5, deauthPulse * 1.5, deauthPulse * 1.5);
        innerCore.rotation.y += delta * 2.0;

        const pos = particleGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          // Accelerate packet stream to simulate radio wave transmission
          pos[i * 3 + 1] += particleVelocities[i * 3 + 1] * 2.8;
          if (pos[i * 3 + 1] < -20) {
            pos[i * 3 + 1] = 20 + Math.random() * 5;
          }
        }
        particleGeom.attributes.position.needsUpdate = true;
      } else if (currentMode === 'matrix-stream') {
        // Fast streaming particles
        const pos = particleGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3 + 1] += particleVelocities[i * 3 + 1] * 2.2;
          if (pos[i * 3 + 1] < -20) {
            pos[i * 3 + 1] = 25 + Math.random() * 5;
          }
        }
        particleGeom.attributes.position.needsUpdate = true;
      } else if (currentMode === 'neural-mesh') {
        // Expansive pulsing nodes
        const pulse = 1 + Math.sin(now * 0.003) * 0.12;
        globeWireframe.scale.set(pulse, pulse, pulse);
        globeNodes.scale.set(pulse, pulse, pulse);

        const pos = particleGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3 + 1] += particleVelocities[i * 3 + 1] * 0.6;
          if (pos[i * 3 + 1] < -20) pos[i * 3 + 1] = 20;
        }
        particleGeom.attributes.position.needsUpdate = true;
      } else {
        // Standard Threat Core
        globeWireframe.scale.set(1, 1, 1);
        globeNodes.scale.set(1, 1, 1);

        const pos = particleGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3 + 1] += particleVelocities[i * 3 + 1];
          if (pos[i * 3 + 1] < -20) {
            pos[i * 3 + 1] = 20;
          }
        }
        particleGeom.attributes.position.needsUpdate = true;
      }

      // Cyber terrain scanner sweep
      cyberGrid.position.z = ((now * 0.005) % gridStep) - (gridStep / 2);

      renderer.render(scene, camera);
    };

    animFrameId = requestAnimationFrame(animate);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose Geometries
      globeGeom.dispose();
      wireframeGeom.dispose();
      innerCoreGeom.dispose();
      globeNodesGeom.dispose();
      particleGeom.dispose();
      cyberGridGeom.dispose();
      particleTexture.dispose();

      // Dispose Materials
      wireframeMat.dispose();
      innerCoreMat.dispose();
      globeNodesMat.dispose();
      particlesMat.dispose();
      cyberGridMat.dispose();

      wifiWaves.forEach(w => {
        w.geometry.dispose();
        (w.material as THREE.Material).dispose();
      });

      // Clear renderer
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full opacity-70" />

      {/* Cyber Vignette Overlay & Scanlines */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070a0f] via-transparent to-[#070a0f]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070a0f]/40 to-[#070a0f] pointer-events-none" />

      {/* Interactive 3D HUD Diagnostics & Mode Switcher */}
      {interactiveHUD && (
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto font-mono text-[11px] hidden sm:flex items-center gap-2 bg-[#05080e]/85 backdrop-blur-md border border-emerald-500/30 rounded-xl px-3 py-2 shadow-2xl shadow-emerald-500/10">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>3D CYBER GRID</span>
          </div>

          <span className="text-zinc-600">|</span>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded border border-emerald-500/20">
            <button
              onClick={() => setVisMode('threat-core')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                visMode === 'threat-core'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Threat Core Node Visualization"
            >
              Core
            </button>
            <button
              onClick={() => setVisMode('neural-mesh')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                visMode === 'neural-mesh'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Neural Mesh Pulsing Node Field"
            >
              Mesh
            </button>
            <button
              onClick={() => setVisMode('matrix-stream')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                visMode === 'matrix-stream'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Downlink Matrix Packet Streams"
            >
              Stream
            </button>
            <button
              onClick={() => setVisMode('wifi-crack')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                visMode === 'wifi-crack'
                  ? 'bg-cyan-400 text-black font-bold shadow-md shadow-cyan-400/30'
                  : 'text-cyan-400 hover:text-white'
              }`}
              title="3D Wi-Fi Deauth Waves & RF Broadcast"
            >
              WiFi RF
            </button>
          </div>

          <span className="text-zinc-600">|</span>

          {/* Rotation Toggle */}
          <button
            onClick={() => setIsRotating(prev => !prev)}
            className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-slate-300 hover:text-white text-[10px] cursor-pointer"
            title="Toggle Core Rotation"
          >
            {isRotating ? 'Pause' : 'Spin'}
          </button>

          <span className="text-zinc-600">|</span>

          {/* Telemetry Stats */}
          <div className="text-[10px] text-slate-400 flex items-center gap-2">
            <span>{hudStats.fps} FPS</span>
            <span>•</span>
            <span className="text-emerald-400">{hudStats.nodes} Nodes</span>
          </div>
        </div>
      )}
    </div>
  );
};
