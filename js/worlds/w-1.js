function world_1(){
	colors = ['#3b5999','#09b83e','#FFB900','#C239B3','#68768A','#847545','#4E342E','#009688','#6A1B9A','#FFD600','#3b5999','#09b83e','#FFB900','#C239B3','#68768A','#847545','#4E342E','#009688','#6A1B9A','#FFD600','#3b5999','#09b83e','#FFB900','#C239B3','#68768A','#847545','#4E342E','#009688','#6A1B9A','#FFD600'];
	world = [];
	w=100
	h=0
	for(let i=0;i<=20; i++){
		
		world[i] = new shape('obj_'+i, false, [
			new vector( (i*w +0) 		,300+(i*h) ),
			new vector( (i*w +100)		,300+(i*h) ),
			new vector( (i*w +100) 	,350+(i*h) ),
			new vector( (i*w +0) 		,350+(i*h) )
		]);
				
		world[i].color = colors[i]
	}
	return world;
}