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
	/*TODO: Look into this function there seems to be an issue with ordering and shapes being missed*/
	loopCheck(shapes){
		var result;
		var newShapes = Array.from(shapes);
		while(newShapes.length >= 1){
			for(var i=1; i<=newShapes.length-1; i++){
				if(newShapes[0] != undefined && newShapes[i] != undefined){
					result = this.check(newShapes[0].shape, newShapes[i].shape);
					console.log(result, i, newShapes[i]);
					if(result.x || result.y){
						newShapes[0].pos.x += (-1*result.x);
						newShapes[0].pos.y += (-1*result.y);
					}	
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