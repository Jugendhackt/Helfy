<?php
include("password.php");

$mysqli = new mysqli($sql_server, $sql_username, $sql_password, $sql_database);
$sql = "";
$result = $mysqli->query($sql);
$res = $result->fetch_assoc();


function loginDataCorrect($ldc_username, $ldc_password){
    $sql = "SELECT * FROM `users` WHERE `username` = '$ldc_username'";
    $result = $mysqli->query($sql);
    $res = $result->fetch_assoc();
    return ($ldc_password == res['password'] && $ldc_password != "");
}
?>