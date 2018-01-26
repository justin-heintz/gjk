class animations{
	constructor(ctx){
		this.ctx = ctx
		this.dir  = 'forward';
		this.date = new Date();
		
		this.current_frame = 0;
		this.last_animation = 'NONE';
		this.last_frame_time = 0;//this.date.getSeconds();
		this.animation = [];	
		this.set();
	}
	set(){
		this.animation['mine']={ 
			options:{
				time_between:2	
			},		
			frames:[
				[0 ,29,42,35,	1,29,42,35],//0
				[50,28,42,36,	1,28,42,36],//1
				[99,27,43,37,	0,27,43,37],//2
				[151,26,41,38,	2,26,41,38],//3
				[199,24,43,40,	0,24,43,40],//4
				[249,13,43,51,	1,13,42,51],//5
				[296,4,36,60,	7,4,36,60],//6
				[350,0,24,64,	21,0,24,64],//7
				[391,8,36,56,	22,8,36,56],//8
				[441,17,39,47,	22,17,39,47]//9
			]	
		};
		this.animation['run']={ 
			options:{
				time_between:4	
			},
			frames:[
				[0,65,42,44,	0,19,42,44],//0
				[51,65,38,44,	0,19,42,44],//1
				[103,64,37,45,	5,19,37,45],//2
				[154,64,35,45,	7,19,35,45],//3
				[200,64,39,45,	3,19,39,45],//4
				[253,65,35,44,	7,19,35,44] //5
			]
		};
	}
	reset(ani_name){
		this.dir = 'forward';	
		this.last_animation = ani_name;
		this.current_frame = 0;
		this.last_frame_time = 0;
		this.date.setSeconds(0);
	}
	draw(ani_name, x, y, flip = false){
		var cf,seconds;
		var f = (flip? -1 : 1);
		
		if(this.last_animation != ani_name){
			this.reset(ani_name);
		}
		
		seconds = this.last_frame_time - this.date.getSeconds();
  
		if(seconds >= this.animation[ani_name].options.time_between){
			if(this.current_frame >= this.animation[ani_name].frames.length-1 && this.dir == 'forward' ){ this.dir = 'backward'; }
			if(this.current_frame <= 0 && this.dir == 'backward' ){ this.dir = 'forward'; }
 			if(this.dir == 'forward'){this.current_frame++;}else{this.current_frame--;}
			
			this.last_frame_time = 0;
			this.date.setSeconds(0);
		}else{
			this.last_frame_time++;	
		}
		
		cf = this.animation[ani_name].frames[this.current_frame];
		
		this.ctx.save();
			this.ctx.scale(f, 1);  
			this.ctx.translate( (x+(flip? 63:0))*f,y); //this is tmp the 63 might not be the correct number. its width + half (42+21)
			this.ctx.drawImage(assets['player'].img, cf[0],cf[1],cf[2],cf[3], cf[4],cf[5],cf[6],cf[7]);
		this.ctx.restore();
	}
}