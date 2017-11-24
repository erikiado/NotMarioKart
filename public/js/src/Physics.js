/**
 * Physics "engine" for the game.
 * NotPhysijs for NotMarioKart.
 */
const Physics = (function() {

    const g = -1;
    let hell = new THREE.Vector3(0, -TOP_CAMERA_DIST, 0);
    let oneDirection = new THREE.Vector3(0, 1, 0);
    let raycaster = new THREE.Raycaster();

    function gravity(object, floor) {
        // Update raycaster with an origin below the object.
        hell.x = object.position.x;
        hell.z = object.position.z;
        raycaster.set(hell, oneDirection);

        // Try to intersect with floor.
        let intersects = raycaster.intersectObject(floor, true);
        if (!intersects.length || object.position.y < 0) {
            object.position.y += g;
        }
    }

    function detectCollision(car, objects) {
        let carBox = new THREE.Box3().setFromObject(car);
        for (let i = 0; i < objects.length; i++) {
            if (carBox.intersectsBox(objects[i].boundingBox)) {
                return true;
            }
        }
        return false;
    }

    return {
        gravity: gravity,
        detectCollision: detectCollision
    };
})();
