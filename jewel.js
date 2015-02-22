
// Create a new Jewel. If no color is given, pick one at random.
function Jewel (x, y, color=randomColor() ){
	var that = this;
	// Position
	this.x = x;
	this.y = y;
	this.xOffset = (JEWEL_SHEET_WIDTH / JEWEL_SHEET_FRAMES) * this.x,
	this.yOffset = (JEWEL_SHEET_HEIGHT + VERTICAL_PADDING) * this.y;
	this.path = makePath(this.xOffset, this.yOffset, (JEWEL_SHEET_WIDTH / JEWEL_SHEET_FRAMES), JEWEL_SHEET_HEIGHT);
	this.id = this.getID();
	// the full width of the sheet, not one sprite
	this.width = JEWEL_SHEET_WIDTH;
	this.height = JEWEL_SHEET_HEIGHT;
	this.xOffset = (JEWEL_SINGLE_WIDTH * this.x) + CANVAS_X_OFFSET;
	this.yOffset = ((JEWEL_SHEET_HEIGHT + VERTICAL_PADDING) * this.y) + CANVAS_Y_OFFSET;
	// Animation
	this.frameIndex = 0;
	this.tickCount = 0;
	this.ticksPerFrame = 20;
	this.numberOfFrames = JEWEL_SHEET_FRAMES;
	// Appearance
	this.color = color;
	this.image = makeImage(this.color);
	this.isSolid = false;
	this.isSpinning = true;
	this.deleted = false;
}

Jewel.prototype.getID = function() {
	return this.x + '-' + this.y;
};

Jewel.prototype.clear = function () {
	context.clearRect(this.xOffset, this.yOffset, JEWEL_SINGLE_WIDTH, JEWEL_SHEET_HEIGHT);
}

Jewel.prototype.freeze = function () {
	this.isSpinning = false;
	this.frameIndex = 0;
}

Jewel.prototype.changeColor = function () {
	var newColor;
	// loop until it gets a new color
	while ((newColor = randomColor()) === this.color);
	this.color = newColor;
	var newImage = makeImage(this.color);
	this.image = newImage;
};

Jewel.prototype.render = function () {
	if (this.isSpinning)
		this.update();
	// Clear it and make it transparent
	if(!this.isSolid){
		this.clear();
		context.save()
		context.globalAlpha = 0.9;
	}
	// Draw the frame
	context.drawImage( this.image,
		// Source x, y, width, height
		this.frameIndex * (this.width / this.numberOfFrames),
		0,
		this.width / this.numberOfFrames,
		this.height,
		// Destination x, y, width, height
		this.xOffset,
		this.yOffset,
		this.width / this.numberOfFrames,
		this.height
	);
	if(!this.isSolid){
		context.restore();
	}
};

Jewel.prototype.update = function () {
	this.tickCount += 1;
	if (this.tickCount > this.ticksPerFrame) {
		this.tickCount = 0;
		if (this.frameIndex < this.numberOfFrames - 1) {  
			// Go to the next frame
			this.frameIndex += 1;
			}
			// If the animation should loop, go back to the first frame
		else{
		this.frameIndex = 0;
		}
	}
};

function makeImage(color){
	var newImage = new Image();
    newImage.src = "img/jewels/" + color + ".png";
    return newImage;
}

function randomColor(){
    var rand = COLORS[Math.floor(Math.random() * COLORS.length)];
    return rand;
}

// Return the group of jewels, including this one, by searching recursively
// A jewel is in the group if it is next to a jewel in this group, and is the same color.
function getJewelGroup(jewel){
	var jewelGroup = [];
	getGroup(jewel, jewelGroup);
	return jewelGroup;
}

// Second parameter is an array to store the results of the recursive function in.
function getGroup(current, jewelGroup){
	if (!isInArray(current, jewelGroup))
		jewelGroup.push(current);
	// If it's already in the group, we've checked this one already
	else
		return;
	if (current.y > 0){
		var up = jewels[current.x][current.y - 1];
		if (current.color === up.color){
			getGroup(up, jewelGroup);
		}
	}
	if (current.y < (NUM_ROWS - 1)){
		var down = jewels[current.x][current.y + 1];
		if (current.color === down.color){
			getGroup(down, jewelGroup);
		}
	}
	if (current.x > 0){
		var left = jewels[current.x - 1][current.y];
		if (current.color === left.color){
			getGroup(left, jewelGroup);
		}
	}
	if (current.x < (NUM_COLS - 1)){
		var right = jewels[current.x + 1][current.y];
		if (current.color === right.color){
			getGroup(right, jewelGroup);
		}
	}
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}