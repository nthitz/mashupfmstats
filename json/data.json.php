<?php
require "../secret.php";

$now = time();
$orderVar = null;
$timeVar = null;
$orderingVar = null;
$viewVar = null;
if(!isset($_GET['order']) || !ctype_alnum($_GET['order'])) {
	die('order');
} else {
	$orderVar = $_GET['order'];
}
if(!isset($_GET['time']) || !ctype_alnum($_GET['time'])) {
	die('time');
} else {
	$timeVar = $_GET['time'];
}
if(!isset($_GET['ordering']) || !ctype_alnum($_GET['ordering'])) {
	die('ordering');
} else {
	$orderingVar = $_GET['ordering'];
}
if(!isset($_GET['view']) || !ctype_alnum($_GET['view'])) {
	die('view');
} else {
	$viewVar = $_GET['view'];
}

$q = 'SELECT ';
$groupBy = null;
switch($viewVar) {
	case "songs":
		$q .= 'song.title, song.artist, ';
		$groupBy = 'play.songid';
		break;
	case "users":
		$q .= 'play.djid, play.djname, ';
		$groupBy = 'play.djid';
		break;
	default:
		die('view');
		break;
}
$count = false;
$avg = false;

switch($orderVar) {
	case 'count':
		$count = true;
		break;
	case 'up':
	case 'down':
	case 'spread':
	case 'snagged':
	case 'realScore':
	case 'score':
		$avg = $orderVar;
		break;
	default:
		die('bad order');
		break;
}
if($count) {
	$q .= 'COUNT(*)';
} else if($avg !== false) {
	$q.= 'AVG('.$avg.')';
}
$q .= ' as cnt';
$q .= ' FROM ';
$whereClause = false;
if($viewVar == 'songs') {
	$q .= 'song,play WHERE play.songid=song.songid';
	$whereClause = true;
} else if($viewVar == 'users') {
	$q .= 'play';
}
$timeLimit = false;
switch($timeVar) {
	case 'all':
		break;
	case 'month':
		$timeLimit = 60 * 60 * 24 * 30;
		break;
	case 'week':
		$timeLimit = 60 * 60 * 24 * 7;
		break;
	case 'day':
		$timeLimit = 60 * 60 * 24;
		break;
	default:
		die('time');
}
if($timeLimit !== false) {
	if(!$whereClause) {
		$whereClause = true;
		$q .= ' WHERE ';
	} else {
		$q .= ' AND ';
	}
	$minStartTime = $now - $timeLimit;
	$q.= 'play.startTime > ' . $minStartTime;
}
$q .= ' GROUP BY '.$groupBy.' ORDER BY cnt ';
$ascending = true;
switch($orderingVar) {
	case 'top':
		$ascending = false;
		break;
	case 'bottom':
		$ascending = true;
		break;
	default:
		die('ordering');
}
$q .= $ascending ? 'ASC' : 'DESC';
$q .= ' LIMIT 50';
dbConnect();
$songs = array();
if ($result = $db->query($q)) {
    while($row = $result->fetch_array(MYSQLI_ASSOC))
	{
		$songs[] = $row;
	}
	echo json_encode($songs);
} else {
	printf("Error: %s\n", $db->error);
	die($q);
}
/*
$lastWeek = $now - 60 * 60 * 24 * 7;
$topSongTypes = array('COUNT(*)', 'AVG(up)','AVG(down)','AVG(spread)','AVG(snagged)','AVG(score)','AVG(realScore)');
$topSongFields = 'song.title, song.artist';
$topPlaysQuery = 'SELECT COUNT(*) as count, song.title, song.artist FROM play,song WHERE play.songid=song.songid GROUP BY play.songid ORDER BY count DESC LIMIT 20';
$lastWeekPlaysQuery =  'SELECT COUNT(*) as count, song.title, song.artist FROM play,song WHERE play.songid=song.songid && play.startTime >= '.$lastWeek .' GROUP BY play.songid ORDER BY count DESC LIMIT 20';
*/
?>
