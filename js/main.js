function init(){
	keymap = [];
	c = document.getElementById("myCanvas");
	c.height = window.screen.availHeight-500;
	c.width = window.screen.availWidth;
	ctx = c.getContext("2d");
	
	px = 100;
	py = 100;
	ph = 100
	pw = 100	
	velx = vely = 0;
	acx = acy = 0.5;
	g = new gjk();
	
	s1 = new shape();
		s1.vectors.push(new vector(px+150,py+100));
		s1.vectors.push(new vector(px+250,py+100));
		s1.vectors.push(new vector(px+280,py+150));
		s1.vectors.push(new vector(px+280,py+200));
		s1.vectors.push(new vector(px+150,py+250));	
	/*
		s1.vectors.push(new vector(px+50,py));
		s1.vectors.push(new vector(px+150,py));
		s1.vectors.push(new vector(px+180,py+50));
	*/
 

	s2 = new shape();
	s2.vectors.push(new vector(px+50,  py));
	s2.vectors.push(new vector(px+150, py));
	s2.vectors.push(new vector(px+150, py+50));
	s2.vectors.push(new vector(px+50, py+50))	
	/*
		s2.vectors.push(new vector(150,100));
		s2.vectors.push(new vector(250,100));
		s2.vectors.push(new vector(280,150));
		s2.vectors.push(new vector(280,200));
		s2.vectors.push(new vector(150,250));
	*/
	s3 = new shape();
		s3.vectors.push(new vector(600,100));
		s3.vectors.push(new vector(600+50,100));
		s3.vectors.push(new vector(600+50,100+50));
		s3.vectors.push(new vector(600,100+50));

	s4 = new shape();
		s4.vectors.push(new vector(1000,100));
		s4.vectors.push(new vector(1200,100));
		
		s4.vectors.push(new vector(1300,200));
		s4.vectors.push(new vector(1300,300));

		s4.vectors.push(new vector(1200,400));
		s4.vectors.push(new vector(1000,400));

	loop();
}
function loop(){ 
	render();
	update(); 
}  
function update(){	
	acx = acy = speed = 5;

	if(keymap['37']){velx-=acx; px-=speed}//velx-=acx
	if(keymap['39']){velx+=acx; px+=speed}//velx+=acx
	if(keymap['38']){vely-=acy; py-=speed}  
	if(keymap['40']){vely+=acy; py+=speed}
	
	s1.vectors = [];
		s1.vectors.push(new vector(px+150,py+100));
		s1.vectors.push(new vector(px+250,py+100));
		s1.vectors.push(new vector(px+280,py+150));
		s1.vectors.push(new vector(px+280,py+200));
		s1.vectors.push(new vector(px+150,py+250));	

 	colRestult = g.check(s1,s2,ctx)
	if(colRestult.x || colRestult.y){
		px -=  colRestult.x; 
		py -=  colRestult.y; 
	}
	
	colRestult = g.check(s1,s3,ctx)
	if(colRestult.x || colRestult.y){
		px -=  colRestult.x; 
		py -=  colRestult.y; 
	}	
	colRestult = g.check(s1,s4,ctx)
	if(colRestult.x || colRestult.y){
		px -=  colRestult.x; 
		py -=  colRestult.y; 
	}	
	
	s1.vectors = [];
		s1.vectors.push(new vector(px+150,py+100));
		s1.vectors.push(new vector(px+250,py+100));
		s1.vectors.push(new vector(px+280,py+150));
		s1.vectors.push(new vector(px+280,py+200));
		s1.vectors.push(new vector(px+150,py+250));	
	

	//px+=velx;
	//py+=vely;

	
 	s1.draw(ctx,'red');
	s2.draw(ctx,'blue');	
	s3.draw(ctx,'orange');
	s4.draw(ctx,'purple');
	
	requestAnimationFrame(this.loop.bind(this));
}
function line(x1=0,y1=0,x2=100,y2=100,cl,c){
	c.beginPath();
	c.moveTo(x1,y1);
	c.lineTo(x2,y2);
	c.strokeStyle = cl;
	c.stroke();	
}
function write(str, clear=false){if(clear){document.getElementById('debug').innerHTML+=str;}else{document.getElementById('debug').innerHTML=str;}}
function render(){
	ctx.fillStyle = "#ffffff"; 	
	ctx.fillRect(0, 0, window.screen.availWidth, window.screen.availHeight);
	ctx.save();	
	ctx.scale(1, 1);	
}
window.onload = function(){
	init();
	onkeydown = onkeyup = function(e){e = e || event; keymap[e.keyCode] = e.type == 'keydown';keymap['last_key'] = e.keyCode;}
}