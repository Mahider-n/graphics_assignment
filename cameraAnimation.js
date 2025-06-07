
// cameraAnimation.js - Camera animation module

const cameraAnimation = (() => {
    // Animation variables
    let autoRotate = true;
    let clock = new THREE.Clock();
    
    // Toggle auto rotation
    function toggleAutoRotation() {
        autoRotate = !autoRotate;
        return autoRotate;
    }
    
    // Update animation
    function update(skeleton) {
        const delta = clock.getDelta();
        
        // Auto rotation
        if (autoRotate && skeleton) {
            skeleton.rotation.y += delta * 0.3;
        }
    }
    
    // Public API
    return {
        toggleAutoRotation,
        update
    };
})();