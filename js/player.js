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
		this.blocks = [];//1:up, 2:right, 3:bottom, 4:left
		this.block = null;
		
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
	trigger_action(button_pressed, ent){
		if(button_pressed['32']){
			//need a way to figure out what block you are mining ! probably something to do with the grid
			//mining_base_speed + block type 
	
			if(this.is_mining){	
				if( Math.ceil((this.mining_time_current - this.mining_time_start)/100) >= this.mining_tools[ this.inventory.mining_tool ]['mining_base_speed']){
					console.log('FINISHED MINING BLOCK');
					this.is_mining = false;
					
					var block_no = 1;
					if(button_pressed['37']){block_no = 4;}
					if(button_pressed['39']){block_no = 2;}
					if(button_pressed['40']){block_no = 3;}
					
					if(this.blocks[ block_no ] != null){
						return this.blocks[ block_no ].id;
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
			ent.sprite.current_animation = 'mine';
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
			ent.pos.x = -1 * this.speed; 
			if(ent.sprite.pos.x <= this.cam.screen_padding+this.cam.pos.x){
				this.cam.pos.x-=this.cam.cam_speed;
			}
			ent.sprite.current_animation = 'run';
			this.direction = false;
		}
		if(button_pressed['39'] && this.can_move){
			ent.pos.x = this.speed; 
			if(ent.sprite.pos.x+ent.sprite.width >= this.cam.pos.x+this.cam.width-this.cam.screen_padding){
				this.cam.pos.x+=this.cam.cam_speed;
			}	
			ent.sprite.current_animation = 'run';
			this.direction = true;
		}
		if(button_pressed['38'] && this.can_move){
			ent.pos.y = -1*this.speed;
			if(ent.sprite.pos.y <= this.cam.screen_padding+this.cam.pos.y){
				this.cam.pos.y-=this.cam.cam_speed;	
			}
			ent.sprite.current_animation = 'run';
		}  
		if(button_pressed['40'] && this.can_move){
			ent.pos.y = this.speed;
			if( ent.sprite.pos.y+ent.sprite.height >= this.cam.pos.y+this.cam.height-this.cam.screen_padding){
				this.cam.pos.y+=this.cam.cam_speed;	
			} 				
			ent.sprite.current_animation = 'run';
		}
		if(!button_pressed['16'] && !button_pressed['32'] && !button_pressed['37'] && !button_pressed['39'] && !button_pressed['38'] && !button_pressed['40']){
			//if nothing is pressed change animation to idle | create a idle animation | switch this to idle
			ent.sprite.current_animation = 'idle';
		}
		ent.pos.y = + 5;//gravity
	}
}