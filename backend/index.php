<?php 
include("passwords.php");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$mysqli = new mysqli($sql_server, $sql_username, $sql_password, $sql_database);

function loginDataCorrect($ldc_username, $ldc_password){
	global $mysqli;
    $sql = "SELECT * FROM `users` WHERE `username` = '$ldc_username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return (password_verify($ldc_password, $res['password']) && $ldc_password != "");
}

function login($ldc_username, $ldc_password){
    if(loginDataCorrect($ldc_username, $ldc_password)){
        $ranseccion = random_int(10000000000000000000, 99999999999999999999);
        $sql = "UPDATE `users` WHERE `username` = '$ldc_username' SET `seccion` = '$ranseccion'";
        $update = $mysqli->query($sql);
        return true;
    } else {
        return false;
    }
}

function seccionCheck($username, $seccion_id){
    global $mysqli;
    $sql = "SELECT * FROM `users` WHERE `username` = '$username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return ($seccion_id == $res['seccion'] && $seccion_id != "");
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
    $u_username = mysql_real_escape_string($_POST['username']);
    $u_password = mysql_real_escape_string($_POST['password']);
    if(registrateUser($u_username, $u_password)){
        echo "success";
    } else {
        echo "failed";
    }
}

if($request == "checkLoginData"){
    $u_username = mysql_real_escape_string($_POST['username']);
    $u_password = mysql_real_escape_string($_POST['password']);
    if(loginDataCorrect($u_username, $u_password)){
        echo "correct";
    } else {
        echo "incorrect";
    }
}

if($request == "addRide"){
    $u_username = mysql_real_escape_string($_POST['username']);
    $u_seccion_id = mysql_real_escape_string($_POST['seccion_id']);
    if(seccionCheck($u_username, $u_seccion_id)){
        $u_type = mysql_real_escape_string($_POST['type']);
        $u_start = mysql_real_escape_string($_POST['start']);
        $u_ziel = mysql_real_escape_string($_POST['ziel']);
        $u_description = mysql_real_escape_string($_POST['description']);
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
?>
