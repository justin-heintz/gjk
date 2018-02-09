<head>
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<script src="js/sprites/assets.js"></script>
	<script src="js/sprites/sprite.js"></script>
	
	<script src="js/phys/vector.js"></script>
	<script src="js/phys/shape.js"></script>
	<script src="js/phys/gjk.js"></script>
	<script src="js/phys/quadtree.js"></script>	
	
	<script src="js/flashlight.js"></script>
	<script src="js/entity.js"></script>
	<script src="js/camera.js"></script>
	<script src="js/ui.js"></script>
	<script src="js/grid.js"></script>	
	<script src="js/player.js "></script>
	<script src="js/main.js "></script>

	<style>
		body{background: #000; overflow: hidden; width: 100%; height: 100%; padding: 10px;}
		
		canvas{position: relative; display: block; width: 520px; height: 520px; margin:0 auto;}

		#background{z-index: 1; margin-top: -520px;}
		#foreground{z-index: 2; margin-top: 0; border: 1px dashed #fff;}
		#lighting{  z-index: 3; margin-top: -520px;}
		#ui{        z-index: 4; margin-top: -520px;}
	</style>
</head>
<body> 
	<canvas id="foreground"></canvas>
	<canvas id="background"></canvas>
	<canvas id="lighting"></canvas>
	<canvas id="ui"></canvas>
</body>
