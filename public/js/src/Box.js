/**
 * Boxes representing obstacles.
 */
const Box = (function(x, y, z) {
    let geometry = new THREE.BoxGeometry( BOX_SIZE, BOX_SIZE, BOX_SIZE );
    let material = new THREE.MeshBasicMaterial( {color: 0xaa8844} );
    this.mesh = new THREE.Mesh( geometry, material );
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
    this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
});
