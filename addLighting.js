// addLighting.js - Lighting module

const addLighting = (() => {
    // Add lighting to the scene
    function addLighting(scene) {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);
        
        // Hemisphere light
        const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.3);
        scene.add(hemisphereLight);
        
        // Point light
        const pointLight = new THREE.PointLight(0xffaa00, 0.5, 20);
        pointLight.position.set(-3, 3, 0);
        scene.add(pointLight);
    }
    
    // Public API
    return {
        addLighting
    };
})();