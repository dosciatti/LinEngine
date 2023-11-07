var gui = {
	powerBar : { x: 0, y: 0, width: canvas.width, height: 10 },
	score : 0,
	scoreText : { x: canvas.width - 90, y: 30 },
	level : 1,
	levelText : { x: 0, y: 30 },
	text: { x: canvas.width * 0.5 - 40, y: canvas.height * 0.5 - 5 },
	button : { x: canvas.width * 0.5 - 20, y: canvas.height * 0.5 + 20, width: 75, height: 25 },
	gap : { nextLevel : 5, restart : 13 },
	'drawText' : function (text, color, variable, font, variableCoordenates) {
		engine.draw.ctx.fillStyle = color
		engine.draw.ctx.font = font
		engine.draw.ctx.fillText(text + " " + variable, variableCoordenates.x, variableCoordenates.y) 		
	},
	'drawButton' : function (text, gap) {
		engine.draw.ctx.fillStyle = "yellow"
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

var time = (new Date()).getTime()

function main() {
	
	engine.clock.currentTime = (new Date()).getTime()
	
	engine.draw.ctx.fillStyle = "blue";
  	engine.draw.ctx.fillRect(0, 0, canvas.width, canvas.height)
  	engine.draw.ctx.fill()

	//start gui section
	engine.draw.drawImageByName(canvas.width - 100, 30, "heart", 1.6, 0) 
	gui.drawText("", "red", modules.levels.vLevel[modules.levels.actualLevel].vHearts.length, "30px Arial", { x : canvas.width - 70, y : 40 })
	engine.draw.drawImageByName(35, 30, "clock", 0.108, 0) 
	var timeString = (Math.floor(engine.clock.currentTime) - Math.floor(time)).toString()
	gui.drawText("", "white", timeString.substring(0, timeString.length - 3),
	"30px Arial", { x : 75, y : 40 })
	//end gui section
	
	modules.levels.draw()
	modules.clouds.draw()
	modules.plane.draw()
	
	if (gameState.state.stopped == false) {
		modules.clouds.move()
		modules.plane.move()
	}
	
	if (util.boxClicked(engine.mouse.x, engine.mouse.y, 
		gui.button.x, gui.button.y,
		gui.button.width, gui.button.height)) 
	{
		engine.mouse.x = 0
		engine.mouse.y = 0
		if (gameState.state.playing == false) gameState.state.playing = true
		if (gameState.state.stopped == true) gameState.state.stopped = false
	}
	
	//if (engine.key.isKeyPressed("KeyZ")) { modules.plane.increaseBaseAngle() }
	//if (engine.key.isKeyPressed("KeyX")) { modules.plane.decreaseBaseAngle() } 
	if (engine.key.isKeyPressed('ArrowLeft')) { modules.plane.decreaseAngle() }
	if (engine.key.isKeyPressed('ArrowRight')) { modules.plane.increaseAngle() }
	if (engine.key.isKeyPressed('ArrowDown')) { modules.plane.decreaseVelocity() }
	if (engine.key.isKeyPressed('ArrowUp')) { modules.plane.increaseVelocity() }
  	
  	if (engine.key.isKeyPressed("KeyP") && ((engine.clock.currentTime - engine.clock.pastTime) >= engine.clock.deltaTime)) {
		if (gameState.situation.lose == false) {
			gameState.state.stopped = true
		}
   		engine.clock.pastTime = (new Date()).getTime()
	}
	
	testCollisions()
	refreshGameConditions()
	
	requestAnimationFrame(main)
}

function refreshGameConditions() {

	if (modules.levels.vLevel[modules.levels.actualLevel].vHearts.length == 0) {
		modules.levels.actualLevel++ 
		if (modules.levels.actualLevel == 2) {
			gameState.situation.win = true
			modules.levels.actualLevel--
		} else {
			modules.levels.makeLevel(modules.levels.actualLevel)
		}
	}

	//if (modules.meteor.vMeteor.length == 0) {
	//	gameState.situation.win = true
	//}
	
	//if (modules.player.power <= 0) {
	//	gameState.situation.lose = true
	//	if (modules.player.spaceshipExploded == false) modules.player.explodeSpaceship()
	//}

	if (gameState.situation.lose == true || gameState.situation.win == true) {
		gameState.state.ended = true
	}

	if (gameState.situation.lose == false && gameState.situation.win == false) {
		gameState.state.playing = true
	}
	
	if (gameState.state.playing == true) {

		if (gameState.situation.lose == true) {
			//gui.score = 0
			//gui.level = 1
			//modules.player.init()
			//modules.player.power = 100
			//modules.meteor.numberOfMeteors = 10
			//modules.meteor.populateWithMeteors()			
		}

		if (gameState.situation.win == true) {
			//gui.level = gui.level + 1
			//modules.meteor.numberOfMeteors = modules.meteor.numberOfMeteors + 10
			//modules.meteor.populateWithMeteors()
		}
		
		gameState.situation.lose = false
		gameState.situation.win = false
		gameState.state.playing = false
	}
	
	if (gameState.state.ended == true) {
		if (gameState.situation.win == true) { 
		  	gui.drawText("You win", "white", "", "30px Arial", gui.text)
			gui.drawButton("Restart", gui.gap.nextLevel)
		}
		if (gameState.situation.lose == true) {
			gui.drawText("You lose", "white", "", "30px Arial", gui.text)
			gui.drawButton("Restart", gui.gap.restart)
		}
		gameState.state.ended = false
	}
	
	if (gameState.state.stopped == true) {
		if (gameState.situation.win == false && gameState.situation.lose == false) {
			gui.drawText("Paused", "white", "", "30px Arial", gui.paused)
			gui.drawButton("Continue", gui.gap.restart)
		}
		//gameState.state.stopped = false
	}
}

function testCollisions() {
	
	var radius = 0.61 * (modules.levels.hearts.scale + modules.plane.scale) * (modules.levels.hearts.radius + modules.plane.radius);

	modules.levels.vLevel[modules.levels.actualLevel].vHearts.forEach(
		function(itemHeart, indexHeart) { 
			var itemPlane = modules.plane
			if (engine.util.contains(itemHeart, itemPlane, radius)) 
			{
				engine.sound.playAudioByName("pick")
				modules.levels.vLevel[levels.actualLevel].vHearts.splice(indexHeart, 1)
			}
		}
	)
}

window.onload 
{
	engine.key.setKeyListeners()
	engine.mouse.setMouseListeners()
	engine.resources.loadResources(engine.resources.areResourcesPrepared)
	engine.sound.playAudioByName("background")
	
	levels.init()
	plane.init()
	clouds.init()
	
	clouds.populate()
	levels.makeLevel(0)

	requestAnimationFrame(main)
}