let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, WINDOW_WIDTH/WINDOW_HEIGHT, 0.1, 1000 );
// let helper = new THREE.CameraHelper( camera );
let camera2 = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
// let helper2 = new THREE.CameraHelper( camera2 );
let renderer = new THREE.WebGLRenderer();
// scene.add( helper2 );
renderer.setSize( WINDOW_WIDTH, WINDOW_HEIGHT );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.domElement.style.position = "relative";
// renderer2.setSize( WINDOW_WIDTH/2, WINDOW_HEIGHT );
// renderer.setClearColor (0xaaeeff, 1); // Sky color
document.body.appendChild( renderer.domElement );
renderer.autoClear = false;


// Objects
let texture = new THREE.TextureLoader().load('box.jpg')
let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let material = new THREE.MeshBasicMaterial( { map: texture } );
let shape = new THREE.Mesh( geometry, material );
// let floorColor = new THREE.MeshPhongMaterial({color:'#aaaaaa',wireframe:false});
// let floor = new THREE.Mesh(new THREE.PlaneGeometry(500,500,8,8), floorColor);


camera.position.z = 15;
camera.position.y = 10;
camera2.position.z = 0;
camera2.position.y = 500;
camera.position.x = 1;
camera2.rotation.x = -90 * Math.PI / 180;


// FLOOR ///////////////////
// Geometry
let cbgeometry = new THREE.PlaneGeometry( WORLD_WIDTH, WORLD_HEIGHT, WORLD_SIDE_SIZE, WORLD_SIDE_SIZE )
// Materials
let cbmaterials = []; 
for(let i = 0; i < ROAD_COLORS.length; i ++){
	cbmaterials.push( new THREE.MeshBasicMaterial( { color: ROAD_COLORS[i], side: THREE.DoubleSide }) );
}
let l = cbgeometry.faces.length / 2; // <-- Right here. This should still be 8x8 (64)
for( let i = 0; i < l; i ++ ) {
	j = i * 2; // <-- Added this back so we can do every other 'face'
	cbgeometry.faces[ j ].materialIndex = ((i + Math.floor(i/WORLD_SIDE_SIZE)) % NUMBER_COLORS); // The code here is changed, replacing all 'i's with 'j's. KEEP THE 8
	cbgeometry.faces[ j + 1 ].materialIndex = ((i + Math.floor(i/WORLD_SIDE_SIZE)) % NUMBER_COLORS); // Add this line in, the material index should stay the same, we're just doing the other half of the same face
}
// Mesh
cb = new THREE.Mesh( cbgeometry, cbmaterials );
cb.rotateX( - Math.PI / 2);
cb.position.y = 0;
// FLOOR ///////////////////

shape.position.y = 1;
scene.add( cb );
scene.add( shape );


function onMouseMove( event ) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	// For selecting in menu???
	// if(event.clientX > WINDOW_WIDTH/2){
	// 	mouse.x = ( (event.clientX) / WINDOW_WIDTH ) * 4 - 3;
	// 	mouse.y = - ( event.clientY / WINDOW_HEIGHT ) * 2 + 1;		
	// } else {
	// 	mouse.x = -300;
	// }
}

let animate = function () {
	// window.addEventListener( 'mousemove', onMouseMove, false );
	requestAnimationFrame( animate );

	renderer.clear();
	
	renderer.setViewport(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
	renderer.render(scene, camera);

	renderer.setViewport(WINDOW_WIDTH-200,50,150,150);
	renderer.render(scene, camera2);
};

animate();