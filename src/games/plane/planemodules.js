var showWhiteCircle = false;

var animatedSprite = {
	animatedSprite : [{ img: new Image(), vPosition: {x: 0, y: 0}, cols: 0, rows: 0, numberOfRepetitions: 0, spriteWidth: 0, spriteHeight: 0, frame : -1, countNumberOfRepetitions : 0, xIndex: 0, yIndex: 0, pastTime : (new Date()).getTime() }],
	'draw' : function(currentTime) 
	{ 
		for (var i = 0; i < animatedSprite.animatedSprite.length; i++) 
			animatedSprite.animate(currentTime, animatedSprite.animatedSprite[i]);
	},
	'animate' : function(currentTime, animSprite) 
	{			
    	if (animSprite.countNumberOfRepetitions <= animSprite.numberOfRepetitions) 
    	{
	   		engine.draw.drawAnimatedSprite(animSprite.vPosition, animSprite.img, animSprite.xIndex, animSprite.yIndex, animSprite.spriteWidth, animSprite.spriteHeight) 
			if ((currentTime - animSprite.pastTime) >= engine.clock.deltaTime) 
			{
  				animSprite.frame = animSprite.frame + 1;
  				animSprite.xIndex = (animSprite.xIndex + 1) % animSprite.cols;
  				animSprite.yIndex = animSprite.xIndex === 0 ? (animSprite.yIndex + 1) % animSprite.rows : animSprite.yIndex;
		   		engine.draw.drawAnimatedSprite(animSprite.vPosition, animSprite.img, animSprite.xIndex, animSprite.yIndex, animSprite.spriteWidth, animSprite.spriteHeight) 
  				animSprite.pastTime = (new Date()).getTime();
  				if (animSprite.frame == (animSprite.cols + animSprite.rows)) 
  				{
  					animSprite.countNumberOfRepetitions = animSprite.countNumberOfRepetitions + 1;	
  					animSprite.frame = -1;
  				}  				
  			}
  		}
	},
	'setAnimation' : function(item) 
	{
 		var x = item.vPosition.x - (engine.resources.data[3].width / (98 * 5)) / 2;
  		var y = item.vPosition.y - (engine.resources.data[3].height / (98 * 5)) / 2; 
  			
		var animSprite = 
		[{ 
			img: engine.resources.data[3], 
			vPosition: {x: x - 98 / 2, y: y - 95 / 2 - 10}, 
			cols: 5, rows: 5, numberOfRepetitions: 1, 
			spriteWidth: 98, spriteHeight: 95,
			frame : -1, countNumberOfRepetitions : 0, 
			xIndex: 0, yIndex: 0,
			pastTime : (new Date()).getTime()
		}];

		animatedSprite.animatedSprite = animatedSprite.animatedSprite.concat(animSprite);		
	}
}

var plane = {
	vPosition : { x : canvas.width / 2, y : canvas.height / 2 },
	angle : 0,
	deltaAngle : 0.025,
	velocity : 0,
	deltaVelocity : 0.025,
	scale : 0.55,
	radius : 0, 
	'init' : function() {
		plane.radius = 0.5 * 
		Math.pow(
		Math.pow(resourcesInfo.find(r => r.name === 'plane').width, 2) + 
		Math.pow(resourcesInfo.find(r => r.name === 'plane').height, 2), 
		0.5)
	},
	'draw' : function () {		
		var x = arena.getViewFromClipX(plane.vPosition.x)
		var y = arena.getViewFromClipY(plane.vPosition.y)
		var xmap = arena.getMapFromBoxX(plane.vPosition.x)
		var ymap = arena.getMapFromBoxY(plane.vPosition.y)
		
		if (engine.key.isKeyPressed("ArrowLeft") == false && engine.key.isKeyPressed("ArrowRight") == false) {
			engine.draw.drawImageByName(x, y, "plane", plane.scale, plane.angle + Math.PI / 2)
			engine.draw.drawImageByName(xmap, ymap, "plane", plane.scale * 0.2, plane.angle + Math.PI / 2)
		}
		if (engine.key.isKeyPressed("ArrowLeft") == true) {
			engine.draw.drawImageByName(x, y, "planeleft", plane.scale, plane.angle + Math.PI / 2)
			engine.draw.drawImageByName(xmap, ymap, "planeleft", plane.scale * 0.2, plane.angle + Math.PI / 2)
		}
		if (engine.key.isKeyPressed("ArrowRight") == true) {
			engine.draw.drawImageByName(x, y, "planeright", plane.scale, plane.angle + Math.PI / 2)
			engine.draw.drawImageByName(xmap, ymap, "planeright", plane.scale * 0.2, plane.angle + Math.PI / 2)
		}
	},
	'move' : function() { 
		plane.vPosition.x = plane.vPosition.x + plane.velocity * Math.cos(-plane.angle)
		plane.vPosition.y = plane.vPosition.y - plane.velocity * Math.sin(-plane.angle)
		arena.actualizeArenaClipCoordinates()
	},
	'increaseAngle' : function () {
		plane.angle = plane.angle + plane.deltaAngle
	},
	'decreaseAngle' : function () {
		plane.angle = plane.angle - plane.deltaAngle
	},
	'increaseVelocity' : function () {
		plane.velocity = plane.velocity + plane.deltaVelocity
	},
	'decreaseVelocity' : function () {
		plane.velocity = plane.velocity - plane.deltaVelocity
	}
}

