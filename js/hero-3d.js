/**
 * INOVA ODONTO — 3D HOLOGRAPHIC SCANNER & PARTICLE VISUALIZER
 * Visualizador 3D de alta performance com Three.js e fallback em Canvas
 */

document.addEventListener('DOMContentLoaded', () => {
  initHero3DVisualizer();
});

function initHero3DVisualizer() {
  const container = document.getElementById('canvas-3d-hero');
  if (!container) return;

  // Se Three.js estiver disponível globalmente
  if (typeof THREE !== 'undefined') {
    initThreeScene(container);
  } else {
    initCanvasFallback(container);
  }
}

function initThreeScene(container) {
  try {
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Sistema de Partículas Holográficas (Nuvem de pontos dental futurista)
    const particleCount = 650;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorRedPrimary = new THREE.Color('#FF1744');
    const colorRedDark = new THREE.Color('#8B001F');
    const colorWhite = new THREE.Color('#FFFFFF');

    for (let i = 0; i < particleCount; i++) {
      // Distribuição cilíndrica/esferoidal com foco central
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 5.5 + (Math.random() * 3.5);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 1.3;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Interpolação de cores vermelhas e brancas
      const mixRatio = Math.random();
      const mixedColor = mixRatio > 0.7 ? colorWhite : (mixRatio > 0.3 ? colorRedPrimary : colorRedDark);

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Aneis orbitais 3D
    const ringGeo = new THREE.TorusGeometry(7.5, 0.04, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xE50932,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.scale.set(1.2, 1.2, 1.2);
    scene.add(ring2);

    // Animação e Interação com o Mouse
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0008;
      mouseY = (e.clientY - windowHalfY) * 0.0008;
    });

    const animate = () => {
      requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particles.rotation.y += 0.004;
      particles.rotation.x = targetY * 2;
      particles.rotation.z = targetX * 2;

      ring1.rotation.z += 0.006;
      ring2.rotation.z -= 0.005;

      renderer.render(scene, camera);
    };

    animate();

    // Redimensionamento
    window.addEventListener('resize', () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });

  } catch (err) {
    console.warn('Three.js initialization notice, using Canvas fallback:', err);
    initCanvasFallback(container);
  }
}

function initCanvasFallback(container) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.innerHTML = '';
  container.appendChild(canvas);

  const resize = () => {
    canvas.width = container.clientWidth || 380;
    canvas.height = container.clientHeight || 450;
  };
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const total = 50;
  for (let i = 0; i < total; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      alpha: Math.random() * 0.6 + 0.2
    });
  }

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Círculo central luminoso
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 180);
    grad.addColorStop(0, 'rgba(229, 9, 50, 0.25)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0, Math.PI * 2);
    ctx.fill();

    // Partículas
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.fillStyle = `rgba(255, 23, 68, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(render);
  };
  render();
}
