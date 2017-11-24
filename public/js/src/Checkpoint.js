/**
 * Boxes representing obstacles.
 */
const Checkpoint = (function(x, y, z) {
    let geometry = new THREE.BoxGeometry( CHECK_SIZE, BOX_SIZE, CHECK_SIZE );
    let material = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe:true} );
    this.mesh = new THREE.Mesh( geometry, material );
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
    this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
});
