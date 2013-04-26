<?php
/**
Interface to cache query results as JSON in a folder for a set period of time
*/
class QueryCache {
	private $folder = './cache/';
	private $timeToLive = 0 ; // one day
	function __construct() {
		$this->timeToLive = 24;
	}
	function clearCache() {
		$cacheFiles = scandir($this->folder);
		$fileStaleTime = time() - $this->timeToLive;
		$numDeleted = 0;
		foreach($cacheFiles as $file) {
			if($file[0] == '.') {
				continue;
			}
			$filePath = $this->folder . $file;
			$fileTime = filemtime($filePath);
			if($fileTime < $fileStaleTime) {
				unlink($filePath);
				$numDeleted ++;
			}
		}
		echo $numDeleted . ' deleted';
	}
	function getQuery($queryToCache) {
		$queryHash = md5($queryToCache);
		$getFile = false;
		$filePath = $this->folder . $queryHash . '.json';
		$fileStaleTime = time() - $this->timeToLive;
		if(file_exists($filePath)) {
			if(filemtime($filePath) < $fileStaleTime) {
				$getFile = true;
			}
		} else {
			$getFile = true;
		}
		if($getFile) {
			$this->getFile($queryToCache, $filePath);
		}
		return $this->outFile($filePath);
	}
	function outFile($path) {
		return file_get_contents($path,'"');
	}
	function getFile($query, $path) {
		global $db;
		$results = array();
		if ($result = $db->query($query)) {
		    while($row = $result->fetch_array(MYSQLI_ASSOC))
			{
				$results[] = $row;
			}
			$json = json_encode($results);
			$f = fopen($path,'w+');
			fwrite($f, $json);
			fclose($f);
		} else {
	      printf("Error: %s\n", $db->error);
	      die($q);
		}
	}
	

}
?>