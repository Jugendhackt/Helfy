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

/*
if($request == "nearbyRides"){
    //$u_username = ($_GET['username']);
    //$u_session_id = ($_GET['session_id']);
    //if(sessionCheck($u_username, $u_session_id)){
        $u_lat = $_GET['lat'];
        $u_lon = $_GET['lon'];
        $sql = "SELECT * FROM `mitfahren`";
        $result = $mysqli->query($sql);
        $rawo = [];
        $i = 0;
        while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $cur = explode(":::", $row['start'])[1];
            $curr = explode(";;;", $cur);
            $d_lat = $curr[0];
            $d_lon = $curr[1];
            #echo json_encode($row);
            if(distance(intval($u_lat), intval($u_lon), intval($d_lat), intval($d_lon), "K") < 100){
				#echo $row['id'].",".$row['type'].",".$row['mitfahrer_id'].",".$row['fahrer_id'].",".$row['start'].",".$row['ziel'].",".$row['description'].",".$row['timestamp']."\n";
				$row['start_klar'] = explode(":::", $row['start'])[0];
				$row['start_lat'] = explode(";;;", explode(":::", $row['start'])[1])[0];
				$row['start_lon'] = explode(";;;", explode(":::", $row['start'])[1])[1];
				$row['ziel_klar'] = explode(":::", $row['ziel'])[0];
				$row['ziel_lat'] = explode(";;;", explode(":::", $row['ziel'])[1])[0];
				$row['ziel_lon'] = explode(";;;", explode(":::", $row['ziel'])[1])[1];
				$row['fahrer_name'] = idToName($row['fahrer_id']);
				$row['mitfahrer_name'] = idToName($row['mitfahrer_id']);
				$row['distance'] = distance(intval($row['start_lat']), intval($row['start_lon']), intval($row['ziel_lat']), intval($row['ziel_lon']), "K");
				$rawo[$i] = $row;
				$i = $i + 1;
				#echo json_encode($row);
			}
			
        }
        echo json_encode($rawo);
    //}
}


if($request == "editRide"){
	$u_username = ($_GET['username']);
    $u_session_id = ($_GET['session_id']);
    if(sessionCheck($u_username, $u_session_id)){
		$u_fahrt_id = ($_GET['fahrt_id']);
		$u_type = ($_GET['type']);
        $u_start = ($_GET['start']);
        $u_ziel = ($_GET['ziel']);
        $u_description = ($_GET['description']);
        $fahrer_id = $_GET['fahrer_id'];
        $mitfahrer_id = $_GET['mitfahrer_id'];
        $sql = "INSERT INTO `mitfahren` VALUES (NULL, '$u_type', '$mitfahrer_id', '$fahrer_id', '$u_start', '$u_ziel', '$u_description', CURRENT_TIMESTAMP)";
        $insert = $mysqli->query($sql);
        echo "success";
    } else {
        echo "failed";
    }
}
*/

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


if($request == "logout"){
	$u_username = $_GET['username'];
    $u_session = $_GET['session'];
    echo logout($u_username, $u_session);
}


?>
