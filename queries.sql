SELECT SUM(up), song.title FROM play,song WHERE play.songid=song.songid GROUP BY play.songid;

