<?php

require("passwords.php");
require_once("permission.php");
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


function login($username, $password){
	global $pdo;
    if(loginDataCorrect($username, $password)){
		if(emailVerified($username)){
			$sessionId = uuid();
			$data = [
				'username' => $username,
				'session' => $sessionId,
			];
			$sql = "UPDATE `users` SET `session` = :session WHERE `username` = :username";
			$stmt = $pdo->prepare($sql);
			$stmt->execute($data);
			return $sessionId;
		} else {
			return "no_email_verify";
		}
    } else {
		return "failed";
	}
}
?>
