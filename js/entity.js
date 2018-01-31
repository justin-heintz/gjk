class entity{
	constructor(shape, sprite){
		this.shape = shape;
		this.sprite = sprite;
		this.pos = new vector(0,0);
	}
	update(){
		this.shape.update( this.pos );
		this.sprite.update(this.shape.centroid.x - this.shape.width/2,
		this.shape.centroid.y - this.shape.height/2,
		this.shape.width, 
		this.shape.height );
		
		this.pos.x=0; this.pos.y=0;
	}
}