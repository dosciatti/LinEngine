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

var player = {
	vPosition : { x: canvas.width / 2, y: canvas.height / 2 }, 
	vForce : { x: 0, y: 1 }, 
	vVelocity : { x: 0, y: -1 },
	velocity : 1, 
	angle : 0,
	power : 100, 
	scale: 0.1,
	radius : 
	0.5 * 
	Math.pow(
	Math.pow(resourcesInfo.find(r => r.name === 'spaceship').width, 2) + 
	Math.pow(resourcesInfo.find(r => r.name === 'spaceship').height, 2), 
	0.5),
	spaceshipExploded : false,
	'init' : function() {
		player.vPosition = { x: canvas.width / 2, y: canvas.height / 2 } 
		player.vForce = { x: 0, y: 1 }
		player.vVelocity = { x: 0, y: -1 }
		player.velocity = 1 
		player.angle = 0
		player.spaceshipExploded = false
	},
	'draw' : function() { 
		engine.draw.drawImageByName(player.vPosition.x, player.vPosition.y, 'spaceship', player.scale, player.angle); 
	  	engine.draw.ctx.strokeStyle = "white";  		
  		engine.draw.ctx.beginPath();
  		if (showWhiteCircle) engine.draw.ctx.arc(player.vPosition.x, player.vPosition.y, player.scale * player.radius, 0, 2 * Math.PI)
  		engine.draw.ctx.stroke();
	},
	'move' : function() { 
		player.vPosition.x = player.vPosition.x + Math.abs(player.vForce.x) * player.vVelocity.x;
		player.vPosition.y = player.vPosition.y + Math.abs(player.vForce.y) * player.vVelocity.y;
    	if (player.vPosition.x > canvas.width) player.vPosition.x = 0
    	if (player.vPosition.x < 0) player.vPosition.x = canvas.width
	    if (player.vPosition.y < 0) player.vPosition.y = canvas.height
    	if (player.vPosition.y > canvas.height) player.vPosition.y = 0
	},
	'changeVelocity' : function(deltaVelocity) 
	{ 	
		player.velocity = engine.util.size(player.vVelocity) + deltaVelocity;
    	player.vVelocity.x = player.velocity * Math.sin(player.angle);
   	 	player.vVelocity.y = -player.velocity * Math.cos(player.angle);    
    	var force = 0.5;
    	player.vForce.x = force * Math.sin(player.angle);
    	player.vForce.y = -force * Math.cos(player.angle);    
  	},
  	'explodeSpaceship' : function() {
		player.spaceshipExploded = true

		var img = engine.resources.getResourceByNameAndType("spaceship", "image")

  		var x = player.vPosition.x - (img.width / (98 * 5)) / 2;
  		var y = player.vPosition.y - (img.height / (98 * 5)) / 2; 
    		
		engine.sound.playAudioByName('spaceship-explosion');

		var distanceX = 0, distanceY = 0
 		
 		for (let i = 0; i < 3; i++) {

			if (i == 0) { distanceX = 0; distanceY = -10 }
			if (i == 1) { distanceX = -10; distanceY = 10 }
			if (i == 2) { distanceX = 10; distanceY = 10 }

			animatedSprite.animatedSprite = animatedSprite.animatedSprite.concat(
			[{ 
				img: engine.resources.data[3], 
				vPosition: {x: x - 98 / 2 + distanceX, y: y - 95 / 2 + distanceY}, 
				cols: 5, rows: 5, numberOfRepetitions: 1, 
				spriteWidth: 98, spriteHeight: 95,
				frame : -1, countNumberOfRepetitions : 0, 
				xIndex: 0, yIndex: 0,
				pastTime : (new Date()).getTime()
			}])
		
		}
	}
}

var shot = {
	velocity : 9,
	vShot : [{vPosition : { x: 0, y: 0 }, angle: 0, angularVelocity: 0}], 
	scale : 0.015,
	radius : 100,
	'init' : function() {
		shot.vShot.splice(0, 1)
	},
	'draw' : function() 
	{ 
		for (var i = 0; i < shot.vShot.length; i++) 
		{
			engine.draw.ctx.fillStyle = "white";
  			engine.draw.ctx.beginPath();
  			engine.draw.ctx.arc(shot.vShot[i].vPosition.x, shot.vShot[i].vPosition.y, shot.scale * shot.radius, 0, 2 * Math.PI)
  			engine.draw.ctx.fill();
		}
	},
	'move' : function() { 
	    for (var i = 0; i < shot.vShot.length; i++) 
	    {    		
    		shot.vShot[i].vPosition.x = shot.vShot[i].vPosition.x + shot.velocity * Math.sin(shot.vShot[i].angle);
    		shot.vShot[i].vPosition.y = shot.vShot[i].vPosition.y - shot.velocity * Math.cos(shot.vShot[i].angle);
    		shot.vShot[i].angularVelocity = shot.vShot[i].angularVelocity + 0.125; 
    	}
	}
}

