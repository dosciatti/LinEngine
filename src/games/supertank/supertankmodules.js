var showWhiteCircle = true;

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

var	player = {
	tankPlayer : { 
		tankType : "tankbigblue", 
		vPosition : { x : canvas.width / 2, y : canvas.height / 2 },
		angle : 0,
		deltaAngle : 0.025,
		velocity : 0,
		deltaVelocity : 0.025,
		scale : 0.25,
		radius : 0
	},
	'init' : function () {
		player.tankPlayer.radius = 0.5 * 
		Math.pow(
		Math.pow(resourcesInfo.find(r => r.name === 'tankbigblue').width, 2) + 
		Math.pow(resourcesInfo.find(r => r.name === 'tankbigblue').height, 2), 
		0.5)
	},
	'draw' : function () {
		var x = arena.getViewFromClipX(player.tankPlayer.vPosition.x)
		var y = arena.getViewFromClipY(player.tankPlayer.vPosition.y)
		engine.draw.drawImageByName(x, y, player.tankPlayer.tankType, player.tankPlayer.scale, player.tankPlayer.angle)
	
		engine.draw.ctx.beginPath();
  		if (showWhiteCircle) engine.draw.ctx.arc(x, y, player.tankPlayer.scale * player.tankPlayer.radius, 0, 2 * Math.PI)
  		engine.draw.ctx.stroke();
	},
	'move' : function() { 
		player.tankPlayer.vPosition.x = player.tankPlayer.vPosition.x + player.tankPlayer.velocity * Math.cos(player.tankPlayer.angle)
		player.tankPlayer.vPosition.y = player.tankPlayer.vPosition.y + player.tankPlayer.velocity * Math.sin(player.tankPlayer.angle)
		arena.actualizeArenaClipCoordinates()
	},
	'increaseAngle' : function () {
		player.tankPlayer.angle = player.tankPlayer.angle + player.tankPlayer.deltaAngle
	},
	'decreaseAngle' : function () {
		player.tankPlayer.angle = player.tankPlayer.angle - player.tankPlayer.deltaAngle
	},
	'increaseVelocity' : function () {
		player.tankPlayer.velocity = player.tankPlayer.velocity + player.tankPlayer.deltaVelocity
	},
	'decreaseVelocity' : function () {
		player.tankPlayer.velocity = player.tankPlayer.velocity - player.tankPlayer.deltaVelocity
	}
}

