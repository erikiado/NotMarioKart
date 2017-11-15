/**
 * Everything about the Player object, its camera, the movements ...
 */

const Player = (function() {
    const povCamera = new THREE.PerspectiveCamera(
        75,
        WINDOW_WIDTH / WINDOW_HEIGHT,
        0.1,
        1000
    );

    const trackingCamera = new THREE.PerspectiveCamera(
        75,
        WINDOW_WIDTH / WINDOW_HEIGHT,
        0.1,
        1000
    );

    let currentCamera = trackingCamera;
    let getCamera = function() {
        return currentCamera;
    };

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
        switchCamera: 67,
        reset: 8
    };

    let enabledControls = controls.movement.arrows;

    const speed = 1;
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
            playerObject.translateZ(speed);
        }
        if (keyCodeMap[enabledControls.left]) {
            playerObject.rotateY(
                keyCodeMap[enabledControls.down]
                    ? -rotationSpeed
                    : rotationSpeed
            );
        }
        if (keyCodeMap[enabledControls.right]) {
            playerObject.rotateY(
                keyCodeMap[enabledControls.down]
                    ? rotationSpeed
                    : -rotationSpeed
            );
        }
        if (keyCodeMap[enabledControls.down]) {
            playerObject.translateZ(-speed);
        }
        if (keyCodeMap[controls.switchCamera]) {
            if (currentCamera === povCamera) {
                currentCamera = trackingCamera;
            } else {
                currentCamera = povCamera;
            }
            keyCodeMap[controls.switchCamera] = false;
        }
        if (keyCodeMap[controls.reset]) {
            playerObject.rotation.x = 0;
            playerObject.position.set(0, playerObject.position.x, 0);
            playerObject.rotation.y = 0;
            playerObject.position.set(0, playerObject.position.y, 0);
            playerObject.rotation.z = 0;
            playerObject.position.set(0, playerObject.position.z, 0);
        }
    }

    function crash() {
        if (keyCodeMap[enabledControls.up]) {
            playerObject.translateZ(-speed);
        } else {
            playerObject.translateZ(speed);
        }
    }

    function makePlayerObject() {
        const loader = new THREE.ObjectLoader();
        const object = loader.parse(playerCar);

        povCamera.position.y = object.scale.y * 2;
        povCamera.position.z = object.scale.z * 4;
        // trackingCamera.rotateX(0 * Math.PI / 180);
        povCamera.rotateY(180 * Math.PI / 180);

        trackingCamera.position.y = object.scale.y * 10;
        trackingCamera.position.z = object.scale.z * -20;
        // trackingCamera.rotateX(0 * Math.PI / 180);
        trackingCamera.rotateY(180 * Math.PI / 180);

        object.add(povCamera);
        object.add(trackingCamera);

        return object;
    }

    return {
        doMovementLoop: doMovementLoop,
        playerObject: playerObject,
        getCamera: getCamera,
        crash: crash
    };
})();
