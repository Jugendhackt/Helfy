<?php
include("password.php");

$mysqli = new mysqli($sql_server, $sql_username, $sql_password, $sql_database);


function loginDataCorrect($ldc_username, $ldc_password){
    $sql = "SELECT * FROM `users` WHERE `username` = '$ldc_username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return (crypt($ldc_password, $res['password']) == $res['password'] && $ldc_password != "");
}

function registrateUser($rg_username, $rg_password){
    $sql = "SELECT * FROM `users` WHERE `username` = '$rg_username'";
    $result = $mysqli->query($sql);
    $rg_password_crypt = crypt($rg_password);
    if($result == ""){
        $sql = "INSERT INTO `users` VALUES (NULL, '$rg_username', '$rg_password_crypt')";
        $insert = $mysqli->query($sql);
        return true;
    } else {
        return false;
    }
}
?>