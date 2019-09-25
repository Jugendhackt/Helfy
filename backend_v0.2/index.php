<?php

/*
	index.php - Helfy backend v0.2

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


require("session.php");

header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


if(!(isset($_POST['request']))){
	?>
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<meta name="robots" content="noindex, nofollow"/>
	</head>
	<?php
	exit();
}



$request = $_POST['request'];




if($request == "version"){
	echo "Helfy backend v0.2.0";
}

if($request == "newSession"){
	return login($_POST['username'], $_POST['password']);
}

if($request == "registrateUser"){
	return registrateUser($_POST['username'], $_POST['password'], $_POST['email'], $_POST['vname'], $_POST['nname'], $_POST['dateofbirth']);
}

?>
