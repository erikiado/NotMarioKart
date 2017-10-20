/**
 * Everything about the Player object, its camera, the movements ...
 */

const Player = (function () {
    const camera = new THREE.PerspectiveCamera(
        75,
        WINDOW_WIDTH / WINDOW_HEIGHT,
        0.1,
        1000
    );

    const playerObject = makePlayerObject();

    const controls = {
        movement: {
            // TODO: these should be in a settings menu once we have one.
            arrows: {
                up: 38,
                down: 40,
                left: 37,
                right: 39
            },
            wasd: {
                up: 87,
                down: 83,
                left: 65,
                right: 68
            }
        },
        reset: 8
    };

    let enabledControls = controls.movement.arrows;

    const speed = 0.5;
    const rotationSpeed = 0.03;

    const keyCodeMap = {};

    function onKeyMove(e) {
        e = e || event; // For IE.
        keyCodeMap[e.which] = e.type === 'keydown';
    }

    document.addEventListener('keydown', onKeyMove, false);
    document.addEventListener('keyup', onKeyMove, false);

    function doMovementLoop() {
        if (keyCodeMap[enabledControls.up]) {
            playerObject.translateZ(-speed);
        }
        if (keyCodeMap[enabledControls.left]) {
            playerObject.rotateY(rotationSpeed);
        }
        if (keyCodeMap[enabledControls.right]) {
            playerObject.rotateY(-rotationSpeed);
        }
        if (keyCodeMap[enabledControls.down]) {
            playerObject.translateZ(speed);
        }
        if (keyCodeMap[controls.reset]) {
            playerObject.rotation.y = 0;
            playerObject.position.set(0, playerObject.position.y, 0);
        }
    }

    function makePlayerObject() {
        const texture = new THREE.TextureLoader().load('/assets/object-textures/player.jpg');
        const geometry = new THREE.BoxGeometry(
            CAR_SIZE_X,
            CAR_SIZE_Y,
            CAR_SIZE_Z
        );
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const object = new THREE.Mesh(geometry, material);

        object.position.y = object.geometry.parameters.height / 2;

        camera.position.x = 1;
        camera.position.y = 10;
        camera.position.z = 15;

        object.add(camera);
        NotMarioKart.addToScene(object);

        return object;
    }

    return {
        doMovementLoop: doMovementLoop,
        playerObject: playerObject,
        camera: camera
    };
})();
