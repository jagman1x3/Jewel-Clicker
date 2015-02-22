var menuButtons = [];

$(initBackground);

// Set up the background on a separate canvas so it doesn't have to be redrawn.
// This also lets clearRect be used without clearing the background on the main canvas
function initBackground(){	
	var img = new Image();
	img.src = 'img/bgtile.png';
	img.onload = function(){
	    drawBackground(img);
	}

}

function initMenu(){
	drawMenu();
	// jQuery event doesn't work for some reason
	canvas.onclick = menuOnClick;
	canvas.onmousemove = menuOnMouseMove;

}

function drawBackground(bgimg){
	var bgCanvas = $('#bgcanvas')[0],
	bgctx = bgCanvas.getContext('2d');
	bgCanvas.width = GAME_CANVAS_WIDTH;
	bgCanvas.height = GAME_CANVAS_HEIGHT;
    var pattern = bgctx.createPattern(bgimg, 'repeat');
    bgctx.fillStyle = pattern;
	bgctx.fillRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);
	canvas.width = GAME_CANVAS_WIDTH;
	canvas.height = GAME_CANVAS_HEIGHT;
	
	initMenu();
}

function drawMenu(){
	context.clearRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);
	makeStartButton();
	makeHighScoreButton();
	menuButtons.forEach(function (button){
		button.draw();
	})
	displayTitleText();
}

function startGame(){
	// Remove the buttons so they don't stay and start multiple games the next time
	emptyArray(menuButtons);
	setTimeout(initGame, 200);
	console.log('starting game');
}

function displayHighScores(){
	emptyArray(menuButtons);
	setTimeout(initHighScores, 200);
}

function menuOnClick(e){
	if (e.region){
		// get the button that was clicked
		var clickedButton;
		// Use a normal for loop so it can be broken out of
		for (var i = menuButtons.length - 1; i >= 0; i--) {
			if (menuButtons[i].name === e.region){
				clickedButton = menuButtons[i];
				clickedButton.color = clickedButton.clickedColor;
				clickedButton.draw();
				clickedButton.onClickEvent();
				break;
			}
		};
	}
}

// Stroke the button that the mouse is over
function menuOnMouseMove(e){
	var mouseoverButton;
	if (e.region){
		for (var i = menuButtons.length - 1; i >= 0; i--) {
			if (menuButtons[i].name === e.region){
				mouseoverButton = menuButtons[i];
				context.lineWidth = 1;
				context.strokeStyle = 'black';
				context.stroke(mouseoverButton.path);
				break;
			}
		};
	}
	menuButtons.forEach(function (button){
		if (button !== mouseoverButton)
			button.draw();
	})
}



function displayTitleText(){
	var fontSize = 50,
	line1 = 'JEWEL',
	line2 = 'CLICKER';
	// Use save and restore so future draws won't have the line dash
	context.save();
	context.setLineDash([5]);
	context.font = fontSize + 'px Impact';
	context.fillStyle = '#CC0033';
	context.strokeStyle = 'black';
	context.lineWidth = 1;
	var textWidth = context.measureText(line1).width,
	textX = (canvas.width / 2) - (textWidth / 2),
	textY = 75;
	context.fillText(line1, textX, textY);
	context.strokeText(line1, textX, textY);
	// Line 2
	textY += fontSize + 10;
	textWidth = context.measureText(line2).width;
	textX = (canvas.width / 2) - (textWidth / 2),
	context.fillStyle = '#CC0066';
	context.fillText(line2, textX, textY);
	context.strokeText(line2, textX, textY);
	context.restore();
}

function makeStartButton(){
	var startButton = new MenuButton({
		name : 'startButton',
		text : 'Start!',
		color : 'yellow',
		clickedColor : 'red',
		strokeColor : 'green',
		x : (canvas.width / 2) - 50,
		y : (canvas.height / 2) + 5,
		onClickEvent : startGame
	});
	menuButtons.push(startButton);
}

function makeHighScoreButton(){
	var highScoreButton = new MenuButton({
		name : 'highScoreButton',
		text : 'High',
		text2 : 'Scores',
		color : 'green',
		clickedColor : 'blue',
		strokeColor : 'orange',
		x : (canvas.width / 2) - 50,
		y : (canvas.height / 2) + 80,
		onClickEvent : displayHighScores
	});
	menuButtons.push(highScoreButton);
}

function makeBackToMenuButton(){
    backButton = new MenuButton({
    	name : 'backButton',
        text : 'Menu',
        color : 'yellow',
        clickedColor : 'red',
        strokeColor : 'green',
        fontSize : 10,
        width : BACK_BUTTON_WIDTH,
        height : SCORE_HEIGHT,
        // Put it at the bottom right corner, to the right of the score
        x : canvas.width - BACK_BUTTON_WIDTH - 5,
        y : canvas.height - 25,
        onClickEvent : function (){
            this.color = this.clickedColor;
            this.draw();
            setTimeout('endGame(false)', 200);
        }
    });
    backButton.draw();
}


// Create a menu button, and assign its click event
function MenuButton(options){
	this.name = options.name;
	// dimensions
	this.width = options.width || 100;
	this.height = options.height || 50;
	this.x = options.x;
	this.y = options.y;
	this.path = makePath(this.x, this.y, this.width, this.height);
	// appearance
	this.text = options.text;
	this.text2 = options.text2 || '';
	this.font = options.font || 'Verdana';
	this.fontSize = options.fontSize || 20;
	this.color = options.color;
	this.clickedColor = options.clickedColor;
	this.strokeColor = options.strokeColor;
	this.strokeWidth = options.strokeWidth || 4;
	// behavior
	this.onClickEvent = options.onClickEvent;
	// Can't add a region with a path yet, so recreate the path
	context.beginPath();
	context.rect(this.x, this.y, this.width, this.height);
	context.addHitRegion({
		'id' : this.name,
	});

}

MenuButton.prototype.draw = function () {
	var textX, textY, text2X, text2Y, textWidth, text2Width;

	// Set the colors
	context.fillStyle = this.color;
	context.strokeStyle = this.strokeColor;
	context.lineWidth = this.strokeWidth;
	// Draw the button
	context.stroke(this.path);
	context.fill(this.path);
	// Set the text styling
	context.font = this.fontSize + 'px ' + this.font;
	context.fillStyle = 'black';
	// Center the text horizontally
	textWidth = context.measureText(this.text).width;
	textX = this.x + (this.width / 2) - (textWidth / 2);
	// Center the text vertically and draw it
	// For one line of text
	if (this.text2 === ''){
		textY = this.y + (this.height / 2) + (this.fontSize / 2),
		context.fillText(this.text, textX, textY);
	}
	// Two lines
	else {
		textY = this.y + (this.height / 2);
		text2Y = this.y + (this.height / 2) + this.fontSize;
		text2Width = context.measureText(this.text2).width;
		text2X = this.x + (this.width / 2) - (text2Width / 2);
		context.fillText(this.text, textX, textY);
		context.fillText(this.text2, text2X, text2Y);
	}
};