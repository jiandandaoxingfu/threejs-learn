/*
 * @Author:             old jia
 * @Email:              jiaminxin@outlook.com
 * @Date:               2019-05-25 20:42:44
 * @Last Modified by:   old jia
 * @Last Modified time: 2019-05-28 13:10:28
 */

// 想要构造环面的连通和
// 首先，生成环面上的点
// 接着，挖去一部分：删除x坐标大于x0的点，当然，这需要把含有这些点的面去掉
// 最后，克隆，拼接即可。
var geo = new THREE.TorusGeometry(3, 1, 60, 80, 2 * Math.PI),
	bound = 3.99,
	delta = 0.1,
	red = new THREE.Color(0xff0000),
	gray = new THREE.Color(0x808080),
	black = new THREE.Color(0x000000);

function tori_partition(geo) {
	geo.faces_ = [];
	geo.faces.forEach((face, id) => {
		let index = [face.a, face.b, face.c],
			vertices = index.map(i => geo.vertices[i]),
			index_ = [];

		for(let i = 0; i < 3; i++) {
			// 如果面片的第一个顶点的x坐标接近左/右分界线，收集
			// 面片顶点在边界线外的位置，然后对面片划分。
			if (vertices[0].x < - bound + delta) {
				if (vertices[i].x < -bound) {
					index_.push(i);
				}
			} else if (vertices[0].x > bound - delta)  {
				if (vertices[i].x > bound) {
					index_.push(i);
				}
				// return;
			} else {
				return;
			}
			
		}

		switch (index_.length) {
			case 0:
				break;
			case 3:
				face.isDelete = true;
				break;
			case 1:
			case 2:
				face_partition(geo, id, face, vertices, index, index_);
				break;
			default:
				break;
		} 
	})
	geo.faces = geo.faces.filter(face => !face.isDelete);
	geo.faces.concat(geo.faces_);
}

// 如果面片有 1 or 2 个顶点在挖去的范围，我们将该面片划分为
// 一个四边形和一个三角形，使得分割后的各面片恰好分界线外或内。
function face_partition(geo, id, face, vertices, index, index_) {
	let b = vertices[0].x > 0 ? bound : -bound,
		v0, v1,	v2,
		i;

	if (index_.length === 2) {
		// 两个顶点在分界线外
		i = [0, 1, 2].filter(d => !index_.includes(d))[0];
		v0 = vertices[i];	// 分界线内顶点
		v1 = vertices[index_[0]];
		v2 = vertices[index_[1]];
	} else {
		i = [0, 1, 2].filter(d => !index_.includes(d));
		v0 = vertices[index_[0]]; 	// 分界线外顶点
		v1 = vertices[i[0]];
		v2 = vertices[i[1]];
	}

	// 计算分界线内顶点与另外两个顶点连线分别和分界面的交点
	let v3 = intersect_point(v0, v1, b),
		v4 = intersect_point(v0, v2, b),
		n = geo.vertices.length;

	geo.vertices.push(v3, v4);

	// 划分
	if (index_.length === 2) {
		// 添加一个新的三角形
		geo.faces_.push(new THREE.Face3(index[i], n + 1, n)); // v0.v3.v4
	} else {
		// 需要将四边形划分为两个三角形
		geo.faces_.push(new THREE.Face3(index[i[1]], n + 1, n)); // v2.v4.v3
		geo.faces_.push(new THREE.Face3(index[i[0]], index[i[1]], n)); // v1.v2.v3
	}
	geo.faces[id].isDelete = true;
}

function intersect_point(v1, v2, x) {
	// 给定空间两点，以及第三点的x坐标，求出第三点y，z。
	//  x  - x1   y  - y1    z  - z1
	//  ------- = ------- =  ------- = k,
	//  x2 - x1   y2 - y1    z2 - z1
	let k = (x - v1.x) / (v2.x - v1.x),
		y = k * (v2.y - v1.y) + v1.y,
		z = k * (v2.z - v1.z) + v1.z;
	return new THREE.Vector3(x, y, z);
}

tori_partition(geo);

let tori = new THREE.Mesh(
	geo,
	new THREE.MeshPhongMaterial({
		color: 0xcd7f32,
		side: THREE.DoubleSide,
		// opacity: 0.4,
		// transparent: true,
		// wireframe: true,
		// vertexColors: THREE.VertexColors
	})
);

tori.geometry.center();
tori.position.set(0, 0, 0);
tori.rotation.y = Math.PI / 2;
scene.add(tori);

// 灯光
let r = 20;
let out_lightPos = [[0, 0, r], [0, 0, -r], [r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0]];
out_lightPos.forEach(pos => {
    let pointLight = new THREE.PointLight('white');
    pointLight.distance = 20;
    pointLight.intensity = 5;
    pointLight.position.set(...pos);
    scene.add(pointLight);
});

let rr = 3;
let inner_lightPos = new Array(20).join(',').split(',').map((d, i) => {
	let theta = i * Math.PI / 20;
	return [0, rr * Math.cos(theta), rr * Math.sin(theta)];
});

inner_lightPos.forEach(pos => {
    let pointLight = new THREE.PointLight('lime');
    pointLight.distance = 3;
    pointLight.intensity = 1;
    pointLight.position.set(...pos);
    scene.add(pointLight);
});

camera.position.set(0, 0, 15);
var controls = new THREE.TrackballControls(camera);
renderer.render(scene, camera);

document.addEventListener('mousemove', function() {
	controls.update();
	renderer.render(scene, camera);
})