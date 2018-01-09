//http://www.dyn4j.org/2010/04/gjk-distance-closest-points/
class gjk{
	constructor(){}	
	support_func(shape1, shape2, dir){
		return subtract_vectors(
			shape1.furthest_vector(dir),
			shape2.furthest_vector(negate_vector(dir))
		);	
	}
	check(shape1, shape2, ctx){
		var a,b,c,ab,ac,ao,abPerp,acPerp;
		var dir = subtract_vectors(avg_point(shape1.vectors), avg_point(shape2.vectors) );
		var simplex = [];
		
		simplex.push(this.support_func(shape1, shape2, dir));
		dir = negate_vector(dir);

		while (true) {
			simplex.push( this.support_func(shape1, shape2, dir) );

			if (dot(simplex[simplex.length-1],dir) <= 0) {
				return false;
			} else {
				a  = simplex[simplex.length-1];// get the last point added to the simplex
				ao = negate_vector(a);// compute AO (same thing as -A)
				
				if (simplex.length == 3) {
					b = simplex[1];
					c = simplex[0];
					
					// compute the edges
					ab = subtract_vectors(b,a);
					ac = subtract_vectors(c,a);

					// compute the normals
					abPerp = tripleProduct(ac, ab, ab);
					acPerp = tripleProduct(ab, ac, ac);
					// is the origin in R4
					if (dot(abPerp, ao) > 0) {
						// remove point c
						simplex.splice(0, 1);
						// set the new direction to abPerp
						dir = abPerp;
					}else{
						// is the origin in R3
						if(dot(acPerp,ao) > 0) {
							// remove point b
							simplex.splice(1, 1);
							// set the new direction to acPerp
							dir = acPerp;
						}else{
							// otherwise we know its in R5 so we can return true
							var dis = 100;
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
					ab = subtract_vectors(b,a);
					// get the perp to AB in the direction of the origin
					abPerp = tripleProduct(ab, ao, ab);
					// set the direction to abPerp
					dir = abPerp;
				}
			}
		}		
	}
}	