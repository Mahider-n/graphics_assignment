// createProduct.js - Skeleton creation module
const createProduct = (() => {
    let skeleton, skeletonParts = {};
    
    function createSkeleton(scene) {
        skeleton = new THREE.Group();
        
        // Create improved bone material
        const boneMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xEDE7DC, // Light ivory color
            roughness: 0.7,
            metalness: 0.3,
            bumpScale: 0.005
        });
        
        // Create joint material (slightly different color)
        const jointMaterial = boneMaterial.clone();
        jointMaterial.color.set(0xE0D4C5);
        
        // Skull
        const skullGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const skull = new THREE.Mesh(skullGeometry, boneMaterial);
        skull.position.y = 1.7;
        skeleton.add(skull);
        skeletonParts.skull = skull;
        
        // Spine
        const spineGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
        const spine = new THREE.Mesh(spineGeometry, boneMaterial);
        spine.position.y = 1.2;
        skeleton.add(spine);
        skeletonParts.spine = spine;
        
        // Ribs
        const ribsGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.2);
        const ribs = new THREE.Mesh(ribsGeometry, boneMaterial);
        ribs.position.y = 1.2;
        ribs.position.z = 0.1;
        skeleton.add(ribs);
        skeletonParts.ribs = ribs;
        
        // Pelvis
        const pelvisGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.3);
        const pelvis = new THREE.Mesh(pelvisGeometry, boneMaterial);
        pelvis.position.y = 0.8;
        skeleton.add(pelvis);
        skeletonParts.pelvis = pelvis;
        
        // Left Arm (group)
        const leftArmGroup = new THREE.Group();
        // Upper arm
        const leftUpperArmGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.5, 16);
        leftUpperArmGeometry.rotateZ(Math.PI/2);
        const leftUpperArm = new THREE.Mesh(leftUpperArmGeometry, boneMaterial);
        leftUpperArm.position.set(-0.3, 1.3, 0);
        leftArmGroup.add(leftUpperArm);
        // Lower arm
        const leftLowerArmGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 16);
        leftLowerArmGeometry.rotateZ(Math.PI/2);
        const leftLowerArm = new THREE.Mesh(leftLowerArmGeometry, boneMaterial);
        leftLowerArm.position.set(-0.8, 1.3, 0);
        leftArmGroup.add(leftLowerArm);
        // Hand
        const leftHandGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const leftHand = new THREE.Mesh(leftHandGeometry, jointMaterial);
        leftHand.position.set(-1.0, 1.3, 0);
        leftArmGroup.add(leftHand);
        skeleton.add(leftArmGroup);
        skeletonParts.leftArm = leftArmGroup;
        
        // Right Arm (group)
        const rightArmGroup = new THREE.Group();
        const rightUpperArm = leftUpperArm.clone();
        rightUpperArm.position.x = 0.3;
        rightArmGroup.add(rightUpperArm);
        const rightLowerArm = leftLowerArm.clone();
        rightLowerArm.position.x = 0.8;
        rightArmGroup.add(rightLowerArm);
        const rightHand = leftHand.clone();
        rightHand.position.x = 1.0;
        rightArmGroup.add(rightHand);
        skeleton.add(rightArmGroup);
        skeletonParts.rightArm = rightArmGroup;
        
        // Left Leg (group)
        const leftLegGroup = new THREE.Group();
        // Upper leg
        const leftUpperLegGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 16);
        const leftUpperLeg = new THREE.Mesh(leftUpperLegGeometry, boneMaterial);
        leftUpperLeg.position.set(-0.2, 0.4, 0);
        leftLegGroup.add(leftUpperLeg);
        // Lower leg
        const leftLowerLegGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.7, 16);
        const leftLowerLeg = new THREE.Mesh(leftLowerLegGeometry, boneMaterial);
        leftLowerLeg.position.set(-0.2, -0.35, 0);
        leftLegGroup.add(leftLowerLeg);
        // Foot
        const leftFootGeometry = new THREE.BoxGeometry(0.15, 0.07, 0.3);
        const leftFoot = new THREE.Mesh(leftFootGeometry, jointMaterial);
        leftFoot.position.set(-0.2, -0.7, 0.15);
        leftLegGroup.add(leftFoot);
        skeleton.add(leftLegGroup);
        skeletonParts.leftLeg = leftLegGroup;
        
        // Right Leg (group)
        const rightLegGroup = new THREE.Group();
        const rightUpperLeg = leftUpperLeg.clone();
        rightUpperLeg.position.x = 0.2;
        rightLegGroup.add(rightUpperLeg);
        const rightLowerLeg = leftLowerLeg.clone();
        rightLowerLeg.position.x = 0.2;
        rightLegGroup.add(rightLowerLeg);
        const rightFoot = leftFoot.clone();
        rightFoot.position.x = 0.2;
        rightLegGroup.add(rightFoot);
        skeleton.add(rightLegGroup);
        skeletonParts.rightLeg = rightLegGroup;
        
        // Center the skeleton
        scene.add(skeleton);
        
        // Move entire skeleton up so feet are above floor
        skeleton.position.y = 1.0;
        
        // Create medical examination table - FIXED ORIENTATION
        const tableGeometry = new THREE.BoxGeometry(7, 0.2, 4);
        const tableMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x3A5F7F, // Deep blue medical table color
            roughness: 0.6,
            metalness: 0.3
        });
        
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.y = -0.1;
        table.receiveShadow = true;
        scene.add(table);
        
        // Add table legs
        const legMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2C3E50,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const legPositions = [
            [-3.5, -1.0, -1.5],
            [-3.5, -1.0, 1.5],
            [3.5, -1.0, -1.5],
            [3.5, -1.0, 1.5]
        ];
        
        legPositions.forEach(pos => {
            const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.8, 16);
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(pos[0], pos[1], pos[2]);
            leg.castShadow = true;
            scene.add(leg);
        });
        
        return { skeleton, skeletonParts };
    }
    
    return {
        createSkeleton: createSkeleton,
        getSkeleton: () => skeleton,
        getSkeletonParts: () => skeletonParts
    };
})();




