<?php

	// Pulls the name and gender from the post data, and doesn't proceed if name is empty
	$name = $_POST['name'];
	$gender = $_POST['gender'];
	if(empty($name)) {
		echo "You must provide a name!";
		return false;
	}

	$ch = curl_init();
    $request_url = "http://game.blobla.com/belikemeen?name=" . $name . "&gender=" . $gender;
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $request_url);
	$content = curl_exec($ch);
	echo $content;
	return true;
?>