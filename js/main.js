window.onload = function(){	
	g = new game();
	onkeydown = onkeyup = function(e){e = e || event;g.keymap[e.keyCode] = e.type == 'keydown';g.keymap['last_key'] = e.keyCode;}
}

class game{
	constructor(){
		this.keymap = [];
		this.shapes = [];
		this.ctx = this.prepCanvas();
		this.phys = new gjk();
		
		this.shapes[0] = new shape('obj_0',true,[
			new vector(50,0),
			new vector(100,0),
			new vector(100,50),
			new vector(50,50)
		]); this.shapes[0].x = this.shapes[0].y=100;

		this.shapes[1] = new shape('obj_1',true,[
			new vector(150,100),
			new vector(250,100),
			new vector(250,150),
			new vector(150,150)
		]); this.shapes[1].x = this.shapes[1].y=100;

		this.shapes[2] = new shape('obj_2',false,[
			new vector(600,100),
			new vector(600+50,100),
			new vector(600+50,100+50),
			new vector(600,100+50)
		]);this.shapes[2].x = this.shapes[2].y=100;

		this.shapes[3] = new shape('obj_3',false,[ 
			new vector(1000,100),
			new vector(1200,100),
			new vector(1300,200),
			new vector(1300,300),
			new vector(1200,400),
			new vector(1000,400)
		]);this.shapes[3].x = this.shapes[3].y=100;
		
		this.loop();		
	}
	loop(){
		this.draw();
		this.update();
	}  	
	update(){
		var speed = 5;
		
		if(this.keymap['37']){this.shapes[0].x = -1*speed;}
		if(this.keymap['39']){this.shapes[0].x = speed;}
		if(this.keymap['38']){this.shapes[0].y = -1*speed;}  
		if(this.keymap['40']){this.shapes[0].y = speed;}	

		this.shapes[1].x = 1;
		
		
		this.shapes[0].update();
		
		
		this.phys.loopCheck(this.shapes);

		this.shapes[0].update();
		this.shapes[1].update();
		
		this.shapes[0].draw(this.ctx,'red');
		this.shapes[1].draw(this.ctx,'blue');	
		this.shapes[2].draw(this.ctx,'orange');
		this.shapes[3].draw(this.ctx,'purple');
		
		requestAnimationFrame(this.loop.bind(this));		
	}
	draw(){
		this.ctx.fillStyle = "#ffffff"; 	
		this.ctx.fillRect(0, 0, window.screen.availWidth, window.screen.availHeight);
		this.ctx.save();	
		this.ctx.scale(1, 1);		
	}
	prepCanvas(){
		var c = document.getElementById("myCanvas"); 
		c.height = window.screen.availHeight-500; 
		c.width = window.screen.availWidth; 
		return c.getContext("2d");	
	}	
}