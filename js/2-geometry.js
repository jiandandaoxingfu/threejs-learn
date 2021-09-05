/*
* @Author:              old jia
* @Date:                2018-08-28 21:29:40
* @Last Modified by:   old jia
* @Last Modified time: 2020-02-28 22:27:55
* @Email:               jiaminxin@outlook.com
* @Ref: 张雯莉：https://read.douban.com/reader/ebook/7412854/
*/

// 圆圈
// THREE.CircleGeometry(radius, segments, thetaStart, thetaLength)

// 管道
// TubeGeometry(path : Curve, tubularSegments : Integer, radius : Float, radialSegments : Integer, closed : Boolean)

// 平面： PlaneGeometry(width, height, (宽分段数)， (长分段数));	
var plane = new THREE.Mesh(
	new THREE.PlaneGeometry(60, 60), 
    // 材质
    //      1. BasicMaterial：渲染后物体的颜色始终为该材质的颜色，而不会由于光照产生明暗、阴影效果。不够真实
    //      2. Lambert：特点是只考虑漫反射而不考虑镜面反射的效果，因而对于金属、镜子等需要镜面反射效果的物体就不适应，
    //         对于其他大部分物体的漫反射效果都是适用的
    //      3. Phong：Phong模型考虑了镜面反射的效果，因此对于金属、镜面的表现尤为适合。
    // 
    // 基本属性(不同材质有不同的属性)
    //      color: 0xffff00,
    //      opacity: 0~1
    //      visible: !0
    //      side: 渲染面片正面或是反面, THREE.Front/Back/DoubleSide
    //      wireframe: 是否渲染线而非面
    //      map: 使用纹理贴图，
    //           let texture = new THREE.TextureLoader().load('images/earth.jpg', function() {
    //                  renderer.render( scene, camera );
    //                });
	new THREE.MeshBasicMaterial({color: 'gray'})
);

// 球面： SphereGeometry(radius, 上下份数， 左右份数)
var sphere = new THREE.Mesh(
	new THREE.SphereGeometry(3, 15, 15), 
	new THREE.MeshBasicMaterial({color: 'blue'})	
);



// 立方体：BoxGeometry(width, height, depth, 三个方向份数可选)
// var cube = new THREE.Mesh(
// 	new THREE.BoxGeometry(6, 6, 6),
// 	new THREE.MeshPhongMaterial({color: 'red'})
// );
// cube.position.set(12, 0, 0);

// 另一种
var materials = [];
for (var i = 0; i < 6; ++i) {
    materials.push(new THREE.MeshBasicMaterial({
        // map: THREE.ImageUtils.loadTexture('../img/' + i + '.png',
        //         {}, function() {
        //             renderer.render(scene, camera);
        //         }),
        // overdraw: !0
    }));
}
var cube = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5),
        new THREE.MeshFaceMaterial(materials));
scene.add(cube);	
cube.position.set(12, 0, 0);

// 圆柱体
var cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 10, 10, 10),
    new THREE.MeshBasicMaterial({wireframe: !1, color: 'red'})
);

// 环面：TorusGeometry(环的半径，管道半径，分割数1，分割数2，弧度)
var tori = new THREE.Mesh(
    new THREE.TorusGeometry(3, 1, 10, 20, 2*Math.PI),
    new THREE.MeshBasicMaterial({wireframe: !0, color: 'gray'})
);
tori.position.set(-12, 0, 0);                 

// 环面扭结：TorusKnotGeometry(环的半径，管道半径，分割数1，分割数2，扭结数1，扭结数2， 高度)
var torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(3, 0.6, 15, 20, 2, 1, 1),
    new THREE.MeshBasicMaterial({color: '#00B2EE'})
);
torusKnot.position.set(0, 12, 0);      

// 亏格为1的球面
var genus1sphere =  new THREE.Group();
{
    // 球面： SphereGeometry(radius, 上下份数， 左右份数)
    let sphere = new THREE.Mesh(
        new THREE.SphereGeometry(5, 20, 20), 
        new THREE.MeshBasicMaterial({color: 'green'})    
    );
    
    // 环面：TorusGeometry(环的半径，管道半径，分割数1，分割数2，弧度)
    let tori = new THREE.Mesh(
        new THREE.TorusGeometry(3, 0.8, 15, 20, 2*Math.PI),
        new THREE.MeshBasicMaterial({color: '#9400D3'})
    );
    tori.position.set(0, -5, 0);
    
    genus1sphere.add(sphere);
    genus1sphere.add(tori);
}
genus1sphere.position.set(0, -15, 0);

// 亏格为2的球面
var genus2sphere =  genus1sphere.clone();
{
    let tori = genus1sphere.children[1].clone();
    tori.rotation.x = -Math.PI/2;
    tori.position.set(0, 0, 5);
    genus2sphere.add(tori);
}
genus2sphere.position.set(0, 0, 15);

// 两个环面的连通和
var genus2tori = new THREE.Group();
{
    let tori1 = tori.clone();
    let tori2 = tori.clone();
    let tori3 = tori.clone();
    let tori4 = tori.clone();
    tori2.position.set(-6, 0, 0);
    tori3.position.set(3, 0, 0);
    tori4.position.set(9, 0, 0);
    genus2tori.add(tori1);
    genus2tori.add(tori2);
    genus2tori.add(tori3);
    genus2tori.add(tori4);
}
genus2tori.position.set(8, 0, -15);


// 自定义几何体： Geometry
var geom = new THREE.Geometry();
var vertices = [[0, 0, 10], [10, 0, 0], [0, 10, 0], [-10, 0, 0], [0, -10, 0]];
var faces = [[0, 1, 2], [0, 2, 3], [0, 3, 4], [1, 2, 3], [1, 3, 4]];

vertices.forEach(v => geom.vertices.push(new THREE.Vector3(...v)));
faces.forEach(f => geom.faces.push(new THREE.Face3(...f)));

var plane5 = new THREE.Mesh(
	geom, 
	new THREE.MeshBasicMaterial({color: 'red'})
);
plane5.position.set(-20, 0, 0);

// scene.add(plane);
scene.add(sphere);
scene.add(cylinder);
scene.add(cube);	
scene.add(tori);
scene.add(torusKnot);
scene.add(genus1sphere);
scene.add(genus2sphere);
scene.add(genus2tori);

// 灯光
// let r = 200;
// let lightPos = [[0, 0, r], [0, 0, -r], [r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0]];
//     lightPos.forEach(pos => {
//     let pointLight = new THREE.PointLight("white");
//     pointLight.distance = 250;
//     pointLight.intensity = 10;
//     pointLight.position.set(...pos);
//     scene.add(pointLight);
// });

// 旋转，放缩
camera.position.set(0, 0, 66);
var controls = new THREE.TrackballControls(camera);
(function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
})();   