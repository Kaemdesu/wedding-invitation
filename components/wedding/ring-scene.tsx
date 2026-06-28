'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Lightformer, Sparkles, useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { type MotionValue, useMotionValueEvent } from 'framer-motion'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const MODEL_PATH = '/models/ring.glb'

function clamp01(v: number) {
  return Math.min(Math.max(v, 0), 1)
}
function smoothstep(a: number, b: number, v: number) {
  const x = clamp01((v - a) / (b - a))
  return x * x * (3 - 2 * x)
}
function mix(a: number, b: number, t: number) {
  return a + (b - a) * t
}


function getElegantRingTransform(progress: number) {
  const p = clamp01(progress)
  let x = 0, y = 0, scale = 0.95   // ⬆ was 0.58
  let rotX = 0.25, rotY = -0.25, rotZ = -0.04

  if (p <= 0.18) {
    const t = smoothstep(0, 0.18, p)
    x = mix(0, 0.03, t); y = mix(0.02, 0.06, t)
    scale = mix(0.95, 1.2, t)     // ⬆ was 0.58 → 0.76
    rotX = mix(0.25, 0.42, t); rotY = mix(-0.25, 0.08, t); rotZ = mix(-0.04, 0.01, t)
  } else if (p <= 0.42) {
    const t = smoothstep(0.18, 0.42, p)
    x = mix(0.03, 0.04, t); y = mix(0.06, 0.02, t)
    scale = mix(1.2, 1.55, t)     // ⬆ was 0.76 → 1.02
    rotX = mix(0.42, 0.88, t); rotY = mix(0.08, 0.22, t); rotZ = mix(0.01, -0.02, t)
  } else if (p <= 0.62) {
    const t = smoothstep(0.42, 0.62, p)
    x = mix(0.04, 0, t); y = mix(0.02, -0.12, t)
    scale = mix(1.55, 1.85, t)    // ⬆ was 1.02 → 1.2
    rotX = mix(0.88, 1.0, t); rotY = mix(0.22, 0.32, t); rotZ = mix(-0.02, -0.04, t)
  } else if (p <= 0.82) {
    const t = smoothstep(0.62, 0.82, p)
    x = mix(0, 0.03, t); y = mix(-0.12, -0.06, t)
    scale = mix(1.85, 1.55, t)    // ⬆ was 1.2 → 0.98
    rotX = mix(1.0, 0.48, t); rotY = mix(0.32, 1.1, t); rotZ = mix(-0.04, 0.02, t)
  } else {
    const t = smoothstep(0.82, 1, p)
    x = mix(0.03, 0, t); y = mix(-0.06, -0.38, t)
    scale = mix(1.55, 1.1, t)     // ⬆ was 0.98 → 0.68
    rotX = mix(0.48, 0.52, t); rotY = mix(1.1, 2.05, t); rotZ = mix(0.02, -0.04, t)
  }
  return { x, y, scale, rotX, rotY, rotZ }
}


function GoldDust({ count = 55 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = t * 0.012
    ref.current.position.y = Math.sin(t * 0.08) * 0.15
  })

  return (
    <points ref={ref}>

<bufferGeometry>
  <bufferAttribute
    attach="attributes-position"
    args={[positions, 3]}
    count={count}
    array={positions}
    itemSize={3}
  />
</bufferGeometry>

      <pointsMaterial
        size={0.04}
        color="#e6c879"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}



function CustomRing({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  const glowRef2 = useRef<THREE.PointLight>(null)
  const { scene: ringModel } = useGLTF(MODEL_PATH)

  useFrame((state) => {
    if (!group.current) return
    const p = progress.get()
    const t = state.clock.elapsedTime
    const tr = getElegantRingTransform(p)
    group.current.position.set(tr.x, tr.y, 0)
    group.current.scale.setScalar(tr.scale)
    group.current.rotation.x = tr.rotX + Math.sin(t * 0.15) * 0.02
    group.current.rotation.y = tr.rotY + t * 0.06
    group.current.rotation.z = tr.rotZ + Math.sin(t * 0.12) * 0.012

    if (glowRef.current) {
      glowRef.current.position.x = Math.sin(t * 0.25) * 2.8
      glowRef.current.position.y = 1.5 + Math.sin(t * 0.2) * 0.4
      glowRef.current.position.z = Math.cos(t * 0.25) * 2.8
      glowRef.current.intensity = 14 + Math.sin(t * 0.4) * 6
    }
    if (glowRef2.current) {
      glowRef2.current.position.x = Math.cos(t * 0.18) * 2.2
      glowRef2.current.position.y = 0.8 + Math.sin(t * 0.15) * 0.3
      glowRef2.current.position.z = Math.sin(t * 0.18) * 2.2
      glowRef2.current.intensity = 8 + Math.sin(t * 0.3) * 4
    }

    // Keep frameloop going for idle sparkle
    state.invalidate()
  })

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.35}>
        <primitive object={ringModel} />
      </Float>
      <pointLight ref={glowRef} color="#f5d68a" intensity={14} distance={10} />
      <pointLight ref={glowRef2} color="#e8b76a" intensity={8} distance={8} />
    </group>
  )
}



useGLTF.preload(MODEL_PATH)

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#e8b76a" />
    </>
  )
}


function StudioEnv() {
  return (
    <Environment resolution={256}>
      <Lightformer
        form="rect"
        intensity={3.5}                         // ⬆ was 2.5
        position={[5, 4, 3]}
        scale={[6, 6, 1]}
        color="#fff5d6"
      />
      <Lightformer
        form="rect"
        intensity={2.5}                         // ⬆ was 1.8
        position={[-5, 3, -2]}
        scale={[5, 5, 1]}
        color="#e6c879"
      />
      <Lightformer
        form="ring"
        intensity={2}
        position={[0, 3, 4]}
        scale={[3, 3, 1]}
        color="#fff5d6"
      />
    </Environment>
  )
}


/** Detect device tier to adapt 3D quality */
function useDeviceTier() {
  const [tier, setTier] = useState<'low' | 'high'>('high')
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    const lowMem = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4
    setTier(isMobile || isCoarse || lowMem ? 'low' : 'high')
  }, [])
  return tier
}

function SceneInvalidator({ progress }: { progress: MotionValue<number> }) {
  const { invalidate } = useThree()
  // Re-render the Canvas only when scroll progress changes
  useMotionValueEvent(progress, 'change', () => {
    invalidate()
  })
  return null
}



export function RingScene({ progress }: { progress: MotionValue<number> }) {
  const tier = useDeviceTier()
  const isLow = tier === 'low'

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 42 }}
      dpr={isLow ? [1, 1.5] : [1, 2]}
      frameloop="demand"
      gl={{
        antialias: !isLow,
        alpha: true,
        powerPreference: isLow ? 'low-power' : 'high-performance',
        stencil: false,
        depth: true,
      }}
      style={{ background: 'transparent' }}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <SceneInvalidator progress={progress} />
        <Lights />
        <StudioEnv />
        <CustomRing progress={progress} />
        <GoldDust count={isLow ? 35 : 55} />
        <Sparkles
          count={isLow ? 30 : 55}
          scale={[8, 6, 4]}
          size={isLow ? 1.8 : 2.2}
          speed={0.35}
          color="#f5d68a"
          opacity={0.9}
        />
        {/* Bloom restored — lighter on mobile, full on desktop */}
        <EffectComposer multisampling={isLow ? 0 : 2}>
          <Bloom
            intensity={isLow ? 0.45 : 0.7}
            luminanceThreshold={isLow ? 0.9 : 0.85}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
