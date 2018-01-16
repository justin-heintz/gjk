//http://www.dyn4j.org/2010/04/gjk-distance-closest-points/
//https://github.com/wanadev/collision-gjk-epa/blob/master/build/collision-gjk-epa.js
  
//https://hamaluik.com/posts/building-a-collision-engine-part-2-2d-penetration-vectors/
//https://github.com/FuzzyWuzzie/headbutt/blob/master/src/headbutt/Headbutt2D.hx

//REFREN TO VECTORS FOR Headbutt2D
//https://github.com/FuzzyWuzzie/haxe-glm/blob/master/src/glm/Vec2.hx

  
/* NOTES FOR JUSTIN
	NORMAL: is an object such as a line or vector that is perpendicular to a given object.
	PERPENDICULAR: crossing lines at 90 degrees 
*/
    
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
 		let x, y;
		let ac = a.dot(c);
		let bc = b.dot(c);
	 
		x = (b.x * ac) - (a.x * bc);
		y = (b.y * ac) - (a.y * bc);
		return new vector(x, y);
	}	
	check(shape1, shape2, ctx){
		var a,b,c,ab,ac,ao,abPerp,acPerp;
		var dir = this.subtract_vectors(shape1.avg_point(), shape2.avg_point() );
		var simplex = [];
 
		simplex.push(this.support_func(shape1, shape2, dir));
		
		dir = dir.negate_vector();

		while (true) {
			simplex.push( this.support_func(shape1, shape2, dir) );
			var arg = simplex[simplex.length-1].dot(dir);
		//console.log(simplex[simplex.length-1].dot(dir),dir,simplex.length-1);
			if (simplex[simplex.length-1].dot(dir) <= 0) {
				//console.log(4);
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
							console.log(1);
						}else{
							// otherwise we know its in R5 so we can return true
							var dis = 500;
							line(simplex[0].x+dis, simplex[0].y+dis, simplex[1].x+dis, simplex[1].y+dis, 'red', ctx);
							line(simplex[1].x+dis, simplex[1].y+dis, simplex[2].x+dis, simplex[2].y+dis, 'blue', ctx);
							line(simplex[2].x+dis, simplex[2].y+dis, simplex[0].x+dis, simplex[0].y+dis, 'green', ctx);					
							
							//this.epa(shape1, shape2, simplex)
							//console.log(this.epa(shape1, shape2, simplex));
							
							return this.epa(shape1, shape2, simplex);
						}
					}
				} else {
					//console.log(2);
					// then its the line segment case
					b = simplex[0];
					// compute AB
					ab = this.subtract_vectors(b,a);
					// get the perp to AB in the direction of the origin
					abPerp = this.tripleProduct(ab, ao, ab);
					// set the direction to abPerp
					if(abPerp.x==0,abPerp.y==0){dir = new vector(-1*ab.y,ab.x);}else{
					dir = abPerp;
					}
				}
				//console.log(3);
			}
		}		
	}
	normalize(vec) {
		   var d = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
		   return new vector(vec.x/d, vec.y/d);
	}
	findClosestEdge(winding, vertices){

		var closestIndex = 0;
		var line = new vector(0,0);
		var closestNormal = new vector(0,0);
        var closestDistance = Number.POSITIVE_INFINITY;
        var dist;
        for(let i=0; i<vertices.length; i++) {
            var j = i + 1;
            if(j >= vertices.length){ j = 0;}

			line = this.subtract_vectors(vertices[i], vertices[j]);//MAYBE SWITCH I WITH J !!!!!!!

            switch(winding) {
                case "cw":
                    var norm = new vector(line.y, -line.x);
                case "ccw":
                    var norm = new vector(-line.y, line.x);
            }
			
            norm = this.normalize(norm);

            // calculate how far away the edge is from the origin
            //console.log( norm )
			dist = norm.dot(vertices[i]);
			
		   if(dist <= closestDistance) {
                closestDistance = dist;
                closestNormal = norm;
                closestIndex = j;
            }
        }
		//console.log(closestDistance, closestNormal, closestIndex); 
        return new Edge(closestDistance, closestNormal, closestIndex);		
	}

	epa(shape1, shape2, vertices){
        var edge, support, distance;
        var e0 = (vertices[1].x - vertices[0].x) * (vertices[1].y + vertices[0].y);
        var e1 = (vertices[2].x - vertices[1].x) * (vertices[2].y + vertices[1].y);
        var e2 = (vertices[0].x - vertices[2].x) * (vertices[0].y + vertices[2].y); 
		var winding = (e0 + e1 + e2 >= 0 ? "cw" : "ccw") 
        var intersection = new vector(0,0);   

		for(let i = 0; i <= 20; i++){
            edge = this.findClosestEdge(winding, vertices);//Edge
            support = this.support_func(shape1,shape2,edge.normal);//vector
 
            distance = support.dot(edge.normal);//float

			intersection = edge.normal ; //try intersection = edge.normal OR edge.normal = intersection  ;
            intersection.multiplyScalar(distance, intersection);
           
			if(Math.abs(distance - edge.distance) <= 0.00001) {
				//console.log(1)
                return intersection;
            }else{
				vertices[edge.index]=support; 
            }
        }
		//console.log(2)
        return intersection;		
	}
	
}
 class Edge {
    constructor(distance, normal, index) {
        this.distance = distance;
        this.normal = normal;
        this.index = index;
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
	dot(b){return (this.x*b.x) + (this.y*b.y);}	
	negate_vector(){return new vector(this.x*-1, this.y*-1);}
	
	multiplyScalar(s,a) {
        a.x = a.x * s;
        a.y = a.y * s;
        return a;
    }
	
}

/*
ADDDDD THIS
	multiplyScalar(a:Vec2, s:Float, dest:Vec2):Vec2 {
        dest.x = a.x * s;
        dest.y = a.y * s;
        return dest;
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

	support(direction:Vec2):Vec2 {
        var furthestDistance:Float = Math.NEGATIVE_INFINITY;
        var furthestVertex:Vec2 = new Vec2(0, 0);

        var vo:Vec2 = new Vec2();
        for(v in vertices) {
            vo = v.addVec(offset, vo);
            var distance:Float = Vec2.dot(vo, direction);
            if(distance > furthestDistance) {
                furthestDistance = distance;
                furthestVertex = vo.copy(furthestVertex);
            }
        }	


    calculateSupport(direction:Vec2):Vec2 {
        var oppositeDirection:Vec2 = direction.multiplyScalar(-1, new Vec2());
        
		var newVertex:Vec2 = shapeA.support(direction).copy(new Vec2());
       
	   newVertex.subtractVec(shapeB.support(oppositeDirection), newVertex);
        return newVertex;
    }

	support_func(shape1, shape2, dir){
		return this.subtract_vectors(
			shape1.furthest_vector(dir),
			shape2.furthest_vector(dir.negate_vector())
		);	
	}
	
	*/