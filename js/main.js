window.onload = function(){	
	g = new game();
	onkeydown = onkeyup = function(e){e = e || event; g.keymap[e.keyCode] = e.type == 'keydown'; g.keymap['last_key'] = e.keyCode;}
}

class game{
	constructor(){
		this.keymap = [];
		this.shapes = world_1();
		this.ctx = this.prep_canvas();
		this.phys = new gjk();
		
		this.player_index = 0//this.shapes.length; 
		this.shapes[this.player_index] = new shape('obj_0',true,[
			new vector(50,0),
			new vector(100,0),
			new vector(100,50),
			new vector(50,50)
		]); 
		
		this.shapes[1] = new shape('obj_1',true,[
			new vector(150,100),
			new vector(250,100),
			new vector(250,150),
			new vector(150,150)
		]);  
		this.shapes[1].following_path = true;
		this.shapes[1].crnt_path = 'path_1';

		this.shapes[2] = new shape('obj_2',true,[
			new vector(600,100),
			new vector(650,100),
			new vector(650,150),
			new vector(600,150)
		]); 
		this.shapes[2].following_path = true;
		this.shapes[2].crnt_path = 'path_2';
		
		this.shapes[3] = new shape('obj_3',true,[ 
			new vector(1000,100),
			new vector(1200,100),
			new vector(1300,200),
			//new vector(1300,300),
			//new vector(1200,400),
			new vector(1000,400)
		]); 
		this.shapes[3].following_path = true;
		this.shapes[3].crnt_path = 'path_3';		
		
		this.shapes[0].color="#f44336";
		this.shapes[1].color="#2196F3";
		this.shapes[2].color="#8BC34A";
		this.shapes[3].color="#FF9800";
/* */
		this.loop();		
	}
	loop(){
		this.draw();
		this.update();
	}  	
	update(){
		var speed = 5;
		
		if(this.keymap['37']){this.shapes[this.player_index].x = -1*speed;}
		if(this.keymap['39']){this.shapes[this.player_index].x = speed;}
		if(this.keymap['38']){this.shapes[this.player_index].y = -1*speed;}  
		if(this.keymap['40']){this.shapes[this.player_index].y = speed;}	
		
		this.shapes[this.player_index].update();
		
		this.phys.loopCheck(this.shapes);

		for(let i = 0; i<this.shapes.length; i++){
			this.shapes[i].update();
		}
		
		requestAnimationFrame(this.loop.bind(this));		
	}
	draw(){
		this.ctx.fillStyle = "#ffffff"; 	
		
		this.ctx.fillRect(0, 0, window.screen.availWidth, window.screen.availHeight-500);
		for(let i = 0; i<this.shapes.length; i++){
			this.shapes[i].draw(this.ctx);
		}		
	}
	prep_canvas(){
		var c = document.getElementById("canvas"); 
		c.height = 500; 
		c.width = 500; 
		return c.getContext("2d");	
	}
	rng(min=1, max=10) {
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}
}