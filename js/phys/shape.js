class shape{
	constructor(name,moves,vectors=[]){ 
		this.x = this.y = 0;
		this.color = "red";
		this.name = name;
		this.moves = moves;	
		this.vectors = vectors; 
		
		this.paths = [];
		this.crnt_path = 0;
		this.crnt_point = 0;
		this.path_loop = true;
		this.path_reverse = false;
		this.following_path = false;
		this.centroid = this.gen_centroid();
		
		/* TMP  FOR TESTING */
		this.paths['path_1'] = [
			new vector(1000,100),
			new vector(1200,100),
			new vector(1300,200),
			new vector(1300,300),
			new vector(1200,400),
			new vector(1000,100)
		]; 	
		
		this.paths['path_2'] = [
			new vector(100,100),
			new vector(120,100),
			new vector(130,200),
			new vector(130,300),
			new vector(120,400),
			new vector(100,100)
		]
		
		this.paths['path_3'] = [
			new vector(150,100),
			new vector(250,100),
			new vector(250,150),
			new vector(150,150)
		]

	}
	at_point(vector1,vector2,radius){ 
		var absX = Math.pow(Math.abs(vector1.x - vector2.x), 2.0) 
		var absY = Math.pow(Math.abs(vector1.y - vector2.y), 2.0) 
		return (Math.sqrt(absX + absY) < radius); 
	}
	follow_path(){
		if(this.following_path){
			var path_x = this.paths[this.crnt_path][this.crnt_point].x; 
			var path_y = this.paths[this.crnt_path][this.crnt_point].y;			
 
			if(this.centroid.x > path_x){this.x-=5;}else if(this.centroid.x < path_x){this.x+=5;} 
			if(this.centroid.y > path_y){this.y-=5;}else if(this.centroid.y < path_y){this.y+=5;} 
			
			if( 	this.at_point(this.centroid,this.paths[this.crnt_path][this.crnt_point],5) ){ 			
				if(this.crnt_point < this.paths[this.crnt_path].length-1){
					this.crnt_point++;
				}else{
					if(this.path_loop){
						this.crnt_point=0;
					}else{
						this.following_path = false;
					}
				} 
			}			
		}
	}
	update(){
		if(this.moves){
			this.follow_path();
			for(let i=0; i<this.vectors.length; i++){
				this.vectors[i].x += this.x;
				this.vectors[i].y += this.y;
			}
			this.centroid = this.gen_centroid();
			this.x = this.y = 0;			
		}
	}
	draw(ctx){
		ctx.fillStyle = this.color;
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
	gen_centroid() {
		var x = 0;
		var y = 0;
		var pointCount = this.vectors.length;
		
		for (var i=0; i<pointCount; i++){	
			x += this.vectors[i].x;
			y += this.vectors[i].y;
		}

		x = Math.ceil(x/pointCount);
		y = Math.ceil(y/pointCount);

		return new vector(x, y);
	}	
}