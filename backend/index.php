<?php 
include("passwords.php");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$mysqli = new mysqli($sql_server, $sql_username, $sql_password, $sql_database);

$current_seccion_id = $_POST['seccion_id_helfy'];

function guidv4($data)
{
    assert(strlen($data) == 16);

    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10

    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
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

function loginDataCorrect($ldc_username, $ldc_password){
	global $mysqli;
    $sql = "SELECT * FROM `users` WHERE `username` = '$ldc_username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return (password_verify($ldc_password, $res['password']) && $ldc_password != "");
}

function login($ldc_username, $ldc_password){
    if(loginDataCorrect($ldc_username, $ldc_password)){
        $ranseccion = guidv4(random_bytes(16));
        $sql = "UPDATE `users` WHERE `username` = '$ldc_username' SET `seccion` = '$ranseccion'";
        $update = $mysqli->query($sql);
        return $ranseccion;
    }
}

function seccionCheck($username){
    global $mysqli, $current_seccion_id;
    $sql = "SELECT * FROM `users` WHERE `username` = '$username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return ($current_seccion_id == $res['seccion'] && $current_seccion_id != "");
}

function idByUsername($username){
    global $mysqli;
    $sql = "SELECT * FROM `users` WHERE `username` = '$username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return res['id'];
}

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


$request = $_POST['request'];


if($request == "registrateUser"){
    $u_username = ($_POST['username']);
    $u_password = ($_POST['password']);
    if(registrateUser($u_username, $u_password)){
        echo "success";
    } else {
        echo "failed";
    }
}

if($request == "checkLoginData"){
    $u_username = ($_POST['username']);
    $u_password = ($_POST['password']);
    if(loginDataCorrect($u_username, $u_password)){
        echo "correct";
    } else {
        echo "incorrect";
    }
}

if($request == "newSeccion"){
    $u_username = ($_POST['username']);
    $u_password = ($_POST['password']);
    if(loginDataCorrect($u_username, $u_password)){
        echo login($u_username, $u_password);
    }
}


if($request == "addRide"){
    $u_username = ($_POST['username']);
    $u_seccion_id = ($_POST['seccion_id']);
    if(seccionCheck($u_username, $u_seccion_id)){
        $u_type = ($_POST['type']);
        $u_start = ($_POST['start']);
        $u_ziel = ($_POST['ziel']);
        $u_description = ($_POST['description']);
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
    } else {
        echo "failed";
    }
}


if($request == "nearbyRides"){
    $u_username = ($_POST['username']);
    $u_seccion_id = ($_POST['seccion_id']);
    if(seccionCheck($u_username, $u_seccion_id)){
        $u_lat = $_POST['lat'];
        $u_lon = $_POST['lon'];
        $sql = "SELECT * FROM `mitfahren`";
        $result = $mysqli->query($sql);
        while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $cur = explode(":::", $row[4])[1];
            $curr = explode(";;;", $cur);
            if(distance(intval(u_lat), intval(u_lon), $d_lat, $d_lon, "K") < 10){
                echo $row[0].",".$row[1].",".$row[2].",".$row[3].",".$row[4].",".$row[5].",".$row[6].",".$row[7]."\n";
            }
          }
    }
}
?>
