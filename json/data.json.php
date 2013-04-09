<?php
//require "../secret.php";
$now = time();
$lastWeek = $now - 60 * 60 * 24 * 7;
$topSongTypes = array('COUNT(*)', 'AVG(up)','AVG(down)','AVG(spread)','AVG(snagged)','AVG(score)','AVG(realScore)');
$topSongFields = 'song.title, song.artist';
$topPlaysQuery = 'SELECT COUNT(*) as count, song.title, song.artist FROM play,song WHERE play.songid=song.songid GROUP BY play.songid ORDER BY count DESC LIMIT 20';
$lastWeekPlaysQuery =  'SELECT COUNT(*) as count, song.title, song.artist FROM play,song WHERE play.songid=song.songid && play.startTime >= '.$lastWeek .' GROUP BY play.songid ORDER BY count DESC LIMIT 20';
echo $lastWeekPlaysQuery;
?>
