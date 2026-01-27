import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function HeroShaderBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- Intelligence Substrate: Instanced Geometry ---
    const count = 12000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      sizes[i] = Math.random();
      randoms[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    const vertexShader = `
      uniform float uTime;
      attribute float aSize;
      attribute float aRandom;
      varying float vAlpha;
      varying vec3 vColor;

      void main() {
        vec3 pos = position;
        
        // Neural Flow: Subtle 3D wave motion
        float time = uTime * 0.2;
        pos.x += sin(time + pos.z * 0.2) * 2.0;
        pos.y += cos(time + pos.x * 0.2) * 2.0;
        pos.z += sin(time + aRandom * 10.0) * 1.5;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        // Perspective scaling
        gl_PointSize = (4.0 * aSize) * (100.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;

        // "Signal Firing": Pulse effect for active nodes
        float pulse = smoothstep(0.7, 1.0, sin(uTime * 1.5 + aRandom * 20.0));
        vAlpha = (0.2 + pulse * 0.8) * (1.0 - (abs(pos.z) / 100.0));
        
        // MeetWise Cyan Gradient
        vColor = mix(vec3(0.0, 0.4, 0.6), vec3(0.0, 0.824, 1.0), pulse);
      }
    `;

    const fragmentShader = `
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        
        float strength = pow(1.0 - (d * 2.0), 3.0);
        gl_FragColor = vec4(vColor, strength * vAlpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    const animate = () => {
      material.uniforms.uTime.value = clock.getElapsedTime();
      
      // Extremely slow rotation for "Research" feel
      points.rotation.y = clock.getElapsedTime() * 0.01;
      points.rotation.z = clock.getElapsedTime() * 0.005;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

 return (
    <div ref={mountRef} style={{ 
      position: "fixed", 
      inset: 0, 
      zIndex: -2, // Push it further back
      pointerEvents: "none",
      background: "transparent" // Remove the gradient from here
    }} />
  );
}