<?php

require 'secret.php';
/*
logData = querystring.stringify {
        userid: userid
        action: action
        username: username
    }
    */
$postVarsRequired = array('userid','action','username');
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
$q = "INSERT INTO log (djid, djname, logTime, userAction) VALUES (";

$q .= '\'' . $db->real_escape_string($in['userid']) . '\',';
$q .= '\'' . $db->real_escape_string($in['username']) . '\',';

$q .= time() . ',';
$q .= '\'' . $db->real_escape_string($in['action']) . '\'';
$q .= ')';
if(!$db->query($q)) {
      printf("Error: %s\n", $db->error . ' ' .$q);
      echo $q;
      die();
}
?>