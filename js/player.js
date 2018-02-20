class player{
	constructor(cam){
		this.cam = cam;
		
		this.speed = 2;
		this.can_move = true;
		this.direction = true;
		
		this.max_hp = 100;
		this.hp = 100;
		
		this.max_weight = 100;
		this.weight = 0;

		this.currency = 0;

		this.mining_time_start = Date.now();
		this.mining_time_current = 0;
		
		this.blocks = [];//1:down, 2:up, 3:right, 4:left
		this.remove_block = null;
		
		this.is_mining = false;
		this.is_climbing = false;
		
		this.mining_tools = {
			0:{name:"Basic PickAxe",mining_base_speed:100},
			1:{name:"PickAxe",mining_base_speed:70},
			2:{name:"Drill",mining_base_speed:10}
		};
		this.backpacks = {
			0:{name:"",weight:100},
			1:{name:"",weight:70},
			2:{name:"",weight:10}
		};
		this.in_hand = "mining_tool";
		this.inventory = { 
			mining_tool:2,
			backpack:0,
			ladders:20,
			elevator:{
				cart:0,
				rope:20
			},	
			ore:{
				dirt:0,
				dirt_coal: 0,
				dirt_copper: 0,
				dirt_iron: 0,
				dirt_silver: 0,
				dirt_emerald: 0,
				dirt_ruby: 0
			},
			ore_smelted:{
				dirt:0,
				dirt_coal: 0,
				dirt_copper: 0,
				dirt_iron: 0,
				dirt_silver: 0,
				dirt_emerald: 0,
				dirt_ruby: 0
			}
		};
	}
	trigger_action(button_pressed, ent){
		if(button_pressed['17']){
			//need to figure out when the player is on the ground or not so 
			// i can tell if im able to jump or climb ladder
			//need a way to place ladders
			
			if(!ent.shape.is_airborne){
				ent.shape.vy-=5;
				ent.shape.y = 0;
				ent.shape.is_airborne = true;
			}
		}
		if(button_pressed['32']){
			if(this.in_hand=="mining_tool"){
				var block_no;
				if(button_pressed['40']){block_no = 1;}//down
				if(button_pressed['38']){block_no = 2;}//up
				if(button_pressed['39']){block_no = 3; this.direction = true;}//right
				if(button_pressed['37']){block_no = 4; this.direction = false;}//left
				
				console.log( this.blocks[ block_no ] );
				
				if(this.is_mining && this.blocks[block_no] != undefined){	

					if( Math.ceil((this.mining_time_current - this.mining_time_start)/100) >= 10 - this.mining_tools[ this.inventory.mining_tool ]['mining_base_speed'] + this.blocks[block_no].density ){
						console.log('FINISHED MINING BLOCK');
 						
						this.is_mining = false;

						if(this.inventory.ore[this.blocks[block_no]['name']] != undefined){
							this.inventory.ore[this.blocks[block_no]['name']]++;
						}
						
						if(this.blocks[ block_no ] != null){
							console.log(this.blocks[block_no]);
							return this.blocks[ block_no ].id;
						}
					}else{
						this.mining_time_current = Date.now();
					}
				}else{
					if(this.blocks[ block_no ] != undefined && this.blocks[block_no].is_mineable){
						console.log('STARTED MINING / RESET MINING', this.blocks[block_no].is_mineable);
						this.mining_time_current = Date.now();
						this.mining_time_start = Date.now()
						
						this.can_move = false;
						this.is_mining = true;
					}else{
						this.can_move = true;
					}
				}
				ent.sprite.current_animation = 'mine';
			}
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
		if(button_pressed['40'] && this.can_move){
			ent.pos.y+=1 
			ent.sprite.current_animation = 'idle';
		}
		if( ent.sprite.pos.y+ent.sprite.height >= this.cam.pos.y+this.cam.height-this.cam.screen_padding){
			this.cam.pos.y+=this.cam.cam_speed;	
		} 				
		
		if(!button_pressed['16'] && !button_pressed['17'] && !button_pressed['32'] && !button_pressed['37'] && !button_pressed['38'] && !button_pressed['39'] && !button_pressed['40']){
			ent.sprite.current_animation = 'idle';
		}
	}
	apply_gravity(ent){
		if(ent.shape.is_airborne){
			//ent.pos.y += 5;
			ent.shape.vy++;
		}
	}
}
