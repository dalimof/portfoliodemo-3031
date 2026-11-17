import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, Component, type ReactNode } from "react";
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const vertex = `
uniform sampler2D uDepth; uniform float uTime; uniform float uProgress;
varying vec2 vUv; varying float vDepth;
void main(){
 vUv=uv; float depth=texture2D(uDepth,uv).r; vDepth=depth;
 vec3 p=position;
 p.z+=depth*(0.24+sin(uv.x*7.0+uTime*0.65)*0.075);
 p.y+=depth*sin(uTime*0.5+uv.x*8.0)*0.018;
 p.z+=depth*sin(uv.x*12.0-uTime*0.7)*0.018;
 gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
}`;
const fragment = `
uniform sampler2D uImage; uniform float uTime; uniform float uProgress; uniform float uPortrait;
varying vec2 vUv; varying float vDepth;
void main(){
 vec4 col=texture2D(uImage,vUv);
 float blossom= smoothstep(0.56,0.92,col.r)*smoothstep(0.22,0.65,col.b)*vDepth;
 col.rgb+=vec3(0.035,0.008,0.025)*blossom*(0.6+0.4*sin(uTime*0.7));
 gl_FragColor=col;
 gl_FragColor.a=mix(1.0,smoothstep(0.0,0.12,vUv.y)*smoothstep(0.0,0.07,1.0-vUv.y),uPortrait);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;

function Petals({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.5);
    s.bezierCurveTo(-0.65, -0.1, -0.4, 0.55, 0, 0.4);
    s.bezierCurveTo(0.4, 0.55, 0.65, -0.1, 0, -0.5);
    return s;
  }, []);
  const seeds = useMemo(
    () =>
      Array.from({ length: 240 }, (_, i) => ({
        x: Math.sin(i * 127.1) * 12,
        y: Math.cos(i * 74.7) * 9,
        z: 1 + (i % 9) * 0.36,
        size: 0.025 + (i % 7) * 0.009,
        speed: 0.13 + (i % 5) * 0.07,
      })),
    [],
  );
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = reduced ? 0 : clock.elapsedTime;
    seeds.forEach((s, i) => {
      dummy.position.set(
        s.x + Math.sin(t * 0.3 + i) * 0.4,
        ((s.y - t * s.speed + 30) % 18) - 9,
        s.z,
      );
      dummy.rotation.set(t * 0.6 + i, t * 0.8 + i * 2, t * 0.45 + i);
      dummy.scale.setScalar(s.size);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, seeds.length]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial
        color="#ffb9df"
        emissive="#ff65ba"
        emissiveIntensity={0.15}
        roughness={0.7}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

function World({ progress, reduced }: { progress: React.RefObject<number>; reduced: boolean }) {
  const [image, depth, cloud] = useLoader(THREE.TextureLoader, [
    "/images/dream-big.png",
    "/images/depth.png",
    "/images/cloud.png",
  ]);
  image.colorSpace = THREE.SRGBColorSpace;
  const { viewport } = useThree();
  const portrait = viewport.width < viewport.height * 0.9;
  const width = portrait
    ? viewport.width * 1.04
    : Math.max(viewport.width, (viewport.height * 1672) / 941) * 1.03;
  const uniforms = useMemo(
    () => ({
      uImage: { value: image },
      uDepth: { value: depth },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPortrait: { value: portrait ? 1 : 0 },
    }),
    [image, depth, portrait],
  );
  const haze = useRef<THREE.Group>(null);
  useFrame(({ clock, camera, pointer }, delta) => {
    const p = progress.current;
    uniforms.uTime.value = reduced ? 0 : clock.elapsedTime;
    uniforms.uProgress.value = p;
    const x = p < 0.3 ? -p * 5 : -1.5 + (p - 0.3) * 5;
    const targetX = reduced ? 0 : x * (portrait ? 0.2 : 1) + pointer.x * 0.12;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3, delta);
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      reduced ? 0 : Math.sin(p * Math.PI) * 0.65 + pointer.y * 0.07,
      3,
      delta,
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      reduced ? 10 : 10 - Math.sin(p * Math.PI) * (portrait ? 0.8 : 2.4),
      3,
      delta,
    );
    camera.rotation.y = THREE.MathUtils.damp(
      camera.rotation.y,
      reduced ? 0 : -pointer.x * 0.006,
      3,
      delta,
    );
    if (haze.current && !reduced)
      haze.current.children.forEach((c, i) => {
        c.position.x = Math.sin(clock.elapsedTime * 0.08 + i) * 1.1 + (i % 2 ? 1 : -1) * 4;
        c.position.y = -2.7 + Math.sin(clock.elapsedTime * 0.11 + i) * 0.4;
      });
  });
  return (
    <>
      <mesh position={[0, portrait ? viewport.height * 0.19 : 0, 0]}>
        <planeGeometry args={[width, (width * 941) / 1672, 180, 100]} />
        <shaderMaterial
          transparent
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
        />
      </mesh>
      <group ref={haze}>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh key={i} position={[(i % 2 ? 1 : -1) * 4, -2.7, (i % 3) * 0.6 + 0.3]}>
            <planeGeometry args={[6 + i * 0.3, 3]} />
            <meshBasicMaterial
              map={cloud}
              transparent
              opacity={0.28}
              depthWrite={false}
              color="#ffe5f3"
            />
          </mesh>
        ))}
      </group>
      <ambientLight intensity={1.8} />
      <directionalLight position={[0, 4, 5]} intensity={2} color="#ffd0ec" />
      <Petals reduced={reduced} />
      {!portrait && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.12} luminanceThreshold={0.92} luminanceSmoothing={0.15} mipmapBlur />
        </EffectComposer>
      )}
    </>
  );
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function DreamScene({
  progress,
  reduced,
}: {
  progress: React.RefObject<number>;
  reduced: boolean;
}) {
  return (
    <div className="dream-scene" aria-hidden="true">
      <SceneBoundary>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <World progress={progress} reduced={reduced} />
          </Suspense>
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
