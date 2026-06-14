"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 3000 }) {
  const pointsRef = useRef();
  const { mouse, viewport } = useThree();

  // Create particles
  const [positions, originalPositions, randoms] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * viewport.width * 1.5;
      const y = (Math.random() - 0.5) * viewport.height * 1.5;
      const z = (Math.random() - 0.5) * 5; // Slight depth

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      randoms[i] = Math.random();
    }
    return [positions, originalPositions, randoms];
  }, [count, viewport.width, viewport.height]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array;
    
    // Mouse interaction parameters
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    const interactionRadius = 2.0;
    const repulsionForce = 0.5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];

      let px = positions[i3];
      let py = positions[i3 + 1];
      let pz = positions[i3 + 2];

      // Ambient floating motion
      const time = state.clock.elapsedTime;
      const floatX = Math.sin(time * 0.5 + randoms[i] * Math.PI * 2) * 0.2;
      const floatY = Math.cos(time * 0.3 + randoms[i] * Math.PI * 2) * 0.2;

      // Distance to mouse
      const dx = px - mouseX;
      const dy = py - mouseY;
      const distSq = dx * dx + dy * dy;

      if (distSq < interactionRadius * interactionRadius) {
        // Repulse
        const dist = Math.sqrt(distSq);
        const force = (interactionRadius - dist) / interactionRadius;
        px += (dx / dist) * force * repulsionForce;
        py += (dy / dist) * force * repulsionForce;
      }

      // Spring back to original position + float
      px += (ox + floatX - px) * 0.05;
      py += (oy + floatY - py) * 0.05;
      pz += (oz - pz) * 0.05;

      positions[i3] = px;
      positions[i3 + 1] = py;
      positions[i3 + 2] = pz;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none opacity-50 bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <Particles count={4000} />
      </Canvas>
    </div>
  );
}
