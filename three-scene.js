/**
 * BUCC NEXUS — High-Performance 3D WebGL Hero Experience
 * Optimized for Smooth Scrolling, Zero GC, and Mobile Performance:
 * 1. Zero Garbage Collection (GC) in Render Loops (Pre-allocated scratch vectors)
 * 2. Viewport-Aware Culling: Pauses rendering when Hero is scrolled out of view (100% GPU offload)
 * 3. Transparent Alpha Background: No dark fog clipping or screen darkening
 * 4. Adaptive DPR Clamping ([1, 1.2] mobile, [1, 1.5] desktop)
 * 5. InstancedMesh Geometry for maximum particle throughput
 */

(function() {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. Skipping 3D initialization.');
    return;
  }

  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // 1. Device & Capability Detection
  const isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 1.5);

  // 2. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  // No heavy fog that dims lower content
  scene.fog = new THREE.FogExp2(0x080A0F, 0.008);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 80);
  camera.position.set(0, 0, 24);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Clear color with alpha: 0 to allow video and content transparency
  renderer.setClearColor(0x080A0F, 0);

  // 3. Pre-allocated Scratch Variables (Zero-GC in render loops)
  const scratchVec3_A = new THREE.Vector3();
  const scratchVec3_B = new THREE.Vector3();
  const scratchMatrix = new THREE.Matrix4();
  const scratchColor = new THREE.Color();
  const targetCamPos = new THREE.Vector3(0, 0, 24);
  const targetCamLook = new THREE.Vector3(0, 0, 0);
  const currentCamLook = new THREE.Vector3(0, 0, 0);

  // Pointer interaction state
  let mouseX = 0;
  let mouseY = 0;
  let hasPointerInteraction = false;

  if (!isMobile) {
    window.addEventListener('mousemove', function(e) {
      hasPointerInteraction = true;
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  // 4. Central Monumental Gateway
  const gatewayGroup = new THREE.Group();
  scene.add(gatewayGroup);

  // Outer Icosahedron Wireframe
  const outerGeo = new THREE.IcosahedronGeometry(4.2, 1);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0x6EE7FF,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  gatewayGroup.add(outerMesh);

  // Inner Octahedron (Electric Orange Accent Core)
  const coreGeo = new THREE.OctahedronGeometry(2.4, 0);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xFF6B35,
    wireframe: true,
    transparent: true,
    opacity: 0.55
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  gatewayGroup.add(coreMesh);

  // 5. Convergent Energy Trails
  const trailGroup = new THREE.Group();
  scene.add(trailGroup);

  const curveData = [
    { start: [-18, 12, -10], control: [-8, 6, -2], color: 0xFF6B35 },
    { start: [-16, -10, -8], control: [-7, -4, -1], color: 0xFF6B35 },
    { start: [18, 14, -12], control: [8, 5, -3], color: 0xFF6B35 },
    { start: [15, -12, -9], control: [6, -5, -2], color: 0xFF6B35 },
    { start: [-20, 0, -14], control: [-10, 2, -4], color: 0x6EE7FF },
    { start: [20, 0, -14], control: [10, -2, -4], color: 0x6EE7FF },
    { start: [0, 18, -10], control: [2, 8, -3], color: 0x6EE7FF },
    { start: [0, -18, -10], control: [-2, -8, -3], color: 0x6EE7FF }
  ];

  curveData.forEach(function(item) {
    const p0 = new THREE.Vector3(item.start[0], item.start[1], item.start[2]);
    const p1 = new THREE.Vector3(item.control[0], item.control[1], item.control[2]);
    const p2 = new THREE.Vector3(0, 0, 0);

    const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
    const points = curve.getPoints(40);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
      color: item.color,
      transparent: true,
      opacity: 0.45,
      linewidth: 1
    });

    const line = new THREE.Line(geometry, material);
    trailGroup.add(line);
  });

  // 6. Instanced Particles (InstancedMesh)
  const particleCount = isMobile ? 250 : 600;
  const particleGeo = new THREE.SphereGeometry(0.09, 6, 6);
  const particleMat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.7
  });

  const instancedParticles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 36;
    const y = (Math.random() - 0.5) * 28;
    const z = (Math.random() - 0.5) * 24;

    scratchMatrix.setPosition(x, y, z);
    instancedParticles.setMatrixAt(i, scratchMatrix);

    const colorPick = Math.random();
    if (colorPick < 0.4) {
      scratchColor.setHex(0xFF6B35);
    } else if (colorPick < 0.75) {
      scratchColor.setHex(0x6EE7FF);
    } else {
      scratchColor.setHex(0xF0F4F8);
    }
    instancedParticles.setColorAt(i, scratchColor);
  }

  instancedParticles.instanceMatrix.needsUpdate = true;
  if (instancedParticles.instanceColor) instancedParticles.instanceColor.needsUpdate = true;
  scene.add(instancedParticles);

  // 7. Ambient & Accent Lighting
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
  scene.add(ambientLight);

  const orangePoint = new THREE.PointLight(0xFF6B35, 4.0, 35);
  orangePoint.position.set(-6, 4, 6);
  scene.add(orangePoint);

  const cyanPoint = new THREE.PointLight(0x6EE7FF, 4.0, 35);
  cyanPoint.position.set(6, -4, 6);
  scene.add(cyanPoint);

  // 8. Zero-GC Animation Loop with Viewport Culling
  let clockTime = 0;
  let scrollY = 0;
  let isHeroVisible = true;

  window.addEventListener('scroll', function() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
    // When user scrolls past 1.4x viewport height, pause 3D calculations to guarantee buttery smooth 120fps scrolling
    isHeroVisible = scrollY < window.innerHeight * 1.4;
  }, { passive: true });

  function animate() {
    requestAnimationFrame(animate);

    // Skip all calculations and GPU drawing when hero is offscreen
    if (!isHeroVisible) {
      return;
    }

    clockTime += 0.008;

    // Rotate Central Gateway
    outerMesh.rotation.x = clockTime * 0.25;
    outerMesh.rotation.y = clockTime * 0.35;

    coreMesh.rotation.x = -clockTime * 0.45;
    coreMesh.rotation.y = clockTime * 0.5;

    // Slow orbital trail rotation
    trailGroup.rotation.z = clockTime * 0.05;

    // Subtle parallax that decays as user scrolls
    const scrollFactor = Math.min(scrollY / 800, 1.5);

    targetCamPos.x = hasPointerInteraction ? mouseX * 2.0 : Math.sin(clockTime * 0.5) * 0.6;
    targetCamPos.y = (hasPointerInteraction ? mouseY * 1.5 : Math.cos(clockTime * 0.4) * 0.5) - scrollFactor * 2.5;
    targetCamPos.z = 24 - scrollFactor * 3.0;

    camera.position.lerp(targetCamPos, 0.05);

    targetCamLook.set(0, -scrollFactor * 1.5, 0);
    currentCamLook.lerp(targetCamLook, 0.05);
    camera.lookAt(currentCamLook);

    renderer.render(scene, camera);
  }

  animate();

  // 9. Resize Handling with Adaptive DPR
  window.addEventListener('resize', function() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isNowMobile = w <= 768;
    const newDpr = Math.min(window.devicePixelRatio || 1, isNowMobile ? 1.2 : 1.5);

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(newDpr);
    renderer.setSize(w, h);
  }, { passive: true });

})();
