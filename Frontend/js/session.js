/*
Session management
*/

var server_url = "https://example.url.com";


var data = "";


function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


async function login(l_username, l_password) {
    var fullurl = server_url + '/backend/index.php?request=newSession&username=' + l_username + "&password=" + l_password;
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });

        data = await request.text();
        console.log("fetch success");

    } catch (e) {
        console.error('fetch error', e);
        data = "fetch errror";
    }

}

async function loginAction(){
    document.getElementById("errorline").innerHTML = "Überprüfen...";
    document.getElementById("errorline").style.padding = "10px 0px;";
    document.getElementById("errorline").style.color = "black";
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    await login(username, password);
    retcode = data;
    if(retcode == "failed"){
        document.getElementById("errorline").innerHTML = "Benutzername oder Passwort ist falsch.";
        document.getElementById("errorline").style.padding = "10px 0px;";
        document.getElementById("errorline").style.color = "red";
    } else if(retcode == "fetch_error"){
        document.getElementById("errorline").innerHTML = "Verbindung mit Server fehlgeschlagen.";
        document.getElementById("errorline").style.padding = "10px 0px;";
        document.getElementById("errorline").style.color = "red";
    } else if(retcode.length == 36) {
        document.getElementById("errorline").innerHTML = "Erfolgreich.";
        document.getElementById("errorline").style.padding = "10px 0px;";
        document.getElementById("errorline").style.color = "green";
        document.cookie = "session=" + retcode + "&username=" + username;
        window.location.href = "home.html"
    }
}