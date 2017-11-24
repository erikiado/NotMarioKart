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
    var playerId = null;

    const controls = {
        movement: {
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

    let speed = 0;
    let maxSpeed = 5;
    const acceleration = 0.05;
    const rotationSpeed = 0.05;

    const keyCodeMap = {};

    function onKeyMove(e) {
        e = e || event; // For IE.
        keyCodeMap[e.which] = e.type === 'keydown';
    }

    document.addEventListener('keydown', onKeyMove, false);
    document.addEventListener('keyup', onKeyMove, false);

    function doMovementLoop() {
        if (keyCodeMap[enabledControls.up]) {
            if (speed < maxSpeed) {
                speed += acceleration;
            }
        }
        if (keyCodeMap[enabledControls.left]) {
            playerObject.rotateY(rotationSpeed);
        }
        if (keyCodeMap[enabledControls.right]) {
            playerObject.rotateY(-rotationSpeed);
        }
        if (keyCodeMap[enabledControls.down]) {
            if (speed > 0) {
                speed -= acceleration;
                speed = Math.max(0, speed);
            }
        }
        playerObject.translateZ(speed);
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
            speed = 0;
        }
    }

    function crash() {
        // acceleration = 0;
        speed = 0;
        // if (keyCodeMap[enabledControls.up]) {
        //     playerObject.translateZ(-speed);
        // } else {
        //     playerObject.translateZ(speed);
        // }

        // for (var i = groupBlocks.length - 1; i >= 0; i--) {
        // let pos = groupBlocks[i].position;
        //     let po = playerObject.children[2].children[0]
        // for (var vertexIndex = 0; vertexIndex < po.geometry.vertices.length; vertexIndex++)
        // {
        //     var localVertex = po.geometry.vertices[vertexIndex].clone();
        //     var globalVertex = localVertex.applyMatrixplayerObject.matrix.multiplyVector3();
        //     var directionVector = globalVertex.subSelf( po.position );

        //     var ray = new THREE.Ray( po.position, directionVector.clone().normalize() );
        //     var collisionResults = ray.intersectObjects( groupBlocks );
        //     if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
        //     {
        //         console.log('perdistre')
        //         // a collision occurred... do something...
        //     }
        // }
        // if((playerObject.position.x+5 < pos.x && playerObject.position.z+5 < pos.z)|| (playerObject.position.x-5 > pos.x && playerObject.position.z+5 > pos.z))
        // console.log(groupBlocks[i])
        // }
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
        playerId: playerId,
        crash: crash
    };
})();
