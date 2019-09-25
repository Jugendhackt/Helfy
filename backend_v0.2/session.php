<?php

/*
	session.php - Helfy backend v0.2

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


function registrateUser($username, $password, $email, $vname, $nname, $dateofbirth){
    global $pdo;

    $password_crypt = password_hash($rg_password,PASSWORD_DEFAULT);
    $verifyCode = explode("-", uuid())[0];

    if(getUser($username) == "failed" && $username != "" && $password != "" && $email != "" && $vname != "" && $nname != "" && $dateofbirth != ""){
		$data = [
			'username' => $username,
			'password' => $password_crypt,
			'email' => $email,
			'settings' => '{"profile":"private", "show-email":false}',
			'vname' => $vname,
			'nname' => $nname,
			'dateofbirth' => $dateofbirth,
			'profile' => '{"about-me":"", "pb-path": "profilepic.png"}',
			'notifications' => '[{"type":"welcome"}]',
			'status' => '{"verify-email":false, "last-login":"never", "verify-code": "'.$verifyCode.'"}'
		];
        $sql = "INSERT INTO `users` VALUES (NULL, :username, :password, :email, :settings, :vname, :nname, :dateofbirth, :profile, :notifications, :status, '')";
        $stmt= $pdo->prepare($sql);
		$stmt->execute($data);
        return "success";
    } else {
        return "failed";
    }
}
?>
