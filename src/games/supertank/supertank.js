var gui = {
	powerBar : { x: 0, y: 0, width: canvas.width, height: 10 },
	score : 0,
	scoreText : { x: canvas.width - 90, y: 30},
	level : 1,
	levelText : { x: 0, y: 30},
	text: { x: canvas.width * 0.5 - 40, y: canvas.height * 0.5 - 5 },
	paused: { x: canvas.width * 0.5 - 40, y: canvas.height * 0.5 - 5 },
	button : { x: canvas.width * 0.5 - 20, y: canvas.height * 0.5 + 20, width: 75, height: 25 },
	gap : { nextLevel : 5, restart : 13, paused : 8 },
	'drawPowerBar' : function() 
	{ 
		engine.draw.ctx.fillStyle = "red"
    	engine.draw.ctx.fillRect(
			gui.powerBar.x, 
  			gui.powerBar.y, 
  			(modules.player.power / 100) * gui.powerBar.width, 
  			gui.powerBar.height
  		)
  		engine.draw.ctx.fill()
	},
	'drawText' : function (text, color, variable, font, variableCoordenates) {
		engine.draw.ctx.fillStyle = color
		engine.draw.ctx.font = font
		engine.draw.ctx.fillText(text + " " + variable, variableCoordenates.x, variableCoordenates.y) 		
	},
	'drawButton' : function (text, gap) {
		engine.draw.ctx.fillStyle = "blue"
    	engine.draw.ctx.fillRect(gui.button.x, gui.button.y, gui.button.width, gui.button.height)
	  	engine.draw.ctx.fill()
		engine.draw.ctx.fillStyle = "white"
		engine.draw.ctx.font = "15px Arial"
		engine.draw.ctx.fillText(text, gui.button.x + gap, gui.button.y + 18) 		
	}
}

var gameState = {
	'state' : { playing : true, stopped : false, ended: false },
  	'situation' : { win : false, lose : false }
}

var gameDefinitions = {
	constants : {
		deltaAngle : 0.025,
		deltaVelocity : 0.02,
		angularVelocity : 0.25
	}
}

function main() {
	
	engine.clock.currentTime = (new Date()).getTime()
	
	engine.draw.ctx.fillStyle = "green";
  	engine.draw.ctx.fillRect(0, 0, canvas.width, canvas.height)
  	engine.draw.ctx.fill()
  	
  	//engine.draw.drawImageByName(200, 200, "plasmaball", 0.05, shot.angularVelocity)
  	
  	modules.tanks.draw()
  	modules.player.draw()
  	modules.shot.draw()

	modules.patrol.move()
	modules.shot.move()
	
		
  	/*
  	gui.drawPowerBar()
  	gui.drawText("Level: ", "white", gui.level, "15px Arial", gui.levelText)
  	gui.drawText("Score: ", "white", gui.score, "15px Arial", gui.scoreText)
  	
	//if (modules.player.spaceshipExploded == false) 
	modules.player.draw()
	modules.shot.draw()
	modules.animatedSprite.draw((new Date()).getTime())
	modules.meteor.draw()
	*/
	
	//if (gameState.state.stopped == false) {
		modules.player.move()
		//modules.shot.move()
		//modules.meteor.move()
	//}
	
	/*
	if (util.boxClicked(engine.mouse.x, engine.mouse.y, 
		gui.button.x, gui.button.y,
		gui.button.width, gui.button.height)) 
	{
		engine.mouse.x = 0
		engine.mouse.y = 0
		if (gameState.state.playing == false) gameState.state.playing = true
		if (gameState.state.stopped == true) gameState.state.stopped = false
	}
	*/
	
	if (engine.key.isKeyPressed('ArrowLeft')) { modules.player.decreaseAngle() }
	if (engine.key.isKeyPressed('ArrowRight')) { modules.player.increaseAngle() }
	if (engine.key.isKeyPressed('ArrowDown')) { modules.player.decreaseVelocity() }
	if (engine.key.isKeyPressed('ArrowUp')) { modules.player.increaseVelocity() }
	
	/*
	if (engine.key.isKeyPressed("KeyP") && ((engine.clock.currentTime - engine.clock.pastTime) >= engine.clock.deltaTime)) {
		gameState.state.stopped = true
		if (gameState.situation.win == true) gameState.state.stopped = false
		if (gameState.situation.lose == true) gameState.state.stopped = false
   		engine.clock.pastTime = (new Date()).getTime()
	}
	*/
	if (engine.key.isKeyPressed("Space") && (engine.clock.currentTime - engine.clock.pastTime) >= engine.clock.deltaTime * 4) {
		var x = arena.getViewFromClipX(modules.player.tankPlayer.vPosition.x)
		var y = arena.getViewFromClipY(modules.player.tankPlayer.vPosition.y)
			
		var s = [{ vPosition : 
		{ 	x: x, 
			y: y }, 
			angle: modules.player.tankPlayer.angle + Math.PI / 2
		}]
		modules.shot.vShot = modules.shot.vShot.concat(s)
		//engine.sound.playAudioByName("spaceship-shot", false)
   		engine.clock.pastTime = (new Date()).getTime()
	}  	
  	/*
	//testCollisions()

	//refreshGameConditions()
	*/
	
	requestAnimationFrame(main)
}

window.onload 
{
	modules.player.init()
	modules.patrol.init()
	modules.tanks.init()

	modules.tanks.populateWithTanks()
	
	engine.key.setKeyListeners()
	engine.mouse.setMouseListeners()
	engine.resources.loadResources(engine.resources.areResourcesPrepared)
	engine.sound.playAudioByName("ground-easy")



	//modules.tanks.addPatrol()
	
	//modules.shot.init()
	//modules.meteor.init()
	//modules.meteor.populateWithMeteors()
}

function setTimeout() {
	
}