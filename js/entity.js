class entity{
	constructor(shape, sprite, attributes = {name:'Na', is_mineable:false, density:1}){
		this.shape = shape;
		this.sprite = sprite;
		this.pos = new vector(0,0);
		
		/*attributes*/
		this.is_mineable = attributes.is_mineable;
		this.density = attributes.density;
		this.name = attributes.name
	}
	update(){
		this.shape.update( this.pos );
 
		this.sprite.update(
			this.shape.centroid.x - this.shape.width/2,
			this.shape.centroid.y - this.shape.height/2,
			this.shape.width, 
			this.shape.height 
		);
		
		this.pos.x = this.pos.y = 0;
	}
}