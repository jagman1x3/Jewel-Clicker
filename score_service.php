<?php

$method = $_SERVER['REQUEST_METHOD'];

switch ($method){
	case 'GET':
	get_scores();
	break;

	case 'POST':
	$name = htmlspecialchars($_POST['name']);
	$score = (int) $_POST['score'];
	add_score($name, $score);
	break;

	default:
	break;
}

// Send the scores back as json
function get_scores(){
	$score_file = file_get_contents('highscores.json');
	print($score_file);
}	

// Figure out what position the score should be, and add it there
function add_score($new_name, $new_score){
	$scores = json_decode(file_get_contents('highscores.json'), true);
	$i = 0;
	foreach ($scores as $highScore) {
		$score = (int) $highScore['score'];
		// Start by comparing to the highest score and work down.
		// Go on to the next score to compare it to and keep track of where we are
		if ($new_score < $score){
			$i++;
		}
	}
	$new_score_array = array(array("name" => $new_name, "score" => $new_score));
	array_splice($scores, $i, 0, $new_score_array);
	// Limit it to top ten scores in the javascript file
	// $scores = array_slice($scores, 0, 10);
	file_put_contents('highscores.json', json_encode($scores));

}

// Create a file of dummy scores to set it up
function create_scores(){
	$scores = array(
				array("name" => "Jordan", "score" => 1000000),
				array("name" => "Donyatsu", "score" => 900000),
				array("name" => "Baum", "score" => 850000)
				);
	file_put_contents('highscores.json',  json_encode($scores));
}

// create_scores();
// add_score("Ronya", 890000);
// add_score("Bagel", 880000);