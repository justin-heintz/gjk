class gjk{
	constructor(){
		this.shape1;
		this.shape2;
		this.simplex = []; 
	}
	subtract_vectors(a,b){
		return new vector(a.x - b.x, a.y - b.y);	
	}	
	support_func(dir){
		return this.subtract_vectors(
			this.shape1.furthest_vector(dir),
			this.shape2.furthest_vector(dir.negate_vector())
		);	
	}
	tripleProduct(a,b,c) {
 		let x, y;
		let ac = a.dot(c);
		let bc = b.dot(c);
	 
		x = (b.x * ac) - (a.x * bc);
		y = (b.y * ac) - (a.y * bc);
		return new vector(x, y);
	}	
	check(shape1, shape2){
		this.shape1 = shape1;
		this.shape2 = shape2;
		this.simplex = [];
		
		var a,b,c,ab,ac,ao,abPerp,acPerp;
		var dir = this.subtract_vectors(this.shape1.avg_point(), this.shape2.avg_point() );
 
		this.simplex.push(this.support_func(dir));
		
		dir = dir.negate_vector();

		while(true){
			this.simplex.push( this.support_func( dir) );

			if (this.simplex[this.simplex.length-1].dot(dir) <= 0) {
				return false;
			}else{
				a  = this.simplex[this.simplex.length-1]; 
				ao = a.negate_vector(); 
				
				if (this.simplex.length == 3) {
					b = this.simplex[1];
					c = this.simplex[0];
					
					// compute the edges
					ab = this.subtract_vectors(b,a);
					ac = this.subtract_vectors(c,a);

					// compute the normals
					abPerp = this.tripleProduct(ac, ab, ab);
					acPerp = this.tripleProduct(ab, ac, ac);
					// is the origin in R4
					if (abPerp.dot(ao) > 0) {
						// remove point c
						this.simplex.splice(0, 1);
						// set the new direction to abPerp
						dir = abPerp;
					}else{
						// is the origin in R3
						if(acPerp.dot(ao) > 0) {
							// remove point b
							this.simplex.splice(1, 1);
							// set the new direction to acPerp
							dir = acPerp;
						}else{
 							return this.epa();
						}
					}
				}else{
					// then its the line segment case
					b = this.simplex[0];
					// compute AB
					ab = this.subtract_vectors(b,a);
					// get the perp to AB in the direction of the origin
					abPerp = this.tripleProduct(ab, ao, ab);
					// set the direction to abPerp
					dir = (abPerp.x==0 && abPerp.y==0? new vector(-1*ab.y,ab.x) : abPerp);
				}
			}
		}		
	}
	epa(){
        var edge, support, distance;
        var e0 = (this.simplex[1].x - this.simplex[0].x) * (this.simplex[1].y + this.simplex[0].y);
        var e1 = (this.simplex[2].x - this.simplex[1].x) * (this.simplex[2].y + this.simplex[1].y);
        var e2 = (this.simplex[0].x - this.simplex[2].x) * (this.simplex[0].y + this.simplex[2].y); 
		var winding = (e0 + e1 + e2 >= 0 ? "cw" : "ccw") 
        var intersection = new vector(0,0);   

		for(let i = 0; i <= 10; i++){
            edge = this.findClosestEdge(winding);
            support = this.support_func( edge.normal);
            distance = support.dot(edge.normal);
			intersection = edge.normal;
            intersection.multiplyScalar(distance, intersection);
           
			if(Math.abs(distance - edge.distance) <= 0.00001) {
                return intersection;
            }else{
				this.simplex[edge.index]=support; 
            }
        }
        return intersection;		
	}
	findClosestEdge(winding){
		var cIndex = 0;
		var dist, norm;
		var line = new vector(0,0);
		var cNormal = new vector(0,0);
        var cDistance = Number.POSITIVE_INFINITY;
        
        for(let i=0,j; i<this.simplex.length; i++) {
            
			j = i + 1;
            
			if(j >= this.simplex.length){ j = 0;}

			line = this.subtract_vectors(this.simplex[i], this.simplex[j]);

			norm = (winding=="cw" ? new vector(line.y, -line.x) : new vector(-line.y, line.x) );

            norm = norm.normalize();

			dist = norm.dot(this.simplex[i]);
			
		   if(dist <= cDistance) {
                cDistance = dist;
                cNormal = norm;
                cIndex = j;
            }
        }
		
        return new edgeObj(cDistance, cNormal, cIndex);		
	}
	loopCheck(shapes){
		var result;
		var newShapes = Array.from(shapes);
		while(newShapes.length >= 1){
			for(var i=1; i<=newShapes.length-1; i++){
				//console.log(newShapes[0].name, newShapes[i].name);
				result = this.check(newShapes[0], newShapes[i]);
				if(result.x || result.y){
					newShapes[0].x=-1*result.x;
					newShapes[0].y=-1*result.y;
				}				
			}
			newShapes.splice(0, 1);
		}
	}	
}
class edgeObj{
    constructor(distance,normal,index) {
        this.distance = distance;
        this.normal = normal;
        this.index = index;
    }
}
class shape{
	constructor(name,moves,vectors=[]){ 
		this.x = this.y = 0;
		this.name = name;
		this.moves = moves;	
		this.vectors = vectors; 
	}
	update(){
		if(this.moves){
			for(let i=0; i<this.vectors.length; i++){
				this.vectors[i].x += this.x;
				this.vectors[i].y += this.y;
			}
		}
		this.x = this.y = 0;
	}
	draw(ctx,color='#f00'){
		ctx.fillStyle = color;
		ctx.beginPath();
		for(let i = 0; i < this.vectors.length; i++ ){
			ctx.lineTo( this.vectors[i].x , this.vectors[i].y );
		}
		ctx.closePath();
		ctx.fill();	
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
	avg_point(){
		let avg = new vector(0,0);
		
		for (let i = 0; i < this.vectors.length; i++) {
			avg.x += this.vectors[i].x;
			avg.y += this.vectors[i].y;
		} 
		return new vector(avg.x / this.vectors.length, avg.y / this.vectors.length);
	} 	
	
}
class vector{
	constructor(x,y){this.x = x; this.y = y;}
	dot(b){return (this.x*b.x) + (this.y*b.y);}	
	negate_vector(){return new vector(this.x*-1, this.y*-1);}
	normalize(){
		var d = Math.sqrt(this.x*this.x+this.y*this.y);
		return new vector(this.x/d, this.y/d);
	}	
	multiplyScalar(s,a){
        a.x=a.x*s; a.y=a.y*s;
        return a;
    }
}