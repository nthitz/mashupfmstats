<?php
die();
require "secret.php";
$path = "importData/xad";
$f = fopen($path, 'r');
echo '<table>';
$data = 0;
$importID = 4;
/*
	startTime
songId` VARCHAR(24) NULL DEFAULT NULL,
  `djid` VARCHAR(24) NULL DEFAULT NULL,
  `djname` VARCHAR(40) NULL DEFAULT NULL,
  `up` INTEGER(6) NULL DEFAULT NULL,
  `down` INT(6) NULL DEFAULT NULL,
  `spread` INT(6) NULL DEFAULT NULL,
  `snagged` INT(6) NULL DEFAULT NULL,
  `whichLine` INT(4) NOT NULL,
  `numInRoom` INT(6) NULL DEFAULT NULL,
  `numActive` INT(6) NULL DEFAULT NULL,
  `score` DECIMAL(10,6) NULL DEFAULT NULL,
  `realScore` DECIMAL(10,6) NULL DEFAULT NULL,

  song_id,metadata.artist,metadata.song,metadata.length,starttime,user.userid,user.name,upvotes,downvotes,hearts,listeners,score,nonIdleListeners,realScore
`songId` VARCHAR(24) NOT NULL,
  `title` MEDIUMTEXT NULL DEFAULT NULL,
  `artist` MEDIUMTEXT NULL DEFAULT NULL,
  `album` MEDIUMTEXT NULL DEFAULT NULL,
  `genre` MEDIUMTEXT NULL DEFAULT NULL,
  `length` INT(5) NULL DEFAULT NULL,
  */
dbConnect();
$headers = fgetcsv($f);
$numHeaders = count($headers);
$row = 0;
while (($data = fgetcsv($f, 0, ',', '"', '"')) !== FALSE) {
	for($i = 0; $i < $numHeaders; $i++) {
		$header = $headers[$i];
		$data[$header] = $data[$i];
	}
	if(trim($data['hearts']) === '') {
		$data['hearts'] = 'NULL';
	}
	if(trim($data['score']) === '') {
		$data['score'] = 'NULL';
	}
	if(trim($data['realScore']) === '') {
		$data['realScore'] = 'NULL';
	}
	$rs = trim($data['realScore']);
	if($rs === 'inf.0' || $rs === '-inf.0') {
		$data['realScore'] = 'NULL';
	}
	$q = 'INSERT INTO play (whichLine, imported, startTime,songId, djid, djname, up, down, spread, snagged, numInRoom, numActive, score, realScore) VALUES ';
	$q .= '(0,'.$importID.','. round($data['starttime']) .',"'.$data['song_id'] . '","' . $data['user.userid'] . '", "' . $db->real_escape_string($data['user.name']). '",' .
		$data['upvotes'] . ', ' . $data['downvotes'] . ', ' . ($data['upvotes'] - $data['downvotes']) . ', ' .
		$data['hearts'] . ', ' . $data['listeners'] . ', ' . $data['nonIdleListeners'] . ', ' . $data['score'] . ', '. $data['realScore'] . ')';
	
	if(!$db->query($q)) {

	      printf("Error: %s\n", $db->error);
	      var_dump($data);
	      die($q);
	}

	$q2 = 'INSERT INTO song (songId, title, artist, length, imported) VALUES ';
	$q2 .= '("'. $data['song_id'] . '","' . $db->real_escape_string($data['metadata.song']).'", "' . $db->real_escape_string($data['metadata.artist']) .'", '.
		 $data['metadata.length'] .','.$importID.') ON DUPLICATE KEY UPDATE songId=songId';
	if(!$db->query($q2)) {

	      printf("Error: %s\n", $db->error);
	      var_dump($data);
	      die($q2);
	}
	if($row % 1000 === 0) {
	
	    echo '<tr>';
	   
	    echo '<td>' . $q . '</td><td>'.$q2.'</td>';
	    echo '</tr>';
	    flush();
	}
    $row++;
    
}	
echo '</table>';
?>