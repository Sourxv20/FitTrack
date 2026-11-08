import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLocation } from "react-router-dom";

export const ThreeSceneBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Determine color palette based on route
    let primaryColorHex = 0x8b5cf6; // violet
    let accentColorHex = 0x06b6d4;  // cyan

    if (location.pathname.includes("/gym")) {
      primaryColorHex = 0xff6b4a; // athletic coral
      accentColorHex = 0xf59e0b;  // amber
    } else if (location.pathname.includes("/running")) {
      primaryColorHex = 0x00f0ff; // neon cyan
      accentColorHex = 0x10b981;  // emerald
    } else if (location.pathname.includes("/progress")) {
      primaryColorHex = 0x10b981; // emerald
      accentColorHex = 0x6366f1;  // indigo
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. 3D Particle Cloud (Starfield / Athletic Kinetic Dust)
    const particleCount = 450;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(primaryColorHex);
    const c2 = new THREE.Color(accentColorHex);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 55;
      positions[i + 1] = (Math.random() - 0.5) * 45;
      positions[i + 2] = (Math.random() - 0.5) * 40;

      const mixed = Math.random() > 0.5 ? c1 : c2;
      colors[i] = mixed.r;
      colors[i + 1] = mixed.g;
      colors[i + 2] = mixed.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom circular particle texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.3, "rgba(255,255,255,0.7)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.65,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, pointsMaterial);
    scene.add(particles);

    // 3. Floating Geometric 3D Hologram (Icosahedron & Torus Ring)
    const group = new THREE.Group();

    // Wireframe Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(5.5, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: primaryColorHex,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
    group.add(icoMesh);

    // Inner Glowing Rings
    const torusGeom = new THREE.TorusGeometry(7, 0.08, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: accentColorHex,
      transparent: true,
      opacity: 0.22
    });
    const torusMesh = new THREE.Mesh(torusGeom, torusMat);
    torusMesh.rotation.x = Math.PI / 3;
    group.add(torusMesh);

    const torusGeom2 = new THREE.TorusGeometry(8.5, 0.05, 16, 100);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: primaryColorHex,
      transparent: true,
      opacity: 0.16
    });
    const torusMesh2 = new THREE.Mesh(torusGeom2, torusMat2);
    torusMesh2.rotation.y = Math.PI / 4;
    group.add(torusMesh2);

    group.position.set(10, 2, -5);
    scene.add(group);

    // 4. Mouse Interactive Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Handle Window Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation towards mouse
      targetX += (mouseX * 3 - targetX) * 0.05;
      targetY += (mouseY * 2 - targetY) * 0.05;

      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      // Rotate 3D particle dust slowly
      particles.rotation.y = elapsedTime * 0.025;
      particles.rotation.x = elapsedTime * 0.015;

      // Rotate geometric hologram
      group.rotation.x = elapsedTime * 0.08;
      group.rotation.y = elapsedTime * 0.12;
      group.position.y = 2 + Math.sin(elapsedTime * 0.8) * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      pointsMaterial.dispose();
      icoGeometry.dispose();
      icoMaterial.dispose();
      torusGeom.dispose();
      torusMat.dispose();
      torusGeom2.dispose();
      torusMat2.dispose();
      renderer.dispose();
    };
  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};
