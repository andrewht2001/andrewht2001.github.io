// Three.js Background Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    alpha: false,
    antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1); // Black background
document.body.insertBefore(renderer.domElement, document.body.firstChild);

// Create sphere
const geometry = new THREE.SphereGeometry(1, 128, 128);
const material = new THREE.MeshStandardMaterial({
    color: 0xdddddd, // Light grey color
    roughness: 0.7,
    metalness: 0.0,
    emissive: 0x111111,
    side: THREE.DoubleSide,
    flatShading: false
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Add raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Add click event listener to canvas
renderer.domElement.addEventListener('click', (event) => {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObject(sphere);

    if (intersects.length > 0) {
        // Sphere was clicked
        // Animate camera to zoom into sphere
        gsap.to(camera.position, {
            duration: 1,
            x: 0,
            y: 0,
            z: 1,
            ease: "power1.in",
            onComplete: () => {
                // After zoom animation completes, show main content
                document.getElementById('main').classList.add('visible');
                document.querySelector('canvas').classList.add('fade-out');
                document.getElementById('blue-overlay').style.opacity = '0';
                document.getElementById('enter-button').style.display = 'none';
                document.getElementById('wrapper').style.pointerEvents = 'auto';
            }
        });
    }
});

// Add ambient light with higher intensity
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Create colored directional lights
const colors = [
    0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff,
    0x00ffff, 0xff8800, 0x8800ff, 0x88ff00, 0xff0088
];
const lights = [];

// Create lights in multiple rings
colors.forEach((color, index) => {
    const light = new THREE.SpotLight(color, 1);
    light.castShadow = false;
    const ringIndex = Math.floor(index / 5);
    const angle = (index % 5) * (Math.PI * 2 / 5) + (ringIndex * Math.PI / 10);
    const radius = 100 + ringIndex * 20; // Increased base radius and spacing
    
    // Position lights in a more spherical pattern
    const height = Math.sin(angle * 2) * (2.5 - ringIndex * 0.4); // Increased height range
    light.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
    );
    
    // Point the light at the center
    light.target.position.set(0, 0, 0);
    scene.add(light.target);
    
    // Add light to scene
    scene.add(light);
    lights.push(light);
});

// Position camera
camera.position.z = 4.5;

// Animation
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    
    // Update light positions
    lights.forEach((light, index) => {
        const ringIndex = Math.floor(index / 5);
        const baseAngle = (index % 5) * (Math.PI * 2 / 5);
        const angle = baseAngle + time * (0.5 + ringIndex * 0.2);
        const radius = 100 + ringIndex * 20;
        
        // Calculate position with increased vertical movement
        const x = Math.cos(angle) * radius;
        const y = Math.sin(time * 0.3 + index) * (2 - ringIndex * 0.3);
        const z = Math.sin(angle) * radius;
        
        light.position.set(x, y, z);
    });
    
    time += 0.01;
    renderer.render(scene, camera);
}

// Start animation
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Stop rendering when canvas fades out
document.querySelector('canvas').addEventListener('transitionend', function(e) {
    if (e.propertyName === 'opacity' && this.style.opacity === '0') {
        renderer.dispose();
    }
});

// Debug logs
console.log('Three.js scene initialized');
console.log('Canvas dimensions:', renderer.domElement.width, renderer.domElement.height);
console.log('Canvas position:', renderer.domElement.style.position);

// Update renderer settings for better quality
renderer.setPixelRatio(window.devicePixelRatio);
renderer.antialias = true; 