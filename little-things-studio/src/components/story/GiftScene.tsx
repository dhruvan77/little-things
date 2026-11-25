"use client";
/**
 * Three.js (React Three Fiber) gift box for the hero.
 * - Colours are read from the site's CSS palette variables (no new colours).
 * - Reads scroll-driven values from a mutable ref (no React re-renders per frame).
 * - Mouse-based parallax tilt, floating idle motion, drifting sparkles and confetti.
 * Loaded with next/dynamic({ ssr:false }) so it never touches SSR / hydration.
 */
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type SceneState = { ribbon: number; lid: number; fade: number };
type Pal = { body: string; lid: string; ribbon: string; gold: string; blush: string; sage: string };

const cssVar = (n: string, fb: string) => (typeof document === "undefined" ? fb : getComputedStyle(document.documentElement).getPropertyValue(n).trim() || fb);
const readPalette = (): Pal => ({
  body: cssVar("--color-surface-container-high", "#ede7df"), lid: cssVar("--color-surface-container-highest", "#e7e2da"),
  ribbon: cssVar("--color-terracotta", "#c98c58"), gold: cssVar("--color-tertiary-fixed-dim", "#fcb880"),
  blush: cssVar("--color-blush", "#e9bfc1"), sage: cssVar("--color-sage", "#b9c6b1"),
});

/** Small seeded PRNG: keeps particle layouts deterministic and render-pure. */
const seeded = (seed: number) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

type Pointer = { current: { x: number; y: number } };

function GiftBox({ state, pal, pointer }: { state: { current: SceneState }; pal: Pal; pointer: Pointer }) {
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const bow = useRef<THREE.Group>(null);
  const bandA = useRef<THREE.Mesh>(null);
  const bandB = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime, s = state.current, g = group.current, l = lid.current, b = bow.current;
    if (!g || !l || !b) return;
    // mouse parallax tilt + slow idle spin + float
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.current.x * 0.7 + Math.sin(t * 0.35) * 0.3 + s.ribbon * 0.35, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.3 - pointer.current.y * 0.35, 4, dt);
    g.position.y = Math.sin(t * 1.1) * 0.08 - 0.7 - s.fade * 1.2;
    g.scale.setScalar(Math.max(0.001, 1 - s.fade * 0.7));
    g.visible = s.fade < 0.995;
    // lid lifts and tips
    l.position.y = 0.78 + s.lid * 2.4;
    l.rotation.z = s.lid * 0.45;
    l.rotation.x = -s.lid * 0.25;
    // bow unties: shrinks, spins and floats away
    b.scale.setScalar(Math.max(0.0001, 1 - s.ribbon * 1.2));
    b.position.y = 0.2 + s.ribbon * 1.4;
    b.rotation.y = s.ribbon * 3;
    // ribbon bands on the lid slide away
    if (bandA.current) bandA.current.scale.z = Math.max(0.0001, 1 - s.ribbon * 1.1);
    if (bandB.current) bandB.current.scale.x = Math.max(0.0001, 1 - s.ribbon * 1.1);
  });

  const mat = (c: string, r = 0.55) => <meshStandardMaterial color={c} roughness={r} metalness={0.05} />;
  return (
    <group ref={group} position={[0, -0.7, 0]}>
      {/* base + ribbon wrap */}
      <mesh><boxGeometry args={[2, 1.3, 2]} />{mat(pal.body)}</mesh>
      <mesh><boxGeometry args={[0.34, 1.32, 2.02]} />{mat(pal.ribbon, 0.35)}</mesh>
      <mesh><boxGeometry args={[2.02, 1.32, 0.34]} />{mat(pal.ribbon, 0.35)}</mesh>
      {/* lid group */}
      <group ref={lid} position={[0, 0.78, 0]}>
        <mesh><boxGeometry args={[2.22, 0.38, 2.22]} />{mat(pal.lid)}</mesh>
        <mesh ref={bandA} position={[0, 0.005, 0]}><boxGeometry args={[0.36, 0.4, 2.24]} />{mat(pal.ribbon, 0.35)}</mesh>
        <mesh ref={bandB} position={[0, 0.006, 0]}><boxGeometry args={[2.24, 0.4, 0.36]} />{mat(pal.ribbon, 0.35)}</mesh>
        <group ref={bow} position={[0, 0.2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0.75]} position={[-0.3, 0.12, 0]}><torusGeometry args={[0.3, 0.075, 14, 28, Math.PI * 1.65]} />{mat(pal.ribbon, 0.35)}</mesh>
          <mesh rotation={[Math.PI / 2, 0, Math.PI - 0.75]} position={[0.3, 0.12, 0]}><torusGeometry args={[0.3, 0.075, 14, 28, Math.PI * 1.65]} />{mat(pal.ribbon, 0.35)}</mesh>
          <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.13, 20, 20]} />{mat(pal.ribbon, 0.3)}</mesh>
          <mesh position={[-0.12, 0.02, 0.1]} rotation={[0.4, 0, 0.5]}><boxGeometry args={[0.12, 0.34, 0.03]} />{mat(pal.ribbon, 0.35)}</mesh>
          <mesh position={[0.12, 0.02, 0.1]} rotation={[0.4, 0, -0.5]}><boxGeometry args={[0.12, 0.34, 0.03]} />{mat(pal.ribbon, 0.35)}</mesh>
        </group>
      </group>
    </group>
  );
}

