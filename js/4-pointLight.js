/*
* @Author:              old jia
* @Date:                2018-08-29 08:35:09
* @Last Modified by:    old jia
* @Last Modified time:  2019-03-17 20:07:07
* @Email:               jiaminxin@outlook.com
*/

var plane = new THREE.Mesh(
	new THREE.PlaneGeometry(30, 15),
	new THREE.MeshPhongMaterial({color: 'gray'})
)
// plane.rotation.x = -Math.PI/4;
scene.add(plane);

var cube = new THREE.Mesh(
	new THREE.CubeGeometry(6, 6, 6), 
	new THREE.MeshPhongMaterial({color: 'blue'})
);
cube.position.set(0, 0, 10);

scene.add(cube);

var ambientLight = new THREE.AmbientLight("#b94a4a");
scene.add(ambientLight);

var pointLight = new THREE.PointLight("white");
pointLight.distance = 90;
pointLight.intensity = 1;
scene.add(pointLight);

var sphereLight = new THREE.Mesh(
	new THREE.SphereGeometry(0.3),
	new THREE.MeshBasicMaterial({color: 'gray'})
)
scene.add(sphereLight);

var theta = 0, R = 5;
sphereLight.position.set(0, R*Math.cos(theta), R*Math.sin(theta) + 10);
pointLight.position.copy(sphereLight.position);

camera.position.set(0, 0, 60);	
camera.lookAt(scene.position);

controls = new THREE.TrackballControls(camera);

(function animate() {
	controls.update();
    renderer.render(scene, camera);
    theta += Math.PI/90;
    sphereLight.position.set(0, R*Math.cos(theta), R*Math.sin(theta) + 10);
	pointLight.position.copy(sphereLight.position);
    requestAnimationFrame(animate);
})();