var patrol = {
	vPatrol : [{ tank: "", rotateStatus : "", forwardStatus: "", position: { x0: 0, y0: 0, x1: 0, y1: 0} }],
	'init' : function () {
		patrol.vPatrol.splice(0, 1)
	},
	'drawLines' : function (tankPatrol) {
		engine.draw.ctx.beginPath()
		engine.draw.ctx.moveTo(tankPatrol.position.x0, tankPatrol.position.y0)
	  	engine.draw.ctx.lineTo(tankPatrol.position.x1, tankPatrol.position.y1)
  		//engine.draw.ctx.endedPath()
  		engine.draw.ctx.stroke()
	},
	'rotate' : function (tank, tankPatrol, teta) {
		var deltaAngle = tanksProperties.vTanksProperties[tanksProperties.getIndex(tank.tankName)].deltaAngle
		
		tank.angle = tank.angle + deltaAngle
		
		var x = 0
		var y = 0

		var yTankAngle = 0
		
		for (let x = -800; x < 800; x += deltaAngle) {
			//engine.draw.ctx.colorStyle = "white"
			y = teta * (x - tank.vPosition.x) + tank.vPosition.y
			engine.draw.ctx.beginPath()
			engine.draw.ctx.moveTo(tankPatrol.position.x0, tankPatrol.position.y0)
	  		engine.draw.ctx.lineTo(x, y)
  			engine.draw.ctx.stroke()

			yTankAngle = tank.angle * (x - tank.vPosition.x) + tank.vPosition.y
			engine.draw.ctx.beginPath()
			engine.draw.ctx.moveTo(tankPatrol.position.x0, tankPatrol.position.y0)
	  		engine.draw.ctx.lineTo(x, yTankAngle)
  			engine.draw.ctx.stroke()
		}

		var d = Math.abs(tank.angle) - Math.abs(teta) + deltaAngle
		if ((d < 0.1) && (d > 0.01)) {
			tankPatrol.rotateStatus = "off"
			tankPatrol.forwardStatus = "on"
		}
		
		//teta = m * Math.PI
		//var k = (tank.angle - teta) / (2 * Math.PI)
		
		//for (let i = 0; i < 10; i++) {
		//	var k = (tank.angle - teta) / (2 * Math.PI)
		//	if ((k - Math.floor(k)) <= deltaAngle) {
		//		tankPatrol.rotateStatus = "off"
		//		tankPatrol.forwardStatus = "on"
		//	}
		//}
	},
	'moveForward' : function (tank, tankPatrol, teta) {
		var stepX = Math.cos(teta)
		var stepY = Math.sin(teta)
		
		tank.vPosition.x = tank.vPosition.x + stepX
		tank.vPosition.y = tank.vPosition.y + stepY
			
		if ((Math.abs(tank.vPosition.x - tankPatrol.position.x1) < 50) && 
			(Math.abs(tank.vPosition.y - tankPatrol.position.y1) < 50)) {
			tankPatrol.forwardStatus = "off"
		}
		
		patrol.drawLines(tankPatrol)
	},
	'move' : function () {
		for (let i = 0; i < patrol.vPatrol.length; i++) {
			var tank = patrol.vPatrol[i].tank
			var tankPatrol = patrol.vPatrol[i]
			var teta = 
				Math.abs(tankPatrol.position.y1 - tankPatrol.position.y0) / 
				Math.abs(tankPatrol.position.x1 - tankPatrol.position.x0)
			
			if (tankPatrol.rotateStatus === "on") {
				patrol.rotate(tank, tankPatrol, teta)
			} 
			
			if (tankPatrol.forwardStatus === "on") {
				patrol.moveForward(tank, tankPatrol, teta)
			}
		}
	},
	'add' : function (tank, x0, y0, x1, y1) {
		var p = { tank: tank, rotateStatus : "on", forwardStatus: "off", position: { x0: x0, y0: y0, x1: x1, y1: y1} }
		patrol.vPatrol = patrol.vPatrol.concat(p)
	}
}

var tanksProperties = {
	vTanksProperties : [{ 
		tankName : "tankbig",
		deltaAngle : 0.025,
		maxVelocity : 3,
		deltaVelocity : 0.025,
		shotPower : 6,
		power : 70
	}, { 
		tankName : "tankgator",
		deltaAngle : 0.05,
		maxVelocity : 5,
		deltaVelocity : 0.05,
		shotPower : 5,
		power : 60
	}, { 
		tankName : "tankpunch",
		deltaAngle : 0.03,
		maxVelocity : 2,
		deltaVelocity : 0.005,
		shotPower : 20,
		power : 100
	}, { 
		tankName : "tankinterceptor",
		deltaAngle : 0.03,
		maxVelocity : 2.5,
		deltaVelocity : 0.015,
		shotPower : 10,
		power : 90
	}],
	'getIndex' : function (tankName) {
		//var tankNames = ["tankbig", "tankgator", "tankpunch", "tankinterceptor"]
		if (tankName === "tankbig") return 0
		if (tankName === "tankgator") return 1
		if (tankName === "tankpunch") return 2
		if (tankName === "tankinterceptor") return 3
	}
}

