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
		var deltaTime = 100;
    	if (animSprite.countNumberOfRepetitions <= animSprite.numberOfRepetitions) 
    	{
	   		engine.draw.drawAnimatedSprite(animSprite.vPosition, animSprite.img, animSprite.xIndex, animSprite.yIndex, animSprite.spriteWidth, animSprite.spriteHeight) 
			if ((currentTime - animSprite.pastTime) >= deltaTime) 
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
	'draw' : function() 
	{ 
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

		var img = engine.resources.getResourceByNameAndType("spaceship", "image")

  		var x = player.vPosition.x - (img.width / (98 * 5)) / 2;
  		var y = player.vPosition.y - (img.height / (98 * 5)) / 2; 
    		
		engine.sound.playAudioByName('spaceship-explosion');

 		var animSpriteA = 
		[{ 
			img: engine.resources.data[3], 
			vPosition: {x: x - 98 / 2, y: y - 95 / 2 - 10}, 
			cols: 5, rows: 5, numberOfRepetitions: 1, 
			spriteWidth: 98, spriteHeight: 95,
			frame : -1, countNumberOfRepetitions : 0, 
			xIndex: 0, yIndex: 0,
			pastTime : (new Date()).getTime()
		}];

		animatedSprite.animatedSprite = animatedSprite.animatedSprite.concat(animSpriteA);		

		var animSpriteB = 
		[{ 
			img: engine.resources.data[3], 
			vPosition: {x: x - 98 / 2 - 10, y: y - 95 / 2 + 10}, 
			cols: 5, rows: 5, numberOfRepetitions: 1, 
			spriteWidth: 98, spriteHeight: 95,
			frame : -1, countNumberOfRepetitions : 0, 
			xIndex: 0, yIndex: 0,
			pastTime : (new Date()).getTime()
		}];

		animatedSprite.animatedSprite = animatedSprite.animatedSprite.concat(animSpriteB);		

		var animSpriteC = 
		[{ 
			img: engine.resources.data[3], 
			vPosition: {x: x - 98 / 2 + 10, y: y - 95 / 2 + 10}, 
			cols: 5, rows: 5, numberOfRepetitions: 1, 
			spriteWidth: 98, spriteHeight: 95,
			frame : -1, countNumberOfRepetitions : 0, 
			xIndex: 0, yIndex: 0,
			pastTime : (new Date()).getTime()
		}];

		animatedSprite.animatedSprite = animatedSprite.animatedSprite.concat(animSpriteC);		
	}
}

var shot = {
	velocity : 9,
	vector : [{vPosition : { x: 0, y: 0 }, angle: 0, angularVelocity: 0}], 
	scale : 0.015,
	radius : 100,
	'draw' : function() 
	{ 
		for (var i = 0; i < shot.vector.length; i++) 
		{
			engine.draw.ctx.fillStyle = "white";
  			engine.draw.ctx.beginPath();
  			engine.draw.ctx.arc(shot.vector[i].vPosition.x, shot.vector[i].vPosition.y, shot.scale * shot.radius, 0, 2 * Math.PI)
  			engine.draw.ctx.fill();
		}
	},
	'move' : function() { 
	    for (var i = 0; i < shot.vector.length; i++) 
	    {    		
    		shot.vector[i].vPosition.x = shot.vector[i].vPosition.x + shot.velocity * Math.sin(shot.vector[i].angle);
    		shot.vector[i].vPosition.y = shot.vector[i].vPosition.y - shot.velocity * Math.cos(shot.vector[i].angle);
    		shot.vector[i].angularVelocity = shot.vector[i].angularVelocity + 0.125; 
    	}
	}
}

var meteor = {
	numberOfMeteors : 50,
	vector : [{vPosition : { x: 0, y: 0 }, vVelocity : { x: -1, y: -1 }, angle: 0, angularVelocity : 0}], 
	scale : 0.1,
	radius : 
	0.5 * 
	Math.pow(
	Math.pow(resourcesInfo.find(r => r.name === 'meteor').width, 2) + 
	Math.pow(resourcesInfo.find(r => r.name === 'meteor').height, 2), 
	0.5),
	'draw' : function() 
	{ 
		for (var i = 0; i < meteor.vector.length; i++) {
			engine.draw.drawImageByName(meteor.vector[i].vPosition.x, meteor.vector[i].vPosition.y, 'meteor', meteor.scale, meteor.vector[i].angle); 
		  	engine.draw.ctx.strokeStyle = "white";  		
  			engine.draw.ctx.beginPath();
  			if (showWhiteCircle) engine.draw.ctx.arc(meteor.vector[i].vPosition.x, meteor.vector[i].vPosition.y, meteor.scale * meteor.radius, 0, 2 * Math.PI)
  			engine.draw.ctx.stroke();
		}
	},
	'move' : function() { 
	    for (var i = 0; i < meteor.vector.length; i++) 
	    {
	    	meteor.vector[i].vPosition.x = meteor.vector[i].vPosition.x + meteor.vector[i].vVelocity.x;
    		meteor.vector[i].vPosition.y = meteor.vector[i].vPosition.y - meteor.vector[i].vVelocity.y;
    		if (meteor.vector[i].vPosition.x > canvas.width) meteor.vector[i].vPosition.x = 0
    		if (meteor.vector[i].vPosition.x < 0) meteor.vector[i].vPosition.x = canvas.width
	    	if (meteor.vector[i].vPosition.y < 0) meteor.vector[i].vPosition.y = canvas.height
    		if (meteor.vector[i].vPosition.y > canvas.height) meteor.vector[i].vPosition.y = 0    	
    		meteor.vector[i].angle = meteor.vector[i].angle + meteor.vector[i].angularVelocity; 
    	}
	},
	'populateWithMeteors' : function() 
	{
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
			
			meteor.vector = meteor.vector.concat(m);
		}
	}
}

let classes = {
	animatedSprite, 
	player, 
	shot, 
	meteor 
}