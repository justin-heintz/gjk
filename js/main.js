//stopped working on the flash light get back to that later 

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
	assets['terrain'].animation['dirt']		 ={frames:[[0,0,80,80,		0,0,40,40]]};		
	assets['terrain'].animation['grass_dirt']={frames:[[85,0,80,80,		0,0,40,40]]};			
	assets['terrain'].animation['lava_stone']={frames:[[170,0,80,80,	0,0,40,40]]};	
	assets['terrain'].animation['dirt_stone']={frames:[[255,0,80,80,	0,0,40,40]]};
	assets['terrain'].animation['stone']	 ={frames:[[340,0,80,80,	0,0,40,40]]};	

	g = new game();
	onkeydown = onkeyup = function(e){e = e || event; g.keymap[e.keyCode] = e.type == 'keydown'; g.keymap['last_key'] = e.keyCode;}
} 
class camera{
	constructor(width, height){
		this.cam_speed = 5;
		this.screen_padding = 40;
		this.width = width;
		this.height = height;
		this.pos = new vector(0,0);
	}
}
class ui{
	constructor(){
		var canvas = document.getElementById("ui"); 
		canvas.width = canvas.height = 520; 
		this.ctx = canvas.getContext("2d");	
	}	
	clear(){
		this.ctx.clearRect(0, 0, 520, 520);
	}
	draw(text, pos,style={color:"black",size:"13px"}){
		this.ctx.fillStyle = style.color ;
		this.ctx.font = style.size+" Arial";
		this.ctx.fillText(text,pos.x,pos.y);		
	}
}
class player{
	constructor(cam){
		this.direction = true;
		this.speed = 5;
		
		this.max_hp = 100;
		this.hp = 100;
		
		this.max_weight = 100;
		this.weight = 0;

		this.currency = 0;
		
		this.ore = {
			coal:0,
			copper:0,
			iorn:0,
			silver:0,
			diamond:0
		}
		this.ore_smelted = {
			coal:0,
			copper:0,
			iorn:0,
			silver:0,
			diamond:0
		}		
		this.cam = cam;
	}
	trigger_action(button_pressed, ent){
		if(button_pressed['37']){ 
			
			console.log( ent[ 'player' ].sprite.pos.x <= this.cam.screen_padding+this.cam.pos.x );
			if(ent[ 'player' ].sprite.pos.x <= this.cam.screen_padding+this.cam.pos.x){
				console.log(1)
				console.log(ent[ 'player' ].sprite.pos.x, this.cam.screen_padding+this.cam.pos.x);				
				this.cam.pos.x-=this.cam.cam_speed;
			}else{
				console.log(2)
				console.log(ent[ 'player' ].sprite.pos.x, this.cam.screen_padding+this.cam.pos.x);					
				ent[ 'player' ].pos.x = -1 * this.speed; 
				console.log(ent[ 'player' ].pos);
			}

			this.direction = false;
		}
		if(button_pressed['39']){
			if(ent[ 'player' ].sprite.pos.x+ent[ 'player' ].sprite.width >= this.cam.pos.x+this.cam.width-this.cam.screen_padding){
				this.cam.pos.x+=this.cam.cam_speed;
				console.log(3)
			}else{
				ent[ 'player' ].pos.x = this.speed; 
				console.log(4)
			}			
			this.direction = true;
		}
		if(button_pressed['38']){
			if(ent[ 'player' ].sprite.pos.y <= this.cam.screen_padding+this.cam.pos.y){
				this.cam.pos.y-=this.cam.cam_speed;	
			}else{
				ent[ 'player' ].pos.y = -1*this.speed;
			}
		}  
		if(button_pressed['40']){
			if( ent[ 'player' ].sprite.pos.y+ent[ 'player' ].sprite.height >= this.cam.pos.y+this.cam.height-this.cam.screen_padding){
				this.cam.pos.y+=this.cam.cam_speed;	
			}else{
				ent[ 'player' ].pos.y = this.speed;	
			}				
		}	
	}
}
class game{
	constructor(){
		this.keymap = [];
		this.entities = [];
 
		this.ctx = this.prep_canvas();
		this.phys = new gjk();
		
		this.cam = new camera(520, 520);
		
		this.p0 = new player(this.cam);
		this.entities['player'] = new entity(
			new shape(40,64,40,64),new sprite('player')
		);		
		this.entities[ 'player' ].sprite.current_animation = 'run';

		this.ui = new ui();	
			
		//grid = new grid();
		
		this.gen_stuff();
		
		this.loop();		
	}
	loop(){
		this.draw();
		this.update();
	}  	
	update(){
		this.p0.trigger_action(this.keymap, this.entities);
		
		this.phys.loopCheck(this.entities);

		for(let i = 0; i<this.entities.length; i++){
			this.entities[i].update(); 
		}
		
		this.entities[ 'player' ].update();
 
		requestAnimationFrame(this.loop.bind(this));		
	}
	draw(){
		this.ctx.fillStyle = "#fff"; 	
		this.ctx.fillRect(0,0,520,520);
		this.ui.clear();
		
		this.ctx.save();
			this.ctx.scale(1, 1);  
			this.ctx.translate(this.cam.pos.x*-1, this.cam.pos.y*-1);
				
			for(let i = 0; i<this.entities.length; i++){
				this.entities[i].sprite.draw(this.ctx);
			}	
	 
			this.entities[ 'player' ].sprite.draw(this.ctx, this.p0.direction );

		this.ctx.restore();	
		
		this.ui.draw("Hp:"+this.p0.max_hp+"/"+this.p0.hp, new vector(10,20) );
		this.ui.draw("Weight:"+this.p0.max_weight+"/"+this.p0.weight,new vector(10,40));	
		this.ui.draw("$:"+this.p0.currency,new vector(10,60));	
	}
	prep_canvas(){
		var c = document.getElementById("canvas"); 
		c.width = c.height = 520; 
		return c.getContext("2d");	
	}
	rng(min=1, max=10) {
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}
	gen_stuff(){//REMOVE THIS LATER ITS ONLY FOR TESTING
		var rand = 1
		var ani = 'dirt';
		var track = 0;
		
		for(var w=0;w<20;w++){
			for(var h=4;h<13;h++){
				switch(this.rng(1, 2)){
					case 1: ani='dirt'; break; case 2: ani='grass_dirt'; break; case 3: ani='lava_stone'; break; case 4: ani='dirt_stone'; break; case 5: ani='stone'; break; case 6: ani='run'; break; case 7: ani='mine'; break;					
				}
				this.entities[track] = new entity( new shape(w*40,h*40,40,40), new sprite('terrain') );
				this.entities[track].sprite.current_animation = (h==4?"grass_dirt":"dirt")  ;

				track++;
			}
		}
		
	}
}
