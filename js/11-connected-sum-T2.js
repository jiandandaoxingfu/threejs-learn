/*
 * @Author:             old jia
 * @Email:              jiaminxin@outlook.com
 * @Date:               2019-05-25 20:42:44
 * @Last Modified by:   old jia
 * @Last Modified time: 2019-05-27 18:17:15
 */

// 想要构造环面的连通和
// 首先，生成环面上的点
// 接着，挖去一部分：删除x坐标大于x0的点，当然，这需要把含有这些点的面去掉
// 最后，克隆，拼接即可。
var geo = new THREE.TorusGeometry(3, 1, 30, 50, 2 * Math.PI),
	geo2 = geo.clone();

var left_delete_vertices_index = [];
var right_delete_vertices_index = [];
geo.vertices.forEach((v, i) => {
	if (v.x > 3.9) {
		right_delete_vertices_index.push(i);
	} else if (v.x < -3.9) {
		left_delete_vertices_index.push(i);
	}
});

let red = new THREE.Color(0xff0000);
let gray = new THREE.Color(0x808080);
let black = new THREE.Color(0x000000);

function cut_tori(faces, left_color, right_color, color) {
	faces.forEach(face => {
		for (let i of left_delete_vertices_index) {
			if ([face.a, face.b, face.c].includes(i)) {
				face.vertexColors = [left_color, left_color, left_color];
				return;
			} else {
				for (let i of right_delete_vertices_index) {
					if ([face.a, face.b, face.c].includes(i)) {
						face.vertexColors = [right_color, right_color, right_color];
						return;
					}
				}
				face.vertexColors = [color, color, color];
			}
		}
	})
}

cut_tori(geo.faces, gray, red, gray);
cut_tori(geo2.faces, red, red, gray);

let tori = new THREE.Mesh(
	geo,
	new THREE.MeshBasicMaterial({
		color: gray,
		wireframe: true,
		vertexColors: THREE.VertexColors
	})
);

let tori2 = new THREE.Mesh(
	geo2,
	new THREE.MeshBasicMaterial({
		color: gray,
		wireframe: true,
		vertexColors: THREE.VertexColors
	})
);

tori.geometry.center();
tori2.geometry.center();

let tori3 = tori.clone();

// 三者旋转90度
rot_tori = tori.clone();
rot_tori.position.set(-7, 0, 0);
rot_tori.rotation.y = -1.15 * Math.PI / 2;

rot_tori2 = tori2.clone();
rot_tori2.position.set(-13, 0, 0);
rot_tori2.rotation.y = 0.95 * Math.PI / 2;

rot_tori3 = tori3.clone();
rot_tori3.position.set(-19, 0, 0);
rot_tori3.rotation.y = -0.96 * Math.PI / 2;

scene.add(rot_tori);
scene.add(rot_tori2);
scene.add(rot_tori3);

// 三者连通和
sum_tori = tori.clone();
sum_tori.position.set(0, 0, 0);

sum_tori2 = tori2.clone();
sum_tori2.position.set(7.5, 0, 0);

sum_tori3 = tori3.clone();
sum_tori3.position.set(15, 0, 0);
sum_tori3.rotation.y = Math.PI;

scene.add(sum_tori);
scene.add(sum_tori2);
scene.add(sum_tori3);



camera.position.set(0, 0, 36);
var controls = new THREE.TrackballControls(camera);
(function animate() {
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
})();