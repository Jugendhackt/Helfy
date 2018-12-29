<?php 
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
if($request == "addRide"){
    $u_username = ($_GET['username']);
    //$u_session_id = ($_GET['session_id']);
    //if(sessionCheck($u_username, $u_session_id)){
        $u_type = ($_GET['type']);
        $u_start = ($_GET['start']);
        $u_ziel = ($_GET['ziel']);
        $u_description = ($_GET['description']);
        if($u_type == "true"){
            $fahrer_id = idByUsername($u_username);
            $mitfahrer_id = "";
        } else {
            $fahrer_id = "";
            $mitfahrer_id = idByUsername($u_username);
        }
        $sql = "INSERT INTO `mitfahren` VALUES (NULL, '$u_type', '$mitfahrer_id', '$fahrer_id', '$u_start', '$u_ziel', '$u_description', CURRENT_TIMESTAMP)";
        $insert = $mysqli->query($sql);
        echo "success";
    //} else {
    //    echo "failed";
    //}
}
*/


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

/*
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


if($request == "logout"){
	$u_username = $_GET['username'];
    $u_session = $_GET['session'];
    echo logout($u_username, $u_session);
}


?>
