class sprite{
	constructor(assest_name){
		this.dir  = 'forward';
		this.date = new Date();
		this.pos = new vector(0,0);
		this.width = 0;
		this.height = 0;		
		this.current_frame = 0;
		this.current_animation = 0;
		this.last_animation = 'NONE';
		this.last_frame_time = 0;
		this.assest_name = assest_name;
	}
	reset(){
		this.dir = 'forward';	
		this.last_animation = this.current_animation;
		this.current_frame = 0;
		this.last_frame_time = 0;
		this.date.setSeconds(0);
	}
	update(x,y,width,height){
		this.pos.x = x;
		this.pos.y = y;		
		this.width = width;
		this.height = height;		
	}
	draw(ctx, flip = false){
		var cf, seconds;
		var f = (flip? -1 : 1);
		
		if(this.last_animation != this.current_animation){
			this.reset();
		}
		
		if(assets[this.assest_name].animation[this.current_animation].frames.length > 1){
			seconds = this.last_frame_time - this.date.getSeconds();
	  
			if(seconds >= assets[this.assest_name].animation[this.current_animation].options.time_between){
				if(this.current_frame >= assets[this.assest_name].animation[this.current_animation].frames.length-1 && this.dir == 'forward' ){ this.dir = 'backward'; }
				if(this.current_frame <= 0 && this.dir == 'backward' ){ this.dir = 'forward'; }
				if(this.dir == 'forward'){this.current_frame++;}else{this.current_frame--;}
				
				this.last_frame_time = 0;
				this.date.setSeconds(0);
			}else{
				this.last_frame_time++;	
			}
		}
		
		cf = assets[this.assest_name].animation[this.current_animation].frames[this.current_frame];
		
		ctx.save();
			ctx.scale(f, 1);  
			ctx.translate( (this.pos.x+(flip? this.width:0))*f, this.pos.y);
			ctx.drawImage(assets[this.assest_name].img, cf[0],cf[1],cf[2],cf[3], cf[4],cf[5],cf[6],cf[7]);
		ctx.restore();
	}
}	