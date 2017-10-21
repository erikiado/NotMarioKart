/**
 * Main file of the game.
 */

const NotMarioKart = (function () {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    const miniMapCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    function buildFloor() {
        const geometry = new THREE.PlaneGeometry(
            WORLD_WIDTH,
            WORLD_HEIGHT,
            WORLD_SIDE_SIZE,
            1
        );
        let materials = [];
        for (let i = 0; i < NUMBER_COLORS; i++) {
            materials.push(
                new THREE.MeshBasicMaterial({
                    color: ROAD_COLORS[i],
                    side: THREE.DoubleSide
                })
            );
        }
        const geoFacesLength = geometry.faces.length / 2;
        for (let i = 0; i < geoFacesLength; i++) {
            let j = i * 2; // <-- Added this back so we can do every other 'face'

            geometry.faces[j].materialIndex =
                (i + Math.floor(i / WORLD_SIDE_SIZE)) % NUMBER_COLORS;

            geometry.faces[j + 1].materialIndex =
                (i + Math.floor(i / WORLD_SIDE_SIZE)) % NUMBER_COLORS; // Other half of the same face
        }

        let floor = new THREE.Mesh(geometry, materials);
        floor.rotateX(-Math.PI / 2);
        floor.position.y = 0;

        scene.add(floor);
    }

    function init() {
        renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.domElement.style.position = 'relative';
        document.body.appendChild(renderer.domElement);
        renderer.autoClear = false;

        miniMapCamera.position.y = 500;
        miniMapCamera.rotation.x = -90 * Math.PI / 180;

        buildFloor();

        scene.add(Player.playerObject);

        loop();
    }

    function loop() {
        requestAnimationFrame(loop);

        renderer.clear();

        renderer.setViewport(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
        renderer.render(scene, Player.camera);

        renderer.setViewport(WINDOW_WIDTH - 200, 50, 150, 150);
        renderer.render(scene, miniMapCamera);

        Player.doMovementLoop();
    }

    return {
        init: init
    };
})();
