class grid{
	constructor(cam_width, cam_height){
		this.container = [];
		this.grid_size  = 40;
		this.cam_width = cam_width;
		this.cam_height = cam_height;
	}
	add(ent){
		var key = this.key(this.divide(ent.shape.centroid.x-20), this.divide(ent.shape.centroid.y-20));
		
		if(!Array.isArray( this.container[key] )){ this.container[key] = []; }
		this.container[key].push(ent);
		ent.id = key;
	}
	get(x_min,y_min,callback=null){
		var tmp_key, listen = [];
 		for(let x=this.divide(x_min-40); x<this.divide(this.cam_width+x_min); x++){
			for(let y=this.divide(y_min); y<this.divide(this.cam_height+y_min); y++){
				if(callback != null){ 
					tmp_key = this.key(x,y);
					if( Array.isArray(this.container[tmp_key]) && this.container[this.key(x,y)].length > 0){
						for(let i=0; i<this.container[tmp_key].length; i++){
							callback(this.container[tmp_key][i]);
						}
					}
				}else{
					if(this.container[this.key(x,y)] != undefined){
						if( this.container[this.key(x,y)].length != 0){
							
							for(let i = 0; i <= this.container[this.key(x,y)].length-1; i++){
								listen.push(this.container[this.key(x,y)][i]);
							}
						}
					}
				}
			}
		}
		if(listen.length!=0){ return listen; }
 	}
	get_single(vector,direction){
		var x = Math.floor(vector.x/this.grid_size) + (direction? 1 : -1);
		var y = Math.floor(vector.y/this.grid_size);
 
		if(this.container['1-'+x+'-1-'+y] != undefined && this.container['1-'+x+'-1-'+y].length > 0){
			return this.container['1-'+x+'-1-'+y]
		}else{ 
			return null; 
		}
	}
	surrounding_ents(vector){
		var x = Math.floor(vector.x/this.grid_size);
		var y = Math.floor(vector.y/this.grid_size);
 
/*
		return [
			this.check_empty( this.container['1-'+x+'-1-'+(y-1)]  ),
			this.check_empty( this.container['1-'+(x+1)+'-1-'+y]  ),
			this.check_empty( this.container['1-'+x+'-1-'+(y-1)]  ),
			this.check_empty( this.container['1-'+(x-1)+'-1-'+y]  )
			];
		*/
		return[
			this.check_empty( this.container['1-'+x+'-1-'+(y+1)]  ),//1
			this.check_empty( this.container['1-'+x+'-1-'+(y-1)]  ),//2
			this.check_empty( this.container['1-'+(x+1)+'-1-'+y]  ),//3
			this.check_empty( this.container['1-'+(x-1)+'-1-'+y]  )	//4	
		];
		
	}
	check_empty(ary){
		if(ary != undefined && ary != null && ary.length != 0){
			return ary[0];
		}
	}
	key(xx,yy){
 		var x_sign = Math.sign(xx)==-1?0:1;
		var y_sign = Math.sign(yy)==-1?0:1;
		
		var x = this.pad(xx,4,0)*(xx<0?-1:1);
		var y = this.pad(yy,4,0)*(yy<0?-1:1);

		return x_sign+'-'+x+'-'+y_sign+'-'+y;
	}
	pad(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}	
	divide(no){
		return Math.ceil(no/this.grid_size);
	}
}	

