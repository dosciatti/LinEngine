let canvas = document.getElementById("myCanvas");

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
		if (--resources.count == 0) {
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
    			resources.data[n].src = "images/" + resourcesInfo[n].name + "." + resourcesInfo[n].mime;
    		if (resourcesInfo[n].type === 'sound')
    			resources.data[n].src = "audio/" + resourcesInfo[n].name + "." + resourcesInfo[n].mime;
  		}
	},	
	getResourceByNameAndType(name, type) 
	{ 
		for (let i = 0; i < resourcesInfo.length; i++) {
			if (resourcesInfo[i].name === name && resourcesInfo[i].type === type) { 
				return resources.data[i]
			}
		}
	},
	count : resourcesInfo.length
}

var draw = {
	ctx : canvas.getContext("2d"),	
	drawImage(x, y, img, scale, rot) 
	{
		draw.ctx.save()
  		draw.ctx.translate(x, y) // change origin
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
			mouse.x = event.x
			mouse.y = event.y
		})
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