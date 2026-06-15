'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Lightformer, Sparkles, useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { type MotionValue } from 'framer-motion'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'

const MODEL_PATH = '/models/ring.glb'
const MODEL_SCALE = 2.8
const MODEL_ROTATION: [number, number, number] = [0, 0, 0]
const MODEL_POSITION: [number, number, number] = [0, 0, 0]

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

  let x = 0
  let y = 0
  let scale = 0.58
  let rotX = 0.25
  let rotY = -0.25
  let rotZ = -0.04

  if (p <= 0.18) {
    const t = smoothstep(0, 0.18, p)
    x = mix(0, 0.03, t)
    y = mix(0.02, 0.06, t)
    scale = mix(0.58, 0.76, t)
    rotX = mix(0.25, 0.42, t)
    rotY = mix(-0.25, 0.08, t)
    rotZ = mix(-0.04, 0.01, t)
  } else if (p <= 0.42) {
    const t = smoothstep(0.18, 0.42, p)
    x = mix(0.03, 0.04, t)
    y = mix(0.06, 0.02, t)
    scale = mix(0.76, 1.02, t)
    rotX = mix(0.42, 0.88, t)
    rotY = mix(0.08, 0.22, t)
    rotZ = mix(0.01, -0.02, t)
  } else if (p <= 0.62) {
    const t = smoothstep(0.42, 0.62, p)
    x = mix(0.04, 0, t)
    y = mix(0.02, -0.12, t)
    scale = mix(1.02, 1.2, t)
    rotX = mix(0.88, 1.0, t)
    rotY = mix(0.22, 0.32, t)
    rotZ = mix(-0.02, -0.04, t)
  } else if (p <= 0.82) {
    const t = smoothstep(0.62, 0.82, p)
    x = mix(0, 0.03, t)
    y = mix(-0.12, -0.06, t)
    scale = mix(1.2, 0.98, t)
    rotX = mix(1.0, 0.48, t)
    rotY = mix(0.32, 1.1, t)
    rotZ = mix(-0.04, 0.02, t)
  } else {
    const t = smoothstep(0.82, 1, p)
    x = mix(0.03, 0, t)
    y = mix(-0.06, -0.38, t)
    scale = mix(0.98, 0.68, t)
    rotX = mix(0.48, 0.52, t)
    rotY = mix(1.1, 2.05, t)
    rotZ = mix(0.02, -0.04, t)
  }

  return { x, y, scale, rotX, rotY, rotZ }
}

function GoldDust() {
  const count = 55
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = t * 0.012
    ref.current.position.y = Math.sin(t * 0.08) * 0.15
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#c9a84c"
        size={0.022}
        transparent
        opacity={0.32}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function CustomRing({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  const glowRef2 = useRef<THREE.PointLight>(null)

  const { scene } = useGLTF(MODEL_PATH)

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
  })

  return (
    <Float speed={0.35} rotationIntensity={0.012} floatIntensity={0.06}>
      <group ref={group}>
        <group
          scale={MODEL_SCALE}
          rotation={MODEL_ROTATION}
          position={MODEL_POSITION}
        >
          <primitive object={scene} />
        </group>

        <pointLight
          ref={glowRef}
          position={[2, 2, 2]}
          intensity={14}
          color="#fff0d0"
          distance={10}
        />

        <pointLight
          ref={glowRef2}
          position={[-2, 1, -2]}
          intensity={8}
          color="#ffe8a0"
          distance={8}
        />

        <Sparkles
          count={10}
          scale={3.5}
          size={1.6}
          speed={0.1}
          opacity={0.4}
          color="#f3d98b"
        />

        <Sparkles
          count={6}
          scale={1.2}
          size={1.0}
          speed={0.08}
          opacity={0.55}
          color="#ffffff"
          position={[0, 0.2, 0]}
        />

        <Sparkles
          count={5}
          scale={1.8}
          size={0.8}
          speed={0.06}
          opacity={0.35}
          color="#ffdd44"
          position={[0, 0.1, 0]}
        />
      </group>
    </Float>
  )
}

useGLTF.preload(MODEL_PATH)

function Lights() {
  return (
    <>
      <ambientLight intensity={0.38} />

      <spotLight
        position={[5, 6, 5]}
        angle={0.5}
        intensity={120}
        color="#ffd591"
        penumbra={1}
      />

      <pointLight
        position={[-5, -2, 3]}
        intensity={38}
        color="#c9a84c"
      />

      <pointLight
        position={[0, 0, 6]}
        intensity={28}
        color="#fff0d0"
      />

      <spotLight
        position={[4, 2, -3]}
        angle={0.4}
        intensity={65}
        color="#ffe4a0"
        penumbra={0.8}
      />

      <spotLight
        position={[-4, 1, -3]}
        angle={0.4}
        intensity={45}
        color="#c9a84c"
        penumbra={0.8}
      />

      <pointLight
        position={[0, 5, 0]}
        intensity={25}
        color="#ffffff"
        distance={10}
      />

      <spotLight
        position={[0, 4, 2]}
        angle={0.6}
        intensity={50}
        color="#ffffff"
        penumbra={0.6}
      />
    </>
  )
}

function StudioEnv() {
  return (
    <Environment resolution={256}>
      <Lightformer
        form="rect"
        intensity={4}
        color="#ffe8b0"
        position={[0, 4, 4]}
        scale={[6, 6, 1]}
      />

      <Lightformer
        form="rect"
        intensity={2.2}
        color="#c9a84c"
        position={[-5, 1, 1]}
        scale={[4, 6, 1]}
      />

      <Lightformer
        form="ring"
        intensity={3}
        color="#fff6e0"
        position={[5, 2, 3]}
        scale={[3, 3, 1]}
      />

      <Lightformer
        form="circle"
        intensity={1.8}
        color="#a8772e"
        position={[0, -4, 2]}
        scale={[5, 5, 1]}
      />

      <Lightformer
        form="rect"
        intensity={1.5}
        color="#ffffff"
        position={[0, 0, -5]}
        scale={[10, 10, 1]}
      />

      <Lightformer
        form="ring"
        intensity={2}
        color="#ffe8b0"
        position={[3, -2, 4]}
        scale={[2, 2, 1]}
      />
    </Environment>
  )
}

export function RingScene({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 38 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Lights />
        <StudioEnv />
        <GoldDust />
        <CustomRing progress={progress} />

        <EffectComposer>
          <Bloom
            intensity={0.45}
            luminanceThreshold={0.65}
            luminanceSmoothing={0.75}
            mipmapBlur
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}