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