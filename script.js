const canvas = document.getElementById("CANVAS");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
const SIDE = 100;

ctx.translate(canvas.width/2, canvas.height/2);

let xAngle = 0;
let yAngle = 0;
let zAngle = 0;

const xAngleSlider = document.getElementById("xAngle");
const yAngleSlider = document.getElementById("yAngle");
const zAngleSlider = document.getElementById("zAngle");


const cube = [
    [-0.5, -0.5, 0.5],
    [-0.5, -0.5, -0.5],
    [0.5, -0.5, -0.5],
    [0.5, -0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [-0.5, 0.5, -0.5],
    [0.5, 0.5, -0.5],
    [0.5, 0.5, 0.5],
];


const cubeSides = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 3],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
    [4, 5],
    [5, 6],
    [6, 7],
    [4, 7],
];


xAngleSlider.oninput = (data) => {
    xAngle = data.target.value;
    clear();
    drawCube(xAngle, yAngle, zAngle);
};


yAngleSlider.oninput = (data) => {
    yAngle = data.target.value;
    clear();
    drawCube(xAngle, yAngle, zAngle);
};


zAngleSlider.oninput = (data) => {
    zAngle = data.target.value;
    clear();
    drawCube(xAngle, yAngle, zAngle);
};


function clear(){
    ctx.save();

    ctx.resetTransform();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
};


// tensor - [0,0,0,0,0,0,0,0]

function vect2tensor(v){
	return [0,v[0],v[1],v[2],0,0,0,0];
};


function tensor2vect(t){
	return [t[1],t[2],t[3]];
};


function vectScale(v, s){
	return [v[0] * s, v[1] * s, v[2] * s];
};


function tensorSum(t1, t2){
	return [t1[0] + t2[0],
		t1[1] + t2[1],
		t1[2] + t2[2],
		t1[3] + t2[3],
		t1[4] + t2[4],
		t1[5] + t2[5],
		t1[6] + t2[6],
		t1[7] + t2[7]]
};


function tensorSub(t1, t2){
	t2 = tensorScale(t2, -1);
	return tensorSum(t1,t2);
};


function tensorScale(t, s){
	return [t[0] * s,
		t[1] * s,
		t[2] * s,
		t[3] * s,
		t[4] * s,
		t[5] * s,
		t[6] * s,
		t[7] * s]
};


function geomProduct(t1, t2){
	if (t1.lenght === 3){const t1 = vect2tensor(t1);};
	if (t2.lenght === 3){const t2 = vect2tensor(t2);};
	
	const p0 = [
		t1[0] * t2[0],
		t1[0] * t2[1],
		t1[0] * t2[2],
		t1[0] * t2[3],
		t1[0] * t2[4],
		t1[0] * t2[5],
		t1[0] * t2[6],
		t1[0] * t2[7]
	];

	const p1 = [
		t1[1] * t2[1],
		t1[1] * t2[0],
		t1[1] * t2[4],
		t1[1] * t2[5],
		t1[1] * t2[2],
		t1[1] * t2[3],
		t1[1] * t2[7],
		t1[1] * t2[6]
	];

	const p2 = [
		t1[2] * t2[2],
		-(t1[2] * t2[4]),
		t1[2] * t2[0],
		t1[2] * t2[6],
		-(t1[2] * t2[1]),
		-(t1[2] * t2[7]),
		t1[2] * t2[3],
		-(t1[2] * t2[5])
	];

	const p3 = [
		t1[3] * t2[3],
		-(t1[3] * t2[5]),
		-(t1[3] * t2[6]),
		t1[3] * t2[0],
		t1[3] * t2[7],
		-(t1[3] * t2[1]),
		-(t1[3] * t2[2]),
		t1[3] * t2[4]
	];

	const p4 = [
		-(t1[4] * t2[4]),
		t1[4] * t2[2],
		-(t1[4] * t2[1]),
		-(t1[4] * t2[7]),
		t1[4] * t2[0],
		t1[4] * t2[6],
		-(t1[4] * t2[5]),
		t1[4] * t2[3]
	];

	const p5 = [
		-(t1[5] * t2[5]),
		t1[5] * t2[3],
		t1[5] * t2[7],
		-(t1[5] * t2[1]),
		-(t1[5] * t2[6]),
		t1[5] * t2[0],
		t1[5] * t2[4],
		-(t1[5] * t2[2])
	];

	const p6 = [
		-(t1[6] * t2[6]),
		-(t1[6] * t2[7]),
		t1[6] * t2[3],
		-(t1[6] * t2[2]),
		t1[6] * t2[5],
		-(t1[6] * t2[4]),
		t1[6] * t2[0],
		t1[6] * t2[1]
	];

	const p7 = [
		-(t1[7] * t2[7]),
		-(t1[7] * t2[6]),
		t1[7] * t2[5],
		-(t1[7] * t2[4]),
		t1[7] * t2[3],
		-(t1[7] * t2[2]),
		t1[7] * t2[1],
		t1[7] * t2[0]
	];

	const s0 = tensorSum(p0, p1);
	const s1 = tensorSum(s0, p2);
	const s2 = tensorSum(s1, p3);
	const s3 = tensorSum(s2, p4);
	const s4 = tensorSum(s3, p5);
	const s5 = tensorSum(s4, p6);
	const s6 = tensorSum(s5, p7);

	return s6;
};


