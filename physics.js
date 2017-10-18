var arrowMoveControls = {
    up: 38,
    down: 40,
    left: 37,
    right: 39
};
var wasdMoveControls = {
    up: 87,
    down: 83,
    left: 65,
    right: 68
};
var resetControl = 8;
var moveControls = arrowMoveControls;

var keyCodeMap = {};

var speed = 0.5;
var rotationSpeed = 0.03;

function onKeyDownUp(e) {
    e = e || event; // For IE.
    keyCodeMap[e.which] = e.type === 'keydown';
}

function doMovementLoop() {
    if (keyCodeMap[moveControls.up]) {
        shape.translateZ(-speed);
    }
    if (keyCodeMap[moveControls.left]) {
        shape.rotateY(rotationSpeed);
    }
    if (keyCodeMap[moveControls.right]) {
        shape.rotateY(-rotationSpeed);
    }
    if (keyCodeMap[moveControls.down]) {
        shape.translateZ(speed);
    }
    if (keyCodeMap[resetControl]) {
        shape.rotation.y = 0;
        shape.position.set(0, shape.position.y, 0);
    }
}