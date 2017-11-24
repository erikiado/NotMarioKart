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

    const players = {};

    function initSocketEvent() {
        var socket = io({ transports: ['websocket'], upgrade: false });

        // TODO: show modal with name form, then emit name

        socket.on('all-players', function(data) {
            console.log('[all-players]', data);
            data.forEach(function(player) {
                const pos = player.position;
                const rot = player.rotation;
                const car = makeCarObject();
                players[player.id] = {
                    position: pos,
                    rotation: rot,
                    car: car
                };
                car.position.set(pos.x, pos.y, pos.z);
                car.rotation.set(rot.x, rot.y, rot.z);
                scene.add(car);
            });
        });

        socket.on('player-joined', function(player) {
            toastr.success(`player ${player.id} has joined.`);
            console.log('[player-joined]', player);
            const pos = player.position;
            const rot = player.rotation;
            const car = makeCarObject();
            players[player.id] = {
                position: pos,
                rotation: rot,
                car: car
            };
            car.position.set(pos.x, pos.y, pos.z);
            car.rotation.set(rot.x, rot.y, rot.z);
            scene.add(car);
        });

        socket.on('player-left', function(playerId) {
            toastr.error(`Player ${playerId} has left.`);
            console.log('[player-left]', playerId);
            const car = players[playerId].car;
            scene.remove(car);
            delete players[playerId];
        });

        socket.on('update-player', function(player) {
            console.log('[update-player]', player);
            const id = player.id;
            const pos = player.position;
            const rot = player.rotation;
            const p = players[id];
            p.car.position.set(pos.x, pos.y, pos.z);
            p.car.rotation.set(rot.x, rot.y, rot.z);
        });

        socket.on('start-countdown', function(seconds) {
            toastr.info(`${seconds} seconds before the race starts.`);
            console.log('[start-countdown]', seconds);
            // TODO: show "x seconds before start"
        });

        socket.on('start', function() {
            toastr.info('The race has started.');
            console.log('[start]');
            // TODO: notify the game has started
            // TODO: disable moving if not started
            // TODO: everyone needs a name first (don't hide modal)
            // TODO: everyone needs to be ready
            // TODO: 2+ players
        });

        socket.on('finished', function(time) {
            toastr.info('You finished.');
            console.log('[finished]', time);
            // TODO: show modal "waiting for others, your time is x"
        });

        socket.on('stop', function(players) {
            toaster.info('The race is over.');
            console.log('[stop]', stop);
            // TODO: all players are finished, show ranking and play again button
            players.forEach(function(player) {
                // sorted by ranking :-)
                const name = player.name;
                const time = time;
            });
        });

        window.setInterval(function() {
            const p = Player.playerObject;
            socket.emit('update-player', {
                position: {
                    x: p.position.x,
                    y: p.position.y,
                    z: p.position.z
                },
                rotation: {
                    x: p.rotation._x,
                    y: p.rotation._y,
                    z: p.rotation._z
                }
            });
        }, 1000 / 80);
    }

    function makeCarObject() {
        const loader = new THREE.ObjectLoader();
        const object = loader.parse(playerCar);
        return object;
    }

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
        initSocketEvent();
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

        // for (let id in players) {
        //     const p = players[id];
        //     const pos = p.position;
        //     const rot = p.rotation;
        //     p.car.position.set(pos.x, pos.y, pos.z);
        //     p.car.rotation.set(rot.x, rot.y, rot.z);
        // }

        Player.doMovementLoop();
        miniMapCamera.position.z = Player.playerObject.position.z;
    }

    return {
        init: init
    };
})();
