var gui = {
	powerBar : { vPosition : { x1: 0, y1: 0, x2: canvas.width, y2: 10 }},
	'draw' : function() 
	{ 
		engine.draw.ctx.fillStyle = "red";
    	engine.draw.ctx.fillRect(
			gui.powerBar.vPosition.x1, 
  			gui.powerBar.vPosition.y1, 
  			(classes.player.power / 100) * gui.powerBar.vPosition.x2, 
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
  	
	classes.player.draw();
	classes.shot.draw();
	classes.animatedSprite.draw((new Date()).getTime());
	classes.meteor.draw();

	classes.player.move();
	classes.shot.move();
	classes.meteor.move();
	
	if (engine.key.isKeyPressed("ArrowLeft")) {
		classes.player.angle = classes.player.angle - deltaAngle;
	}

	if (engine.key.isKeyPressed("ArrowRight")) {
		classes.player.angle = classes.player.angle + deltaAngle;
	}
		
	if (engine.key.isKeyPressed("ArrowUp")) {
		classes.player.changeVelocity(deltaVelocity);
	}

	if (engine.key.isKeyPressed("ArrowDown")) {
		classes.player.changeVelocity(-2 * deltaVelocity);
	}

	if (engine.key.isKeyPressed("Space") && (currentTime - pastTime) >= deltaTime) {
		var s = [{ vPosition : { x: classes.player.vPosition.x, y: classes.player.vPosition.y }, angle: classes.player.angle, angularVelocity: 0.25 }];
		classes.shot.shot = classes.shot.shot.concat(s);
		engine.sound.playAudioByName("spaceship-shot");
   		pastTime = (new Date()).getTime();
	}
  	
	testCollisions();

	refreshGameConditions();
	
	requestAnimationFrame(main);
}

function refreshGameConditions() {

	if (classes.meteor.meteor.length == 0) {
		gameState.situation.win = true;
	}
	
	if (classes.player.power <= 0) {
		gameState.situation.lose = true;
	}

	if (gameState.situation.win == true) gui.youWin();

	if (gameState.situation.lose == true) {  	
	  	gui.youLose();
	
	    if (spaceshipExploded == false) {
	    	classes.player.explodeSpaceship();
			spaceshipExploded = true;
		}
		
		if (spaceshipExploded == true) {
			classes.player.velocity = 0;
			classes.player.vVelocity.x = 0;
			classes.player.vVelocity.y = 0;
			classes.player.vPosition.x = -2 * canvas.width;
			classes.player.vPosition.y = -2 * canvas.height;
		}
		
	}	

}

function testCollisions() {
	
	var radiusSM = 0.61 * (classes.shot.scale + classes.meteor.scale) * (classes.shot.radius + classes.meteor.radius);
	var radiusPM = 0.61 * (classes.player.scale + classes.meteor.scale) * (classes.player.radius + classes.meteor.radius);

	classes.shot.shot.forEach(
		function(itemShot, indexShot) { 
			classes.meteor.meteor.forEach(
				function(itemMeteor, indexMeteor) {
					if (engine.util.contains(itemShot, itemMeteor, radiusSM)) 
					{
						engine.sound.playAudioByName("meteor-explosion")
						classes.animatedSprite.setAnimation(itemMeteor)
						classes.meteor.meteor.splice(indexMeteor, 1)
						classes.shot.shot.splice(indexShot, 1)		
					}
				}
			)
		}
	)
	
	classes.meteor.meteor.forEach(
		function(item, index) {
			if (engine.util.contains(classes.player, item, radiusPM)) 
			{
				classes.player.power = classes.player.power - 25;
				engine.sound.playAudioByName("spaceship-meteor-impact")
				classes.animatedSprite.setAnimation(item)
				classes.meteor.meteor.splice(index, 1)
			}
		}
	) 

}

window.onload 
{
	engine.key.setKeyListeners();
	classes.meteor.populateWithMeteors();
	engine.resources.loadResources(engine.resources.areResourcesPrepared);
}