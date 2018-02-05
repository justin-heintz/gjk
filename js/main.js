//KEYCODE BUTTONS !!!
//http://keycode.info
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

	fg = document.getElementById("foreground"); 
	bg = document.getElementById("background"); 
	ltg = document.getElementById("lighting"); 
	uic = document.getElementById("ui"); 
	
	fg.width = fg.height = bg.width = bg.height = ltg.width = ltg.height = uic.width = uic.height = 520; 
	canvas={fg: fg.getContext("2d"), bg: bg.getContext("2d"), ltg: ltg.getContext("2d"), ui: uic.getContext("2d")}

	//try to find a better place for this
	sky_day = canvas.bg.createLinearGradient(0, 0, 0, 170);
	sky_day.addColorStop(0, "#2196F3");
	sky_day.addColorStop(1, "#81D4FA");	
	
	g = new game();
	onkeydown = onkeyup = function(e){e = e || event; g.keymap[e.keyCode] = e.type == 'keydown'; g.keymap['last_key'] = e.keyCode;}
} 

class player{
	constructor(cam){
		this.cam = cam;
		
		this.speed = 5;
		this.can_move = true;
		this.direction = true;
		
		this.max_hp = 100;
		this.hp = 100;
		
		this.max_weight = 100;
		this.weight = 0;

		this.currency = 0;

		this.mining_time_start = Date.now();
		this.mining_time_current = 0;
		
		this.is_mining = false;
		
		this.mining_tools={
			0:{name:"Basic PickAxe",mining_base_speed:100},
			1:{name:"PickAxe",mining_base_speed:70},
			2:{name:"Drill",mining_base_speed:10}
		};
		this.backpacks={
			0:{name:"",weight:100},
			1:{name:"",weight:70},
			2:{name:"",weight:10}
		};
		
		this.inventory={ 
			mining_tool:2,
			backpack:0,
			elevator:{
				cart:0,
				rope:0
			},	
			ore:{
				coal: 0,
				copper: 0,
				iorn: 0,
				silver: 0,
				gold: 0,
				diamond: 0
			},
			ore_smelted:{
				coal: 0,
				copper: 0,
				iorn: 0,
				silver: 0,
				gold: 0,
				diamond: 0
			}
		};
	}
	trigger_action(button_pressed, ent, block = null){

		if(button_pressed['32']){
			//need a way to figure out what block you are mining ! probably something to do with the grid
			//mining_base_speed + block type 
	
			if(this.is_mining){	
				if( Math.ceil((this.mining_time_current - this.mining_time_start)/100) >= this.mining_tools[ this.inventory.mining_tool ]['mining_base_speed']){
					console.log('FINISHED MINING BLOCK');
					this.is_mining = false;
					if(block != null){
						block.splice(0, 1);
					}
					
				}else{
					this.mining_time_current = Date.now();
				}
			}else{
				console.log('STARTED MINING / RESET MINING');
				this.mining_time_current = Date.now();
				this.mining_time_start = Date.now()
				
				this.can_move = false;
				this.is_mining = true;
				
			}
			ent['player'].sprite.current_animation = 'mine';
		}else{
			this.is_mining = false;
			this.can_move = true;
		}
		if(button_pressed['16']){
			this.inventory.mining_tool = 2;
			this.can_move = true;
			this.is_mining = false;			
		}		
		if(button_pressed['37'] && this.can_move){ 
			ent['player'].pos.x = -1 * this.speed; 
			if(ent['player'].sprite.pos.x <= this.cam.screen_padding+this.cam.pos.x){
				this.cam.pos.x-=this.cam.cam_speed;
			}
			ent['player'].sprite.current_animation = 'run';
			this.direction = false;
		}
		if(button_pressed['39'] && this.can_move){
			ent['player'].pos.x = this.speed; 
			if(ent['player'].sprite.pos.x+ent['player'].sprite.width >= this.cam.pos.x+this.cam.width-this.cam.screen_padding){
				this.cam.pos.x+=this.cam.cam_speed;
			}	
			ent['player'].sprite.current_animation = 'run';
			this.direction = true;
		}
		if(button_pressed['38'] && this.can_move){
			ent['player'].pos.y = -1*this.speed;
			if(ent['player'].sprite.pos.y <= this.cam.screen_padding+this.cam.pos.y){
				this.cam.pos.y-=this.cam.cam_speed;	
			}
			ent['player'].sprite.current_animation = 'run';
		}  
		if(button_pressed['40'] && this.can_move){
			ent['player'].pos.y = this.speed;
			if( ent['player'].sprite.pos.y+ent['player'].sprite.height >= this.cam.pos.y+this.cam.height-this.cam.screen_padding){
				this.cam.pos.y+=this.cam.cam_speed;	
			} 				
			ent['player'].sprite.current_animation = 'run';
		}
		if(!button_pressed['16'] && !button_pressed['32'] && !button_pressed['37'] && !button_pressed['39'] && !button_pressed['38'] && !button_pressed['40']){
			//if nothing is pressed change animation to idle | create a idle animation | switch this to idle
			ent['player'].sprite.current_animation = 'run';
		}
	}
}
class game{
	constructor(){
		this.block = null;
		
		this.keymap = [];
		this.entities = [];
		
		this.ui = new ui();	
		this.phys = new gjk();
		this.cam = new camera(520, 520);
		this.grid = new grid(520,520);
		this.p0 = new player(this.cam);
		this.entities['player'] = new entity(
			new shape(40,64,40,64), new sprite('player')
		);		
		this.entities['player'].sprite.current_animation = 'run';

		this.gen_stuff();
		
		this.loop();		
	}
	loop(){
		this.draw();
		this.update();
	}  	
	update(){
		var txx = Math.floor(this.entities['player'].shape.centroid.x/40) + (this.p0.direction? 1 : -1);
		var tyy = Math.floor(this.entities['player'].shape.centroid.y/40)  ;
 
		if(this.grid.container['1-'+txx+'-1-'+tyy] != undefined && this.grid.container['1-'+txx+'-1-'+tyy].length > 0){
			this.block = this.grid.container['1-'+txx+'-1-'+tyy]
		}else{ this.block = null; }
		
		this.p0.trigger_action(this.keymap, this.entities, this.block);
		
		//this.phys.loopCheck(this.entities);
		
		//console.log( this.grid.get(this.cam.pos.x, this.cam.pos.y)  ); 
		
		var keys = this.grid.get(this.cam.pos.x, this.cam.pos.y);
		//console.log(keys[0].split("-"));		
		//console.log(keys[keys.length-1].split("-"));
		
		var start = keys[0].split("-");
		var end = keys[keys.length-1].split("-");
		
		
		//FIND OUT WHY THIS CAN BE NAN SOMETIMES !!!!!!!
		start[1] = (isNaN(start[1]) ? 0: start[1]);
		//console.log(start[1]+'-'+end[1]+'-'+start[3]+'-'+end[3]);
		for(let width = start[1]; width <= end[1]; width++){
			for(let height = start[3]; height <= end[3]; height++){
				//console.log('1-'+width+'-1-'+height);
				//console.log();
				if( this.grid.container['1-'+width+'-1-'+height] != undefined){
					//console.log(this.grid.container['1-'+width+'-1-'+height]);
					if( this.grid.container['1-'+width+'-1-'+height][0] != undefined){
						this.grid.container['1-'+width+'-1-'+height][0].update()
					}
				}
			}
		}
		
		/*
		this.grid.get(this.cam.pos.x, this.cam.pos.y, function(e){
			e.update();
		});*/			
		
		this.entities['player'].update();
 
		requestAnimationFrame(this.loop.bind(this));		
	}
	draw(){
		this.ui.clear();
		canvas.fg.clearRect(0, 0, 520, 520);
 
		/*====== FG ======*/
		canvas.fg.save();
			canvas.fg.scale(1, 1);  
			canvas.fg.translate(this.cam.pos.x*-1, this.cam.pos.y*-1);

			this.grid.get(this.cam.pos.x, this.cam.pos.y, function(e){
				e.sprite.draw(canvas.fg);
			});	

			this.entities['player'].sprite.draw(canvas.fg, this.p0.direction );
 
		canvas.fg.restore();	
		
		/*====== BG ======*/
		canvas.bg.fillStyle = sky_day;
		canvas.bg.fillRect(0, 0, 520, 520);
		
		/*====== UI ======*/
		this.ui.draw("Hp:"+this.p0.max_hp+"/"+this.p0.hp, new vector(10,20) );
		this.ui.draw("Weight:"+this.p0.max_weight+"/"+this.p0.weight,new vector(10,40));	
		this.ui.draw("$:"+this.p0.currency,new vector(10,60));	
		this.ui.draw("Current-Axe:"+this.p0.mining_tools[ this.p0.inventory.mining_tool ]['name'] ,new vector(10,80));	
	}
	gen_stuff(){
		var ani = 'dirt';
		var tmp;
		for(var w=0;w<120;w++){
			for(var h=4;h<120;h++){
				//switch(this.rng(1, 2)){case 1: ani='dirt'; break; case 2: ani='grass_dirt'; break; case 3: ani='lava_stone'; break; case 4: ani='dirt_stone'; break; case 5: ani='stone'; break; case 6: ani='run'; break; case 7: ani='mine'; break;}
				tmp = new entity( new shape(w*40,h*40,40,40), new sprite('terrain'))
				tmp.sprite.current_animation = (h==4?"grass_dirt":"dirt");
				this.grid.add(tmp);
			}
		}
		//console.log(this.grid.container);die();
	}
	rng(min=1, max=10) {
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}	
}
