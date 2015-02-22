// Declare all constants here so they'll be declared first and be usable in all files

// Globals
var canvas = $('#gamecanvas')[0],
context = canvas.getContext("2d"),

// jewel constants

// engine constants
NUM_ROWS = 8,
NUM_COLS = 8,
SCORE_HEIGHT = 20,
SCORE_MAX_WIDTH = 120,
// GAME_CANVAS_WIDTH = (NUM_COLS * JEWEL_SINGLE_WIDTH),
// GAME_CANVAS_HEIGHT = (NUM_ROWS * (JEWEL_SHEET_HEIGHT + VERTICAL_PADDING) + SCORE_HEIGHT  + VERTICAL_PADDING),
GAME_CANVAS_HEIGHT = 400,
GAME_CANVAS_WIDTH = 300,
BACK_BUTTON_WIDTH = 50,

JEWEL_SHEET_WIDTH = 256,
JEWEL_SHEET_HEIGHT = 32,
JEWEL_SHEET_FRAMES = 8,
JEWEL_SINGLE_WIDTH = (JEWEL_SHEET_WIDTH / JEWEL_SHEET_FRAMES),
VERTICAL_PADDING = 8,
CANVAS_X_OFFSET = (GAME_CANVAS_WIDTH - (JEWEL_SINGLE_WIDTH * NUM_COLS)) / 2,
CANVAS_Y_OFFSET = (GAME_CANVAS_HEIGHT - (JEWEL_SHEET_HEIGHT * NUM_ROWS)) / 2 - 40,
COLORS = ["blue", "green", "grey", "orange", "pink", "yellow"],

// menu constants
START_BUTTON_WIDTH = 60,
HIGH_SCORE_HEIGHT = 20,
TITLE_TEXT = 'Jewel Clicker',
MENU_CANVAS_HEIGHT = 300,
MENU_CANVAS_WIDTH = 200;

// Helper functions

// Create a 2 dimensional array
function createArray(length) {
    var arr = new Array(length || 0),
    i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

// Return a rectangular Path2D witih the given dimensions and location
function makePath(x, y, width, height){
    var newPath = new Path2D();
    newPath.rect(x, y, width, height);
    return newPath;
}

// Delete everything in an array
function emptyArray(array){
    array.splice(0, array.length);
}