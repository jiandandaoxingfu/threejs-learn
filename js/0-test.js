var geometry = new THREE.Geometry();

// Make the simplest shape possible: a triangle.
geometry.vertices.push(
    new THREE.Vector3(-10,  10, 0),
    new THREE.Vector3(-10, -10, 0),
    new THREE.Vector3( 10, -10, 0)
);

// Note that I'm assigning the face to a variable
// I'm not just shoving it into the geometry.
var face = new THREE.Face3(0, 1, 2);

// Assign the colors to the vertices of the face.
face.vertexColors[0] = new THREE.Color(0xff0000); // red
face.vertexColors[1] = new THREE.Color(0x00ff00); // green
face.vertexColors[2] = new THREE.Color(0x0000ff); // blue

// Now the face gets added to the geometry.
geometry.faces.push(face);

// Using this material is important.
var material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});

var mesh = new THREE.Mesh(geometry, material);


camera.position.set(0, 0, 16);

var controls = new THREE.TrackballControls(camera);

(function animate() {
	controls.update();
	// glider.rotation.x += 0.01;
	// glider.rotation.y += 0.01;
	// glider.rotation.z += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
})();	