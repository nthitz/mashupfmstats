<?php
require "../secret.php";

require "cachedQuery.php";
$queryCache = new QueryCache();
$now = mktime(0,0,0);
$yearSeconds = 60 * 60 *24 * 365;
$lastYear = $now - $yearSeconds;
$key = null;
$value = null;
if(isset($_GET['key']) && ctype_alnum($_GET['key'])) {
	$key = $_GET['key'];
} else {
	die('key');
}
if($key !== 'djid' && $key !== 'songid') {
	die('key');
}
if(isset($_GET['value']) && ctype_alnum($_GET['value'])) {
	$value = $_GET['value'];
} else {
	die('value');
}
dbConnect();
$keySafe = $db->real_escape_string($key);
$valueSafe = $db->real_escape_string($value);
$data = array();
$data['key'] = $key;
$data['times'] = array('min'=>$lastYear , 'max' => $now);

$q = 'SELECT * FROM play';
if($key === 'djid') {
	$q = 'SELECT play.*, song.title, song.artist FROM play, song';
} 
$q.= ' WHERE ' . $key .'="'.$valueSafe. '" && startTime >'. $lastYear ;
if($key === 'djid') {
	$q .= ' && play.songid=song.songid';
}
$q .=' ORDER BY startTime DESC';

$plays = array();
$plays = json_decode($queryCache->getQuery($q));
/*
if ($result = $db->query($q)) {
    while($row = $result->fetch_array(MYSQLI_ASSOC))
	{
		$plays[] = $row;
	}
	$data['plays'] = $plays;
} else {
	printf("Error: %s\n", $db->error);
	die($q);
}
*/
$data['plays'] = $plays;

switch($key) {
	case "djid":

	break;
	case "songid":
		$songQ = 'SELECT * FROM song WHERE songid="'.$valueSafe.'" LIMIT 1';
		if($songResult = $db->query($songQ)) {
			$row = $songResult->fetch_array(MYSQLI_ASSOC);
			$data['song'] = $row;
		}
	break;
}

echo json_encode($data);

?>
