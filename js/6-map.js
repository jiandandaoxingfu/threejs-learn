/*
* @Author:              old jia
* @Date:                2018-08-30 08:36:45
* @Last Modified by:   old jia
* @Last Modified time: 2019-05-26 15:10:39
* @Email:               jiaminxin@outlook.com
*/

let texture = new THREE.TextureLoader().load('images/earth.jpg');
var sphere = new THREE.Mesh(
	new THREE.SphereGeometry(100, 40, 40), 
	new THREE.MeshBasicMaterial({map: texture})
);
scene.add(sphere);

camera.position.set(0, 0, 500);
camera.lookAt(new THREE.Vector3(0, 0, -1));

controls = new THREE.TrackballControls(camera, document.getElementById('main'));

(function animate() {
	requestAnimationFrame( animate );
	controls.update();
	sphere.rotation.x += 0.005;
	sphere.rotation.y += 0.01;
	renderer.render( scene, camera );
})();