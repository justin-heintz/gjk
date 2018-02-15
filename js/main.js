window.onload = function(){	
	assets = []; 
	assets['player'] = new asset('http://bluejaydev.com/games/miner-dev/miner/sprites/characters/player.png');
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
			[0,65,42,44,	0,19,42,40],//0
			[51,65,38,44,	0,19,42,40],//1
			[103,64,37,45,	5,19,37,40],//2
			[154,64,35,45,	7,19,35,40],//3
			[200,64,39,45,	3,19,39,40],//4
			[253,65,35,44,	7,19,35,40] //5
		]
	};	
	assets['player'].animation['idle']={ 
		options:{
			time_between:100	
		},
		frames:[
			[0,65,42,44, 0,19,42,40]
		]
	};	
	
	assets['terrain'] = new asset('http://bluejaydev.com/games/miner-dev/miner/sprites/terrain.png');
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

class game{
	constructor(){
		this.keymap = [];
		this.ui = new ui();	
		this.phys = new gjk();
		this.cam = new camera(520, 520);
		this.grid = new grid(520,520);
		this.p0 = new player(this.cam);
		this.grid.container['player'] = new entity(
			new shape(16,40,16,58), new sprite('player')
		);	
		this.grid.container['player'].sprite.current_animation = 'idle';	
		
		this.gen_stuff();
		
		this.loop();		
	}
	loop(){
		this.draw();
		this.update();
	}  	
	update(){
		this.p0.blocks = this.grid.surrounding_ents( this.grid.container['player'].shape.centroid );//gets the blocks around the player and puts it in an array
		this.p0.blocks.unshift(this.grid.container['player']);//puts player at the front of the array
		
 		var remove_block = this.p0.trigger_action(this.keymap, this.grid.container['player'] );
		
		if(remove_block != null || remove_block != undefined){
			delete this.grid.container[remove_block]
		}
		
		this.p0.apply_gravity( this.grid.container['player'] );
		
		this.grid.container['player'].update();
		
 		for(var i=1,count=0; i<=4; i++){
			count += (this.p0.blocks[i] != undefined ? 1 : 0);
		}
		
		if(count!=0){
			this.phys.loopCheck(this.p0.blocks);
		}

		this.grid.get(this.cam.pos.x, this.cam.pos.y, function(e){ 
			e.update(); 
		}); 	

		this.grid.container['player'].update();
 
		requestAnimationFrame(this.loop.bind(this));		
	}
	draw(){
		/*====== Clear Canvases ======*/
		this.ui.clear();
		canvas.fg.clearRect(0, 0, 520, 520);
 
		/*====== FG ======*/
		canvas.fg.save();
			canvas.fg.scale(1, 1);  
			canvas.fg.translate(this.cam.pos.x*-1, this.cam.pos.y*-1);
 
			this.grid.get(this.cam.pos.x, this.cam.pos.y, function(e){
				e.sprite.draw(canvas.fg);
			});	

			this.grid.container['player'].sprite.draw(canvas.fg, this.p0.direction );
 
		canvas.fg.restore();	
		
		/*====== BG ======*/
		canvas.bg.fillStyle = sky_day;
		canvas.bg.fillRect(0, 0, 520, 520);
		
		/*====== UI ======*/
		//this.ui.draw("Hp:"+this.p0.max_hp+"/"+this.p0.hp, new vector(10,20) );
		//this.ui.draw("Weight:"+this.p0.max_weight+"/"+this.p0.weight,new vector(10,40));	
		//this.ui.draw("$:"+this.p0.currency,new vector(10,60));	
		//this.ui.draw("Current-Axe:"+this.p0.mining_tools[ this.p0.inventory.mining_tool ]['name'] ,new vector(10,80));	
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
	}
	rng(min=1, max=10) {
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}	
}
