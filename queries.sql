SELECT SUM(up), song.title FROM play,song WHERE play.songid=song.songid GROUP BY play.songid;

SELECT play.songid, COUNT(*) as cnt, song.title FROM song, play WHERE song.songid=play.songid GROUP BY play.songid ORDER BY cnt DESC LIMIT 20;
