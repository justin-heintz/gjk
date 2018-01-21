class quad_tree_obj{
	constructor(x, y, width, height, max_children, depth, max_depth){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
 		this.max_children = max_children;
		this.depth = depth;
		this.max_depth = max_depth;
		this.quads 	= {1:[], 2:[], 3:[], 4:[], 5:[]};
		this.ch 	= {1:0, 2:0, 3:0, 4:0, 5:0};
	}
	insert(ent, cam){
		var quad = this.pickQuad(ent, cam);
		
		if(quad == 5){
			this.quads[quad].push(ent);	
		}else{
			if(this.ch[quad] <  this.max_children || this.depth == this.max_depth ){
				this.quads[quad].push(ent);
				this.ch[quad]++;
			}else{
				if(this.quads[ quad ] instanceof quad_tree_obj == false ){
					var tmpents = this.quads[ quad ];

					var tmpCords = this.pickCords( quad );
	 
					this.quads[ quad ] = new quad_tree_obj(tmpCords.x, tmpCords.y, this.width/2, this.height/2, this.max_children, this.depth+1, this.max_depth);
					for(var i=0; i<tmpents.length; i++){
						this.quads[ quad ].insert( tmpents[i], cam);
					}
				} 
				this.quads[ quad ].insert(ent, cam);
			}
		}
	}
	get(ent,cam){
		var quad = this.pickQuad(ent,cam);
		if(this.quads[ quad ] instanceof quad_tree_obj == true ){
			return {quad: this.quads[ quad ].get(ent, cam),parent:this.quads[ 5 ]};
		}else{
			return {quad:this.quads[ quad ],parent:this.quads[ 5 ]};
		}
	}
	pickCords(quad){
		switch(quad){
			case 1:
				return {x:this.x, y:this.y};
			break;
			case 2:
				return {x:this.x, y:this.y+(this.height/2)};
			break;
			case 3:
				return {x:this.x + (this.width/2), y:this.y};
			break;			
			case 4:
				return {x:this.x + (this.width/2), y:this.y+(this.height/2)};
			break;
		}
	}
	pickQuad(ent, cam){
		if(ent.width > this.width/4 || ent.height > this.height/4){
			return 5; // the ent is to large for the quad
		}
		
		if(ent.pos.x+cam.x < this.x+this.width/2){
			if(ent.pos.y+cam.y < this.y + this.height/2){
				return 1;
			}else{
				return 2;
			}
		}else {
			if(ent.pos.y+cam.y < this.y + this.height/2){
				return 3;
			}else{
				return 4;
			}
		}
	}
	draw(ctx){
		for(var i=1; i<=4; i++){
			if(this.quads[ i ] instanceof  quad_tree_obj  ){
				this.quads[ i ].draw(ctx);
			}else{
				var tmpCords = this.pickCords(i);
				ctx.strokeStyle = "red";
				ctx.strokeRect(tmpCords.x , tmpCords.y , (this.width/2 ), (this.height/2 ) );	
				//ctx.font = "10px Arial"; 
				//ctx.fillStyle = "#000000";
				//ctx.fillText(tmpCords.x +":"+tmpCords.y+"-"+this.depth , tmpCords.x, tmpCords.y);
			}
		}
	}	
}