const canvas = document.getElementById("CANVAS");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
const SIDE = 100;

ctx.translate(canvas.width/2, canvas.height/2);

const sliderAngle = document.getElementById("Angle");
const inputX = document.getElementById("x");
const inputY = document.getElementById("y");
const inputZ = document.getElementById("z");

let angle = sliderAngle.value;
let axis = [inputX.value,inputY.value,inputZ.value];


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


function clear(){
    ctx.save();

    ctx.resetTransform();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
};


function isZero(n){
    return n === 0;
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


function vectLength(v){
	return (v[0] ** 2 + v[1] ** 2 + v[2] ** 2) ** 0.5
};


function vectNormalize(v){
	return vectScale(v, 1/vectLength(v));
};


function crossProduct(v1, v2){
	return [v1[1] * v2[2] - v1[2] * v2[1],
		-(v1[0] * v2[2] - v1[2] * v2[0]),
		v1[0] * v2[1] - v1[1] * v2[0]];
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
	if (t1.length === 3){const t1 = vect2tensor(t1);};
	if (t2.length === 3){const t2 = vect2tensor(t2);};
	
	const zero = [0,0,0,0,0,0,0,0];

	if (t1.every(isZero) || t2.every(isZero)) {return zero;}

	const p0 = (t1[0] !== 0) ?
		[t1[0] * t2[0],
		t1[0] * t2[1],
		t1[0] * t2[2],
		t1[0] * t2[3],
		t1[0] * t2[4],
		t1[0] * t2[5],
		t1[0] * t2[6],
		t1[0] * t2[7]]
		: zero;

	const p1 = (t1[1] !== 0) ?
		[t1[1] * t2[1],
		t1[1] * t2[0],
		t1[1] * t2[4],
		t1[1] * t2[5],
		t1[1] * t2[2],
		t1[1] * t2[3],
		t1[1] * t2[7],
		t1[1] * t2[6]]
		: zero;

	const p2 = (t1[2] !== 0) ? 
		[t1[2] * t2[2],
		-(t1[2] * t2[4]),
		t1[2] * t2[0],
		t1[2] * t2[6],
		-(t1[2] * t2[1]),
		-(t1[2] * t2[7]),
		t1[2] * t2[3],
		-(t1[2] * t2[5])]
		: zero;

	const p3 = (t1[3] !== 0) ?
		[t1[3] * t2[3],
		-(t1[3] * t2[5]),
		-(t1[3] * t2[6]),
		t1[3] * t2[0],
		t1[3] * t2[7],
		-(t1[3] * t2[1]),
		-(t1[3] * t2[2]),
		t1[3] * t2[4]]
		: zero;

	const p4 = (t1[4] !== 0) ?
		[-(t1[4] * t2[4]),
		t1[4] * t2[2],
		-(t1[4] * t2[1]),
		-(t1[4] * t2[7]),
		t1[4] * t2[0],
		t1[4] * t2[6],
		-(t1[4] * t2[5]),
		t1[4] * t2[3]]
		: zero;

	const p5 = (t1[5] !== 0) ?
		[-(t1[5] * t2[5]),
		t1[5] * t2[3],
		t1[5] * t2[7],
		-(t1[5] * t2[1]),
		-(t1[5] * t2[6]),
		t1[5] * t2[0],
		t1[5] * t2[4],
		-(t1[5] * t2[2])]
		: zero;

	const p6 = (t1[6] !== 0) ?
		[-(t1[6] * t2[6]),
		-(t1[6] * t2[7]),
		t1[6] * t2[3],
		-(t1[6] * t2[2]),
		t1[6] * t2[5],
		-(t1[6] * t2[4]),
		t1[6] * t2[0],
		t1[6] * t2[1]]
		: zero;

	const p7 = (t1[7] !== 0) ?
		[-(t1[7] * t2[7]),
		-(t1[7] * t2[6]),
		t1[7] * t2[5],
		-(t1[7] * t2[4]),
		t1[7] * t2[3],
		-(t1[7] * t2[2]),
		t1[7] * t2[1],
		t1[7] * t2[0]]
		: zero;

	const s0 = tensorSum(p0, p1);
	const s1 = tensorSum(s0, p2);
	const s2 = tensorSum(s1, p3);
	const s3 = tensorSum(s2, p4);
	const s4 = tensorSum(s3, p5);
	const s5 = tensorSum(s4, p6);
	const s6 = tensorSum(s5, p7);

	return s6;
};


function rotate(vp, plane, angle){
	const p = vect2tensor(vp);
	const hangle = angle/2;

	const cos = Math.cos(hangle);
	const rotor = tensorScale(plane, Math.sin(hangle));
	const nrotor = tensorScale(rotor, -1);
	
	rotor[0] = cos;
	nrotor[0] = cos;

	const result = geomProduct(nrotor, geomProduct(p,rotor));

	return tensor2vect(result);
};


function findPlane(axis){
	const naxis = vectNormalize(axis);
	const plane = [0,0,0,0,naxis[2],-naxis[1],naxis[0],0];

	return plane;
};


function cloudRotate(cloud, axis, angle){
	const plane = findPlane(axis);
	const rotated = [];

	for (let point of cloud){
		rotated.push(rotate(point, plane, angle));
	}

	return rotated;
};


function calcVertices(cloud, axis, angle){
	const rotated = cloudRotate(cloud, axis, angle);

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


function drawFigure(vertices, sides, axis, angle){
    const newVertices = calcVertices(vertices, axis, angle);
    draw(newVertices, sides);
};


sliderAngle.oninput = (data) => {
    angle = data.target.value;
    clear();
    drawFigure(cube, cubeSides, axis, angle);
};


inputX.oninput = (data) => {
    axis = [data.target.value, axis[1], axis[2]];
    clear();
    drawFigure(cube, cubeSides, axis, angle);
};


inputY.oninput = (data) => {
    axis = [axis[0], data.target.value, axis[2]];
    clear();
    drawFigure(cube, cubeSides, axis, angle);
};


inputZ.oninput = (data) => {
    axis = [axis[0], axis[1], data.target.value];
    clear();
    drawFigure(cube, cubeSides, axis, angle);
};
    

drawFigure(cube, cubeSides, axis, angle);
