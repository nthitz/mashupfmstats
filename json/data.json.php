<?php
require "../secret.php";

$now = time();
$orderVar = null;
$timeVar = null;
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
$q = 'SELECT song.title, song.artist, ';

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
$q .= ' FROM song,play WHERE play.songid=song.songid';
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
}
if($timeLimit !== false) {
	$minStartTime = $now - $timeLimit;
	$q.= ' AND play.startTime > ' . $minStartTime;
}
$q .= ' GROUP BY play.songid ORDER BY cnt DESC LIMIT 50';
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
