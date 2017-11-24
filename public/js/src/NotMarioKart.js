/**
 * Main file of the game.
 */

const NotMarioKart = (function() {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    const miniMapRenderer = new THREE.WebGLRenderer();
    const miniMapCamera = new THREE.OrthographicCamera(
        -WINDOW_WIDTH/MINICAM_FACTOR,
        WINDOW_WIDTH/MINICAM_FACTOR,
        WINDOW_HEIGHT/MINICAM_FACTOR,
        -WINDOW_HEIGHT/MINICAM_FACTOR,
        TOP_CAMERA_DIST - 50,
        TOP_CAMERA_DIST + 50
    );
    var floor;
    //Box objects
    var objects = [];
    var checkpoints = [];
    const players = {};
    //Box positions for other players
    var boxes = [];
    var lap = 0;
    var checkLapCount = 0;
    var currentCheckpoint;
    var lastCheckpoint = 0;

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
            console.log(data);
            if(data.length == 0){
                addBoxes();
                socket.emit('send-boxes',boxes);
            }
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

        socket.on('receive-boxes', function(boxs) {
            // console.log('[player-left]', playerId);
            boxes = boxs;
            addBoxesPosition();
            // const car = players[playerId].//car;
            // scene.remove(car);
            // delete players[playerId];
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
        }, 1000 / 25);
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
                    side: THREE.DoubleSide,
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

        floor = new THREE.Mesh(geometry, materials);
        floor.rotateX(-Math.PI / 2);
        floor.position.y = 0;

        scene.add(floor);
    }

    function addCheckpoints() {
        let curvePoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(300, 0, 580),
            new THREE.Vector3(250, 0, -200),
            new THREE.Vector3(200, 0, -870),
            new THREE.Vector3(0, 0, -500),
        ];

        for (let i = 0; i < curvePoints.length; i++) {
            // console.log(curvePoints[i]);
            let check = new Checkpoint(curvePoints[i].x,
                              BOX_SIZE/2,
                              curvePoints[i].z);
            scene.updateMatrixWorld();
            // if (i != curvePoints.length-1) {
                checkpoints.push(check);
                scene.add(check.mesh);
            // }
        }
    }

    function addBoxes() {
        let min = -2000;
        let max =  2000;
        for (let i = 0; i < 1000; i++) {
            // Create random box.
            let box = new Box(Math.floor(Math.random() * ((max-min)+1) + min),
                              BOX_SIZE/2,
                              Math.floor(Math.random() * ((max-min)+1) + min));
            // Add only if it's over the floor.
            scene.updateMatrixWorld();
            Physics.gravity(box.mesh, floor);
            if (box.mesh.position.y == BOX_SIZE/2) {
                objects.push(box);
                boxes.push({
                    x: box.mesh.position.x,
                    z: box.mesh.position.z
                });
                scene.add(box.mesh);
            }
        }
    }


    function addBoxesPosition() {
        for (let i = 0; i < boxes.length; i++) {
            // Create random box.
            let box = new Box(boxes[i].x,
                              BOX_SIZE/2,
                              boxes[i].z);
            // Add only if it's over the floor.
            scene.updateMatrixWorld();
            Physics.gravity(box.mesh, floor);
            if (box.mesh.position.y == BOX_SIZE/2) {
                objects.push(box);
                scene.add(box.mesh);
            }
        }
    }

    function checkLap(){
        if(currentCheckpoint == lastCheckpoint+1){
            lastCheckpoint = currentCheckpoint;
        }
        if(currentCheckpoint == 0 && lastCheckpoint == 4){
            lastCheckpoint = currentCheckpoint;
            lap = lap + 1;
        }
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
        // addBoxes();
        addCheckpoints();

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
        if (Physics.detectCollision(Player.playerObject, objects)) {
            Player.crash();
        }
        currentCheckpoint = Physics.checkPoints(Player.playerObject,checkpoints);
        if(currentCheckpoint != -1){
            if(checkLapCount % 10 == 0){
                checkLap();
            } 
            checkLapCount += 1;
            checkLapCount = checkLapCount % 10;
        }
        miniMapCamera.position.z = Player.playerObject.position.z;

        Physics.gravity(Player.playerObject, floor);
    }

    return {
        init: init
    };
})();
