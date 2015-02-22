var backButton, jewels, 
score = 0,
biggestGroupSize = 1,
inGame = false,
// To reconstruct the biggest group
jewelInBiggestGroup,
// So the score isn't wasting resources every frame
updateScore = true;

function initGame() {
	console.log('Game started');
	score = 0;
	context.clearRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);
	// Reset all the jewels so they aren't still there
	jewels = createArray(NUM_ROWS, NUM_COLS);
	for (i = 0; i < NUM_ROWS; i++){
		for (j = 0; j < NUM_COLS; j++){
			// Reverse the order so it follows normal coordinates
			addJewel(j, i);
		}
	}
	canvas.onclick = gameOnClick;
	canvas.onmousemove = gameOnMouseMove;
	makeBackToMenuButton();
	inGame = true;
	updateScore = true;
	gameLoop();
}

function gameLoop() {
	if (inGame){
		// Loop this method
		window.requestAnimationFrame(gameLoop);
		jewels.forEach(function (col){
			col.forEach(function (jewel){
				if (!jewel.deleted)
					jewel.render();
			}); 
		});
	}
	if(updateScore)
		displayScore();
}

// Stop drawing and exit, either to scores (with save) or menu
function endGame(toSave){
	inGame = false;
	if (jewels)
		emptyArray(jewels);
	if (toSave){
		displayScorePrompt(score);
	}
	else{
		score = 0;
		initMenu();       
	}
}

// Finds which jewel in the array was clicked and changes its color (make it do something else later)
function gameOnClick (e){
	if (e.region){
		// if it's a jewel, it'll have a - in the id
		if (e.region.indexOf('-') !== -1){
			var clickedJewel = getJewelByID(e.region);
			if (clickedJewel.isSpinning){
				// Change its color, and if it's now in a group, freeze it.
				clickedJewel.changeColor();
				var group = getJewelGroup(clickedJewel);
				if (group.length > 1){
					group.forEach(function (clickedJewel){
						clickedJewel.freeze();
					});
				}
				// If this is now the biggest group, update the score
				if (group.length > biggestGroupSize){
					biggestGroupSize = group.length;
					score = biggestGroupSize * 1000;
					updateScore = true;
					// If there is a previous biggest, make it not solid
					if (jewelInBiggestGroup){
						previousBiggestGroup = getJewelGroup(jewelInBiggestGroup);
						previousBiggestGroup.forEach(function (clickedJewel){
							clickedJewel.isSolid = false;
							clickedJewel.isInBiggestGroup = false;
						});
					}
					// Make the new biggest group solid
					group.forEach(function (clickedJewel){
						clickedJewel.isSolid = true;
						clickedJewel.isInBiggestGroup = true;
					});
					jewelInBiggestGroup = clickedJewel;
				}
			}          
		}
		if (isGameOver()){
			canvas.onmousemove = null;
			canvas.onclick = null;
			deleteJewels();
		}
		else if (e.region === backButton.name)
			backButton.onClickEvent();
	}
}

function gameOnMouseMove(e){
// Make whichever jewel the mouse is over solid
	var onBackButton = false;
	if (e.region){
		if (e.region.indexOf('-') !== -1){
			var mouseOverJewel = getJewelByID(e.region);
			// If it's part of the biggest group, don't do anything
			if (!mouseOverJewel.isInBiggestGroup){
				mouseOverJewel.isSolid = true;
			}
			jewels.forEach(function (col){
				col.forEach(function (jewel){
					if (jewel !== mouseOverJewel && !jewel.isInBiggestGroup)
						jewel.isSolid = false;
					});
			});
		}
		// Stroke the back button if needed
		else if (e.region === backButton.name){
			onBackButton = true;
			context.lineWidth = 1;
			context.strokeStyle = 'black';
			context.stroke(backButton.path);
		}    
	}
	// If it isn't over a jewel, they should all be transparent except the biggest group.
	else {
		jewels.forEach(function (col){
			col.forEach(function (jewel){
				if (!jewel.isInBiggestGroup)
					jewel.isSolid = false;
			})
		})
	}
	if (!onBackButton)
		backButton.draw();
}

function displayScore(){
	// Clear the score area    
	context.clearRect(5, GAME_CANVAS_HEIGHT - SCORE_HEIGHT, SCORE_MAX_WIDTH, SCORE_HEIGHT);
	context.font = '20px Verdana';
	context.strokeStyle = 'black';
	context.fillStyle = 'white';
	context.strokeText('Score: ' + score, 5, GAME_CANVAS_HEIGHT - 5, SCORE_MAX_WIDTH);
	// fillText has (x, y) at the bottom left of the box, not the top left
	context.fillText('Score: ' + score, 5, GAME_CANVAS_HEIGHT - 5, SCORE_MAX_WIDTH);
	updateScore = false;
}

// Create a jewel and add it to the array
function addJewel(x, y, color){
	var newJewel = new Jewel(x, y, color);
	jewels[x][y] = newJewel;
	// Have to recreate the path
	context.beginPath();
	context.rect(newJewel.xOffset, newJewel.yOffset, JEWEL_SINGLE_WIDTH, JEWEL_SHEET_HEIGHT);
	context.addHitRegion({
		'id' : newJewel.id
	});
}

function getJewelByID (id){
	var idArray = id.split('-'),
	x = idArray[0],
	y = idArray[1];
	return jewels[x][y];
}

// Return true if no more jewels can be clicked, and false otherwise.
function isGameOver(){
	var gameOver = true;
	jewels.forEach(function (row){
		row.forEach(function (jewel){
			// A jewel can still be clicked if it's spinning.
			if (jewel.isSpinning)
				gameOver = false;
		});
	});
	return gameOver;
}

function deleteJewels(){
	var group = getJewelGroup(jewelInBiggestGroup),
	i = 0,
	// Make a new array so they can be done randomly
	toDelete = [];
	jewels.forEach(function (row){
		row.forEach(function (jewel) {
			if (!isInArray(jewel, group)){
				toDelete.push(jewel);
			}
		});
	});
	deleteJewelArray(toDelete);
}

// Randomly delete one jewel at a time with a short delay
function deleteJewelArray(toDelete){
	var randIndex = Math.floor(Math.random() * toDelete.length),
	jewel = toDelete[randIndex];        
	setTimeout(function() {
		jewel.clear();
		jewel.deleted = true;
		// Remove it from the array
		toDelete.splice(randIndex, 1);
		if (toDelete.length > 0)
			deleteJewelArray(toDelete);
		// Call the end method here so it doesn't trigger before the timeouts finish
		else
		   endGame(true);
	}, 150);
}

