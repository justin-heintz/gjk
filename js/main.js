/*
THIS IS FOR LIGHTING
http://jsfiddle.net/ArtBIT/WUXDb/1/

*/
window.onload = function(){	
	assets = []; 
	assets['player'] = new asset('http://bluejaydev.com/games/gjk-dev/gjk/sprites/characters/player.png');
	assets['player'].animation['mine']={ 
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
	assets['player'].animation['run']={ 
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

	assets['terrain'] = new asset('http://bluejaydev.com/games/gjk-dev/gjk/sprites/terrain.png');
	assets['terrain'].animation['dirt']		={frames:[[0,0,80,80,	0,0,40,40]]};		
	assets['terrain'].animation['grass_dirt']={frames:[[85,0,80,80,	0,0,40,40]]};			
	assets['terrain'].animation['lava_stone']={frames:[[170,0,80,80,	0,0,40,40]]};	
	assets['terrain'].animation['dirt_stone']={frames:[[255,0,80,80,	0,0,40,40]]};
	assets['terrain'].animation['stone']		={frames:[[340,0,80,80,	0,0,40,40]]};	

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
		
		/*
		this.entities[0] = new entity(
			new shape(0,396,40,64),new sprite('player')
		);
		this.entities[0].sprite.current_animation = 'run';
		
		this.entities[1] = new entity(
			new shape(200,200,40,64),new sprite('player')
		);		
		this.entities[1].shape.following_path = false;
		this.entities[1].shape.crnt_path = 'path_2';
		this.entities[1].sprite.current_animation = 'mine';
		
		this.entities[2] = new entity(
			new shape(400,100,40,64),new sprite('player')
		);				
		this.entities[2].shape.following_path = false;
		this.entities[2].shape.crnt_path = 'path_2';
		this.entities[2].sprite.current_animation = 'run';
		
		
		this.entities[3] = new entity(
			new shape(100,150,40,64),new sprite('player')
		);		
		this.entities[3].shape.following_path = false;
		this.entities[3].shape.crnt_path = 'path_2';	
		this.entities[3].sprite.current_animation = 'mine';

		this.entities[4] = new entity(
			new shape(0,460,40,40),new sprite('terrain')
		);		
		this.entities[5] = new entity(
			new shape(40,460,40,40),new sprite('terrain')
		);	
		this.entities[6] = new entity(
			new shape(80,460,40,40),new sprite('terrain')
		);	
		this.entities[7] = new entity(
			new shape(120,460,40,40),new sprite('terrain')
		);	
		this.entities[8] = new entity(
			new shape(160,460,40,40),new sprite('terrain')
		);			
		
		
		this.entities[4].sprite.current_animation = 'dirt';
		this.entities[5].sprite.current_animation = 'grass_dirt';
		this.entities[6].sprite.current_animation = 'lava_stone';
		this.entities[7].sprite.current_animation = 'dirt_stone';
		this.entities[8].sprite.current_animation = 'stone';

		this.entities[0].shape.color="rgba(0,0,0,0.2)";this.entities[1].shape.color="rgba(0,255,0,0.2)";this.entities[2].shape.color="rgba(255,0,0,0.2)";this.entities[3].shape.color="rgba(0,0,255,0.2)";
		*/
		var rand = 1
		var ani = 'dirt';
		var track = 0;
		for(w=0;w<12;w++){
			for(h=0;h<12;h++){
				rand = this.rng(6, 7);
				switch(rand){
					case 1: ani='dirt'; break;
					case 2: ani='grass_dirt'; break;
					case 3: ani='lava_stone';  break;
					case 4: ani='dirt_stone'; break;
					case 5: ani='stone'; break;
					case 6: ani='run'; break;
					case 7: ani='mine'; break;					
				}
				this.entities[track] = new entity(
					new shape(w*40,h*64,40,64),new sprite('player')
				);
				this.entities[track].sprite.current_animation = ani;
				track++;
				
			}
		}	
		
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
		
		for(let i = 0; i<this.entities.length; i++){
			//this.entities[i].shape.draw(this.ctx);
			this.entities[i].sprite.draw(this.ctx, true);
		}	

		//TODO: FIX THIS LATER !!! NOT NEEDED !! CAN BE DONE BETTER
		for(let i = 0; i<this.entities.length ; i++){
			this.entities[i].pos.x=0; this.entities[i].pos.y=0;
		}		
	}
	prep_canvas(){
		var c = document.getElementById("canvas"); 
		c.width = c.height = 500; 
 
		return c.getContext("2d");	
	}
	rng(min=1, max=10) {
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}
}