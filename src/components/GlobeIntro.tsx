"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TAITUNG_LAT = 22.7554;
const TAITUNG_LNG = 121.1446;
const DURATION = 10000;

function latLngToVec3(
  lat: number,
  lng: number,
  radius: number,
  THREE: typeof import("three")
) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function createEarthTexture(canvas: HTMLCanvasElement) {
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Ocean base
  ctx.fillStyle = "#1a4a6e";
  ctx.fillRect(0, 0, 2048, 1024);

  // Simplified landmasses
  ctx.fillStyle = "#3a6848";
  // Eurasia rough shape
  ctx.beginPath();
  ctx.ellipse(1200, 350, 500, 180, 0, 0, Math.PI * 2);
  ctx.fill();
  // Africa
  ctx.beginPath();
  ctx.ellipse(1080, 550, 120, 200, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Americas
  ctx.beginPath();
  ctx.ellipse(400, 350, 120, 280, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(450, 600, 100, 180, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Australia
  ctx.beginPath();
  ctx.ellipse(1600, 620, 100, 60, 0, 0, Math.PI * 2);
  ctx.fill();

  // Taiwan highlight
  const twX = ((TAITUNG_LNG + 180) / 360) * 2048;
  const twY = ((90 - TAITUNG_LAT - 2) / 180) * 1024;
  ctx.fillStyle = "#5a9068";
  ctx.beginPath();
  ctx.ellipse(twX, twY, 12, 28, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Taitung golden dot
  const ttX = ((TAITUNG_LNG + 180) / 360) * 2048;
  const ttY = ((90 - TAITUNG_LAT) / 180) * 1024;
  const grd = ctx.createRadialGradient(ttX, ttY, 0, ttX, ttY, 20);
  grd.addColorStop(0, "rgba(212,164,74,1)");
  grd.addColorStop(0.5, "rgba(212,164,74,0.4)");
  grd.addColorStop(1, "rgba(212,164,74,0)");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(ttX, ttY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Center dot
  ctx.fillStyle = "#d4a44a";
  ctx.beginPath();
  ctx.arc(ttX, ttY, 4, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

function createStars(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 800; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 1.5 + 0.5;
    const alpha = Math.random() * 0.6 + 0.2;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  return canvas;
}

interface GlobeIntroProps {
  onComplete: () => void;
}

export default function GlobeIntro({ onComplete }: GlobeIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<
    "space" | "zoom" | "atmosphere" | "ocean"
  >("space");
  const [showCTA, setShowCTA] = useState(false);

  const skip = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    document.cookie = "globe_seen=1;path=/;max-age=31536000";
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      skip();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let cleanup: (() => void) | null = null;

    import("three").then((THREE) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 100);
      camera.position.set(0, 0, 4.5);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Stars background
      const starsCanvas = document.createElement("canvas");
      createStars(starsCanvas, w, h);
      const starsEl = starsCanvas;
      starsEl.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;z-index:0;";
      container.insertBefore(starsEl, container.firstChild);

      // Earth
      const earthCanvas = document.createElement("canvas");
      createEarthTexture(earthCanvas);
      const earthTexture = new THREE.CanvasTexture(earthCanvas);
      const earthGeo = new THREE.SphereGeometry(1, 64, 64);
      const earthMat = new THREE.MeshPhongMaterial({
        map: earthTexture,
        shininess: 10,
      });
      const earth = new THREE.Mesh(earthGeo, earthMat);
      scene.add(earth);

      // Atmosphere inner
      const atmosGeo = new THREE.SphereGeometry(1.02, 64, 64);
      const atmosMat = new THREE.MeshPhongMaterial({
        color: 0x4488cc,
        transparent: true,
        opacity: 0.08,
        side: THREE.FrontSide,
      });
      const atmos = new THREE.Mesh(atmosGeo, atmosMat);
      scene.add(atmos);

      // Outer glow with shader
      const glowGeo = new THREE.SphereGeometry(1.12, 64, 64);
      const glowMat = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPositionNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPositionNormal;
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vPositionNormal), 3.0);
            gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      scene.add(glow);

      // Taitung marker
      const taitungPos = latLngToVec3(TAITUNG_LAT, TAITUNG_LNG, 1.03, THREE);
      const markerGeo = new THREE.SphereGeometry(0.015, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0xd4a44a });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(taitungPos);
      scene.add(marker);

      // Lighting
      const ambient = new THREE.AmbientLight(0x333333);
      scene.add(ambient);
      const directional = new THREE.DirectionalLight(0xffffff, 1.2);
      directional.position.set(5, 3, 5);
      scene.add(directional);

      // Orient earth so Taitung faces camera initially
      const targetPhi = (90 - TAITUNG_LAT) * (Math.PI / 180);
      const targetTheta = (TAITUNG_LNG + 180) * (Math.PI / 180);
      earth.rotation.y = -(targetTheta - Math.PI) + 0.5;

      // Overlay for ocean transition
      const overlay = document.createElement("div");
      overlay.style.cssText =
        "position:absolute;inset:0;z-index:5;pointer-events:none;background:linear-gradient(to top,#0e3a52,transparent);opacity:0;transition:opacity 0.3s;";
      container.appendChild(overlay);

      startTimeRef.current = performance.now();

      const animate = (time: number) => {
        const elapsed = time - startTimeRef.current;
        const p = Math.min(elapsed / DURATION, 1);
        setProgress(p);

        // Phase detection
        if (p < 0.3) {
          setPhase("space");
          // Slow rotation
          earth.rotation.y += 0.001;
          // Marker pulse
          const pulse = 1 + 0.3 * Math.sin(elapsed * 0.005);
          marker.scale.setScalar(pulse);
        } else if (p < 0.65) {
          setPhase("zoom");
          const phaseP = easeInOutCubic((p - 0.3) / 0.35);
          camera.position.z = 4.5 - (4.5 - 1.3) * phaseP;
          // Stars fade
          starsEl.style.opacity = String(1 - phaseP);
          // Glow intensity
          glow.scale.setScalar(1 + phaseP * 0.15);
        } else if (p < 0.85) {
          setPhase("atmosphere");
          const phaseP = easeOutQuart((p - 0.65) / 0.2);
          camera.position.z = 1.3 - (1.3 - 0.4) * phaseP;
          atmosMat.opacity = 0.08 + phaseP * 0.3;
          overlay.style.opacity = String(phaseP * 0.8);
        } else {
          setPhase("ocean");
          const phaseP = easeOutQuart((p - 0.85) / 0.15);
          camera.position.z = 0.4 - phaseP * 0.2;
          overlay.style.opacity = String(0.8 + phaseP * 0.2);
          if (phaseP > 0.5 && !showCTA) {
            setShowCTA(true);
          }
        }

        renderer.render(scene, camera);

        if (p < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);

      const handleResize = () => {
        const nw = window.innerWidth;
        const nh = window.innerHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener("resize", handleResize);

      cleanup = () => {
        cancelAnimationFrame(animFrameRef.current);
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
        earthGeo.dispose();
        earthMat.dispose();
        earthTexture.dispose();
        atmosGeo.dispose();
        atmosMat.dispose();
        glowGeo.dispose();
        glowMat.dispose();
        markerGeo.dispose();
        markerMat.dispose();
        if (container.contains(renderer.domElement))
          container.removeChild(renderer.domElement);
        if (container.contains(starsEl)) container.removeChild(starsEl);
        if (container.contains(overlay)) container.removeChild(overlay);
      };
    });

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      cleanup?.();
    };
  }, [skip, showCTA]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black overflow-hidden"
    >
      {/* Skip button */}
      <button
        onClick={skip}
        className="absolute top-6 right-6 z-20 px-4 py-2 text-[0.75rem] tracking-[0.15em] uppercase text-white/40 border border-white/10 bg-transparent cursor-pointer transition-colors hover:text-white/70 hover:border-white/25 font-accent"
      >
        Skip
      </button>

      {/* Phase text overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-end pb-32">
        {/* Coordinates — visible in space phase */}
        <p
          className="font-accent text-[0.7rem] tracking-[0.3em] text-white/30 transition-opacity duration-1000"
          style={{ opacity: phase === "space" ? 1 : 0 }}
        >
          22.7554°N &nbsp; 121.1446°E
        </p>

        {/* Title — visible in zoom phase */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000"
          style={{ opacity: phase === "zoom" || phase === "atmosphere" ? 1 : 0 }}
        >
          <h1
            className="font-display font-extralight text-cream/90 tracking-[0.08em]"
            style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
          >
            台東
          </h1>
          <p className="font-accent text-[0.85rem] tracking-[0.4em] text-white/40 mt-2">
            TAITUNG
          </p>
        </div>

        {/* Ocean phase CTA */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000"
          style={{ opacity: showCTA ? 1 : 0 }}
        >
          <p className="font-body font-extralight text-cream/60 text-[1rem] tracking-[0.06em] mb-8">
            海風正從太平洋的方向吹來
          </p>
          <button
            onClick={skip}
            className="pointer-events-auto px-8 py-3 bg-transparent border border-cream/30 text-cream/80 font-body text-[0.88rem] cursor-pointer transition-all hover:bg-cream/10 hover:border-cream/50"
          >
            走進台東
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/5">
        <div
          className="h-full bg-gold/60 transition-[width] duration-100"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
