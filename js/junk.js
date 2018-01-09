/*
https://mollyrocket.com/849s
http://www.dyn4j.org/2010/04/gjk-gilbert-johnson-keerthi/
*/
class shape{
	constructor(){
		this.vectors = [];
	}
	furthest_vector(dir){
		let k, furthestDot;
		k = furthestDot = Number.MIN_SAFE_INTEGER;
		this.vectors.forEach(function(vector, key){
			if(vector.dot(dir) > furthestDot){
				k = key;
				furthestDot = vector.dot(dir);
			}
		});	
		return this.vectors[k];
	}
	draw(ctx,color='#f00'){
		ctx.fillStyle = color;
		ctx.beginPath();
		for( let i = 0; i < this.vectors.length  ; i++ ){
			ctx.lineTo( this.vectors[i].x , this.vectors[i].y )
		}
		ctx.closePath();
		ctx.fill();	
	}	
}
class vector{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
	dot(b){
		return this.x*b.x + this.y*b.y;
	}	
	negate_vector(){
		return new vector(this.x*-1, this.y*-1);
	}
	subtract_vectors(b){
		return new vector(this.x - b.x, this.y - b.y);	
	}
}

function dot(a,b){
	return a.x*b.x + a.y*b.y;
}
function negate_vector(a){
	return new vector(a.x*-1, a.y*-1);
}
function subtract_vectors(a,b){
	return new vector(a.x - b.x, a.y - b.y);	
}
function furthest_vector(s, direction){
	let k = furthestDot = Number.MIN_SAFE_INTEGER;
	s.vectors.forEach(function(vector,key){
		if(dot(vector,direction) > furthestDot){
			k = key;
			furthestDot = dot(vector,direction);
		}
	});	
	return k;
}
function tripleProduct(a, b, c) {
    let r = new vector(0,0);
	let ac = dot(a,c);
    let bc = dot(b,c);
 
    r.x = b.x * ac - a.x * bc;
    r.y = b.y * ac - a.y * bc;
    return r;
}

function avg_point(vecs) {
    let avg = {x:0, y:0};
	
    for (let i = 0; i < vecs.length; i++) {
        avg.x += vecs[i].x;
        avg.y += vecs[i].y;
    } 
    return new vector(avg.x / vecs.length, avg.y / vecs.length);
} 

function line(x1=0,y1=0,x2=100,y2=100,cl,c){
	c.beginPath();
	c.moveTo(x1,y1);
	c.lineTo(x2,y2);
	c.strokeStyle = cl;
	c.stroke();	
}
function write(str, clear=false){
	if(clear){document.getElementById('debug').innerHTML+=str;}else{document.getElementById('debug').innerHTML=str;}
}
	
function mshape(s1,s2,cl){
	l = subtract_shapes(s1, s2);	
	let ol = new vector(0,0);
	//console.log(l);
	for(let i = 0; i < l.length; i++){
		line(l[i].x+100, l[i].y+100, l[i].x+101, l[i].y+101, "black", cl )	
		ol = l[i];
	}
}
function subtract_shapes(s1, s2){
	var rshape = [];
	s1.vectors.forEach(function(s1v) {
		s2.vectors.forEach(function(s2v) {
			rshape.push(subtract_vectors(s1v,s2v));
		});
	});
	return rshape;
}