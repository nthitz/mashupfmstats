<?php
$db = null;
function dbConnect() {
	global $db;
	$db = new mysqli('dbserver.example.com','dbuser','dbpass','dbname');
		
	if ($db->connect_error) {
	    die('db error (' . $db->connect_errno . ') '. $db->connect_error);
	}
	$db->set_charset("utf8");
}
$key = 'secretkey';
?>