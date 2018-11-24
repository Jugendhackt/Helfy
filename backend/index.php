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

function registrateUser($rg_username, $rg_password){
	global $mysqli;
    $sql = "SELECT * FROM `users` WHERE `username` = '$rg_username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    $rg_password_crypt = password_hash($rg_password,PASSWORD_DEFAULT);
    if($res == ""){
        $sql = "INSERT INTO `users` (`id`, `username`, `password`) VALUES (NULL, '$rg_username', '$rg_password_crypt')";
        $insert = $mysqli->query($sql);
        return true;
    } else {
        return false;
    }
}


$request = $_POST['request'];


if($request == "registrateUser"){
    $u_username = $_POST['username'];
    $u_password = $_POST['password'];
    if(registrateUser($u_username, $u_password)){
        echo "success";
    } else {
        echo "failed";
    }
}

if($request == "checkLoginData"){
    $u_username = $_POST['username'];
    $u_password = $_POST['password'];
    if(loginDataCorrect($u_username, $u_password)){
        echo "correct";
    } else {
        echo "incorrect";
    }
}
?>