var tanks = {
	tanksNumber : 10,
	vTanks : [{ 
		teamColor : "",
		tankName : "",
		tankProperties : {
			deltaAngle : 0,
			maxVelocity : 0,
			deltaVelocity : 0,
			shotPower : 0,
			power : 0
		}, 
		vPosition : { x : 0, y : 0 },
		angle : 0,
		power : 0,
		scale : 0		
	}],
	radius : 0,
	'init' : function() {
		tanks.vTanks.splice(0, 1)
		tanks.radius = 0.5 * 
		Math.pow(
		Math.pow(resourcesInfo.find(r => r.name === 'tankbigblue').width, 2) + 
		Math.pow(resourcesInfo.find(r => r.name === 'tankbigblue').height, 2), 
		0.5)		
	},
	'populateTeam' : function (teamColor) {
		var tankNames = ["tankbig", "tankgator", "tankpunch", "tankinterceptor"]			
		for (let i = 0; i < 5; i++) {
			var tankTypeIndex = Math.floor(Math.random() * 4)
			//var tankProperties = tanksProperties.vTanksProperties[tankTypeIndex]

			var x = Math.random() * canvas.width
			var y = Math.random() * canvas.height

			//var tankProperties = tanksProperties.vTanksProperties[tanksProperties.getIndex(tankNames[tankTypeIndex])]

			var tank = { 
				teamColor : teamColor,
				tankName : tankNames[tankTypeIndex],
				tankProperties : tanksProperties.vTanksProperties[tankTypeIndex], 
				vPosition : { x : x, y : y },
				angle : 0,
				power : tanksProperties.vTanksProperties[tankTypeIndex].power,
				scale : 0.25
			}
			
			tanks.vTanks = tanks.vTanks.concat(tank)
		}
		
	},
	'populateWithTanks' : function () {
		tanks.populateTeam("blue")
		tanks.populateTeam("red")
		tanks.addPatrol(tanks.vTanks[0], "attack")
	},
	'draw' : function () {
		for (let i = 0; i < 10; i++) {			
			var tank = tanks.vTanks[i]
			var x = arena.getViewFromClipX(tank.vPosition.x)
			var y = arena.getViewFromClipY(tank.vPosition.y)
			engine.draw.drawImageByName(x, y, tank.tankName + tank.teamColor, tank.scale, tank.angle)
		
			engine.draw.ctx.beginPath()
	  		if (showWhiteCircle) engine.draw.ctx.arc(x, y, tank.scale * tanks.radius, 0, 2 * Math.PI)
  			engine.draw.ctx.stroke()
		}
	},
	'addPatrol' : function (tank, typePatrol) {
		var x = tank.vPosition.x
		var y = tank.vPosition.y
		if (typePatrol === "attack") {
			patrol.add(tank, x, y, 
			player.tankPlayer.vPosition.x, player.tankPlayer.vPosition.y)
		}
		if (typePatrol === "backwards") {
			patrol.add(tank, x, y, 
			player.tankPlayer.vPosition.x * -player.tankPlayer.velocity, 
			player.tankPlayer.vPosition.y * -player.tankPlayer.velocity)
		}
	},
	'move' : function() { 
	},
	'increaseAngle' : function () {
	},
	'decreaseAngle' : function () {
	},
	'increaseVelocity' : function () {
	},
	'decreaseVelocity' : function () {
	}
}

var shot = {
	vShot : [{vPosition : { x: 0, y: 0 }, angle: 0}], 
	velocity : 6,
	angularVelocity : 0,
	scale : 0.035,
	radius : 100,
	'init' : function() {
		shot.vShot.splice(0, 1)
	},
	'draw' : function() 
	{ 
		for (var i = 0; i < shot.vShot.length; i++) 
		{
			var x = shot.vShot[i].vPosition.x
			var y = shot.vShot[i].vPosition.y
			engine.draw.drawImageByName(x, y, "plasmaball", shot.scale, shot.angularVelocity)
		}
	},
	'move' : function() { 
	    for (var i = 0; i < shot.vShot.length; i++) 
	    {    		
    		shot.vShot[i].vPosition.x = shot.vShot[i].vPosition.x + shot.velocity * Math.sin(shot.vShot[i].angle);
    		shot.vShot[i].vPosition.y = shot.vShot[i].vPosition.y - shot.velocity * Math.cos(shot.vShot[i].angle);
    		shot.vShot[i].angularVelocity = shot.vShot[i].angularVelocity + 0.125; 
    	}
	},
	'punch' : function (tank) {
		var x = arena.getViewFromClipX(tank.tankPlayer.vPosition.x)
		var y = arena.getViewFromClipY(tank.vPosition.y)
		var s = [{ vPosition : 
		{ 	x: x, 
			y: y }, 
			angle: tank.angle + Math.PI / 2
		}]
		modules.shot.vShot = modules.shot.vShot.concat(s)
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
		arena.clip.x0 = player.tankPlayer.vPosition.x - canvas.width / 2 
		arena.clip.x1 = player.tankPlayer.vPosition.x + canvas.width / 2
		arena.clip.y0 = player.tankPlayer.vPosition.y - canvas.height / 2 
		arena.clip.y1 = player.tankPlayer.vPosition.y + canvas.height / 2
	}
}

let modules = {
	animatedSprite,
	arena,
	shot,
	tanks,
	player,
	patrol,
	player
}