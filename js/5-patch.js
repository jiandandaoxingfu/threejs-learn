/*
* @Author:              old jia
* @Date:                2018-08-29 09:48:16
* @Last Modified by:   jiami
* @Last Modified time: 2023-03-14 12:51:29
* @Email:               jiaminxin@outlook.com
*/

var surface;
let zaxis = vertices.map(v => v[2]);
// vertices = vertices.map(v => [5 * v[0], v[1] ,v[2] ]);
let zmin = Math.min(...zaxis);
let zmax = Math.max(...zaxis);
let zrange = zmax - zmin;

function colorMap(z) {
    let c = 4*(z - zmin) / zrange;
    if      (c < 0) return [0,   0,   1];
    else if (c < 1) return [0,   c,   1];
    else if (c < 2) return [0,   1, 2-c];
    else if (c < 3) return [c-2, 1,   0];
    else if (c < 4) return [1,   4-c, 0];
    else            return [1,   0,   0];
}

(function() {
	let geom = new THREE.Geometry();
	vertices.forEach(v => geom.vertices.push(new THREE.Vector3(...v)));
	faces.forEach(f => {
		let z = f.map(i => vertices[i][2]).reduce((i, j) => i + j) / f.length;
		let color = colorMap(z);	
		color = [new THREE.Color(...color),
			new THREE.Color(...color),
			new THREE.Color(...color)];
		if(f.length === 3) {
			f = new THREE.Face3(...f);
			f.vertexColors = color;
			geom.faces.push(f);
		} else if(f.length === 4) {
			let f1 = new THREE.Face3(f[0], f[1], f[2]),
				f2 = new THREE.Face3(f[2], f[3], f[0]);
			f1.vertexColors = color;
			f2.vertexColors = color;
			geom.faces.push(f1);
			geom.faces.push(f2);
		}
	});
	geom.computeFaceNormals();
	geom.computeVertexNormals();
	surface = new THREE.Mesh(
		geom, 
		new THREE.MeshLambertMaterial({wireframe: !0, vertexColors: true, side: THREE.DoubleSide})
	);
	surface.geometry.center();
	surface.rotation.z = -Math.PI/2;
	scene.add(surface);
})();

const pi = Math.PI, sin = Math.sin, cos = Math.cos;

(function() {
	let r = 1000;
	let vertices = [[0, 0, r], [0, 0, -r], [r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0]];
	vertices.forEach(v => {
		let pointLight = new THREE.PointLight("white");
		pointLight.distance = 2000;
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

camera.position.set(0, 0, 800);

var controls = new THREE.TrackballControls(camera);

(function animate() {
	controls.update();
	
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
})();	