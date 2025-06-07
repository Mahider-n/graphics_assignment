// initScene.js - Scene initialization module
const initScene = (() => {
    // Scene variables
    let scene, camera, renderer, controls;
    
    // Initialize the scene
    function init() {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);
        scene.fog = new THREE.Fog(0x1a1a2e, 20, 50);
        
        // Create camera - position adjusted to see entire skeleton
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 3, 9);  // Higher and slightly farther
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('viewer'),
            antialias: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        
        // Add orbit controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 3;
        controls.maxDistance = 15;
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        return { scene, camera, renderer, controls };
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Public API
    return {
        init,
        getScene: () => scene,
        getCamera: () => camera,
        getRenderer: () => renderer,
        getControls: () => controls
    };
})();