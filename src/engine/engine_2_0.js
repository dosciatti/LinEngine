var clock = {	
	deltaTime : 100,
	pastTime : (new Date()).getTime(),
 	currentTime : (new Date()).getTime()
}

var key = {	
	keys : [
		{key: 'Enter', pressed: false},
		{key: 'Space', pressed: false},
		{key: 'ArrowLeft', pressed: false},
		{key: 'ArrowRight', pressed: false},
		{key: 'ArrowUp', pressed: false},
		{key: 'ArrowDown', pressed: false},
		{key: 'KeyP', pressed: false}
	],
	keyDown : '',
	keyUp : '',
	'setKeyListeners' : function() { 
		document.addEventListener('keydown', function(event) { 
			key.keyDown = event.code
			key.setKeyDown()
		})
		document.addEventListener('keyup', function(event) { 
			key.keyUp = event.code
			key.setKeyUp()
		})
	},
	setKeyUp() 
	{
		for (let i = 0; i < key.keys.length; i++) {
			if (key.keyUp === key.keys[i].key) {
				key.keys[i].pressed = false
			}	
		}
	},
	setKeyDown() 
	{
		for (let i = 0; i < key.keys.length; i++) { 
			if (key.keyDown === key.keys[i].key) {
				key.keys[i].pressed = true
			}
		}	
	},
	isKeyPressed(keyToTest)
	{
		for (let i = 0; i < key.keys.length; i++) { 
			if (keyToTest === key.keys[i].key) {
				return key.keys[i].pressed
			}
		}	
	}
}

var resources = {
	data : [],
	areResourcesPrepared() 
	{
		resources.count = resources.count - 1
		if (resources.count == 0) {
			window.Function.call(main())
		}
	},
	loadResources(callback) 
	{	 
  		for(let n = 0; n < resourcesInfo.length; n++) {
    		if (resourcesInfo[n].type === 'image') {
    			resources.data[n] = new Image()
    		}
    		if (resourcesInfo[n].type === 'sound') {
    			resources.data[n] = new Audio()
    		}
    		resources.data[n].addEventListener('onload', callback(resources.areResourcesPrepared) );
    		if (resourcesInfo[n].type === 'image')
    			resources.data[n].src = "src/games/" + game.name + "/resources/images/" + resourcesInfo[n].name + "." + resourcesInfo[n].mimetype
    		if (resourcesInfo[n].type === 'sound')
    			resources.data[n].src = "src/games/" + game.name + "/resources/audio/" + resourcesInfo[n].name + "." + resourcesInfo[n].mimetype
  		}
	},
	count : resourcesInfo.length
}

var draw = {
	ctx : canvas.getContext("2d"),	
	drawImage(x, y, img, scale, rot) 
	{
		draw.ctx.save()
  		draw.ctx.translate(x, y)
  		draw.ctx.scale(scale, scale)
  		draw.ctx.rotate(rot)
  		draw.ctx.drawImage(img, -img.width / 2, -img.height / 2) 		
  		draw.ctx.restore()
	},
	drawImageByName(x, y, imageName, scale, rot) 
	{
		for (let i = 0; i < resourcesInfo.length; i++) {
			if (imageName === resourcesInfo[i].name) draw.drawImage(x, y, resources.data[i], scale, rot)
		}
	},
	drawAnimatedSprite(vPosition, img, xIndex, yIndex, spriteWidth, spriteHeight) 
	{
		draw.ctx.drawImage(img, xIndex * spriteWidth, yIndex * spriteHeight, 
		spriteWidth, spriteHeight, vPosition.x, vPosition.y, spriteWidth, spriteHeight)
	}
}

var sound = {
	play(audio) 
	{
		audio.play();
	},
	playAudioByName(audioName) 
	{ 
		for (let i = 0; i < resourcesInfo.length; i++) {
			if (resourcesInfo[i].name === audioName && resourcesInfo[i].type === 'sound') { 
				sound.play(resources.data[i])
			}
		}
	}
}

var util = {
	contains(entityA, entityB, radius) 
	{
		var r = Math.pow(
			Math.pow(entityA.vPosition.x - entityB.vPosition.x, 2) + 
			Math.pow(entityA.vPosition.y - entityB.vPosition.y, 2), 0.5)
	
		r = r * 1.62;
	
		if (r < radius)  
			return true;
		else
			return false;
	},
	boxClicked(x, y, x1, y1, width, height)
	{
		if ((x >= x1) && (x <= (x1 + width)) && (y >= y1) && (y <= (y1 + height))) {
			return true
		} else {
			return false
		}
	},
	size(vector) 
	{
	  return Math.pow(Math.pow(vector.x, 2) + Math.pow(vector.y, 2), 0.5);
  	}
}

var mouse = {
	x : 0,
	y : 0,
	'setMouseListeners' : function() { 
		document.addEventListener('click', function(event) { 
			mouse.x = event.pageX
			mouse.y = event.pageY
		})
	}	
}

var sprite = {
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

		sprite.animatedSprite.animatedSprite = sprite.animatedSprite.animatedSprite.concat(animSprite);		
	}
}

let engine = {
	clock,
	key, 
	resources, 
	draw, 
	sound, 
	util,
	mouse
}