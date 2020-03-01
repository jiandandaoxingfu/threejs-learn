/*
* @Author:              old jia
* @Date:                2018-08-29 09:48:16
* @Last Modified by:   old jia
* @Last Modified time: 2020-02-28 22:44:51
* @Email:               jiaminxin@outlook.com
*/

var glider;

(function() {
	let geom = new THREE.Geometry();
	vertices.forEach(v => geom.vertices.push(new THREE.Vector3(...v)));
	faces.forEach(f => geom.faces.push(new THREE.Face3(...f)));
	geom.computeFaceNormals();
	geom.computeVertexNormals();
	glider = new THREE.Mesh(
		geom, 
		new THREE.MeshPhongMaterial({color: '#c0c0c0', wireframe: !1})
	);
	glider.geometry.center();
	glider.rotation.z = -Math.PI/2;
	scene.add(glider);
})();

const pi = Math.PI, sin = Math.sin, cos = Math.cos;

(function() {
	let r = 280;
	let vertices = [[0, 0, r], [0, 0, -r], [r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0]];
	vertices.forEach(v => {
		let pointLight = new THREE.PointLight("white");
		pointLight.distance = 500;
		pointLight.intensity = 1;
		pointLight.position.set(...v);
		scene.add(pointLight);		

		let sphereLight = new THREE.Mesh(
			new THREE.SphereGeometry(3),
			new THREE.MeshBasicMaterial({color: 'white'})
		)
		sphereLight.position.set(...v);
		scene.add(sphereLight);
	})
})();

camera.position.set(0, 0, 666);

var controls = new THREE.TrackballControls(camera);

(function animate() {
	controls.update();
	// glider.rotation.x += 0.01;
	// glider.rotation.y += 0.01;
	// glider.rotation.z += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
})();	