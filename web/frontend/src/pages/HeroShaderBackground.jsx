import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function HeroShaderBackground() {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    const mountNode = mountRef.current;
    // --- Configuration ---
    const CONFIG = {
      particleCount: 15000,
      connectionDistance: 25,
      maxConnections: 3,
      mouseInfluence: 0.03,
      cameraZ: 50,
      colors: {
        primary: new THREE.Color(0x00d4ff),    // Cyan
        secondary: new THREE.Color(0x0066ff),  // Deep Blue
        accent: new THREE.Color(0x00ffcc),     // Teal
        dark: new THREE.Color(0x001133)        // Deep Navy
      }
    };

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000510, 0.015);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = CONFIG.cameraZ;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountNode.appendChild(renderer.domElement);

    // --- Layer 1: Deep Space Nebula (Background) ---
    const nebulaGeometry = new THREE.PlaneGeometry(300, 300, 32, 32);
    const nebulaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: CONFIG.colors.dark },
        uColor2: { value: new THREE.Color(0x002244) },
        uColor3: { value: new THREE.Color(0x001a33) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          vec3 pos = position;
          float wave = sin(pos.x * 0.02 + uTime * 0.1) * 2.0;
          pos.z += wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                             -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
            + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          float noise1 = snoise(vUv * 3.0 + uTime * 0.05);
          float noise2 = snoise(vUv * 6.0 - uTime * 0.03);
          float noise3 = snoise(vUv * 1.5 + uTime * 0.02);
          
          float combined = (noise1 + noise2 * 0.5 + noise3 * 0.25) / 1.75;
          combined = combined * 0.5 + 0.5;
          
          vec3 color = mix(uColor1, uColor2, combined);
          color = mix(color, uColor3, noise3 * 0.5 + 0.5);
          
          float alpha = smoothstep(0.2, 0.8, combined) * 0.6;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebula.position.z = -50;
    scene.add(nebula);

    // --- Layer 2: Neural Network Particles ---
    const count = CONFIG.particleCount;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const randoms = new Float32Array(count);
    const phases = new Float32Array(count);
    const types = new Float32Array(count); // 0 = data, 1 = node, 2 = signal

    for (let i = 0; i < count; i++) {
      // Spherical distribution with density falloff
      const radius = 40 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) * 0.5; // Flattened sphere
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      
      sizes[i] = Math.random();
      randoms[i] = Math.random();
      phases[i] = Math.random() * Math.PI * 2;
      
      // 70% data points, 20% nodes, 10% signals
      const rand = Math.random();
      if (rand > 0.9) types[i] = 2;
      else if (rand > 0.7) types[i] = 1;
      else types[i] = 0;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    particleGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    particleGeometry.setAttribute('aType', new THREE.BufferAttribute(types, 1));

    const particleVertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      attribute float aSize;
      attribute float aRandom;
      attribute float aPhase;
      attribute float aType;
      
      varying float vAlpha;
      varying vec3 vColor;
      varying float vType;
      varying float vSize;

      void main() {
        vec3 pos = position;
        vType = aType;
        
        // Complex neural motion
        float time = uTime * 0.15;
        float t = aRandom * 10.0;
        
        // Orbital motion
        float angle = time * 0.1 + aPhase;
        float radius = length(pos.xy);
        float newAngle = atan(pos.y, pos.x) + sin(time + aRandom * 5.0) * 0.02;
        
        pos.x = radius * cos(newAngle) + sin(time * 2.0 + t) * 1.0;
        pos.y = radius * sin(newAngle) + cos(time * 1.5 + t) * 1.0;
        pos.z += sin(time * 0.5 + aPhase) * 2.0;
        
        // Mouse interaction - gentle repulsion
        vec2 toMouse = pos.xy - uMouse * 55.0;
        float distToMouse = length(toMouse);
        float mouseInfluence = smoothstep(40.0, 0.0, distToMouse);
        pos.xy += normalize(toMouse) * mouseInfluence * 3.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        // Size based on type and depth
        float typeSize = aType == 2.0 ? 2.5 : (aType == 1.0 ? 1.5 : 1.0);
        float depthScale = 100.0 / -mvPosition.z;
        gl_PointSize = (6.0 * aSize * typeSize) * depthScale;
        vSize = gl_PointSize;
        
        gl_Position = projectionMatrix * mvPosition;
        
        // Dynamic alpha based on type and activity
        float activity = sin(uTime * 1.5 + aPhase * 3.0) * 0.5 + 0.5;
        float pulse = aType == 2.0 ? 
          smoothstep(0.4, 1.0, sin(uTime * 3.0 + aRandom * 10.0)) : 
          smoothstep(0.7, 1.0, activity);
        
        // Fade based on distance from camera
        float depthFade = 1.0 - smoothstep(20.0, 100.0, -mvPosition.z);
        vAlpha = (0.3 + pulse * 0.7) * depthFade;
        
        // Color gradient based on type
        vec3 dataColor = mix(vec3(0.0, 0.5, 0.8), vec3(0.0, 0.8, 1.0), aRandom);
        vec3 nodeColor = mix(vec3(0.2, 0.6, 1.0), vec3(0.5, 0.8, 1.0), pulse);
        vec3 signalColor = mix(vec3(0.0, 1.0, 0.8), vec3(0.5, 1.0, 1.0), pulse);
        
        if (aType == 2.0) vColor = signalColor;
        else if (aType == 1.0) vColor = nodeColor;
        else vColor = dataColor;
      }
    `;

    const particleFragmentShader = `
      varying float vAlpha;
      varying vec3 vColor;
      varying float vType;
      varying float vSize;
      
      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        
        if (dist > 0.5) discard;
        
        // Soft glow with type-specific sharpness
        float sharpness = vType == 2.0 ? 2.0 : (vType == 1.0 ? 1.5 : 1.0);
        float strength = pow(1.0 - (dist * 2.0), 3.0 * sharpness);
        
        // Inner core for nodes
        float core = 1.0 - smoothstep(0.0, 0.2, dist);
        
        vec3 finalColor = vColor * (strength + core * 0.5);
        float finalAlpha = strength * vAlpha;
        
        gl_FragColor = vec4(finalColor, finalAlpha);
      }
    `;

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Layer 3: Connection Lines (Neural Links) ---
    const lineMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: CONFIG.colors.primary }
      },
      vertexShader: `
        attribute float aProgress;
        attribute float aAlpha;
        varying float vAlpha;
        uniform float uTime;
        
        void main() {
          vAlpha = aAlpha * (0.5 + 0.5 * sin(uTime * 2.0 + aProgress * 10.0));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        
        void main() {
          gl_FragColor = vec4(uColor, vAlpha * 0.3);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // Dynamic line geometry - will update each frame
    const maxLines = 2000;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxLines * 2 * 3); // 2 vertices per line
    const lineProgress = new Float32Array(maxLines * 2);
    const lineAlpha = new Float32Array(maxLines * 2);
    
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('aProgress', new THREE.BufferAttribute(lineProgress, 1));
    lineGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(lineAlpha, 1));
    lineGeometry.setDrawRange(0, 0);
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- Layer 4: Volumetric Light Rays (God Rays) ---
    const rayGeometry = new THREE.PlaneGeometry(100, 200, 1, 10);
    const rayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00aaff) }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.x += sin(uv.y * 3.0 + uTime * 0.5) * 5.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        varying vec2 vUv;
        
        void main() {
          float fade = 1.0 - abs(vUv.x - 0.5) * 2.0;
          fade *= smoothstep(1.0, 0.0, vUv.y);
          fade *= smoothstep(0.0, 0.3, vUv.y);
          
          float shimmer = sin(uTime + vUv.y * 10.0) * 0.5 + 0.5;
          
          gl_FragColor = vec4(uColor, fade * shimmer * 0.1);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const ray1 = new THREE.Mesh(rayGeometry, rayMaterial);
    ray1.position.set(-30, 20, -20);
    ray1.rotation.z = 0.3;
    scene.add(ray1);

    const ray2 = new THREE.Mesh(rayGeometry, rayMaterial);
    ray2.position.set(30, -10, -30);
    ray2.rotation.z = -0.5;
    scene.add(ray2);

    // --- Mouse Tracking ---
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    const updateConnections = () => {
      let lineIndex = 0;
      const positions = particleGeometry.attributes.position.array;
      
      // Only process a subset for performance
      const checkCount = Math.min(count, 800);
      
      for (let i = 0; i < checkCount && lineIndex < maxLines; i++) {
        if (types[i] !== 1) continue; // Only connect nodes
        
        const ix = positions[i * 3];
        const iy = positions[i * 3 + 1];
        const iz = positions[i * 3 + 2];
        
        let connections = 0;
        
        for (let j = i + 1; j < checkCount && connections < CONFIG.maxConnections && lineIndex < maxLines; j++) {
          if (types[j] === 0) continue;
          
          const jx = positions[j * 3];
          const jy = positions[j * 3 + 1];
          const jz = positions[j * 3 + 2];
          
          const dx = ix - jx;
          const dy = iy - jy;
          const dz = iz - jz;
          const distSq = dx * dx + dy * dy + dz * dz;
          
          if (distSq < CONFIG.connectionDistance * CONFIG.connectionDistance) {
            const dist = Math.sqrt(distSq);
            const alpha = 1.0 - (dist / CONFIG.connectionDistance);
            
            // Line start
            linePositions[lineIndex * 6] = ix;
            linePositions[lineIndex * 6 + 1] = iy;
            linePositions[lineIndex * 6 + 2] = iz;
            
            // Line end
            linePositions[lineIndex * 6 + 3] = jx;
            linePositions[lineIndex * 6 + 4] = jy;
            linePositions[lineIndex * 6 + 5] = jz;
            
            lineProgress[lineIndex * 2] = 0;
            lineProgress[lineIndex * 2 + 1] = 1;
            lineAlpha[lineIndex * 2] = alpha;
            lineAlpha[lineIndex * 2 + 1] = alpha;
            
            lineIndex++;
            connections++;
          }
        }
      }
      
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.aProgress.needsUpdate = true;
      lineGeometry.attributes.aAlpha.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIndex * 2);
    };

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * CONFIG.mouseInfluence;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * CONFIG.mouseInfluence;

      // Update uniforms
      nebulaMaterial.uniforms.uTime.value = elapsedTime;
      particleMaterial.uniforms.uTime.value = elapsedTime;
      particleMaterial.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      lineMaterial.uniforms.uTime.value = elapsedTime;
      rayMaterial.uniforms.uTime.value = elapsedTime;

      // Rotate entire system slowly
      particles.rotation.y = elapsedTime * 0.02;
      particles.rotation.x = Math.sin(elapsedTime * 0.01) * 0.1;
      
      // Update connections every 2nd frame for performance
      if (frameRef.current % 2 === 0) {
        updateConnections();
      }

      // Camera subtle movement
      camera.position.x = Math.sin(elapsedTime * 0.1) * 2;
      camera.position.y = Math.cos(elapsedTime * 0.08) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      // Dispose everything
      nebulaGeometry.dispose();
      nebulaMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      rayGeometry.dispose();
      rayMaterial.dispose();
      
      renderer.dispose();
      if (mountNode && renderer.domElement) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        background: "radial-gradient(ellipse at center, #001122 0%, #000000 100%)"
      }}
    />
  );
}