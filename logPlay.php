<?php
/*
Here's the data you will be getting in $_POST	


	  whichLine: same idea as the whichLine param for the queue
      songid: 
      djid: 
      djname: 
      starttime: 
      up:
      down: 
      snagged: 
      key: make sure this matches some secret random password that we determine before logging song
      numListeners: numListeners
      numActive: numActive
      score: score
      realScore: realScore
Basic Needs:
Log song into Play table. All the fields should match up to one of the post vars cept for the 'spread'
field which should set as up + down

See if song exists in the Song table (check for matching songid)
If it doesn't exist
	echo 'needSong';
else
	//the song exists in the Song table, no action required


The bot will examine the response, if it sees 'needSong' it will send additional information
to another script (logSong.php, do that next) to save the song metadata
*/
require 'secret.php';

$postVarsRequired = array('whichLine','songid','djid','djname','starttime','up','down','snagged','key'
    , 'numListeners', 'numActive', 'score', 'realScore');
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
if ($db->connect_error) {
    die('db error (' . $db->connect_errno . ') '. $db->connect_error);
}
$db->set_charset("utf8");
$songIDSafe = $db->real_escape_string($in['songid']);
$q = "INSERT INTO play (startTime, songId, djid, djname, up, down, spread, snagged, whichLine, numInRoom, numActive, score, realScore) VALUES (";
$q .= $db->real_escape_string($in['starttime']) . ',';
$q .= '\'' . $songIDSafe . '\',';
$q .= '\'' . $db->real_escape_string($in['djid']) . '\',';
$q .= '\'' . $db->real_escape_string($in['djname']) . '\',';
$q .= $db->real_escape_string($in['up']) . ',';
$q .= $db->real_escape_string($in['down']) . ',';
$q .= $db->real_escape_string($in['up'] - $in['down']) . ',';
$q .= $db->real_escape_string($in['snagged']) . ',';
$q .= $db->real_escape_string($in['whichLine']) . ',';
$q .= $db->real_escape_string($in['numListeners']) . ',';
$q .= $db->real_escape_string($in['numActive']) . ',';
$q .= $db->real_escape_string($in['score']) . ',';
$q .= $db->real_escape_string($in['realScore']);
$q .= ')';
if(!$db->query($q)) {
      printf("Error: %s\n", $db->error);
      die();
}
/* Select queries return a resultset */ 

$songExistsQ = 'SELECT COUNT(*) as cnt FROM song WHERE songId=\'' . $songIDSafe . '\'';
if ($result = $db->query($songExistsQ)) {
    $row = $result->fetch_assoc();
    if($row['cnt'] == 0) {
        echo 'needsong:' . $in['songid'];
    }
    $result->close();
}

?>