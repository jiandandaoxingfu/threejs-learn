/*
* @Author:              old jia
* @Date:                2018-06-16 18:56:03
* @Last Modified by:    old jia
* @Last Modified time:  2018-08-28 23:59:41
* @Email:               jiaminxin@outlook.com
*/
/*使用说明：
	功能：元素随鼠标移动而旋转。
	将需要旋转的元素放在一个容器上面(如div),将该容器设置为transform-style: preserve-3d;
	然后以该容器为参数初始化该变量即可。

	一些注意：
		相对：是对容器而言
		绝对：是对窗口而言
*/


var rotate3D = {
	ele : null,	// 作用元素
	currentLocation : {x : 0, y : 0},	// 鼠标坐标
	lastLocation : {x : 0, y : 0},
	isRotate : false,
	// 由于只有旋转，故为3×3矩阵，当然，matrix3d属性值为16个。
	curMatrix : [1, 0, 0, 
				 0, 1, 0, 
				 0, 0, 1],			// 元素的绝对旋转矩阵
	newMatrix : [1, 0, 0, 
				 0, 1, 0, 
				 0, 0, 1],			// 新的绝对旋转矩阵
	rotate_vector : [1, 0, 0],

	init : function(ele) {
		this.ele = ele;
		this.set_rotate_matrix();
		return this;
	},

	// 鼠标移动事件回调函数: 获取相对于窗口坐标系的绝对旋转轴
	get_absolute_rotate_vector : function(e) {
		let x, y;
		if(e.touches === undefined) {
			x = e.clientX;
			y = e.clientY;
		}else {
			x = e.touches[0].pageX;
			y = e.touches[0].pageY;
		}	
		if ( !this.isRotate ) {return;}
		this.currentLocation = {x : x, y : y};
		let dx = x - this.lastLocation.x;
		let dy = y - this.lastLocation.y;
		this.lastLocation = this.currentLocation;
		let d = Vector3.distance([dx, dy, 0]);
		if(d < 2 || d > 100) return;// 鼠标移动较慢或较快都无效
		this.rotate_vector = [-dy, dx, 0];
	},

	// 根据绝对旋转轴(窗口坐标系下)得到新的相对旋转轴(元素坐标系下)
	// 我们有窗口坐标系下点的坐标，想要求其在元素的坐标系下的坐标，需要求旋转矩阵的逆
	// 而由于其正定，所以只需其转置
	get_relative_rotate_vector : function() {
		let v = this.rotate_vector;
		let M_ = matrix3.transpose(this.curMatrix);// 旋转矩阵的转置
		this.rotate_vector = [M_[0]*v[0] + M_[3]*v[1], 
							  M_[1]*v[0] + M_[4]*v[1], 
							  M_[2]*v[0] + M_[5]*v[1]];	// v[2]=0;
	}, 

	// 获取容器的matrix3d属性值
	get_rotate_matrix : function() {
		let transform = this.ele.style.transform;
		let mat = transform.slice(9, transform.length - 1).split(',').map(item => parseFloat(item));
		this.curMatrix = [mat[0], mat[1], mat[2], 
						  mat[4], mat[5], mat[6], 
						  mat[8], mat[9], mat[10]];
	},

	// 设置容器的matrix3d属性值
	set_rotate_matrix : function() {
		let m = this.newMatrix;
		let mat = [m[0], m[1], m[2], 0, 
				   m[3], m[4], m[5], 0, 
				   m[6], m[7], m[8], 0, 
				   0, 0, 0, 1];
		let s = 'matrix3d(';
		mat.forEach(item => s += (item.toFixed(2) + ','));
		this.ele.style.transform = s.slice(0, s.length - 1) + ')';
	},

	// 将容器当前的绝对旋转矩阵和容器的相对旋转矩阵两者叠加，即相对于窗口坐标系的绝对旋转矩阵
	get_absolute_rotate_matrix : function() {
		this.newMatrix = matrix3.multiply(this.newMatrix, this.curMatrix);// 两个旋转矩阵的叠加
	}, 

	// 根据相对旋转轴获取相对于容器的相对旋转矩阵
	get_relative_rotate_matrix : function() {
		let v = this.rotate_vector;
		// 根据旋转轴确定旋转角度和矩阵
		let length_v = Vector3.distance(v);
		let sita = 0.2*length_v/180*Math.PI;
		v = Vector3.normlize(v);
		let A1 = [v[0]*v[0], v[0]*v[1], v[0]*v[2], 
				  v[1]*v[0], v[1]*v[1], v[1]*v[2], 
				  v[2]*v[0], v[2]*v[1], v[2]*v[2]]; 		  
		let A2 = [0, -v[2], v[1], 
		          v[2], 0, -v[0], 
		          -v[1], v[0], 0];
		let I = [1, 0, 0, 
				 0, 1, 0, 
				 0, 0, 1];
		//  M = A1 + cos(sita) * (I - A1) + sin(sita) * A2;
		let M = A1.map((item, i) => item + Math.cos(sita) * (I[i] - A1[i]) + Math.sin(sita) * A2[i]);
		this.newMatrix = [M[0], M[3], M[6], M[1], M[4], M[7], M[2], M[5], M[8]];
	}, 

	run : function(e) {
		this.get_absolute_rotate_vector(e);// 获取相对于窗口坐标系的绝对旋转轴
		this.get_rotate_matrix();		  // 获取元素的旋转矩阵
		this.get_relative_rotate_vector();// 获取相对于容器的坐标系的相对旋转轴
		this.get_relative_rotate_matrix();// 获取相对于容器的坐标系的相对旋转矩阵
		this.get_absolute_rotate_matrix();// 获取相对于窗口坐标系的绝对旋转矩阵
		// this.set_rotate_matrix();
		let x = vector[0];
		let y = vector[1];
		let z = vector[2];
		let m = this.newMatrix;
		vector = [x * m[0] + y * m[3] + z * m[6], 
				x * m[1] + y * m[4] + z * m[7], 
				x * m[2] + y * m[5] + z * m[8]];
		// camera.target.x = vector[0];
		// camera.target.y = vector[1];
		// camera.target.z = vector[2];
		camera.lookAt(new THREE.Vector3(...vector));
		renderer.render(scene, camera);
	},

	// 单击后鼠标移动会有旋转效果,再次单击没有效果
	click : function() {
		document.addEventListener("click", function(e) {
			rotate3D.isRotate = !rotate3D.isRotate
		})
		// 手机端
		document.addEventListener('touchstart', function(e) {
          	rotate3D.isRotate = true;
      	})
		return this;
	}, 
	// 鼠标移动事件
	mousemove : function() {
		document.addEventListener("mousemove", function(e) {
			if(rotate3D.isRotate) {
				rotate3D.run(e);
			}
		})
		// 手机端
		document.addEventListener("touchmove", function(e) {
			e.preventDefault();
			if(rotate3D.isRotate) {
				rotate3D.run(e);
			}
		})
		return this;
	}, 
	// 鼠标滑轮滚动
	mousewheel: function() {
		document.addEventListener("mousewheel", function(e) {
			// console.log(e.wheelDelta); // 120/-120：上/下
			let m = camera.getFocalLength(), 
				ratio = m / originFocalLength;
			if ((e.wheelDelta > 0 && ratio < 2) || (e.wheelDelta < 0 && ratio > 0.3)) {
				rotate3D.isRotate = false;
				m = m + (e.wheelDelta > 0 ? 0.05 * m : -0.05 * m);
				camera.setFocalLength(m);
				renderer.render(scene, camera);
			}
		})
		return this;
	}
}
