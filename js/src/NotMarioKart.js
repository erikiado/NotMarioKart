/**
 * Main file of the game.
 */

const NotMarioKart = (function() {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    const miniMapRenderer = new THREE.WebGLRenderer();
    const miniMapCamera = new THREE.OrthographicCamera(
        -WINDOW_WIDTH,
        WINDOW_WIDTH,
        WINDOW_HEIGHT,
        -WINDOW_HEIGHT,
        TOP_CAMERA_DIST - 50,
        TOP_CAMERA_DIST + 50
    );

    function buildFloor() {
        let curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 500, 0),
            new THREE.Vector3(-200, 500, 0),
            new THREE.Vector3(-200, 800, 0),
            new THREE.Vector3(600, 800, 0),
            new THREE.Vector3(600, 500, 0),
            new THREE.Vector3(300, 500, 0),
            new THREE.Vector3(300, 0, 0),
            new THREE.Vector3(800, 0, 0),
            new THREE.Vector3(800, -500, 0),
            new THREE.Vector3(0, -500, 0)
        ]);
        curve.closed = true;

        let extrudeSettings = {
            steps: 100,
            extrudePath: curve
        };

        // Shape that gets extruded through the curve
        let shape = new THREE.Shape([
            new THREE.Vector2(2 * CAR_SIZE_Y, 0),
            new THREE.Vector2(0, 5 * CAR_SIZE_X),
            new THREE.Vector2(0, -5 * CAR_SIZE_X)
        ]);

        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        let materials = [];
        for (let i = 0; i < NUMBER_COLORS; i++) {
            materials.push(
                new THREE.MeshBasicMaterial({
                    color: ROAD_COLORS[i],
                    side: THREE.DoubleSide
                    //wireframe: true // This makes track more Tron-like
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
        renderer.domElement.style.position = 'fixed';
        document.body.appendChild(renderer.domElement);
        renderer.autoClear = false;

        miniMapRenderer.setSize(WINDOW_WIDTH / 4, WINDOW_HEIGHT / 4);
        miniMapRenderer.setPixelRatio(window.devicePixelRatio);
        miniMapRenderer.domElement.style.position = 'fixed';
        miniMapRenderer.domElement.style.top = '5%';
        miniMapRenderer.domElement.style.left = '70%';
        miniMapRenderer.domElement.style.zIndex = '2';
        miniMapRenderer.domElement.style.outline = 'white solid';
        document.body.appendChild(miniMapRenderer.domElement);
        miniMapRenderer.autoClear = false;

        miniMapCamera.position.y = TOP_CAMERA_DIST;
        miniMapCamera.rotation.x = -90 * Math.PI / 180;

        buildFloor();

        scene.add(Player.playerObject);

        loop();
    }

    function loop() {
        requestAnimationFrame(loop);

        renderer.clear();
        renderer.setViewport(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
        renderer.render(scene, Player.getCamera());

        miniMapRenderer.clear();
        miniMapRenderer.setViewport(0, 0, WINDOW_WIDTH / 4, WINDOW_HEIGHT / 4);
        miniMapRenderer.render(scene, miniMapCamera);

        Player.doMovementLoop();
        miniMapCamera.position.z = Player.playerObject.position.z;
    }

    return {
        init: init
    };
})();
