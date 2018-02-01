<head>
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="background: #000; overflow:hidden;width:100%;height:100%;padding:10px;  "> 
	<script src="js/sprites/assets.js"></script>
	<script src="js/sprites/sprite.js"></script>
	
	<script src="js/flashlight.js"></script>
	
	<script src="js/main.js?time=<?= time();?> "></script>
	
	<script src="js/worlds/w-1.js"></script>
	
	<script src="js/phys/vector.js"></script>
	<script src="js/phys/shape.js"></script>
	<script src="js/phys/gjk.js"></script>
	<script src="js/phys/quadtree.js"></script>
	
	<script src="js/entity.js"></script>
	
	<canvas id="canvas" style="display: block; width: 520px; height: 520px; margin:0 auto;"></canvas>
	<canvas id="overlay" style="position:relative; z-index:9; display: block; width: 520px; height: 520px; margin:-520px  auto 0 auto;"></canvas>
	<canvas id="ui" style="position:relative; z-index:10; display: block; width: 520px; height: 520px; margin:-520px  auto 0 auto;"></canvas>
</body>
