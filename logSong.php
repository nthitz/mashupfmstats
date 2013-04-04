<?php
/*
Here's the data you will be getting in $_POST 

album=&genre=Moombah&length=274&song=Zombies%20Ate%20My%20Wonderwall&artist=Le%20Wood&songid=509903b7cf683a5dfe19f6fb&key=test
*/
require 'secret.php';

$postVarsRequired = array('album','genre','length','song','artist','songid','song','key');
$in = array();
$testInput = $_REQUEST;
if($testInput['key'] !== $key) {
      die('key');
}
foreach($postVarsRequired as $postVar) {
      if(!isset($testInput[$postVar])) {
            die('missingdata');
      }
      $in[$postVar] = $testInput[$postVar];
}

dbConnect();
$songIDSafe = $db->real_escape_string($in['songid']);
$q = "INSERT INTO song (songId, title, artist, album, genre, length) VALUES (";
$q .= '\'' . $songIDSafe . '\',';
$q .= '\'' . $db->real_escape_string($in['song']) . '\',';
$q .= '\'' . $db->real_escape_string($in['artist']) . '\',';
$q .= '\'' .$db->real_escape_string($in['album']) . '\',';
$q .= '\'' .$db->real_escape_string($in['genre']) . '\',';
$q .= $db->real_escape_string($in['length']);
$q .= ')';
if(!$db->query($q)) {

      printf("Error: %s\n", $db->error);
      die($q);
}