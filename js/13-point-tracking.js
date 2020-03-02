const pi = Math.PI;
var target, plane;
var arm0, arm1, arm2, arm3;
var width;
var height;
class Robot {
	// 考虑三维四自由度机械臂。
	constructor(arm_lengths, radius) {
		this.arm_lengths = arm_lengths;
		this.joint_radius = radius;
		this.joint_angles = [0, pi/2, 0, 0];
		this.target_pos = [];
		this.arms = [];
		this.robot = null;
	}

	draw() {
		let world = new THREE.Group();
		width = this.arm_lengths.slice(1).reduce( (i, j) => i+j);
		height = width + this.arm_lengths[0];
		let texture = new THREE.TextureLoader().load('images/tile-floor01.jpg');
		plane = new THREE.Mesh(
			new THREE.CircleGeometry(width, 50, 50), 
			new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0.9})
		)
		plane.rotation.x = -pi/2;

		// robot
		let robot = new THREE.Group();

		// arm0
		arm0 = new THREE.Mesh(
			new THREE.CylinderGeometry(this.joint_radius - 0.5, this.joint_radius - 0.5, this.arm_lengths[0], 30),
   			new THREE.MeshLambertMaterial({wireframe: !1, color: '#dd4411'}) 
   		)
   		arm0 = change_origin([0, -this.arm_lengths[0]/2, 0], arm0);
   		arm0.position.y = 0;
		let arm0_bottom = new THREE.Mesh(
			new THREE.CylinderGeometry(5, 5, 2, 5),
   			new THREE.MeshLambertMaterial({wireframe: !1, color: '#c0c0c0'})
   		)
		arm0_bottom.position.y = 1; 
   		arm0.add(arm0_bottom);

   		// arm 1-3
   		[arm1, arm2, arm3] = [1, 2, 3].map( i => {
   			let arm = new THREE.Mesh(
				new THREE.CylinderGeometry(this.joint_radius - 0.5, this.joint_radius - 0.5, this.arm_lengths[i], 30),
   				new THREE.MeshPhongMaterial({wireframe: !1, color: '#dd4411'})
   			);
   			arm = change_origin([0, -this.arm_lengths[i]/2, 0], arm);
   			arm.position.y = this.arm_lengths[i-1];
			let arm_bottom = new THREE.Mesh(
				new THREE.SphereGeometry(this.joint_radius, 50, 50),
				new THREE.MeshPhongMaterial({ wireframe: !1, color: 'white'})
			);
			arm.add(arm_bottom);
			return arm;
   		})

		target = new THREE.Mesh(
			new THREE.SphereGeometry(1.5, 50, 50), 
			new THREE.MeshLambertMaterial({color: 'yellow'})	
		);

		let len = this.arm_lengths.slice(1);
		let min_r = Math.max(len[2] + len[1] - len[0], len[0], len[2] + len[0] - len[1]);
		let s1 = new THREE.Mesh(
			new THREE.SphereGeometry(min_r, 10, 10), 
			new THREE.MeshBasicMaterial({color: 'blue', wireframe: !0})	
		);
		s1.position.z = this.arm_lengths[0];
		let s2 = new THREE.Mesh(
			new THREE.SphereGeometry(width, 20, 20), 
			new THREE.MeshBasicMaterial({color: 'red', wireframe: !0})	
		);
		s2.position.z = this.arm_lengths[0];

		robot.add(arm0);	
		arm0.add(arm1);
		arm1.add(arm2);
		arm2.add(arm3);
		plane.add(target);
		// plane.add(s1);
		// plane.add(s2);
		world.add(plane);
		world.add(robot);
   		scene.add(world);
   		this.robot = robot;
   		world.position.y = -height/2;

 		// x-红色，y-绿色，z-蓝色
 		plane.rotation.z = pi/2;
		plane.add(new THREE.AxisHelper( width ));
	
   		var pos_arr = [
			[0, height, 0],
			[0, 0, height],
			[height, 0, 0],
			[0, -height, 0],
			[0, 0, -height],
			[-height, 0, 0]
		]
		for(let i=0; i<6; i++) {

			let light = new THREE.DirectionalLight( i%2 == 1 ? 0xffffff : 0x444444, 1); //  太阳光-平行光
			light.position.set(...pos_arr[i]);
			scene.add(light);
		}
		
		scene.add( new THREE.AmbientLight( 0x444444 ) );
	}

	get_joint_angle(x, y) {
		// 逆向动力学，求夹角。
		let lens = this.arm_lengths.slice(1);
		let theta123, phi, theta12, theta12_, psi,
			 theta1, theta1_, theta2, theta3, joint_angles;
		phi = theta123 = Math.atan2(y, x);
		let a = 2 * (x -  lens[2] * Math.cos(phi)) * lens[1];
		let b = 2 * (y -  lens[2] * Math.sin(phi)) * lens[1];
		let c = x*x + y*y + lens[1]*lens[1] + lens[2]*lens[2] - lens[0]*lens[0] - 2*lens[2]*( x*Math.cos(phi) + y*Math.sin(phi) );
		let d = b*b + a*a - c*c;
		if( d < 0 ) { // 无法到达
			console.log('无法到达');			
			return !1;
		} else {
			psi = theta12 = 2*Math.atan( (b + Math.sqrt(d) ) / (a + c) ); // b +/- sqrt(d)都可以。
			theta12_ = 2*Math.atan( (b - Math.sqrt(d) ) / (a + c) );
			theta1 = Math.acos( (x - lens[2]*Math.cos(phi) - lens[1]*Math.cos(psi)) / lens[0] );
			theta1_ = Math.asin( (y - lens[2]*Math.sin(phi) - lens[1]*Math.sin(psi)) / lens[0] )
			theta2 = theta12 - theta1;
			theta3 = theta123 - theta12;
			if( theta1_ < 0 ) {
				theta1 = -theta1;
				theta2 = theta12 - theta1;
			}
			
			[theta1, theta2, theta3].forEach( theta => {
				if( theta > pi ) {
					theta -= 2*pi;
				} else if( theta < -pi ) {
					theta += 2*pi;
				}
				this.joint_angles.push(theta);
			});
			return !0;
		}
	}

	update() {
		this.robot.rotation.y = this.joint_angles[0];
		arm1.rotation.x = this.joint_angles[1] - pi/2;
		arm2.rotation.x = this.joint_angles[2];
		arm3.rotation.x = this.joint_angles[3];
	}

	start() {
		let x = width*(1 - 2*Math.random());
		let y = width*(1 - 2*Math.random());
		let z = height*Math.random();
		let r2 = x*x + y*y + (z-this.arm_lengths[0])*(z-this.arm_lengths[0]);
		let len = this.arm_lengths.slice(1);
		let min_r = Math.max(len[2] + len[1] - len[0], len[0], len[2] + len[0] - len[1]);
		if( z-this.arm_lengths[0] <= 0 || r2 > width*width || r2 < min_r*min_r ) {
			this.start();
		} else {
			let beta = Math.atan2(y, x); // beta
			let x1 = x*Math.cos(beta) + y*Math.sin(beta);
			let z1 = z - this.arm_lengths[0];
			this.joint_angles = [beta];
			if( this.get_joint_angle(x1, z1) ) { // theta1, theta2, theta3
				target.position.set(x, y, z);
				setTimeout(() => {
					this.update();
					setTimeout(() => {
						this.start();
					}, 500);
				}, 1000);
			} else {
				let ball = new THREE.Mesh(
					new THREE.SphereGeometry(0.3, 5, 5), 
					new THREE.MeshLambertMaterial({color: 'gray'})	
				);
				ball.position.set(x, y, z);
				plane.add(ball);
				this.start();
			}
		}
	}
}

var arm_lengths = [20, 15, 12, 16];
var robot = new Robot(arm_lengths, 2);
robot.draw();
robot.start();


//通过x,y,z指定旋转中心改变x，y，z的顺序，obj是要旋转的对象
// position改变的是几何体相对于父级坐标系的位置而非中心。
function change_origin(pos, obj){
   	let wrapper = new THREE.Object3D();
    wrapper.position.set(...pos);
    wrapper.add(obj);
    obj.position.set(...pos.map(d => -d));
    return wrapper;
}

camera.position.set(0, height, 2*height);
camera.lookAt(new THREE.Vector3(0, 0, 0));
var controls = new THREE.TrackballControls(camera);
(function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
})();