/*
* @Author:              old jia
* @Date:                2018-08-30 16:14:17
* @Last Modified by:   old jia
* @Last Modified time: 2019-05-26 15:10:31
* @Email:               jiaminxin@outlook.com
*/

scene.background = new THREE.Color( 0xcce0ff );
scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

var texture = new THREE.TextureLoader().load('images/grass.jpg');
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 25, 25 );

var group = new THREE.Group();

{
	let grass = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(20000, 20000),
		new THREE.MeshBasicMaterial({map: texture})
	)
	// grass.rotation.x = -Math.PI/2;
	group.add(grass);
}

var texture1 = new THREE.TextureLoader().load('images/wall_paper.jpg');
var texture2 = new THREE.TextureLoader().load('images/brick.jpg');
var texture3 = new THREE.TextureLoader().load('images/tile-floor.jpg');

// wall_behind
{	
	let wall_behind = new THREE.Mesh(
		new THREE.CubeGeometry(2020, 25, 1000), 
		new THREE.MeshBasicMaterial({map: texture1})
	);
	// wall_behind.rotation.x = -Math.PI/2;
	wall_behind.position.x = 15;
	wall_behind.position.y = 260;
	wall_behind.position.z = 500;
	group.add(wall_behind);
}

// vertical wall
{
	let cube = new THREE.CubeGeometry(25, 500, 1000);
	let material = new THREE.MeshBasicMaterial({map: texture2});
	
	for(let i=0; i<5; i++) {	
		let wall = new THREE.Mesh(cube, material);
		// wall.rotation.x = -Math.PI/2;
		wall.position.x = i * 500 - 985;
		wall.position.z = 500;
		group.add(wall);
	}
}

// horizontal wall
{
	let cube = new THREE.CubeGeometry(2020, 525, 25);
	let material = new THREE.MeshBasicMaterial({map: texture3});
	
	for(let i=1; i<3; i++) {	
		let wall = new THREE.Mesh(cube, material);
		// wall.rotation.x = -Math.PI/2;
		wall.position.z = i * 500 - 485 + 500;
		wall.position.x = 15;
		wall.position.y = 10;
		group.add(wall);
	}
}


{
	let sphereLight = new THREE.Mesh(
		new THREE.SphereGeometry(50),
		new THREE.MeshBasicMaterial({color: 'red'})
	)
	sphereLight.position.set(0, 0, 0);
	// scene.add(sphereLight);
}

group.rotation.x = -Math.PI/2;
scene.add(group);





camera.position.set(0, 0, 3000);

controls = new THREE.OrbitControls(camera);
controls.maxPolarAngle = Math.PI * 0.45;
controls.minDistance = 1000;
controls.maxDistance = 5000;

(function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
})();