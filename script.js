// === Skills Carousel ===
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.skill-card');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');

  if (!track || cards.length === 0) return;

  let cardWidth = cards[0].offsetWidth + 20;
  let currentPosition = 0;

  const updateCarousel = () => {
    const container = document.querySelector('.carousel-container');
    const visibleCards = Math.floor(container.offsetWidth / cardWidth);
    const maxPosition = -(cardWidth * (cards.length - visibleCards));

    track.style.transform = `translateX(${currentPosition}px)`;

    leftArrow.style.visibility = currentPosition === 0 ? 'hidden' : 'visible';
    rightArrow.style.visibility = currentPosition <= maxPosition ? 'hidden' : 'visible';

    return maxPosition;
  };

  const handleResize = () => {
    cardWidth = cards[0].offsetWidth + 20;
    updateCarousel();
  };

  let maxPosition = updateCarousel();

  leftArrow.addEventListener('click', () => {
    currentPosition = Math.min(currentPosition + cardWidth, 0);
    maxPosition = updateCarousel();
  });

  rightArrow.addEventListener('click', () => {
    currentPosition = Math.max(currentPosition - cardWidth, maxPosition);
    maxPosition = updateCarousel();
  });

  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX && currentPosition > maxPosition) {
      currentPosition = Math.max(currentPosition - cardWidth, maxPosition);
    }
    if (touchEndX > touchStartX && currentPosition < 0) {
      currentPosition = Math.min(currentPosition + cardWidth, 0);
    }
    maxPosition = updateCarousel();
  });

  window.addEventListener('resize', handleResize);
});


// === THREE.js Animated Background ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true,
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 5000;
const posArray = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 200;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  transparent: true,
  color: 0x00e5ff,
  blending: THREE.AdditiveBlending,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Brighter large stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.3, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(50).fill().forEach(addStar);

function animate() {
  requestAnimationFrame(animate);
  particlesMesh.rotation.x += 0.0002;
  particlesMesh.rotation.y += 0.0003;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;
  camera.position.x = x * 5;
  camera.position.y = y * 5;
  camera.lookAt(scene.position);
});
