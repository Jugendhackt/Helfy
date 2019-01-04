<?php
require("passwords.php");
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$pdo = new PDO('mysql:host='.$sql_server.';dbname='.$sql_database, $sql_username, $sql_password);


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
	global $pdo;
    $statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
	$statement->execute(array($ldc_username));
	$res = $statement->fetchAll()[0];
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
	global $pdo;
	if($mode == "regist"){
		$statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
		$statement->execute(array($empfaenger));
		$res = $statement->fetchAll()[0];
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
    global $pdo;
    $statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
	$statement->execute(array($ldc_username));
	$res = $statement->fetchAll()[0];

    return (password_verify($ldc_password, $res['password']) && $ldc_password != "" && $ldc_username != '');
}

function sessionDataCorrect($ldc_username, $ldc_session){
    global $pdo;
    $statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
	$statement->execute(array($ldc_username));
	$res = $statement->fetchAll()[0];
	
    return ($res['session'] == $ldc_session && $res != "" && $ldc_session != "");
}

function getHomeData($ldc_username){
	global $pdo;
    $statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
	$statement->execute(array($ldc_username));
	$res = $statement->fetchAll()[0];
	
    $notif = sizeof(explode("$", $res['notifications']));
    if($res['notifications'] == ""){
		$notif = 0;
	}
    return [$res['username'], $res['vname'], $res['nname'], explode("=", explode(";", $res['settings'])[0])[1], explode("=", explode(";", $res['settings'])[1])[1], explode(";", $res['settings']), $notif];
}

