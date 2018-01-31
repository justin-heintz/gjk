class flash_light{
	constructor(){
		this.on =  true;
		this.dir = 1;
		this.pos = new vector(0,0);
		this.overlay = this.prep_canvas();
	}
	update(){}
	draw_dark(x,y,w,h){
		this.overlay.globalCompositeOperation = 'source-over';
		this.overlay.fillRect(x,y,w,h);		
	}
	draw_light(x,y){
		if(this.on){
			this.overlay.globalCompositeOperation = 'destination-out';
			this.overlay.beginPath();
				this.overlay.lineTo(x+(30)*this.dir,  y+50-15);
				this.overlay.lineTo(x+(150)*this.dir, y+50-15);
				this.overlay.lineTo(x+(150)*this.dir, y+100-15);
			this.overlay.closePath();
			this.overlay.fill();		
		}
	}
	prep_canvas(){
		var overlay = document.getElementById("overlay"); 
		overlay.width = overlay.height = 520; 
		return overlay.getContext("2d");	
	}
}