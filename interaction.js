
// interaction.js - Interaction module
const interaction = (() => {
    let raycaster, mouse;
    let skeletonParts = {};
    let allPartMeshes = [];
    let currentHighlightedPart = null; // Track currently highlighted part
    let lastHoveredMesh = null;       // Track last hovered mesh

    function init(scene, camera, renderer, parts) {
        skeletonParts = parts;
        // Collect all mesh objects from skeleton parts
        Object.values(skeletonParts).forEach(part => {
            if (part.isGroup) {
                part.children.forEach(child => {
                    if (child.isMesh) {
                        allPartMeshes.push(child);
                        // Ensure emissive property exists for highlighting
                        if (!child.material.emissive) {
                            child.material.emissive = new THREE.Color(0x000000);
                        }
                    }
                });
            } else if (part.isMesh) {
                allPartMeshes.push(part);
                // Ensure emissive property exists for highlighting
                if (!part.material.emissive) {
                    part.material.emissive = new THREE.Color(0x000000);
                }
            }
        });

        // Initialize raycaster and mouse vector
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // FIX 1: Use allPartMeshes instead of scene.children
        renderer.domElement.addEventListener('click', (event) => onMouseClick(event, camera));
        renderer.domElement.addEventListener('mousemove', (event) => onMouseMove(event, camera, renderer));

        document.getElementById('toggle-rotation').addEventListener('click', toggleAutoRotation);
        document.getElementById('reset-view').addEventListener('click', resetCameraView);

        document.querySelectorAll('.part-list li').forEach(item => {
            item.addEventListener('click', () => {
                const part = item.getAttribute('data-part');
                highlightPart(part);
            });
        });
    }

    // FIX 2: Optimized part finding
    function findClickedPart(clickedObject) {
        // Check if it's a direct part
        for (const [name, part] of Object.entries(skeletonParts)) {
            if (part === clickedObject) return name;
        }

        // Check if it's a child of a group part
        for (const [name, part] of Object.entries(skeletonParts)) {
            if (part.isGroup && part.children.includes(clickedObject)) {
                return name;
            }
        }

        return null;
    }

    function onMouseClick(event, camera) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        
        // FIX 3: Only intersect with product parts, not entire scene
        const intersects = raycaster.intersectObjects(allPartMeshes, true);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            const partName = findClickedPart(clickedObject);
            
            if (partName) {
                highlightPart(partName);
            }
        }
    }

    function onMouseMove(event, camera, renderer) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(allPartMeshes, true);

        // FIX 4: Clear only hover effect, not click highlight
        if (lastHoveredMesh) {
            // Only clear if not currently highlighted part
            if (!currentHighlightedPart || 
                !isPartOfHighlighted(lastHoveredMesh, currentHighlightedPart)) {
                lastHoveredMesh.material.emissive.set(0x000000);
            }
            lastHoveredMesh = null;
        }

        if (intersects.length > 0) {
            const hoveredObject = intersects[0].object;
            
            // FIX 5: Skip if it's part of currently highlighted component
            if (currentHighlightedPart && 
                isPartOfHighlighted(hoveredObject, currentHighlightedPart)) {
                renderer.domElement.style.cursor = 'pointer';
                return;
            }
            
            // Apply hover effect
            hoveredObject.material.emissive.set(0x333333);
            lastHoveredMesh = hoveredObject;
            renderer.domElement.style.cursor = 'pointer';
        } else {
            renderer.domElement.style.cursor = 'auto';
        }
    }

    // Helper to check if mesh belongs to highlighted part
    function isPartOfHighlighted(mesh, partName) {
        const part = skeletonParts[partName];
        if (!part) return false;
        
        if (part.isGroup) {
            return part.children.includes(mesh);
        }
        return part === mesh;
    }

    function highlightPart(partName) {
        // Clear previous highlight if any
        if (currentHighlightedPart) {
            const prevPart = skeletonParts[currentHighlightedPart];
            resetPartAppearance(prevPart);
        }

        const part = skeletonParts[partName];
        if (!part) return;

        currentHighlightedPart = partName;

        // Show info panel
        const infoPanel = document.getElementById('info-panel');
        const partTitle = document.getElementById('part-title');
        const partInfo = document.getElementById('part-info');

        infoPanel.style.display = 'block';

        switch (partName) {
            case 'skull':
                partTitle.textContent = 'Skull';
                partInfo.textContent = 'The skull supports the face and protects the brain.';
                break;
            case 'spine':
                partTitle.textContent = 'Spine';
                partInfo.textContent = 'The spine provides structural support and houses the spinal cord.';
                break;
            case 'ribs':
                partTitle.textContent = 'Ribs';
                partInfo.textContent = 'Ribs protect the heart and lungs.';
                break;
            case 'pelvis':
                partTitle.textContent = 'Pelvis';
                partInfo.textContent = 'The pelvis connects the spine to the legs and supports organs.';
                break;
            case 'leftArm':
            case 'rightArm':
                const armSide = partName === 'leftArm' ? 'Left' : 'Right';
                partTitle.textContent = `${armSide} Arm`;
                partInfo.textContent = `The ${armSide.toLowerCase()} arm enables a wide range of motion.`;
                break;
            case 'leftLeg':
            case 'rightLeg':
                const legSide = partName === 'leftLeg' ? 'Left' : 'Right';
                partTitle.textContent = `${legSide} Leg`;
                partInfo.textContent = `The ${legSide.toLowerCase()} leg supports body weight and enables movement.`;
                break;
            default:
                partTitle.textContent = partName;
                partInfo.textContent = '';
        }

        // Apply highlight effect
        highlightPartAppearance(part);
    }

    function resetPartAppearance(part) {
        if (part.isGroup) {
            part.children.forEach(child => {
                if (child.material) {
                    child.scale.set(1, 1, 1);
                    child.material.emissive.set(0x000000);
                }
            });
        } else if (part.material) {
            part.scale.set(1, 1, 1);
            part.material.emissive.set(0x000000);
        }
    }

    function highlightPartAppearance(part) {
        if (part.isGroup) {
            part.children.forEach(child => {
                if (child.material) {
                    child.scale.set(1.1, 1.1, 1.1);
                    child.material.emissive.set(0x0044aa);
                }
            });
        } else if (part.material) {
            part.scale.set(1.1, 1.1, 1.1);
            part.material.emissive.set(0x0044aa);
        }
    }

    function toggleAutoRotation() {
        const button = document.getElementById('toggle-rotation');
        const indicator = document.querySelector('.indicator-dot');
        const autoRotate = cameraAnimation.toggleAutoRotation();

        if (autoRotate) {
            button.textContent = 'Pause Auto Rotation';
            indicator.style.background = '#00ff00';
            indicator.style.boxShadow = '0 0 10px #00ff00';
            document.querySelector('.auto-rotate-indicator span').textContent = 'Auto Rotation: ON';
        } else {
            button.textContent = 'Resume Auto Rotation';
            indicator.style.background = '#ff0000';
            indicator.style.boxShadow = '0 0 10px #ff0000';
            document.querySelector('.auto-rotate-indicator span').textContent = 'Auto Rotation: OFF';
        }
    }

    function resetCameraView() {
        const controls = initScene.getControls();
        const camera = initScene.getCamera();
        controls.reset();
        camera.position.set(0, 2, 5);
        camera.lookAt(0, 0, 0);
    }

    return {
        init,
        highlightPart
    };
})();
 