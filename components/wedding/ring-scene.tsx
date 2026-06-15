'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles, Float } from '@react-three/drei'
import { type MotionValue } from 'framer-motion'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'

function Ring({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const p = progress.get()
    // Zoom in: starts far, comes closer as user scrolls
    const scale = 0.55 + p * 1.15
    group.current.scale.setScalar(scale)
    // Continuous + scroll-driven rotation
    group.current.rotation.y = state.clock.elapsedTime * 0.35 + p * Math.PI * 3
    group.current.rotation.x = 0.35 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08
    // Drift slightly upward as it grows
    group.current.position.y = -0.1 + p * 0.15
  })

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={group}>
        {/* Band */}
        <mesh castShadow>
          <torusGeometry args={[1, 0.16, 48, 160]} />
          <meshStandardMaterial
            color="#c9a84c"
            metalness={1}
            roughness={0.18}
            envMapIntensity={1.6}
          />
        </mesh>

        {/* Prong setting */}
        <mesh position={[0, 1.02, 0]}>
          <cylinderGeometry args={[0.22, 0.3, 0.28, 24]} />
          <meshStandardMaterial color="#c9a84c" metalness={1} roughness={0.2} envMapIntensity={1.6} />
        </mesh>

        {/* Diamond */}
        <mesh position={[0, 1.34, 0]} rotation={[0, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial
            color="#fffaf0"
            metalness={0.5}
            roughness={0.02}
            emissive="#fff3d6"
            emissiveIntensity={0.45}
            envMapIntensity={2.5}
          />
        </mesh>

        <Sparkles count={40} scale={3.2} size={3} speed={0.4} color="#f3d98b" />
      </group>
    </Float>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <spotLight position={[5, 6, 5]} angle={0.5} intensity={120} color="#ffd591" penumbra={1} />
      <pointLight position={[-5, -2, 3]} intensity={40} color="#c9a84c" />
      <pointLight position={[0, 0, 6]} intensity={25} color="#fff0d0" />
    </>
  )
}

function StudioEnv() {
  return (
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={4} color="#ffe8b0" position={[0, 4, 4]} scale={[6, 6, 1]} />
      <Lightformer form="rect" intensity={2} color="#c9a84c" position={[-5, 1, 1]} scale={[4, 6, 1]} />
      <Lightformer form="ring" intensity={3} color="#fff6e0" position={[5, 2, 3]} scale={[3, 3, 1]} />
      <Lightformer form="circle" intensity={2} color="#a8772e" position={[0, -4, 2]} scale={[5, 5, 1]} />
    </Environment>
  )
}

export function RingScene({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Lights />
        <StudioEnv />
        <Ring progress={progress} />
      </Suspense>
    </Canvas>
  )
}
