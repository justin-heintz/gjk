window.onload = function(){	
	assets = []; 
	assets['player'] = new asset('http://bluejaydev.com/games/gjk-dev/gjk/sprites/characters/player.png');
	assets['terrain'] = new asset('http://bluejaydev.com/games/gjk-dev/gjk/sprites/terrain.png');

	g = new game();
	onkeydown = onkeyup = function(e){e = e || event; g.keymap[e.keyCode] = e.type == 'keydown'; g.keymap['last_key'] = e.keyCode;}
}

class game{
	constructor(){
		this.keymap = [];
		this.entities = [];
		this.shapes = world_1();
		this.ctx = this.prep_canvas();
		this.phys = new gjk();
		
		this.entities[0] = new entity(
			new shape(0,396,40,64),
			new animations('player')
		);
		this.entities[1] = new entity(
			new shape(200,200,40,64),
			new animations('player')
		);		
		this.entities[1].shape.following_path = false;
		this.entities[1].shape.crnt_path = 'path_2';
		
		this.entities[2] = new entity(
			new shape(400,100,40,64),
			new animations('player')
		);				
		this.entities[2].shape.following_path = false;
		this.entities[2].shape.crnt_path = 'path_2';
		
		this.entities[3] = new entity(
			new shape(100,150,40,64),
			new animations('player')
		);		
		this.entities[3].shape.following_path = false;
		this.entities[3].shape.crnt_path = 'path_2';	
		

		this.entities[4] = new entity(
			new shape(0,460,40,40),
			new animations('terrain')
		);		
		this.entities[5] = new entity(
			new shape(40,460,40,40),
			new animations('terrain')
		);	
		this.entities[6] = new entity(
			new shape(80,460,40,40),
			new animations('terrain')
		);	
		this.entities[7] = new entity(
			new shape(120,460,40,40),
			new animations('terrain')
		);	
		this.entities[8] = new entity(
			new shape(160,460,40,40),
			new animations('terrain')
		);			

		this.entities[0].shape.color="rgba(0,0,0,0.2)";
		this.entities[1].shape.color="rgba(0,255,0,0.2)";
		this.entities[2].shape.color="rgba(255,0,0,0.2)";
		this.entities[3].shape.color="rgba(0,0,255,0.2)";
			
		this.loop();		
	}
	loop(){
		this.draw();
		this.update();
	}  	
	update(){
		var speed = 1.2;
		
		if(this.keymap['37']){this.entities[0].pos.x = -1*speed;}
		if(this.keymap['39']){this.entities[0].pos.x = speed;}
		if(this.keymap['38']){this.entities[0].pos.y = -1*speed;}  
		if(this.keymap['40']){this.entities[0].pos.y = speed;}	
		
		this.entities[0].shape.update( this.entities[0].pos );
		
		this.phys.loopCheck(this.entities);

		for(let i = 0; i<this.entities.length; i++){
			this.entities[i].update(); 
		}

		requestAnimationFrame(this.loop.bind(this));		
	}
	draw(){
		this.ctx.fillStyle = "#ffffff"; 	
		this.ctx.fillRect(0, 0, 500, 500);
		
		for(let i = 0; i<this.entities.length-5; i++){
			this.entities[i].shape.draw(this.ctx);
			this.entities[i].sprite.draw('run', this.ctx, true);
		}	
		///////////////////////////////////////////////////////////////////////////////////////////
		
		this.entities[4].sprite.draw('dirt', this.ctx);
		this.entities[5].sprite.draw('grass_dirt', this.ctx);
		this.entities[6].sprite.draw('lava_stone', this.ctx);
		this.entities[7].sprite.draw('dirt_stone', this.ctx);
		this.entities[8].sprite.draw('stone', this.ctx);

		for(let i = 0; i<this.entities.length-5; i++){
			this.entities[i].pos.x=0; 
			this.entities[i].pos.y=0;
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