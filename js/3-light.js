/*
* @Author:              old jia
* @Date:                2018-08-28 22:43:33
* @Last Modified by:   old jia
* @Last Modified time: 2020-03-01 10:31:32
* @Email:               jiaminxin@outlook.com
*/

var cube = new THREE.Mesh(
	new THREE.CubeGeometry(10, 10, 10), 
	new THREE.MeshPhongMaterial({color: 'blue'})
);

scene.add(cube);

var pos_arr = [
	[0, 40, 0],
	[0, 0, 40],
	[40, 0, 0],
	[0, -40, 0],
	[0, 0, -40],
	[-40, 0, 0]]
for(let i=0; i<6; i++) {
	let light = new THREE.DirectionalLight('white', 2.5); //  太阳光-平行光
	// let light = new THREE.PointLight('yellow', 5, 60); // 点光源，照射范围内所有方向
	light.position.set(...pos_arr[i]);
	scene.add(light);
}
var ambLight = new THREE.AmbientLight('white'); // 环境光
scene.add(ambLight);

var controls = new THREE.TrackballControls(camera);
camera.position.set(0, 0, 60);	
camera.lookAt(scene.position);
(function animate() {
	controls.update();
    renderer.render(scene, camera);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;	
    requestAnimationFrame(animate);
})();