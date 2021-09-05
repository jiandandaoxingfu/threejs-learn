/*
 * @Author:             old jia
 * @Email:              jiaminxin@outlook.com
 * @Date:               2019-05-28 11:17:53
 * @Last Modified by:   jiandandaoxingfu
 * @Last Modified time: 2020-03-02 20:29:43
 */

var R = 5, r = 0.1;
var circle = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
	let theta = i * Math.PI / 8;
	return new THREE.Vector3(R * Math.cos(theta), R * Math.sin(theta), 0);
})
curve = new THREE.CatmullRomCurve3(circle);

var texture = new THREE.TextureLoader().load('images/清明上河图.jpg');
texture.wrapS = THREE.RepeatWrapping;

var material = new THREE.MeshStandardMaterial({
	map: texture,
	side: THREE.BackSide,
});
var tube = new THREE.Mesh(
	new THREE.TubeGeometry(curve, 100, r, 50, false),	
	material
);
tube.rotation.x = - Math.PI / 2;
tube.position.x = 5;
scene.add(tube);

let pointLight = new THREE.PointLight("white");
pointLight.distance = 8;
pointLight.intensity = 5;
pointLight.position.set(0, r, 0);
scene.add(pointLight);

camera.position.set(0, 0, 0.1);

var controls = new THREE.TrackballControls(camera);

(function animate() {
	controls.update();
	material.map.offset.x -= 0.0005 * r;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
})();	



