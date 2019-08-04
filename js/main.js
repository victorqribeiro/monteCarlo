let canvas, c, size, input, solveBtn, clicked = false, path = [], TWOPI = 2*Math.PI, tmp;

window.onload = ()=>{ init() };

function init(){

	canvas = document.createElement('canvas');
	size = 500;
	canvas.width = size;
	canvas.height = size;
	c = canvas.getContext('2d');
	
	c.fillStyle = "white";
	c.fillRect(0,0,size,size);
	c.fillStyle = "black";

	const main = document.getElementById('main');
	main.innerHTML = "";

	const left = document.createElement('div');
	left.id = "left";
	const right = document.createElement('div');
	right.id = "right";

	input = document.createElement('input');
	input.type = "number";
	input.placeholder = "samples";
	input.value = 1000;

	solveBtn = document.createElement('button');
	solveBtn.innerText = "Solve";
	solveBtn.addEventListener('click', solve );
	
	const clear = document.createElement('button');
	clear.innerText = "Clear";
	clear.addEventListener('click', function(){
		erase();
	});

	result = document.createElement('div');
	result.innerHTML = "<br>";

	right.appendChild(input);	
	right.appendChild(solveBtn);
	right.appendChild(clear);
	right.appendChild(result);

	left.appendChild( canvas );

	main.appendChild(left);
	main.appendChild(right);
	document.body.appendChild(main);

	canvas.addEventListener('mouseup', function(){
		clicked = false;
		path = [];
	});

	canvas.addEventListener('mousedown', function(e){
		clicked = true;
		drawPoint( getPos(e) );
	});

	canvas.addEventListener('touchstart', function(e){
		drawPoint( getPos(e) );
	});

	canvas.addEventListener('touchmove', function(e){ 
		drawLine( getPos(e) );
	});

	canvas.addEventListener('mousemove', function(e){
		if( clicked )
			drawLine( getPos(e) );
	});

	canvas.addEventListener('touchend', function(e){
		path = [];
	});

}



const solve = function(){
	
	let inside = 0, mean = 0;

	const total = 100, samples = input.value;

	if( !tmp ){
		tmp = c.getImageData(0,0,size,size);
	}else{
		c.clearRect(0,0,size,size);
		c.putImageData(tmp,0,0);
	}
	
	const newData = new Uint8Array(size*size);
	
	for(let i = 0; i < newData.length; i++){
		newData[i] = tmp.data[i*4];
	}
	
	c.fillStyle = "red";

	for(let j = 0; j < samples; j++){
		const x = Math.round( Math.random() * size );
		const y = Math.round( Math.random() * size );
	
		if( newData[y*size+x] < 128 ){
			inside++;
		}
		
		c.beginPath();
		c.arc(x,y,2,0,TWOPI);
		c.closePath();
		c.fill();
		
	}
	
	result.innerHTML = (size*size) * inside/samples;
	
}

const getPos = function(e){
	e.preventDefault();
	
	let x, y;
	let rect = canvas.getBoundingClientRect();
	
	_x = canvas.width/rect.width;
	_y = canvas.height/rect.height;
	
	if( e.touches ){
		x = e.targetTouches[0].pageX * _x;
		y = (e.targetTouches[0].pageY-rect.y) * _y;
	}else{
		x = e.offsetX * _x;
		y = e.offsetY * _y;
	}
	return {x, y};
}

const drawLine = function(p){
	
	path.push( {x: p.x, y: p.y} );
	
	c.fillStyle = "black";
	
	if (path.length > 1) {
	  c.beginPath();
	  c.lineWidth = size/28 * 3;
	  c.lineCap = "round";
	  c.moveTo(path[path.length - 2].x, path[path.length - 2].y);
	  c.lineTo(path[path.length - 1].x, path[path.length - 1].y);
	  c.stroke();
	  path.shift();
	} 
  
}

const drawPoint = function(p){
	if( tmp ){
		c.clearRect(0,0,size,size);
		c.putImageData(tmp,0,0);
		tmp = null;
	}
	c.fillStyle = "black";
	if( !path.length ){
		path.push( {x: p.x, y: p.y} );
		c.beginPath();
		c.arc(p.x, p.y, (size/28 * 3)/2, 0, Math.PI*2);
		c.fill();
	}
}

const erase = function(){
	tmp = null;
	c.fillStyle = "white";
	c.fillRect(0,0,size,size);
	c.fillStyle = "black";
	result.innerHTML = "<br>";
}
