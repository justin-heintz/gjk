class ui{
	clear(){
		canvas.ui.clearRect(0, 0, 520, 520);
	}
	draw(text, pos,style={color:"#fff",size:"13px"}){
		canvas.ui.fillStyle = style.color ;
		canvas.ui.font = style.size+" Arial";
		canvas.ui.fillText(text,pos.x,pos.y);		
	}
}