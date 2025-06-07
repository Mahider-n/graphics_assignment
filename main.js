// main.js - Main application script

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scene
    const { scene, camera, renderer, controls } = initScene.init();
    
    // Add lighting
    addLighting.addLighting(scene);
    
    // Create product
    const { skeleton, skeletonParts } = createProduct.createSkeleton(scene);
    
    // Initialize interaction
    interaction.init(scene, camera, renderer, skeletonParts);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update camera animation
        cameraAnimation.update(skeleton);
        
        // Update controls
        controls.update();
        // controls.update(skeleton);

        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
});