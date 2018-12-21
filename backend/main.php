<?php
require("passwords.php");
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$mysqli = new mysqli($sql_server, $sql_username, $sql_password, $sql_database);


function guidv4($data)
{
    assert(strlen($data) == 16);

    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10

    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

//function getCoordinates($where){
	//$url = 'https://nominatim.openstreetmap.org/search.php?q='.$where.'&format=json';
	//$content = file_get_contents($url);
	//$rawc = json_decode($content);
	//$coor = $rawc[0]["lan"].";;;".$rawc[0]["lon"];
	//return $coor;
	//}

//echo getCoordinates("ulm");

function permissionControll($ldc_username){
	global $mysqli;
    $ldc_username = $mysqli->real_escape_string($ldc_username);
    $sql = "SELECT * FROM `users` WHERE `username` = '$ldc_username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    if($res['verify-email'] == "1"){
		return "ok";
	} else {
		return "no_email_verify";
	}
}

function distance($lat1, $lon1, $lat2, $lon2, $unit) {
    if (($lat1 == $lat2) && ($lon1 == $lon2)) {
      return 0;
    }
    else {
      $theta = $lon1 - $lon2;
      $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
      $dist = acos($dist);
      $dist = rad2deg($dist);
      $miles = $dist * 60 * 1.1515;
      $unit = strtoupper($unit);
  
      if ($unit == "K") {
        return ($miles * 1.609344);
      } else if ($unit == "N") {
        return ($miles * 0.8684);
      } else {
        return $miles;
      }
    }
}


function sendEMail($mode, $empfaenger){
	global $mysqli;
	if($mode == "regist"){
		$empfaenger = $mysqli->real_escape_string($empfaenger);
		$sql = "SELECT * FROM `users` WHERE `username` = '$empfaenger'";
		$result = $mysqli->query($sql);
		$res = $result->fetch_assoc();
		$vname = $res['vname'];
		$nname = $res['nname'];
		$username = $res['username'];
		$empfaenger_email = $res['email'];
		$hash = $res['session'];
		$betreff = "Registration bei Helfy: E-Mail bestätigen";
		$nachricht = "Guten Tag, $vname $nname,\n\nvielen Dank, dass Sie sich bei Helfy registriert haben! Bitte bestätigen Sie ihre E-Mail Adresse, um ihren Account freizuschalten.\n\nJetzt bestätigen: ".$server_url."/verify.php?mode=email&id=$hash&username=$username&type=true\n\nSollten Sie sich nicht bei Helfy registriert haben, dann klicken Sie bitte hier: ".$server_url."/verify.php?mode=email&id=$hash&username=$username&type=false\n\nMit freundlichen Grüße,\ndas Helfy Team";
		mail($empfaenger_email, $betreff, $nachricht, "From: Helfy <".$server_mail.">");
	}
}


function loginDataCorrect($ldc_username, $ldc_password){
    global $mysqli;
    $ldc_username = $mysqli->real_escape_string($ldc_username);
    $sql = "SELECT * FROM `users` WHERE `username` = '$ldc_username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return (password_verify($ldc_password, $res['password']) && $ldc_password != "");
}

function sessionDataCorrect($ldc_username, $ldc_session){
    global $mysqli;
    $ldc_username = $mysqli->real_escape_string($ldc_username);
    $sql = "SELECT * FROM `users` WHERE `username` = '$ldc_username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return ($res['session'] == $ldc_session && $res != "");
}

function getHomeData($ldc_username){
	global $mysqli;
	$ldc_username = $mysqli->real_escape_string($ldc_username);
    $sql = "SELECT * FROM `users` WHERE `username` = '$ldc_username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return [$res['username'], $res['vname'], $res['nname'], explode("=", explode(";", $res['settings'])[0])[1], explode("=", explode(";", $res['settings'])[1])[1]];
}

function login($ldc_username, $ldc_password){
	global $mysqli;
    if(loginDataCorrect($ldc_username, $ldc_password)){
		$ldc_username = $mysqli->real_escape_string($ldc_username);
        $ransession = guidv4(random_bytes(16));
        $sql = "UPDATE `users` SET `session` = '$ransession' WHERE `username` = '$ldc_username'";
        $update = $mysqli->query($sql);
        return $ransession;
    } else {
		return "failed";
	}
}

/*
function sessionCheck($username){
    global $mysqli, $current_session_id;
    $sql = "SELECT * FROM `users` WHERE `username` = '$username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return ($current_session_id == $res['session'] && $current_session_id != "");
}
*/
function idByUsername($username){
    global $mysqli;
    $username = $mysqli->real_escape_string($username);
    $sql = "SELECT * FROM `users` WHERE `username` = '$username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return res['id'];
}


function verifyEmail($username, $code, $type){
	$ret = false;
	if($type == "true"){
		global $mysqli;
		$username = $mysqli->real_escape_string($username);
		$sql = "SELECT * FROM `users` WHERE `username` = '$username'";
		$result = $mysqli->query($sql);
		$res = $result->fetch_assoc();
		if($code == $res['session']){
			$sql = "UPDATE `users` SET `session` = '', `verify-email` = 1 WHERE `username` = '$username'";
			$update = $mysqli->query($sql);
			$ret = true;
		}
	}
	return $ret;
}


function idToName($u_id){
	global $mysqli;
	$u_id = $mysqli->real_escape_string($u_id);
    $sql = "SELECT * FROM `users` WHERE `id` = '$u_id'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return $res['username'];
}


function registrateUser($rg_username, $rg_password, $rg_email, $rg_vorname, $rg_nachname, $rg_ort, $rg_plz){
	global $mysqli;
	$rg_username = $mysqli->real_escape_string($rg_username);
	$rg_email = $mysqli->real_escape_string($rg_email);
	$rg_vorname = $mysqli->real_escape_string($rg_vorname);
	$rg_nachname = $mysqli->real_escape_string($rg_nachname);
    $rg_ort = $mysqli->real_escape_string($rg_ort);
    $rg_plz = $mysqli->real_escape_string($rg_plz);
    $rg_settings = "ORT=".$rg_ort.";PLZ=".$rg_plz;

    $sql = "SELECT * FROM `users` WHERE `username` = '$rg_username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    $rg_password_crypt = password_hash($rg_password,PASSWORD_DEFAULT);
    $hash = guidv4(random_bytes(16));
    if($res == "" && $rg_username != "" && $rg_password != "" && $rg_email != "" && $rg_vorname != "" && $rg_nachname != ""){
        $sql = "INSERT INTO `users` VALUES (NULL, '$rg_username', '$rg_password_crypt', '$rg_vorname', '$rg_nachname', '$rg_email', '$rg_settings', 0, '$hash')";
        $insert = $mysqli->query($sql);
        return true;
    } else {
        return false;
    }
}

function existsUser($rg_username){
	global $mysqli;
	$rg_username = $mysqli->real_escape_string($rg_username);

    $sql = "SELECT * FROM `users` WHERE `username` = '$rg_username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    
    return ($res != "");
}

/*

function addRide($type, $user_id, $start, $ziel, $description){
    global $mysqli;
    if($type == "true"){
        $fahrer_id = $user_id;
        $mitfahrer_id = "";
    } else {
        $fahrer_id = "";
        $mitfahrer_id = $user_id;
    }
    $sql = "INSERT INTO `mitfahren` VALUES (NULL, '$type', '$mitfahrer_id', '$fahrer_id', '$start', '$ziel')";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
}

if(!(isset($_GET['request']))){
	exit();
}
*/

?>
