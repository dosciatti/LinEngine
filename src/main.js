var gui = {
	powerBar : { x: 0, y: 0, width: canvas.width, height: 10 },
	score : 0,
	scoreText : { x: canvas.width - 90, y: 30},
	level : 1,
	levelText : { x: 0, y: 30},
	text: { x: canvas.width * 0.5 - 40, y: canvas.height * 0.5 - 5 },
	button : { x: canvas.width * 0.5 - 20, y: canvas.height * 0.5 + 20, width: 75, height: 25 },
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
	},
 	isBackgroundSoundStarted : false
}

function main() {

	engine.clock.currentTime = (new Date()).getTime()
	
	if (gameDefinitions.isBackgroundSoundStarted == false) 
	{
		engine.sound.playAudioByName("ground-hard")
		gameDefinitions.isBackgroundSoundStarted = true	
	} 
	
	engine.draw.ctx.fillStyle = "black";
  	engine.draw.ctx.fillRect(0, 0, canvas.width, canvas.height)
  	engine.draw.ctx.fill()
  	
  	gui.drawPowerBar()
  	gui.drawText("Level: ", "white", gui.level, "15px Arial", gui.levelText)
  	gui.drawText("Score: ", "white", gui.score, "15px Arial", gui.scoreText)
  	
	if (modules.player.isSpaceshipExploded == false) modules.player.draw()
	
	modules.shot.draw()
	modules.animatedSprite.draw((new Date()).getTime())
	modules.meteor.draw()

	if (gameState.state.stopped == false) {
		modules.player.move()
		modules.shot.move()
		modules.meteor.move()
	}
	
	if (util.boxClicked(engine.mouse.x, engine.mouse.y, 
		gui.button.x, gui.button.y,
		gui.button.width, gui.button.height)) 
	{
		engine.mouse.x = 0
		engine.mouse.y = 0
		gameState.state.playing = true
	}
	
	if (engine.key.isKeyPressed("ArrowLeft")) {
		modules.player.angle = modules.player.angle - gameDefinitions.constants.deltaAngle
	}

	if (engine.key.isKeyPressed("ArrowRight")) {
		modules.player.angle = modules.player.angle + gameDefinitions.constants.deltaAngle
	}
		
	if (engine.key.isKeyPressed("ArrowUp")) {
		modules.player.changeVelocity(gameDefinitions.constants.deltaVelocity)
	}

	if (engine.key.isKeyPressed("ArrowDown")) {
		modules.player.changeVelocity(-2 * gameDefinitions.constants.deltaVelocity)
	}

	if (engine.key.isKeyPressed("KeyP") && ((engine.clock.currentTime - engine.clock.pastTime) >= engine.clock.deltaTime)) {
		if (gameState.situation.win == false && gameState.situation.lose == false) {
			if (gameState.state.stopped == true) {
				gameState.state.stopped = false
			}
			else {
				gameState.state.stopped = true
			}
		}
   		engine.clock.pastTime = (new Date()).getTime()
	}

	if (engine.key.isKeyPressed("Space") && (engine.clock.currentTime - engine.clock.pastTime) >= engine.clock.deltaTime) {
		var s = [{ vPosition : { x: modules.player.vPosition.x, y: modules.player.vPosition.y }, angle: modules.player.angle, angularVelocity: gameDefinitions.constants.angularVelocity }]
		modules.shot.vShot = modules.shot.vShot.concat(s)
		engine.sound.playAudioByName("spaceship-shot")
   		engine.clock.pastTime = (new Date()).getTime()
	}
  	
	testCollisions()

	refreshGameConditions()
	
	requestAnimationFrame(main)
}

function refreshGameConditions() {

	if (modules.meteor.vMeteor.length == 0) {
		gameState.situation.win = true
	}
	
	if (modules.player.power <= 0) {
		gameState.situation.lose = true
		if (modules.player.isSpaceshipExploded == false) modules.player.explodeSpaceship()
	}

	if (gameState.situation.lose == true || gameState.situation.win == true) {
		gameState.state.ended = true
	}

	if (gameState.situation.lose == false && gameState.situation.win == false) {
		gameState.state.playing = true
	}
	
	if (gameState.state.playing == true) {

		if (gameState.situation.lose == true) {
			gui.score = 0
			modules.meteor.vMeteor.forEach(
				function (item, index) {
					modules.meteor.vMeteor = modules.meteor.vMeteor.splice(index, 1)
				}
			)
			modules.player.init()
			modules.player.power = 100
			modules.meteor.populateWithMeteors()
			gameDefinitions.isBackgroundSoundStarted = false
		}

		if (gameState.situation.win == true) {
			gui.level = gui.level + 1
			modules.meteor.vMeteor.forEach(
				function (item, index) {
					modules.meteor.vMeteor = modules.meteor.vMeteor.splice(index, 1)
				}
			)
			modules.meteor.numberOfMeteors = modules.meteor.numberOfMeteors + 10
			modules.meteor.populateWithMeteors()
		}
		gameState.situation.lose = false
		gameState.situation.win = false
		gameState.state.playing = false
	}
	
	if (gameState.state.ended == true) {
		if (gameState.situation.win == true) { 
		  	gui.drawText("You win", "white", "", "30px Arial", gui.text)
			gui.drawButton("Next level", 5)
		}
		if (gameState.situation.lose == true) {
			gui.drawText("You lose", "white", "", "30px Arial", gui.text)
			gui.drawButton("Restart", 13)
		}
		gameState.state.ended = false
	}
	
	if (gameState.state.stopped == true) {
		if (gameState.situation.win == false && gameState.situation.lose == false) {
			gui.drawText("Paused", "white", "", "30px Arial", gui.paused)
		}
		gameState.state.stopped = false
	}
}

function testCollisions() {
	
	var radiusSM = 0.61 * (modules.shot.scale + modules.meteor.scale) * (modules.shot.radius + modules.meteor.radius);
	var radiusPM = 0.61 * (modules.player.scale + modules.meteor.scale) * (modules.player.radius + modules.meteor.radius);

	modules.shot.vShot.forEach(
		function(itemShot, indexShot) { 
			modules.meteor.vMeteor.forEach(
				function(itemMeteor, indexMeteor) {
					if (engine.util.contains(itemShot, itemMeteor, radiusSM)) 
					{
						engine.sound.playAudioByName("meteor-explosion")
						modules.animatedSprite.setAnimation(itemMeteor)
						modules.meteor.vMeteor.splice(indexMeteor, 1)
						modules.shot.vShot.splice(indexShot, 1)
						gui.score = gui.score + 10
					}
				}
			)
		}
	)
	
	modules.meteor.vMeteor.forEach(
		function(item, index) {
			if (engine.util.contains(modules.player, item, radiusPM)) 
			{
				modules.player.power = modules.player.power - 25;
				engine.sound.playAudioByName("spaceship-meteor-impact")
				modules.animatedSprite.setAnimation(item)
				modules.meteor.vMeteor.splice(index, 1)
			}
		}
	) 

}

window.onload 
{
	engine.key.setKeyListeners()
	engine.mouse.setMouseListeners()
	engine.resources.loadResources(engine.resources.areResourcesPrepared)
	modules.shot.init()
	modules.meteor.init()
	modules.meteor.populateWithMeteors()
}