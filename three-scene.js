/**
 * BUCC NEXUS — 3D WebGL Hero Experience
 * Compliant with 3D Web & Three.js Performance Rules:
 * 1. Zero Garbage Collection (GC) in Render Loops (Pre-allocated scratch vectors)
 * 2. Mobile Touch Integrity (Pointer pass-through, coarse pointer detection)
 * 3. WebGL GPU Fill Rate & Adaptive DPR Clamping ([1, 1.25] mobile, [1, 1.5] desktop)
 * 4. Particle & Node Instancing (THREE.InstancedMesh)
 */

(function() {
  'use strict';

  // Check WebGL availability
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. Skipping 3D initialization.');
    return;
  }

  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // 1. Device & Capability Detection
  const isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);

  // 2. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080A0F, 0.018);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 24);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x080A0F, 1);

  // 3. Pre-allocated Scratch Variables (Zero-GC in render loops)
  const scratchVec3_A = new THREE.Vector3();
  const scratchVec3_B = new THREE.Vector3();
  const scratchMatrix = new THREE.Matrix4();
  const scratchColor = new THREE.Color();
  const targetCamPos = new THREE.Vector3(0, 0, 24);
  const targetCamLook = new THREE.Vector3(0, 0, 0);
  const currentCamLook = new THREE.Vector3(0, 0, 0);

  // Mouse interaction state
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

  // 4. Central Monumental Gateway (Translucent Geometric Structure)
  const gatewayGroup = new THREE.Group();
  scene.add(gatewayGroup);

  // Outer Icosahedron Wireframe
  const outerGeo = new THREE.IcosahedronGeometry(4.2, 1);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0x6EE7FF,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  gatewayGroup.add(outerMesh);

  // Inner Octahedron (Electric Orange Accent Core)
  const coreGeo = new THREE.OctahedronGeometry(2.4, 0);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xFF6B35,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  gatewayGroup.add(coreMesh);

  // Solid Translucent Core Facet
  const solidCoreGeo = new THREE.OctahedronGeometry(2.0, 0);
  const solidCoreMat = new THREE.MeshStandardMaterial({
    color: 0x080A0F,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.65
  });
  const solidCoreMesh = new THREE.Mesh(solidCoreGeo, solidCoreMat);
  gatewayGroup.add(solidCoreMesh);

  // 5. Convergent Energy Trails (Spline Curves converging into Nexus)
  const trailGroup = new THREE.Group();
  scene.add(trailGroup);

  const curveData = [
    // Orange pathways
    { start: [-18, 12, -10], control: [-8, 6, -2], color: 0xFF6B35 },
    { start: [-16, -10, -8], control: [-7, -4, -1], color: 0xFF6B35 },
    { start: [18, 14, -12], control: [8, 5, -3], color: 0xFF6B35 },
    { start: [15, -12, -9], control: [6, -5, -2], color: 0xFF6B35 },
    // Cyan pathways
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
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
      color: item.color,
      transparent: true,
      opacity: 0.35,
      linewidth: 1
    });

    const line = new THREE.Line(geometry, material);
    trailGroup.add(line);
  });

  // 6. Instanced Nodes & Floating Ambient Particles (InstancedMesh)
  const particleCount = isMobile ? 350 : 800;
  const particleGeo = new THREE.SphereGeometry(0.08, 6, 6);
  const particleMat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.6
  });

  const instancedParticles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 36;
    const y = (Math.random() - 0.5) * 28;
    const z = (Math.random() - 0.5) * 24;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    particleVelocities[i * 3] = (Math.random() - 0.5) * 0.008;
    particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
    particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;

    scratchMatrix.setPosition(x, y, z);
    instancedParticles.setMatrixAt(i, scratchMatrix);

    // Color: Alternating Orange, Cyan, White
    const colorPick = Math.random();
    if (colorPick < 0.35) {
      scratchColor.setHex(0xFF6B35);
    } else if (colorPick < 0.7) {
      scratchColor.setHex(0x6EE7FF);
    } else {
      scratchColor.setHex(0xF0F4F8);
    }
    instancedParticles.setColorAt(i, scratchColor);
  }

  instancedParticles.instanceMatrix.needsUpdate = true;
  if (instancedParticles.instanceColor) instancedParticles.instanceColor.needsUpdate = true;
  scene.add(instancedParticles);

  // 7. Ambient & Directional Lighting
  const ambientLight = new THREE.AmbientLight(0x080A0F, 2.0);
  scene.add(ambientLight);

  const orangePoint = new THREE.PointLight(0xFF6B35, 3.5, 30);
  orangePoint.position.set(-6, 4, 6);
  scene.add(orangePoint);

  const cyanPoint = new THREE.PointLight(0x6EE7FF, 3.5, 30);
  cyanPoint.position.set(6, -4, 6);
  scene.add(cyanPoint);

  // 8. Zero-GC Animation Loop
  let clockTime = 0;
  let scrollY = 0;

  window.addEventListener('scroll', function() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
  }, { passive: true });

  function animate() {
    requestAnimationFrame(animate);

    clockTime += 0.008;

    // Rotate Central Gateway
    outerMesh.rotation.x = clockTime * 0.25;
    outerMesh.rotation.y = clockTime * 0.35;

    coreMesh.rotation.x = -clockTime * 0.45;
    coreMesh.rotation.y = clockTime * 0.5;

    solidCoreMesh.rotation.x = clockTime * 0.15;
    solidCoreMesh.rotation.z = -clockTime * 0.2;

    // Slow orbital trail rotation
    trailGroup.rotation.z = clockTime * 0.05;

    // Scroll parallax & camera target calculation
    const scrollFactor = Math.min(scrollY / 1000, 2.5);

    targetCamPos.x = hasPointerInteraction ? mouseX * 2.2 : Math.sin(clockTime * 0.5) * 0.8;
    targetCamPos.y = (hasPointerInteraction ? mouseY * 1.8 : Math.cos(clockTime * 0.4) * 0.6) - scrollFactor * 3.5;
    targetCamPos.z = 24 - scrollFactor * 4;

    // Smooth camera interpolation using pre-allocated vectors (No object allocations)
    camera.position.lerp(targetCamPos, 0.04);

    targetCamLook.set(0, -scrollFactor * 2.5, 0);
    currentCamLook.lerp(targetCamLook, 0.04);
    camera.lookAt(currentCamLook);

    // Gently pulse lights
    orangePoint.intensity = 3.0 + Math.sin(clockTime * 2.0) * 0.8;
    cyanPoint.intensity = 3.0 + Math.cos(clockTime * 2.2) * 0.8;

    renderer.render(scene, camera);
  }

  animate();

  // 9. Resize Handling with DPR Clamp
  window.addEventListener('resize', function() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isNowMobile = w <= 768;
    const newDpr = Math.min(window.devicePixelRatio || 1, isNowMobile ? 1.25 : 1.5);

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(newDpr);
    renderer.setSize(w, h);
  }, { passive: true });

})();