var clouds = {
	scale : 3,
	radius : 0,
	vClouds : [{ vPosition : { x : 0, y: 0 }, velocity : 0 }],
	cloudsNumber : 10,
	maxVelocity : 1,
	minVelocity : 0.5,
	'init' : function() {
		clouds.vClouds.splice(0, 1)
		clouds.radius = 0.5 * 
		Math.pow(
		Math.pow(resourcesInfo.find(r => r.name === 'cloud').width, 2) + 
		Math.pow(resourcesInfo.find(r => r.name === 'cloud').height, 2), 
		0.5)
	},
	'populate' : function() {	
		for (let i = 0; i < clouds.cloudsNumber; i++) {
			
			var signalX = Math.random()
			var signalY = Math.random()
			
			? (signalX < 0.5) : signalX = -1, signalX = 1
			? (signalY < 0.5) : signalY = -1, signalY = 1
			
			//box with negative coordinates values
			? (arena.box.x0 < 0 || arena.box.y0 < 0) : signalX = signalX, signalX = 1
			
			//box with negative coordinates values
			? (arena.box.y0 < 0 || arena.box.y1 < 0) : signalY = signalY, signalX = 1
			
			velocity = Math.random() * clouds.maxVelocity + clouds.minVelocity
			
			var v = [{ vPosition : { 
				x: signalX * Math.random() * (arena.box.x1 - arena.box.x0) / 2, 
				y: signalY * Math.random() * (arena.box.y1 - arena.box.y0) / 2 },
				velocity : velocity }]

			clouds.vClouds = clouds.vClouds.concat(v)
		}
	},
	'draw' : function () {
		for (let i = 0; i < clouds.vClouds.length; i++) {
			//if (hearts.vHearts[i].intercepted == false) {	
			//engine.draw.drawImageByName(arena.getX(hearts.vHearts[i].x), arena.getY(hearts.vHearts[i].y), "heart", 1, 0)
			//}
			
			var x = arena.getViewFromClipX(clouds.vClouds[i].vPosition.x)
			var y = arena.getViewFromClipY(clouds.vClouds[i].vPosition.y)
			engine.draw.drawImageByName(x, y, "cloud", clouds.scale, 0)
			
			var xmap = arena.getMapFromBoxX(clouds.vClouds[i].vPosition.x)
			var ymap = arena.getMapFromBoxY(clouds.vClouds[i].vPosition.y)
			engine.draw.drawImageByName(xmap, ymap, "cloud", 0.25, 0)
		}	
	},
	'move' : function () {
		for (let i = 0; i < clouds.vClouds.length; i++) {
			var gap = 300

			? (arena.box.x0 > 0) : gap = gap * -1, gap = gap 
			//? (arena.box.x1 < 0) : gap = gap, gap = gap  

			if (clouds.vClouds[i].vPosition.x < arena.box.x0) 
				clouds.vClouds[i].vPosition.x = arena.box.x1 + gap

			if (clouds.vClouds[i].vPosition.x > arena.box.x1) 
				clouds.vClouds[i].vPosition.x = arena.box.x0 - gap
			
			clouds.vClouds[i].vPosition.x = clouds.vClouds[i].vPosition.x + clouds.vClouds[i].velocity
		}
	}
}

