<?php 
include("passwords.php");
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

#var_dump($_GET);

$mysqli = new mysqli($sql_server, $sql_username, $sql_password, $sql_database);


//$current_session_id = $_GET['session_id'];


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

//echo getCoordinates("harpolingen");

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

function loginDataCorrect($ldc_username, $ldc_password){
    global $mysqli;
    $ldc_username = $mysqli->real_escape_string($ldc_username);
    $sql = "SELECT * FROM `users` WHERE `username` = '$ldc_username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return (password_verify($ldc_password, $res['password']) && $ldc_password != "");
}

function login($ldc_username, $ldc_password){
	global $mysqli;
    if(loginDataCorrect($ldc_username, $ldc_password)){
		$ldc_username = $mysqli->real_escape_string($ldc_username);
        $ransession = guidv4(random_bytes(16));
        $sql = "UPDATE `users` WHERE `username` = '$ldc_username' SET `session` = '$ransession'";
        $update = $mysqli->query($sql);
        return $ransession;
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
/*
function registrateUser($rg_username, $rg_password){
	global $mysqli;
    $sql = "SELECT * FROM `users` WHERE `username` = '$rg_username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    $rg_password_crypt = password_hash($rg_password,PASSWORD_DEFAULT);
    if($res == ""){
        $sql = "INSERT INTO `users` VALUES (NULL, '$rg_username', '$rg_password_crypt', '')";
        $insert = $mysqli->query($sql);
        return true;
    } else {
        return false;
    }
}

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
$request = $_GET['request'];

/*
if($request == "registrateUser"){
    $u_username = ($_GET['username']);
    $u_password = ($_GET['password']);
    if(registrateUser($u_username, $u_password)){
        echo "success";
    } else {
        echo "failed";
    }
}
*/
if($request == "checkLoginData"){
    $u_username = ($_GET['username']);
    $u_password = ($_GET['password']);
    if(loginDataCorrect($u_username, $u_password)){
        echo "correct";
    } else {
        echo "incorrect";
    }
}

if($request == "newSession"){
    $u_username = ($_GET['username']);
    $u_password = ($_GET['password']);
    if(loginDataCorrect($u_username, $u_password)){
        echo login($u_username, $u_password);
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

function idToName($u_id){
	global $mysqli;
	$u_id = $mysqli->real_escape_string($u_id);
    $sql = "SELECT * FROM `users` WHERE `id` = '$u_id'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return $res['username'];
	}


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


if($request == "logout"){
    $u_username = ($_POST['username']);
    $sql = "UPDATE `users` WHERE `username` = '$u_username' SET `session` = ''";
    $update = $mysqli->query($sql);
}
*/

?>
