/*
* @Author:              old jia
* @Date:                2018-06-16 18:21:49
* @Last Modified by:    old jia
* @Last Modified time:  2018-07-14 12:14:23
* @Email:               jiaminxin@outlook.com
*/


var Vector3 = {
	rotate: function([x, y, z], mat) {
		//mat 为旋转矩阵，绕原点旋转
		let a = x * mat[0] + y * mat[3] + z * mat[6];
		let b = x * mat[1] + y * mat[4] + z * mat[7];
		z = x * mat[2] + y * mat[5] + z * mat[8];
		return [a, b, z];
	},

	normlize: function(v) {
		//单位化
		let length_v = Math.sqrt(v[0] * v[0] + v[1] * v[1]  + v[2] * v[2]);
		return [v[0] / length_v, v[1] / length_v, v[2] / length_v];
	},

	distance: function(a, b) {
		if(b == undefined) b = [0, 0, 0];
		return Math.sqrt((a[0] - b[0])*(a[0] - b[0]) + (a[1] - b[1])*(a[1] - b[1]) + (a[2] - b[2])*(a[2] - b[2]));
	},

	dot: function(a, b) {
		//向量点乘
		return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	},

	a_angle_b: function(a, b) {
		//获取向量a，b的夹角。
		return Math.acos(this.dot(a, b) / (this.distance(a)*this.distance(b)));
	}


}