function rotate(vp, vb1, vb2, angle){
	const p = vect2tensor(vp);
	const b1 = vect2tensor(vb1);
	const b2 = vect2tensor(vb2);
	const hangle = angle/2;

	const m1 = tensorScale(p, Math.cos(hangle) ** 2);
	const m2 = tensorScale(geomProduct(p, geomProduct(b1,b2)), Math.sin(hangle) * Math.cos(hangle));
	const m3 = tensorScale(geomProduct(geomProduct(b1,b2), p), Math.sin(hangle) * Math.cos(hangle));
	const m4 = tensorScale(geomProduct(geomProduct(geomProduct(geomProduct(b1,b2),p), b1), b2), Math.sin(hangle) ** 2);

	const result = tensorSub(tensorSub(tensorSum(m1, m2), m3), m4);

	return tensor2vect(result);
};


function xRotate (points, angle){
	const y = [0, 1, 0];
	const z = [0, 0, 1];

	const rotated = [];
	for (let point of points){
		rotated.push(rotate(point, z, y, angle));
	}

	return rotated;
};


function yRotate (points, angle){
	const x = [1, 0, 0];
	const z = [0, 0, 1];

	const rotated = [];
	for (let point of points){
		rotated.push(rotate(point, x, z, angle));
	}

	return rotated;
};


function zRotate (points, angle){
	const y = [0, 1, 0];
	const x = [1, 0, 0];

	const rotated = [];
	for (let point of points){
		rotated.push(rotate(point, y, x, angle));
	}

	return rotated;
};


function calcVertices(points, xAngle, yAngle, zAngle){
	const rotated = zRotate(yRotate(xRotate(points, xAngle),yAngle), zAngle);

	const resVert = [];
	for (let point of rotated){
		resVert.push(vectScale(point, SIDE));
	}
	
	return resVert;
};


function connect(side, vertices){
    const p1 = side[0];
    const p2 = side[1];
    ctx.beginPath();
    ctx.moveTo(vertices[p1][0], vertices[p1][1]);
    ctx.lineTo(vertices[p2][0], vertices[p2][1]);
    ctx.closePath();
    ctx.stroke();
};


function draw (vertices, sides){
    for (let side of sides) {
        connect(side, vertices);
    }
};


function drawCube(xAngle, yAngle, zAngle){
	const vertices = calcVertices(cube, xAngle, yAngle, zAngle);
	draw(vertices, cubeSides);
}

drawCube(xAngle, yAngle, zAngle);
