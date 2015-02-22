var HS_SERVICE = 'js/score_service.php',
HS_CANVAS_WIDTH = 300,
HS_CANVAS_HEIGHT = 400,
HS_PROMPT_CANVAS_HEIGHT = 150,
MAX_NAME_CHARS = 15;


function initHighScores(){
	context.clearRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);
	canvas.onmousemove = hsOnMouseMove;
    canvas.onclick = hsOnClick;
	makeBackToMenuButton();
	displayHighScoreText();
	getScores();
}

// Only need to handle the back button
function hsOnClick (e){
	if (e.region){
		if (e.region === backButton.name){	
		backButton.color = backButton.clickedColor;
		backButton.draw();
		backButton.onClickEvent();
		}
	}
}

function hsOnMouseMove(e){
	if (e.region){
		if (e.region === backButton.name){
			context.lineWidth = 1;
			context.strokeStyle = 'black';
			context.stroke(backButton.path);
		}
	}
	else
		backButton.draw();
}

function addScore(name, score){
	$.post(HS_SERVICE, {'name' : name, 'score' : score})
	.done(function (data){
		// This needs to finish before getScores() is called
		initHighScores();
	});
}

function getScores () {
	console.log('getting scores');
	$.getJSON(HS_SERVICE)
	.done(function (data){
		parseScores(data);
	});
}

function parseScores(data){
	var names = [],
	scores = [],
	i = 0;
	data.forEach(function (highScore){
		names[i] = highScore.name;
		scores[i] = highScore.score;
		i++;
	});
	displayScores(names, scores);	
}

function displayScores(names, scores){
	for (var i = 0; i < 10; i++) {
		var fontSize = 20;
		context.font = fontSize + 'px Verdana';
		context.fillStyle = 'white';
		context.strokeStyle = 'black';
		// First draw the name left-aligned
		var nameX = 7,
		nameY = 175 + (i * fontSize),
		nameText = (i + 1) + '.  ' + names[i] + ':',
		// Have the score be right-aligned
		scoreWidth = context.measureText(scores[i]).width,
		scoreX = HS_CANVAS_WIDTH - scoreWidth - 10;
		context.strokeText(nameText, nameX, nameY, scoreX - 10);
		context.fillText(nameText, nameX, nameY, scoreX - 10);
		context.strokeText(scores[i], scoreX, nameY, HS_CANVAS_WIDTH - scoreX);
		context.fillText(scores[i], scoreX, nameY, HS_CANVAS_WIDTH - scoreX);
	}
}

function displayHighScoreText(){
	var fontSize = 50,
	line1 = 'HIGH',
	line2 = 'SCORES';
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

function displayScorePrompt(score){
	context.clearRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);
	var fontSize = 30;
	context.font = fontSize + 'px Impact';
	context.fillStyle = 'white';
	var textWidth = context.measureText('ENTER YOUR NAME').width,
	textX = (HS_CANVAS_WIDTH / 2) - (textWidth / 2),
	textY = fontSize + 15;
	context.fillText('ENTER YOUR NAME', textX, textY);
	var name = '',
	enterPressed = false;
	// make the cursor appear
	drawName('');
	$(document).keypress(function (e){
		if (!enterPressed && name.length < MAX_NAME_CHARS){
			// enter
			if (e.which == 13){
				e.preventDefault();
				enterPressed = true;
				processScore(name, score);
			}
			// backspace
			else if (e.which == 8){
				e.preventDefault();
				name = name.substring(0, name.length - 1)
				drawName(name);
			}
			// other
			else if (isCharacterKeyPress(e) && !enterPressed){	
				// space
				if (e.which == 0 || e.which == 32)
					e.preventDefault();
				var c = getChar(e);
				name = name + c;
				drawName(name);
			}
		}
	});
}

// Add the score and go to the scores screen
function processScore(name){
	$(document).off('keypress');
	console.log('processing score');
	addScore(name, score);
}

function drawName(name){
	var fontSize = 30;
	context.font = fontSize + 'px Impact';
	var nameWidth = context.measureText(name + '_').width,
	textX = (HS_CANVAS_WIDTH / 2) - (nameWidth / 2),
	textY = (3 * fontSize) + 30;
	// clear the current name
	// Add some padding in case of clearing deleted characters and the _
	context.clearRect(textX - 15, textY - fontSize - 15, nameWidth + 35, fontSize + 35);
	context.fillStyle = 'white';
	context.fillText(name + '_', textX, textY, canvas.width - textX);
}

// Handle other browsers
function getChar(event) {
	if (event.which == null) {
		return String.fromCharCode(event.keyCode) // IE
	} 
	else if (event.which!=0 && event.charCode!=0) {
		return String.fromCharCode(event.which)   // the rest
	}
	else {
		return null // special key
	}
}

function isCharacterKeyPress(evt) {
    if (typeof evt.which == "undefined") {
        // This is IE, which only fires keypress events for printable keys
        return true;
    } else if (typeof evt.which == "number" && evt.which > 0) {
        // In other browsers except old versions of WebKit, evt.which is
        // only greater than zero if the keypress is a printable key.
        // We need to filter out backspace and ctrl/alt/meta key combinations
        return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
    }
    return false;
}