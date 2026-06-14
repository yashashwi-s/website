"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

const DistortionMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uHover: 0,
    uTime: 0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D uTexture;
    uniform float uHover;
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Distortion calculation
      float waveX = sin(uv.y * 10.0 + uTime * 2.0) * 0.05 * uHover;
      float waveY = cos(uv.x * 10.0 + uTime * 2.0) * 0.05 * uHover;
      
      // RGB Shift
      float r = texture2D(uTexture, uv + vec2(waveX, waveY)).r;
      float g = texture2D(uTexture, uv).g;
      float b = texture2D(uTexture, uv - vec2(waveX, waveY)).b;
      
      // Grayscale conversion
      vec3 color = vec3(r, g, b);
      float gray = dot(color, vec3(0.299, 0.587, 0.114));
      
      // Mix between grayscale and shifted color based on hover
      vec3 finalColor = mix(vec3(gray), color, uHover);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ DistortionMaterial });

function Scene({ imageUrl }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const texture = useTexture(imageUrl);
  const [hovered, setHover] = useState(false);
  const targetHover = useRef(0);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      targetHover.current = THREE.MathUtils.lerp(targetHover.current, hovered ? 1 : 0, 0.1);
      materialRef.current.uHover = targetHover.current;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <planeGeometry args={[2, 2]} />
      <distortionMaterial ref={materialRef} uTexture={texture} />
    </mesh>
  );
}

export default function WebGLDistortion({ imageUrl }) {
  return (
    <div className="absolute inset-0 w-full h-full cursor-pointer">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]}
      >
        <Scene imageUrl={imageUrl} />
      </Canvas>
    </div>
  );
}