// // createProduct.js - Product creation module

// const createProduct = (() => {
//     // Product variables
//     let chair, chairParts = {};
    
//     // Create the chair product
//     function createChair(scene) {
//         chair = new THREE.Group();
        
//         // Create materials
//         const seatMaterial = new THREE.MeshStandardMaterial({ 
//             color: 0x1e90ff,
//             roughness: 0.4,
//             metalness: 0.2
//         });
        
//         const legMaterial = new THREE.MeshStandardMaterial({ 
//             color: 0x333333,
//             roughness: 0.7,
//             metalness: 0.5
//         });
        
//         const backMaterial = new THREE.MeshStandardMaterial({ 
//             color: 0x1e90ff,
//             roughness: 0.4,
//             metalness: 0.2
//         });
        
//         const armMaterial = new THREE.MeshStandardMaterial({ 
//             color: 0x1e90ff,
//             roughness: 0.4,
//             metalness: 0.2
//         });
        
//         // Seat
//         const seatGeometry = new THREE.BoxGeometry(2.5, 0.2, 2.5);
//         const seat = new THREE.Mesh(seatGeometry, seatMaterial);
//         seat.position.y = 1.2;
//         seat.castShadow = true;
//         seat.receiveShadow = true;
//         chair.add(seat);
//         chairParts.seat = seat;
        
//         // Backrest
//         const backGeometry = new THREE.BoxGeometry(2.5, 1.5, 0.2);
//         const back = new THREE.Mesh(backGeometry, backMaterial);
//         back.position.set(0, 1.95, -1.25);
//         back.castShadow = true;
//         chair.add(back);
//         chairParts.back = back;
        
//         // Front legs
//         for (let i = -1; i <= 1; i += 2) {
//             const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 16);
//             const leg = new THREE.Mesh(legGeometry, legMaterial);
//             leg.position.set(i * 1.0, 0.6, 0.8);
//             leg.castShadow = true;
//             chair.add(leg);
//             chairParts.leg1 = leg; // Note: This will overwrite, but we just need reference to one for demo
//         }
        
//         // Back legs
//         for (let i = -1; i <= 1; i += 2) {
//             const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 16);
//             const leg = new THREE.Mesh(legGeometry, legMaterial);
//             leg.position.set(i * 1.0, 0.6, -0.8);
//             leg.castShadow = true;
//             chair.add(leg);
//             chairParts.leg2 = leg; // Note: This will overwrite, but we just need reference to one for demo
//         }
        
//         // Seat support
//         const supportGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.0, 16);
//         const support = new THREE.Mesh(supportGeometry, legMaterial);
//         support.position.set(0, 0.8, 0);
//         support.rotation.x = Math.PI / 2;
//         support.castShadow = true;
//         chair.add(support);
//         chairParts.support = support;
        
//         // Armrest
//         const armGeometry = new THREE.BoxGeometry(0.2, 0.1, 1.2);
//         const arm = new THREE.Mesh(armGeometry, armMaterial);
//         arm.position.set(1.35, 1.7, 0);
//         arm.castShadow = true;
//         chair.add(arm);
//         chairParts.arm = arm;
        
//         // Center the chair
//         scene.add(chair);
        
//         // Add floor
//         const floorGeometry = new THREE.PlaneGeometry(20, 20);
//         const floorMaterial = new THREE.MeshStandardMaterial({ 
//             color: 0x444466,
//             roughness: 0.8,
//             metalness: 0.2
//         });
//         const floor = new THREE.Mesh(floorGeometry, floorMaterial);
//         floor.rotation.x = -Math.PI / 2;
//         floor.position.y = -0.01;
//         floor.receiveShadow = true;
//         scene.add(floor);
        
//         return { chair, chairParts };
//     }
    
//     // Public API
//     return {
//         createChair,
//         getChair: () => chair,
//         getChairParts: () => chairParts
//     };
// })();