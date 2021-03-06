/*
* @Author:              old jia
* @Date:                2018-08-30 20:42:51
* @Last Modified by:    old jia
* @Last Modified time:  2018-08-31 13:18:26
* @Email:               jiaminxin@outlook.com
*/

var texture1 = new THREE.TextureLoader().load('images/grass.jpg');
var texture2 = new THREE.TextureLoader().load('images/brick.jpg');
var texture3 = new THREE.TextureLoader().load('images/tile-floor.jpg');
var texture4 = new THREE.TextureLoader().load('images/rock.jpg');
texture4.wrapS = texture4.wrapT = THREE.RepeatWrapping;
texture4.repeat.set( 6, 2 );

// wall_behind
{	
	let wall_behind = new THREE.Mesh(
		new THREE.CubeGeometry(2020, 25, 1000), 
		new THREE.MeshBasicMaterial({map: texture1})
	);
	wall_behind.position.x = 15;
	wall_behind.position.y = 260;
	scene.add(wall_behind);
}

// vertical wall
{
	let cube = new THREE.CubeGeometry(25, 500, 1000);
	let material = new THREE.MeshBasicMaterial({map: texture2});
	
	for(let i=0; i<5; i++) {	
		let wall = new THREE.Mesh(cube, material);
		wall.position.x = i * 500 - 985;
		scene.add(wall);
	}
}

// horizontal wall
{
	let cube = new THREE.CubeGeometry(2020, 525, 25);
	let material = new THREE.MeshBasicMaterial({map: texture3});
	
	for(let i=0; i<3; i++) {	
		let wall = new THREE.Mesh(cube, material);
		wall.position.z = i * 500 - 485;
		wall.position.x = 15;
		wall.position.y = 10;
		scene.add(wall);
	}
}

// road 
{
	let road = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(3000, 666), 
		new THREE.MeshBasicMaterial({map: texture4})
	)
	road.position.z = -500;
	road.position.y = -570;
	scene.add(road);
}

// var ambientLight = new THREE.AmbientLight("yellow");
// scene.add(ambientLight);

// var pointLight2 = new THREE.PointLight("white");
// pointLight2.distance = 600;
// pointLight2.intensity = 2;
// pointLight2.position.set(0, 0, 150);
// scene.add(pointLight2);

// var sphereLight = new THREE.Mesh(
// 	new THREE.SphereGeometry(50),
// 	new THREE.MeshBasicMaterial({color: 'red'})
// )
// scene.add(sphereLight);

camera.position.set(0, 0, 4000);	
camera.lookAt(scene.position);

controls = new THREE.TrackballControls(camera);
// //????????????
// controls.rotateSpeed = 1.0;
// //????????????
// controls.zoomSpeed = 1.2;
// //????????????
// controls.panSpeed = 0.8;
// //???????????????
// controls.noZoom = false;
// //???????????????
// controls.noPan = true;
// //??????????????? true????????????
// controls.staticMoving = false;
// //?????????????????? ???????????????
// controls.dynamicDampingFactor = 0.3;
// 
(function animate() {
	controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
})();