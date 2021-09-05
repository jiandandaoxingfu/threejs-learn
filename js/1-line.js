/*
* @Author:              old jia
* @Date:                2018-08-28 20:59:02
* @Last Modified by:   old jia
* @Last Modified time: 2020-02-28 23:41:42
* @Email:               jiaminxin@outlook.com
*/


// 添加物体: 每种物体均需指明形状，材料

// Geometry: 自定义线段或几何体，类似于patch
// var geom = new THREE.Geometry();
// geom.vertices.push(new THREE.Vector3(-10, -10, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(110, -10, 0));
// var line = new THREE.Line(
// 	geom, 
// 	new THREE.LineBasicMaterial({color: 'blue'})
// );
// scene.add(line);


let axis = new THREE.Group();
let plane = new THREE.Mesh(
	new THREE.PlaneGeometry(60, 60), 
	new THREE.MeshPhongMaterial({color: '#828282', wireframe: !1})
)
let geom = new THREE.Geometry();
geom.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(30, 0, 0));
let line_x = new THREE.Line(
	geom,
	new THREE.LineBasicMaterial({color: 'red'})
);
let line_y = new THREE.Line(
	geom,
	new THREE.LineBasicMaterial({color: 'yellow'})
);
line_y.rotation.z = Math.PI/2;
let line_z = new THREE.Line(
	geom,
	new THREE.LineBasicMaterial({color: 'green'})
)
line_z.rotation.y = Math.PI/2;
axis.add(plane);
axis.add(line_x);
axis.add(line_y);
axis.add(line_z);
scene.add(axis);
// light
var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 10, 5, 15 );
scene.add( light );
var light = new THREE.DirectionalLight( 0x444444 );
light.position.set( 10, 5, 15 );
scene.add( light );		
light = new THREE.AmbientLight( 0x444444 );
scene.add( light );


camera.position.set(0, 0, 150);
camera.lookAt(new THREE.Vector3(0, 0, 0));

