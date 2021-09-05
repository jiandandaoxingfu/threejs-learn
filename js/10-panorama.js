/*
* @Author:              old jia
* @Date:                2019-05-23 21:29:40
* @Last Modified by:   old jia
* @Last Modified time: 2019-05-25 20:37:15
* @Email:               jiaminxin@outlook.com
*/



// 球面： SphereGeometry(radius, 上下份数， 左右份数)
const RADIUS = 1000;
var sphere = new THREE.Mesh(
	new THREE.SphereGeometry(RADIUS, 25, 25), 
	new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('images/p3.png')})	
);
sphere.scale.x = -1;

scene.add(sphere);


// 灯光
let r = 200;
let lightPos = [[0, 0, r], [0, 0, -r], [r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0]];
    lightPos.forEach(pos => {
    let pointLight = new THREE.PointLight("white");
    pointLight.distance = 250;
    pointLight.intensity = 10;
    pointLight.position.set(...pos);
    scene.add(pointLight);
});

// 旋转，放缩
let vector = [0, 0, 1000],
    originFocalLength = camera.getFocalLength();
camera.position.set(0, 0, 0);
camera.lookAt(new THREE.Vector3(...vector));

let i = 0;
(function animate() {
    if (i++ > 100) return;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
})();   





