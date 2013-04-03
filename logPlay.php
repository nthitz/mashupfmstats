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
?>