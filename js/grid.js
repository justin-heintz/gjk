class grid{
	constructor( ){
		this.container = [];
		this.grid_size  = 40;
	}
	add(ent){
		var key = this.key(this.divide(ent.shape.x), this.divide(ent.shape.y));
		if(!Array.isArray( this.container[key] )){ this.container[key] = []; }
		this.container[key].push(ent);
		ent.id = key;
	}
	get(x_min,x_max,y_min,y_max,callback=null){
		var tmp_key, listen = [];
 		for(let x=this.divide(x_min); x<this.divide(x_max); x++){
			for(let y=this.divide(y_min); y<this.divide(y_max); y++){
				if(callback != null){ 
					tmp_key = this.key(x,y);
					if( Array.isArray(this.container[tmp_key]) && this.container[this.key(x,y)].length > 0){
						for(let i=0; i<this.container[tmp_key].length; i++){
							callback(this.container[tmp_key][i]);
						}
					}
				}else{
					listen.push(this.key(x,y));
				}
			}
		}
		if(listen.length!=0){ return listen; }
 	}
	key(x,y){
		var x_sign = Math.sign(x)==-1?0:1;
		var y_sign = Math.sign(y)==-1?0:1;
		
		var x = this.pad(x,4,0)*(x<0?-1:1);
		var y = this.pad(y,4,0)*(y<0?-1:1);
		
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