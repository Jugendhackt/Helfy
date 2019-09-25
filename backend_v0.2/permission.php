<?php

/*
	permission.php - Helfy backend v0.2

	Copyright 2018-2019 Jakob Stolze <https://github.com/jaybeejs>

	This file is part of Helfy - https://github.com/Jugendhackt/Helfy
	Helfy is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	Helfy is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	You should have received a copy of the GNU General Public License
	along with Helfy.  If not, see <http://www.gnu.org/licenses/>.
	Diese Datei ist Teil von Helfy.
	Helfy ist Freie Software: Sie können es unter den Bedingungen
	der GNU General Public License, wie von der Free Software Foundation,
	Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
	veröffentlichten Version, weiter verteilen und/oder modifizieren.
	Helfy wird in der Hoffnung, dass es nützlich sein wird, aber
	OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
	Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
	Siehe die GNU General Public License für weitere Details.
	Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
	Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/


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
