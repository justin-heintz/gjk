class grid{
	constructor( ){
		this.container = [];
		this.grid_size  = 40;
	}
	add(ent){
		var key = this.key(this.div(ent.shape.x), this.div(ent.shape.y));
		if(!Array.isArray( this.container[key] )){ this.container[key] = []; }
		this.container[key].push(ent);
		ent.id = key;
	}
	get(xmin,xmax,ymin,ymax,callback=null){
		var tmpkey, listent = [];
 		for(let x=this.div(xmin); x<this.div(xmax); x++){
			for(let y=this.div(ymin); y<this.div(ymax); y++){
				if(callback != null){ 
					tmpkey = this.key(x,y);
					if( Array.isArray(this.container[tmpkey]) && this.container[this.key(x,y)].length > 0){
						for(let i=0; i<this.container[tmpkey].length; i++){
							callback(this.container[tmpkey][i]);
						}
					}
				}else{
					listent.push(this.key(x,y));
				}
			}
		}
		if(listent.length!=0){ return listent; }
 	}
	key(x,y){
		var xSign = Math.sign(x)==-1?0:1;
		var ySign = Math.sign(y)==-1?0:1;
		
		var x = this.pad(x,4,0)*(x<0?-1:1);
		var y = this.pad(y,4,0)*(y<0?-1:1);
		
		return xSign+'-'+x+'-'+ySign+'-'+y;
	}
	pad(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}	
	div(no){
		return Math.ceil(no/this.grid_size);
	}
}	