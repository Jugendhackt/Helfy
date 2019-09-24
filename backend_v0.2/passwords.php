<?php
$sql_server = "127.0.0.1";
$sql_username = "username";
$sql_password = "password";
$sql_database = "database";

$server_url = "https://helfy.bluekite.de";
$server_mail = "no-reply@helfy.bluekite.de";

$pdo = new PDO('mysql:host='.$sql_server.';dbname='.$sql_database, $sql_username, $sql_password);
?>
