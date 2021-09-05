/*
 * @Author:              old jia
 * @Date:                2018-09-01 00:07:41
 * @Last Modified by:    old jia
 * @Last Modified time:  2018-09-01 10:11:38
 * @Email:               jiaminxin@outlook.com
 */

const pi = Math.PI, sin = Math.sin, cos = Math.cos;

function create_drip(u, v) {
	let a = 20, b = 1;
	// u, v in [0, 1];
	u = u * 2 * pi;
	v = v * 2 * pi;
	x = a / 8 * (sin(2 * u) + 2 * sin(u)) / b * cos(v);
	y = -a / 2 * cos(u);
	z = a / 8 * (sin(2 * u) + 2 * sin(u)) / b * sin(v);
	return new THREE.Vector3(x, y, z);
}

var texture = new THREE.TextureLoader().load('images/water2.jpg');
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 6, 6 );

var geom = new THREE.ParametricGeometry(create_drip, 40, 20);
var material = new THREE.MeshPhongMaterial();
for(let i=0; i<666; i++) {	
	let drip = new THREE.Mesh(
		geom, 
		material
	);
	drip.position.set(( Math.random() - 0.5 ) * 1000, ( Math.random() - 0.5 ) * 1000, ( Math.random() - 0.5 ) * 1000);
	scene.add(drip);
}

let pointLight = new THREE.PointLight("white");
pointLight.distance = 900;
pointLight.intensity = .6;
scene.add(pointLight);	

var ambientLight = new THREE.AmbientLight("#2895D1");
scene.add(ambientLight);

camera.position.set(0, 0, 600);	
var y = 0;
camera.lookAt(new THREE.Vector3(0, y, 0));

controls = new THREE.TrackballControls(camera);
controls.rotateSpeed = 1;
controls.panSpeed = 0.2;
(function animate() {
	controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
})();