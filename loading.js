// Taken from http://mag.splashnology.com/article/how-to-create-a-progress-bar-with-html5-canvas/478/
// and slightly modified - the visual effects would take much too long to program by hand

// $(initLoading);

// Define the size and position of indicator
var i = 0,
res = 0,
total_width = 300,
total_height = 34,
initial_x = (GAME_CANVAS_WIDTH/2) - (total_width/2),	
initial_y = (GAME_CANVAS_HEIGHT/2) - (total_height/2),
radius = total_height/2;
 
function initLoading() {

	canvas.width = GAME_CANVAS_WIDTH;
	canvas.height = GAME_CANVAS_HEIGHT;
 
    // Text’s font of the progress
    context.font = "16px Verdana";
 
    // Gradient of the progress
    var progress_lingrad = context.createLinearGradient(0,initial_y+total_height,0,0);
    progress_lingrad.addColorStop(0, '#4DA4F3');
    progress_lingrad.addColorStop(0.4, '#ADD9FF');
    progress_lingrad.addColorStop(1, '#9ED1FF');
    context.fillStyle = progress_lingrad;
 
    // Create the animation
    res = setInterval(draw, 10);
}
 
function draw() {
    // augment the length on 1 for every iteration
    i+=1;
 
    // Clear the layer
    context.clearRect(initial_x-5,initial_y-5,total_width+15,total_height+15);
    progressLayerRect(context, initial_x, initial_y, total_width, total_height, radius);
    progressBarRect(context, initial_x, initial_y, i, total_height, radius, total_width);
    progressText(context, initial_x, initial_y, i, total_height, radius, total_width );
    // stop the animation and load the menu when it reaches 100%
    if (i>=total_width) {
        clearInterval(res);
        setTimeout(initMenu, 200);
    }
}
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arc(x+width-radius, y+radius, radius, -Math.PI/2, Math.PI/2, false);
    ctx.lineTo(x + radius, y + height);
    ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
    ctx.closePath();
    ctx.fill();
}

function progressLayerRect(ctx, x, y, width, height, radius) {
    ctx.save();
    // Define the shadows
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#666';
 
     // first grey layer
    ctx.fillStyle = 'rgba(189,189,189,1)';
    roundRect(ctx, x, y, width, height, radius);
 
    // second layer with gradient
    // remove the shadow
    ctx.shadowColor = 'rgba(0,0,0,0)';
    var lingrad = ctx.createLinearGradient(0,y+height,0,0);
    lingrad.addColorStop(0, 'rgba(255,255,255, 0.1)');
    lingrad.addColorStop(0.4, 'rgba(255,255,255, 0.7)');
    lingrad.addColorStop(1, 'rgba(255,255,255,0.4)');
    ctx.fillStyle = lingrad;
    roundRect(ctx, x, y, width, height, radius);
 
    ctx.restore();
}

function progressBarRect(ctx, x, y, width, height, radius, max) {
    // deplacement for chord drawing
    var offset = 0;
    ctx.beginPath();
    if (width<radius) {
        offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius-width),2));
        // Left angle
        var left_angle = Math.acos((radius - width) / radius);
        ctx.moveTo(x + width, y+offset);
        ctx.lineTo(x + width, y+height-offset);
        ctx.arc(x + radius, y + radius, radius, Math.PI - left_angle, Math.PI + left_angle, false);
    }
    else if (width+radius>max) {
        offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius - (max-width)),2));
        // Right angle
        var right_angle = Math.acos((radius - (max-width)) / radius);
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width, y);
        ctx.arc(x+max-radius, y + radius, radius, -Math.PI/2, -right_angle, false);
        ctx.lineTo(x + width, y+height-offset);
        ctx.arc(x+max-radius, y + radius, radius, right_angle, Math.PI/2, false);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
    }
    else {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
    }
    ctx.closePath();
    ctx.fill();
 
    // shadow on the right
    if (width<max-1) {
        ctx.save();
        ctx.shadowOffsetX = 1;
        ctx.shadowBlur = 1;
        ctx.shadowColor = '#666';
        if (width+radius>max)
            offset = offset+1;
        ctx.fillRect(x+width,y+offset,1,total_height-offset*2);
        ctx.restore();
    }
}

function progressText(ctx, x, y, width, height, radius, max) {
    ctx.save();
    ctx.fillStyle = 'white';
    var text = Math.floor(width/max*100)+"%";
    var text_width = ctx.measureText(text).width;
    var text_x = x+width-text_width-radius/2;
    if (width<=radius+text_width) {
        text_x = x+radius/2;
    }
    ctx.fillText(text, text_x, y+22);
    ctx.restore();
}

