const exp = Math.exp,
	  sin = Math.sin,
	  cos = Math.cos,
	  pow = Math.pow,
	  rand = function() {
	  	 return 0.5 + Math.random() * 0.1;
	  };

var nx = 200,
	ny = 200,
	vx = [],
	vy = [],
	vz = [],
	vertices = '',
	faces = '',
	xmin = -4.2,
	xmax = 4.2,
	ymin = -4.2,
	ymax = 4.2,
	xwid = xmax - xmin,
	ywid = ymax - ymin,
	zfunc = '3.5 * exp(-(X^2 + T^2)) + 2 * exp(-(X^2 + (T+3)^2)) - 4 * exp(-((X-3)^2 + T^2)) -4 * exp(-(X^2 + (T-3)^2)) + 2.5 * exp(-((X+3)^2 + T^2)) + sin(3 * X) * rand(1) + cos(3 * T) * rand(1)';
	zfunc = math2js(zfunc);
console.log(zfunc);

for( let i=0; i<ny; i++) {
	for( let j=0; j<nx; j++) {
		faces += `${(nx + 1) * i + j} ${(nx + 1) * i + j + 1} ${(nx + 1) * (i + 1) + j + 1} -1 ${(nx + 1) * (i + 1) + j + 1} ${(nx + 1) * (i + 1) + j} ${(nx + 1) * i + j} -1 `; 
	}
}
faces = faces.slice(0, faces.length - 4);

vx = new Array(nx + 1).join(',').split(',').map( (a, i) => i * xwid / nx + xmin );
vy = new Array(ny + 1).join(',').split(',').map( (a, i) => i * ywid / ny + ymin );
vx = vx.map( x => vx ).flat();
vy = vy.map( y => new Array(nx + 1).join(',').split(',').map( a => y ) ).flat();

vx.forEach( (x, i) => {
	let z = eval(zfunc.replace(/X/g, x).replace(/T/g, vy[i]));
	vertices += `${x} ${vy[i]} ${z}, `;
	vz.push(z);

})

let zmax = parseFloat(Math.max(...vz).toFixed(2)),
	zmin = parseFloat(Math.min(...vz).toFixed(2)),
	scale = Math.min(2 / xwid, 2 / ywid, 2 / (zmax - zmin)).toFixed(4),
	translation = `${-(xmax + xmin) / 2} ${-(ymax + ymin) / 2} ${-(zmax + zmin) / 2}`,
	box = `${xmin} ${ymin} ${zmin} ${xmax} ${ymin} ${zmin} ${xmax} ${ymax} ${zmin} ${xmin} ${ymax} ${zmin} ${xmin} ${ymin} ${zmax} ${xmax} ${ymin} ${zmax} ${xmax} ${ymax} ${zmax} ${xmin} ${ymax} ${zmax}`,
	cut_x_plane = `${xmin} ${ymin} ${zmin}, ${xmin} ${ymax} ${zmin}, ${xmin} ${ymax} ${zmax}, ${xmin} ${ymin} ${zmax}`,
	cut_y_plane = `${xmin} ${ymin} ${zmin}, ${xmax} ${ymin} ${zmin}, ${xmax} ${ymin} ${zmax}, ${xmin} ${ymin} ${zmax}`,
	cut_z_plane = `${xmin} ${ymin} ${zmin}, ${xmax} ${ymin} ${zmin}, ${xmax} ${ymax} ${zmin}, ${xmin} ${ymax} ${zmin}`;
	scale = `${scale} ${scale} ${scale}`;
	nx += 1;
	ny += 1;


function math2js(zfunc) {
	while( zfunc.indexOf('^') > -1 ) {
    	let pos = zfunc.indexOf('^'),
    		l_zfunc = '',
    		r_zfunc = '',
        	num_l = 0,
        	num_r = 0;
    	for( let i = pos - 1; i > -1; i-- ) {
      	num_l += zfunc[i] === "(" ? 1 : 0;
      	num_r += zfunc[i] === ")" ? 1 : 0;
      	if( num_l === num_r ) {
            	l_zfunc = zfunc.slice(0, i) + '(pow(' + zfunc.slice(i, pos) + ', ';
            	r_zfunc = zfunc.slice(pos + 1, zfunc.length);
            	break
        	}
    	}
	
    	if( r_zfunc[0].match(/^\d+[.]?\d{0,}/) ) {
    		zfunc = l_zfunc + r_zfunc.match(/^\d+[.]?\d{0,}/)[0] + '))' + r_zfunc.replace(/^\d+[.]?\d{0,}/, '');
    	} else {
    		num_l = 0;
    		num_r = 0;
    		for( let i = 0; i < r_zfunc.length; i++ ) {
      			num_l += r_zfunc[i] === "(" ? 1 : 0;
      			num_r += r_zfunc[i] === ")" ? 1 : 0;
      			if( num_l === num_r ) {
            		zfunc = l_zfunc + r_zfunc.slice(0, i+1) + '))' + r_zfunc.slice(i+1, r_zfunc.length);
            		break
        		}
    		}
    	}
	}
	return zfunc
}