//http://www.dyn4j.org/2010/04/gjk-distance-closest-points/
class gjk{
	subtract_vectors(a,b){
		return new vector(a.x - b.x, a.y - b.y);	
	}	
	support_func(shape1, shape2, dir){
		return this.subtract_vectors(
			shape1.furthest_vector(dir),
			shape2.furthest_vector(dir.negate_vector())
		);	
	}
	tripleProduct(a, b, c) {
		let r = new vector(0,0);
		let ac = a.dot(c);
		let bc = b.dot(c);
	 
		r.x = b.x * ac - a.x * bc;
		r.y = b.y * ac - a.y * bc;
		return r;
	}	
	check(shape1, shape2, ctx){
		var a,b,c,ab,ac,ao,abPerp,acPerp;
		var dir = this.subtract_vectors(shape1.avg_point(), shape2.avg_point() );
		var simplex = [];
		
		simplex.push(this.support_func(shape1, shape2, dir));
		dir = dir.negate_vector();

		while (true) {
			simplex.push( this.support_func(shape1, shape2, dir) );

			if (simplex[simplex.length-1].dot(dir) <= 0) {
				return false;
			} else {
				a  = simplex[simplex.length-1];// get the last point added to the simplex
				ao = a.negate_vector();// compute AO (same thing as -A)
				
				if (simplex.length == 3) {
					b = simplex[1];
					c = simplex[0];
					
					// compute the edges
					ab = this.subtract_vectors(b,a);
					ac = this.subtract_vectors(c,a);

					// compute the normals
					abPerp = this.tripleProduct(ac, ab, ab);
					acPerp = this.tripleProduct(ab, ac, ac);
					// is the origin in R4
					if (abPerp.dot(ao) > 0) {
						// remove point c
						simplex.splice(0, 1);
						// set the new direction to abPerp
						dir = abPerp;
					}else{
						// is the origin in R3
						if(acPerp.dot(ao) > 0) {
							// remove point b
							simplex.splice(1, 1);
							// set the new direction to acPerp
							dir = acPerp;
						}else{
							// otherwise we know its in R5 so we can return true
							var dis = 500;
							line(simplex[0].x+dis, simplex[0].y+dis, simplex[1].x+dis, simplex[1].y+dis, 'red', ctx);
							line(simplex[1].x+dis, simplex[1].y+dis, simplex[2].x+dis, simplex[2].y+dis, 'blue', ctx);
							line(simplex[2].x+dis, simplex[2].y+dis, simplex[0].x+dis, simplex[0].y+dis, 'green', ctx);					
							return true;
						}
					}
				} else {
					// then its the line segment case
					b = simplex[0];
					// compute AB
					ab = this.subtract_vectors(b,a);
					// get the perp to AB in the direction of the origin
					abPerp = this.tripleProduct(ab, ao, ab);
					// set the direction to abPerp
					dir = abPerp;
				}
			}
		}		
	}
}
class shape{
	constructor(){ this.vectors = []; }
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
	avg_point() {
		let avg = {x:0, y:0};
		
		for (let i = 0; i < this.vectors.length; i++) {
			avg.x += this.vectors[i].x;
			avg.y += this.vectors[i].y;
		} 
		return new vector(avg.x / this.vectors.length, avg.y / this.vectors.length);
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
	constructor(x,y){this.x = x;this.y = y;}
	dot(b){return this.x*b.x + this.y*b.y;}	
	negate_vector(){return new vector(this.x*-1, this.y*-1);}
}	