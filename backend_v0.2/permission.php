<?php

function uuid(){
	$data = random_bytes(16);
	assert(strlen($data) == 16);
	$data[6] = chr(ord($data[6]) & 0x0f | 0x40);
	$data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}


function getUser($username){
	global $pdo;
	$statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
	$statement->execute(array($username));
	$res = $statement->fetchAll();
    if($statement->rowCount() != 0){
		return $res[0];
	} else {
		return "failed";
	}
}


function emailVerified($username){
	$user = getUser($username);
	$status = json_decode($user['status'], true);
	return $status['verify-email'];
}


function loginDataCorrect($username, $password){
    global $pdo;
    $statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
	$statement->execute(array($username));
	$res = $statement->fetchAll();
	if(isset($res[0])){
		$res = $res[0];
		return (password_verify($password, $res['password']) && $password != "" && $username != '');
	} else {
		return false;
	}
}


function sessionDataCorrect($username, $session){
    global $pdo;
    $statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
	$statement->execute(array($username));
	$res = $statement->fetchAll();
	if(isset($res[0])){
		$res = $res[0];
		return ($res['session'] == $session && $res != "" && $session != "");
	} else {
		return false;
	}
}

?>