var levels = {
	actualLevel : 0,
	hearts : {
		radius : 0,
		scale: 1,
	},
 	vLevel : [{vHearts : [{vPosition : { x : 0, y: 0 }, intercepted : false }]}],
	'init' : function() {
		levels.vLevel[0].vHearts.splice(0, 1)
		levels.hearts.radius = 0.5 * 
		Math.pow(
		Math.pow(resourcesInfo.find(r => r.name === 'heart').width, 2) + 
		Math.pow(resourcesInfo.find(r => r.name === 'heart').height, 2), 
		0.5)
	},
	'makeCircle' : function (x, y, radius) {
		for (let r = 10; r < radius; r = r + 50) {
			for (let arc = 0; arc < 2 * Math.PI * radius; arc += 45) {
				levels.vLevel[levels.actualLevel].vHearts = 
				levels.vLevel[levels.actualLevel].vHearts.concat({ vPosition : { x: x + r * Math.cos(arc), y : y + r * Math.sin(arc) }, intercepted : false })	
			}
		}
	},
	'makeRectangle' : function (x0, y0, x1, y1) {
		for (let i = x0; i < x1; i += 50) {
			for (let j = y0; j < y1; j += 50) {
				levels.vLevel[levels.actualLevel].vHearts = 
				levels.vLevel[levels.actualLevel].vHearts.concat({ vPosition : { x: i, y : j }, intercepted : false })	
			}
		}
	},
	'makeLevel' : function (level) {
		levels.actualLevel = level
		levels.vLevel = levels.vLevel.concat([{vHearts : [{ vPosition : { x : 0, y: 0 }, intercepted : false }]}])
		if (levels.actualLevel == 0) {
			levels.makeCircle(400, 400, 100)
			levels.makeRectangle(-200, -200, 100, 100)
		}
		if (levels.actualLevel == 1) {
			levels.makeCircle(400, 400, 300)
			levels.makeRectangle(-200, -200, 200, 200)
		}/*
		if (levels.actualLevel == 2) {
			levels.makeCircle(400, 400, 300)
			levels.makeRectangle(-200, -200, 200, 200)
		}
		if (levels.actualLevel == 3) {
			levels.makeCircle(400, 400, 300)
			levels.makeRectangle(-200, -200, 200, 200)
		}
		if (levels.actualLevel == 4) {
			levels.makeCircle(400, 400, 300)
			levels.makeRectangle(-200, -200, 200, 200)
		}*/
	},
	'draw' : function () {
		console.log(levels.vLevel[levels.actualLevel].vHearts.length)
		for (let i = 0; i < levels.vLevel[levels.actualLevel].vHearts.length; i++) {
			//if (hearts.vHearts[i].intercepted == false) {	
			//engine.draw.drawImageByName(arena.getX(hearts.vHearts[i].x), arena.getY(hearts.vHearts[i].y), "heart", 1, 0)
			//}
			var x = arena.getViewFromClipX(levels.vLevel[levels.actualLevel].vHearts[i].vPosition.x)
			var y = arena.getViewFromClipY(levels.vLevel[levels.actualLevel].vHearts[i].vPosition.y)
			engine.draw.drawImageByName(x, y, "heart", 1, 0)
			
			var xmap = arena.getMapFromBoxX(levels.vLevel[levels.actualLevel].vHearts[i].vPosition.x)
			var ymap = arena.getMapFromBoxY(levels.vLevel[levels.actualLevel].vHearts[i].vPosition.y)
			engine.draw.drawImageByName(xmap, ymap, "heart", 0.25, 0)
		}	
	}
}

var arena = {
	box : { x0 : -800, y0 : -800, x1 : 800, y1 : 800 },	
	map : { x0 : canvas.width - 200, y0 : canvas.height / 2 + 200 , x1 : 800, y1 : 600},
	'getMapFromBoxX' : function (boxPositionX) {
		return Math.floor(((arena.map.x1 - arena.map.x0) / (arena.box.x1 - arena.box.x0)) * (boxPositionX - arena.box.x0) + arena.map.x0)
	},
	'getMapFromBoxY' : function (boxPositionY) {
		return Math.floor(((arena.map.y1 - arena.map.y0) / (arena.box.y1 - arena.box.y0)) * (boxPositionY - arena.box.y0) + arena.map.y0)
	},
	clip : { x0 : 0, y0 : 0, x1 : canvas.width, y1 : canvas.height},
	view : { x0 : 0, y0 : 0, x1 : canvas.width, y1 : canvas.height},
	'getViewFromClipX' : function (clipPositionX) {
		return Math.floor(((arena.clip.x1 - arena.clip.x0) / (arena.view.x1 - arena.view.x0)) * (clipPositionX - arena.clip.x0) - arena.view.x0)
	},
	'getViewFromClipY' : function (clipPositionY) {
		return Math.floor(((arena.clip.y1 - arena.clip.y0) / (arena.view.y1 - arena.view.y0)) * (clipPositionY - arena.clip.y0) - arena.view.y0)
	},
	'actualizeArenaClipCoordinates' : function () {
		arena.clip.x0 = plane.vPosition.x - canvas.width / 2 
		arena.clip.x1 = plane.vPosition.x + canvas.width / 2
		arena.clip.y0 = plane.vPosition.y - canvas.height / 2 
		arena.clip.y1 = plane.vPosition.y + canvas.height / 2
	}
}

let modules = {
	animatedSprite,
	arena,
	plane,
	clouds,
	levels
}