function login($ldc_username, $ldc_password){
	global $pdo;
    if(loginDataCorrect($ldc_username, $ldc_password)){
		$ransession = guidv4(random_bytes(16));
		$data = [
			'username' => $ldc_username,
			'session' => $ransession,
		];
        $sql = "UPDATE `users` SET `session` = :session WHERE `username` = :username";
        $stmt = $pdo->prepare($sql);
		$stmt->execute($data);
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
    global $pdo;
    $statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
	$statement->execute(array($username));
	$res = $statement->fetchAll()[0];
    return res['id'];
}


function verifyEmail($username, $code){
	global $pdo;
    $statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
	$statement->execute(array($username));
	$res = $statement->fetchAll()[0];
	if($code == $res['session']){
		$sql = "UPDATE `users` SET `session` = '', `verify-email` = 1 WHERE `username` = :username";
		$statement->prepare($sql);
		$statement->execute(array($username));
		return "success";
	} else {
		return "failed";
	}
}


function idToName($u_id){
	global $pdo;
	$statement = $pdo->prepare("SELECT * FROM `users` WHERE `id` = ?");
	$statement->execute(array($u_id));
	$res = $statement->fetchAll()[0];
    return $res['username'];
}


function registrateUser($rg_username, $rg_password, $rg_email, $rg_vorname, $rg_nachname, $rg_ort, $rg_plz){
    global $pdo;
    $statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
	$statement->execute(array($rg_username));
	$res = $statement->fetchAll()[0];
    $rg_password_crypt = password_hash($rg_password,PASSWORD_DEFAULT);
    $hash = guidv4(random_bytes(16));
    if($res == "" && $rg_username != "" && $rg_password != "" && $rg_email != "" && $rg_vorname != "" && $rg_nachname != ""){
		$data = [
			'username' => $rg_username,
			'email' => $rg_email,
			'vname' => $rg_vorname,
			'nname' => $rg_nachname,
			'settings' => "ORT=".$rg_ort.";PLZ=".$rg_plz.";GROUPS=",
			'hash' => $hash,
			'password' => $rg_password_crypt,
		];

        $sql = "INSERT INTO `users` VALUES (NULL, :username, :password, :vname, :nname, :email, :settings, 'welcome', 0, :hash)";
        $stmt= $pdo->prepare($sql);
		$stmt->execute($data);
        return true;
    } else {
        return false;
    }
}

function existsUser($rg_username){
	global $pdo;
	$statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
	$statement->execute(array($rg_username));
	$res = $statement->fetchAll();
    return ($statement->rowCount() != 0);
}

function logout($u_username, $u_session){
	if(sessionDataCorrect($u_username, $u_session)){
		global $pdo;
		$statement = $pdo->prepare("UPDATE `users` SET `session` = '' WHERE `username` = ?");
		$statement->execute(array($u_username));
		return "success";
	} else {
		return "failed";
	}
}

function newGroupHash(){
	$hash = guidv4(random_bytes(16));
	return $hash;
}

function newNotification($u_username, $u_notification){
	global $pdo;
    $statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
	$statement->execute(array($u_username));
	$res = $statement->fetchAll()[0];
    if($res['notifications'] != ""){
		$setout = $res['notifications']."$".$u_notification;
	} else {
		$setout = $u_notification;
	}
	$sql = "UPDATE `users` SET `notifications` = :setout WHERE `username` = :username";
	$data = [
		'username' => $u_username,
		'setout' => $setout,
	];
	$statement = $pdo->prepare($sql);
	$statement->execute($data);
	
}

function addGroupToUser($u_username, $u_groupHash){
	global $pdo;
    $statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
	$statement->execute(array($u_username));
	$res = $statement->fetchAll()[0];
    
    $statement = $pdo->prepare("SELECT * FROM `groups` WHERE `hash` = ?");
	$statement->execute(array($u_groupHash));
	$ros = $statement->fetchAll()[0];
    
    $settings = explode(";", $res['settings']);
    if($settings[2] != "GROUPS="){
		$setout = str_replace($settings[2], $settings[2].",".$ros['id'], $res['settings']);
    } else {
		$setout = str_replace($settings[2], $settings[2].$ros['id'], $res['settings']);
	}
	$sql = "UPDATE `users` SET `settings` = :setout WHERE `username` = :username";
	$data = [
		'username' => $u_username,
		'setout' => $setout,
	];
	$statement = $pdo->prepare($sql);
	$statement->execute($data);
}

function getGroupByHash($hash){
	global $pdo;
    $statement = $pdo->prepare("SELECT * FROM `groups` WHERE `hash` = ?");
	$statement->execute(array($hash));
	$res = $statement->fetchAll()[0];
    return $res;
}

function newGroup($u_groupname, $u_users, $u_description, $u_creator, $u_creator_session){
	if(sessionDataCorrect($u_creator, $u_creator_session)){
		global $pdo;
		$ranhash = newGroupHash();
		$sql = "INSERT INTO `groups` VALUES (NULL, :groupname, :users, :admin, '', :description, :hash)";
		
		$data = [
			'groupname' => $u_groupname,
			'users' => $u_users,
			'admin' => $u_creator,
			'description' => $u_description,
			'hash' => $ranhash,
		];
		$statement = $pdo->prepare($sql);
		$statement->execute($data);
		
		addGroupToUser($u_creator, $ranhash);
		$users = explode(",", $u_users);
		for($i = 0; $i < sizeof($users); $i++){
			if($users[$i] != $u_creator){
				newNotification($users[$i], "joinGroup:".getGroupByHash($ranhash)['id']);
			}
		}
		return $ranhash;
	} else {
		return "failed";
	}
}

function getGroupById($groupID){
	global $pdo;
    $statement = $pdo->prepare("SELECT * FROM `groups` WHERE `id` = ?");
	$statement->execute(array($groupID));
	$res = $statement->fetchAll()[0];
    return $res;
}

function getNotifications($u_username, $u_session){
	if(sessionDataCorrect($u_username, $u_session)){
		global $pdo;
		$statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
		$statement->execute(array($u_username));
		$res = $statement->fetchAll()[0];
		$ntfct = explode("$", $res['notifications']);
		$length = sizeof($ntfct);
		for($i = 0; $i < $length; $i++){
			$ntfct[$i] = explode(":", $ntfct[$i]);
			if($ntfct[$i][0] == "joinGroup"){
				$group = getGroupById($ntfct[$i][1]);
				$ntfct[$i] = [$ntfct[$i][0], $group['hash'], $group['name'], $group['admin'], $group['description']];
			}
		}
		return json_encode($ntfct);
	} else {
		return "failed";
	}
}

function removeNotification($u_username, $u_session, $id, $code){
	if(sessionDataCorrect($u_username, $u_session)){
		global $pdo;
		$statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
		$statement->execute(array($u_username));
		$res = $statement->fetchAll()[0];
		$ntfct = explode("$", $res['notifications']);
		
		if(explode(":", $ntfct[$id])[0] == "joinGroup"){
			if($code == "join"){
				addGroupToUser($u_username, getGroupById(explode(":", $ntfct[$id])[1])['hash']);
			}
		}
		
		$setout = str_replace("REM0VED", "", str_replace("\$REM0VED", "", str_replace("REM0VED$", "", str_replace($ntfct[$id], "REM0VED", $res['notifications']))));
		$sql = "UPDATE `users` SET `notifications` = :setout WHERE `username` = :username";
		$data = [
			'username' => $u_username,
			'setout' => $setout,
		];
		$statement = $pdo->prepare($sql);
		$statement->execute($data);
		
		if(explode(":", $ntfct[$id])[0] == "joinGroup"){
			if($code == "join"){
				newNotification($u_username, "simple:success:Sie sind der Gruppe <i>".getGroupById(explode(":", $ntfct[$id])[1])['name']."</i> beigetreten.");
			} else {
				newNotification($u_username, "simple:warning:Sie haben die Einladung zur Gruppe <i>".getGroupById(explode(":", $ntfct[$id])[1])['name']."</i> abgelehnt.");
			}
		}
		return "success";
	} else {
		return "failed";
	}
}


function getGroups($u_username, $u_session){
	if(sessionDataCorrect($u_username, $u_session)){
		global $pdo;
		$statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
		$statement->execute(array($u_username));
		$res = $statement->fetchAll()[0];
		$groups = explode(",", str_replace("GROUPS=", "", explode(";", $res['settings'])[2]));
		$out = [];
		if($groups[0] == ""){
		} else {
			for($i = 0; $i < sizeof($groups); $i++){
				$group = getGroupById($groups[$i]);
				$usersGroup = explode(",", $group['users']);
				if(in_array($u_username, $usersGroup)){
					array_push($out, [$group['name'], $group['users'], $group['admin'], $group['description'], $group['hash']]);
				}
			}
		}
		return $out;
	} else {
		return "failed";
	}
}

function leaveGroup($u_username, $u_session, $u_groupHash){
	if(sessionDataCorrect($u_username, $u_session)){
		global $pdo;
		$group = getGroupByHash($u_groupHash);
		$usersGroup = explode(",", $group['users']);
		$usersOut = "";
		if(in_array($u_username, $usersGroup)){
			if($group['users'] != $u_username){
				$usersOut = str_replace(",".$u_username, "", str_replace($u_username.",", "", $group['users']));
			}
			$sql = "UPDATE `groups` SET `users` = :users WHERE `hash` = :hash";
			$data = [
				'users' => $usersOut,
				'hash' => $u_groupHash,
			];
			$statement = $pdo->prepare($sql);
			$statement->execute($data);
			
			$statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
			$statement->execute(array($u_username));
			$res = $statement->fetchAll()[0];
			
			$uhome = getHomeData($u_username)[5][2];
			$userGroups = str_replace($group['id'], "", str_replace($group['id'].",", "", str_replace(",".$group['id'], "", $uhome)));
			$data = [
				'settings' => str_replace($uhome, $userGroups, $res['settings']),
				'username' => $u_username,
			];
			$sql = "UPDATE `users` SET `settings` = :settings WHERE `username` = :username";
			$statement = $pdo->prepare($sql);
			$statement->execute($data);
			
			if($group['admin'] == $u_username){
				if($group['users'] != ""){
					$data = [
						'hash' => $u_groupHash,
						'admin' => explode(",", $group['users'])[0],
					];
					$sql = "UPDATE `groups` SET `admin` = :admin WHERE `hash` = :hash";
					$statement = $pdo->prepare($sql);
					$statement->execute($data);
				}
			}
			newNotification($u_username, "simple:danger:Sie haben die Gruppe <i>".$group['name']."</i> verlassen.");
			return "success";
		} else {
			return "failed_not_member";
		}
	} else {
		return "failed";
	}
}


function changePassword($u_username, $u_session, $u_password, $u_password_new){
	if(sessionDataCorrect($u_username, $u_session)){
		if(loginDataCorrect($u_username, $u_password)){
			global $pdo;
			$data = [
				'password' => password_hash($u_password_new,PASSWORD_DEFAULT),
				'username' => $u_username,
			];
			$sql = "UPDATE `users` SET `password` = :password WHERE `username` = :username";
			
			$statement = $pdo->prepare($sql);
			$statement->execute($data);
			
			return "success";
		} else {
			return "failed_passwd";
		}
	} else {
		return "failed";
	}
}

function changeEmail($u_username, $u_session, $u_email){
	if(sessionDataCorrect($u_username, $u_session)){
		global $pdo;
		$data = [
			'email' => $u_email,
			'username' => $u_username,
			'session' => guidv4(random_bytes(16)),
		];
		$sql = "UPDATE `users` SET `email` = :email, `verify-email` = '0', `session` = :session WHERE `username` = :username";
		
		$statement = $pdo->prepare($sql);
		$statement->execute($data);
		
		return "success";
	} else {
		return "failed";
	}
}

function changeUsername($u_username, $u_session, $u_newUsername){
	if(sessionDataCorrect($u_username, $u_session)){
		if(existsUser($u_newUsername) == false){
			global $pdo;
			$statement = $pdo->prepare("SELECT * FROM `users` WHERE `username` = ?");
			$statement->execute(array($u_username));
			$res = $statement->fetchAll()[0];
			$data = [
				'id' => $res['id'],
				'username' => $u_newUsername,
			];
			$sql = "UPDATE `users` SET `username` = :username WHERE `id` = :id";
			
			$statement = $pdo->prepare($sql);
			$statement->execute($data);
			
			return "success";
		} else {
			return "username_already_taken";
		}
	} else {
		return "failed";
	}
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
