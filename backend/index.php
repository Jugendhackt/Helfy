<?php 
/*
	index.php

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

require("main.php");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


if(!(isset($_GET['request']))){
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

$request = $_GET['request'];

if($request == "version"){
	echo "Helfy backend v0.1";
}

if($request == "homeData"){
    $u_username = ($_GET['username']);
    $u_session = ($_GET['session']);
    if(sessionDataCorrect($u_username, $u_session)){
		$pmk = permissionControll($u_username);
		if($pmk == "ok"){
			echo json_encode(getHomeData($u_username));
		} else {
			echo $pmk;
		}
	} else {
		echo "failed";
	}
}

if($request == "registrateUser"){
    $u_username = ($_GET['username']);
    $u_password = ($_GET['password']);
    $u_email = ($_GET['email']);
    $u_vname = ($_GET['vname']);
    $u_nname = ($_GET['nname']);
    $u_ort = ($_GET['ort']);
    $u_plz = ($_GET['plz']);
    if(registrateUser($u_username, $u_password, $u_email, $u_vname, $u_nname, $u_ort, $u_plz)){
        echo "success";
    } else {
        echo "failed";
    }
}

if($request == "existsUser"){
    $u_username = ($_GET['username']);
    if(existsUser($u_username)){
        echo "true";
    } else {
        echo "false";
    }
}

if($request == "checkSessionData"){
    $u_username = ($_GET['username']);
    $u_session = ($_GET['session']);
    if(sessionDataCorrect($u_username, $u_session)){
		$pmk = permissionControll($u_username);
		if($pmk == "ok"){
			echo "correct";
		} else {
			echo $pmk;
		}
    } else {
        echo "incorrect";
    }
}

if($request == "newSession"){
    $u_username = $_GET['username'];
    $u_password = $_GET['password'];
    if(loginDataCorrect($u_username, $u_password)){
		$pmk = permissionControll($u_username);
		if($pmk == "ok"){
			echo login($u_username, $u_password);
		} else {
			echo $pmk;
		}
    } else {
		echo "failed";
	}
}

if($request == "newGroup"){
    echo newGroup($_GET['groupname'], $_GET['users'], $_GET['description'], $_GET['username'], $_GET['session']);
}

if($request == "getNotifications"){
    echo getNotifications($_GET['username'], $_GET['session']);
}

if($request == "removeNotification"){
    echo removeNotification($_GET['username'], $_GET['session'], $_GET['id'], $_GET['code']);
}

if($request == "getGroups"){
    echo json_encode(getGroups($_GET['username'], $_GET['session']));
}

if($request == "leaveGroup"){
    echo leaveGroup($_GET['username'], $_GET['session'], $_GET['groupHash']);
}

if($request == "changePassword"){
    echo changePassword($_GET['username'], $_GET['session'], $_GET['password'], $_GET['passwordNew']);
}

if($request == "changeEmail"){
    echo changeEmail($_GET['username'], $_GET['session'], $_GET['email']);
}

if($request == "changeUsername"){
    echo changeUsername($_GET['username'], $_GET['session'], $_GET['newUsername']);
}

if($request == "changeProfileSettings"){
    echo editProfileSettings($_GET['username'], $_GET['session'], $_GET['type'], $_GET['mail']);
}

if($request == "offerRide"){
    echo addBulletin("offerRide", $_GET['username'], $_GET['session'], $_GET['from'], $_GET['to'], $_GET['addr'], $_GET['time']);
}

if($request == "getRides"){
    echo json_encode(getBulletin("ride", $_GET['username'], $_GET['session'], $_GET['location'], $_GET['distance'], $_GET['time']));
}

if($request == "getSettings"){
    echo json_encode(getSettings($_GET['username'], $_GET['session']));
}

if($request == "getPublicProfile"){
    echo json_encode(getPublicProfile($_GET['username'], $_GET['session'], $_GET['profile']));
}

if($request == "logout"){
	$u_username = $_GET['username'];
    $u_session = $_GET['session'];
    echo logout($u_username, $u_session);
}

if($request == "getChat"){
	$username = $_GET['username'];
	$session = $_GET['session'];
	$partner = $_GET['partner'];
	if(sessionDataCorrect($username, $session)){
		if(existsUser($partner)){
			echo json_encode($chat->getChat($username, $partner));
		} else {
			echo json_encode("invalid_receiver");
		}
	} else {
		echo json_encode("failed");
	}
}

if($request == "getChats"){
	$username = $_GET['username'];
	$session = $_GET['session'];
	if(sessionDataCorrect($username, $session)){
		echo json_encode($chat->getChats($username));
	} else {
		echo json_encode("failed");
	}
}

if($request == "sendMessage"){
	$username = $_GET['username'];
	$session = $_GET['session'];
	$partner = $_GET['partner'];
	$message = $_GET['message'];
	if(sessionDataCorrect($username, $session)){
		if($message != ""){
			if(existsUser($partner)){
				$chat->sendMessage($username, $partner, $message, "text");
				echo "success";
			} else {
				echo "invalid_receiver";
			}
		} else {
			echo "empty_message";
		}
	} else {
		echo "failed";
	}
}

if($request == "verifyEmail"){
	if(verifyEmail($_GET['username'], $_GET['code']) == "success"){
		echo "success";
	} else {
		echo "failed";
	}
}

if($request == "searchUser"){
	echo json_encode(searchUser($_GET['username'], $_GET['session'], $_GET['q']));
}

?>