var meteor = {
	numberOfMeteors : 10,
	vMeteor : [{vPosition : { x: 0, y: 0 }, vVelocity : { x: -1, y: -1 }, angle: 0, angularVelocity : 0}], 
	scale : 0.1,
	radius : 
	0.5 * 
	Math.pow(
	Math.pow(resourcesInfo.find(r => r.name === 'meteor').width, 2) + 
	Math.pow(resourcesInfo.find(r => r.name === 'meteor').height, 2), 
	0.5),
	'init' : function() {
		modules.meteor.vMeteor.splice(0, 1)
	},
	'draw' : function() 
	{ 
		for (var i = 0; i < meteor.vMeteor.length; i++) {
			engine.draw.drawImageByName(meteor.vMeteor[i].vPosition.x, meteor.vMeteor[i].vPosition.y, 'meteor', meteor.scale, meteor.vMeteor[i].angle); 
		  	engine.draw.ctx.strokeStyle = "white";  		
  			engine.draw.ctx.beginPath();
  			if (showWhiteCircle) engine.draw.ctx.arc(meteor.vMeteor[i].vPosition.x, meteor.vMeteor[i].vPosition.y, meteor.scale * meteor.radius, 0, 2 * Math.PI)
  			engine.draw.ctx.stroke();
		}
	},
	'move' : function() { 
	    for (var i = 0; i < meteor.vMeteor.length; i++) 
	    {
	    	meteor.vMeteor[i].vPosition.x = meteor.vMeteor[i].vPosition.x + meteor.vMeteor[i].vVelocity.x;
    		meteor.vMeteor[i].vPosition.y = meteor.vMeteor[i].vPosition.y - meteor.vMeteor[i].vVelocity.y;
    		if (meteor.vMeteor[i].vPosition.x > canvas.width) meteor.vMeteor[i].vPosition.x = 0
    		if (meteor.vMeteor[i].vPosition.x < 0) meteor.vMeteor[i].vPosition.x = canvas.width
	    	if (meteor.vMeteor[i].vPosition.y < 0) meteor.vMeteor[i].vPosition.y = canvas.height
    		if (meteor.vMeteor[i].vPosition.y > canvas.height) meteor.vMeteor[i].vPosition.y = 0    	
    		meteor.vMeteor[i].angle = meteor.vMeteor[i].angle + meteor.vMeteor[i].angularVelocity; 
    	}
	},
	'populateWithMeteors' : function() 
	{
		modules.meteor.vMeteor.forEach(
			function (item, index) {
				modules.meteor.vMeteor = modules.meteor.vMeteor.splice(index, 1)
			}
		)

		for (var i = 0; i < meteor.numberOfMeteors; i++) {

			var signal = 0;

			var x = Math.floor(Math.random() * 2 * canvas.width);
			var y = Math.floor(Math.random() * 2 * canvas.height);
		
			if (x < (canvas.width / 2)) { x = x - 3 * canvas.width; }
			if (x > (canvas.width / 2)) { x = x + 3 * canvas.width; }

			if (y < (canvas.height / 2)) { y = y - 3 * canvas.height; }
			if (y > (canvas.height / 2)) { y = y + 3 * canvas.height; }

			var velocityX = (Math.floor(Math.random() * 5) - 3) * 0.5;
			signal = Math.random();
			if (signal < 0.5) velocityX = velocityX * -1;	
		
			var velocityY = (Math.floor(Math.random() * 7) - 3) * 0.5;
			signal = Math.random();
			if (signal < 0.5) velocityY = velocityY * -1;	

			var angle = Math.floor(Math.random() * 360);
			var angularVelocity = Math.random();

			if (angularVelocity < 0.5) { angularVelocity = angularVelocity * -1; }
			angularVelocity = angularVelocity * 0.025;

			var m = [{vPosition : { x: x, y: y }, vVelocity : { x: velocityX, y: velocityY }, angle: angle, angularVelocity : angularVelocity}]; 
			
			meteor.vMeteor = meteor.vMeteor.concat(m);
		}
	}
}

let modules = {
	animatedSprite, 
	player, 
	shot, 
	meteor 
}