/** Drifting golden sparkles. */
function Sparkles({ color, count = 90 }: { color: string; count?: number }) {
  const geo = useRef<THREE.BufferGeometry>(null);
  const { pos, speed } = useMemo(() => {
    const rnd = seeded(7), pos = new Float32Array(count * 3), speed = new Float32Array(count);
    for (let i = 0; i < count; i++) { pos[i * 3] = (rnd() - 0.5) * 8; pos[i * 3 + 1] = (rnd() - 0.5) * 6; pos[i * 3 + 2] = (rnd() - 0.5) * 4; speed[i] = 0.08 + rnd() * 0.22; }
    return { pos, speed };
  }, [count]);
  useFrame(({ clock }, dt) => {
    const a = geo.current?.attributes.position as THREE.BufferAttribute | undefined; if (!a) return;
    for (let i = 0; i < count; i++) { let y = a.getY(i) + speed[i] * dt; if (y > 3.2) y = -3.2; a.setY(i, y); a.setX(i, a.getX(i) + Math.sin(clock.elapsedTime * 0.6 + i) * 0.002); }
    a.needsUpdate = true;
  });
  return <points><bufferGeometry ref={geo}><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry><pointsMaterial size={0.07} color={color} transparent opacity={0.9} depthWrite={false} sizeAttenuation /></points>;
}

/** Slowly falling confetti rendered as one instanced mesh. */
function Confetti({ colors, count = 60 }: { colors: string[]; count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => { const rnd = seeded(21); return Array.from({ length: count }, () => ({ x: (rnd() - 0.5) * 7.5, y: rnd() * 6.4 - 3.2, z: (rnd() - 0.5) * 3.5 - 0.5, r: rnd() * 6, vr: (rnd() - 0.5) * 2.4, v: 0.25 + rnd() * 0.4 })); }, [count]);
  useEffect(() => { const m = mesh.current; if (!m) return; data.forEach((_, i) => m.setColorAt(i, new THREE.Color(colors[i % colors.length]))); if (m.instanceColor) m.instanceColor.needsUpdate = true; }, [data, colors]);
  useFrame((_, dt) => {
    const m = mesh.current; if (!m) return;
    data.forEach((d, i) => { d.y -= d.v * dt; if (d.y < -3.3) d.y = 3.3; d.r += d.vr * dt; dummy.position.set(d.x, d.y, d.z); dummy.rotation.set(d.r, d.r * 0.7, d.r * 0.3); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); });
    m.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={mesh} args={[undefined, undefined, count]}><planeGeometry args={[0.13, 0.22]} /><meshBasicMaterial side={THREE.DoubleSide} toneMapped={false} /></instancedMesh>;
}

export default function GiftScene({ state, active, onReady }: { state: { current: SceneState }; active: boolean; onReady?: () => void }) {
  const pal = useMemo(() => readPalette(), []);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const f = (e: PointerEvent) => { pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1; };
    window.addEventListener("pointermove", f, { passive: true });
    return () => window.removeEventListener("pointermove", f);
  }, []);
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.9, 10], fov: 36 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} frameloop={active ? "always" : "never"} onCreated={() => onReady?.()} aria-hidden>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 5, 4]} intensity={2.1} />
      <pointLight position={[-4, 1, 3]} intensity={18} color={pal.blush} />
      <GiftBox state={state} pal={pal} pointer={pointer} />
      <Sparkles color={pal.gold} />
      <Confetti colors={[pal.ribbon, pal.blush, pal.sage, pal.gold]} />
    </Canvas>
  );
}
