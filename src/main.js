var gui = {
	powerBar : { vPosition : { x1: 0, y1: 0, x2: canvas.width, y2: 10 }},
	'draw' : function() 
	{ 
		engine.draw.ctx.fillStyle = "red";
    	engine.draw.ctx.fillRect(
			gui.powerBar.vPosition.x1, 
  			gui.powerBar.vPosition.y1, 
  			(modules.player.power / 100) * gui.powerBar.vPosition.x2, 
  			gui.powerBar.vPosition.y2
  		);
  		engine.draw.ctx.fill();	
	},
	'youWin' : function() {
		engine.draw.ctx.fillStyle = "white";
		engine.draw.ctx.font = "30px Arial";
		engine.draw.ctx.fillText("You win", canvas.width * 0.5 - 30, canvas.height * 0.5 - 5); 		
	},
	'youLose' : function() {
		engine.draw.ctx.fillStyle = "white";
		engine.draw.ctx.font = "30px Arial";
		engine.draw.ctx.fillText("You lose", canvas.width * 0.5 - 30, canvas.height * 0.5 - 5); 		
	}
}

var gameState = {
	'state' : {playing : true, stoped : false, ended : false} ,
  	'situation' : {win : false, lose : false} ,
};

var deltaTime = 100;
var deltaAngle = 0.025;
var deltaVelocity = 0.02;
var pastTime = (new Date()).getTime();
var isBackgroundSoundStarted = false;
var spaceshipExploded = false;

function main() {

	currentTime = (new Date()).getTime();
	
	if (isBackgroundSoundStarted == false) 
	{
		engine.sound.playAudioByName("ground-hard");
		isBackgroundSoundStarted = true;	
	} 
	
	engine.draw.ctx.fillStyle = "black";
  	engine.draw.ctx.fillRect(0, 0, canvas.width, canvas.height);
  	engine.draw.ctx.fill(); 
  	
  	gui.draw();
  	
	modules.player.draw();
	modules.shot.draw();
	modules.animatedSprite.draw((new Date()).getTime());
	modules.meteor.draw();

	modules.player.move();
	modules.shot.move();
	modules.meteor.move();
	
	if (engine.key.isKeyPressed("ArrowLeft")) {
		modules.player.angle = modules.player.angle - deltaAngle;
	}

	if (engine.key.isKeyPressed("ArrowRight")) {
		modules.player.angle = modules.player.angle + deltaAngle;
	}
		
	if (engine.key.isKeyPressed("ArrowUp")) {
		modules.player.changeVelocity(deltaVelocity);
	}

	if (engine.key.isKeyPressed("ArrowDown")) {
		modules.player.changeVelocity(-2 * deltaVelocity);
	}

	if (engine.key.isKeyPressed("Space") && (currentTime - pastTime) >= deltaTime) {
		var s = [{ vPosition : { x: modules.player.vPosition.x, y: modules.player.vPosition.y }, angle: modules.player.angle, angularVelocity: 0.25 }];
		modules.shot.vShot = modules.shot.vShot.concat(s);
		engine.sound.playAudioByName("spaceship-shot");
   		pastTime = (new Date()).getTime();
	}
  	
	testCollisions();

	refreshGameConditions();
	
	requestAnimationFrame(main);
}

function refreshGameConditions() {

	if (modules.meteor.vMeteor.length == 0) {
		gameState.situation.win = true;
	}
	
	if (modules.player.power <= 0) {
		gameState.situation.lose = true;
	}

	if (gameState.situation.win == true) gui.youWin()

	if (gameState.situation.lose == true) {  	
	  	gui.youLose();
	
	    if (spaceshipExploded == false) {
	    	modules.player.explodeSpaceship();
			spaceshipExploded = true;
		}
		
		if (spaceshipExploded == true) {
			modules.player.velocity = 0;
			modules.player.vVelocity.x = 0;
			modules.player.vVelocity.y = 0;
			modules.player.vPosition.x = -2 * canvas.width;
			modules.player.vPosition.y = -2 * canvas.height;
		}
		
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
	engine.key.setKeyListeners();
	modules.meteor.populateWithMeteors();
	engine.resources.loadResources(engine.resources.areResourcesPrepared);
}