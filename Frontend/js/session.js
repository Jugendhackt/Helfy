/*
Session management
*/

var server_url = "https://example.url.com";


var data = "";

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = "helfy_" + cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
    var name = "helfy_" + cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
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
        data = "fetch_error";
    }

}

async function loginAction() {
    document.getElementById("errorline").innerHTML = "Überprüfen...";
    document.getElementById("errorline").style.padding = "10px 0px;";
    document.getElementById("errorline").style.color = "black";
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    await login(username, password);
    retcode = data;
    if (retcode == "failed") {
        document.getElementById("errorline").innerHTML = "Benutzername oder Passwort ist falsch.";
        document.getElementById("errorline").style.padding = "10px 0px;";
        document.getElementById("errorline").style.color = "red";
    } else if (retcode == "fetch_error") {
        document.getElementById("errorline").innerHTML = "Verbindung mit Server fehlgeschlagen.";
        document.getElementById("errorline").style.padding = "10px 0px;";
        document.getElementById("errorline").style.color = "red";
    } else if (retcode.length == 36) {
        document.getElementById("errorline").innerHTML = "Erfolgreich.";
        document.getElementById("errorline").style.padding = "10px 0px;";
        document.getElementById("errorline").style.color = "green";
        setCookie("session", retcode, 7);
        setCookie("username", username, 7);
        window.location.href = "home.html";
    } else if (retcode == "no_email_verify"){
        console.log("no email verify");
        document.getElementById("errorline").innerHTML = "Sie müssen erst Ihre E-Mail Adresse bestätigen.";
        document.getElementById("errorline").style.padding = "10px 0px;";
        document.getElementById("errorline").style.color = "red";
    }
}

async function setupHome() {
    var username = getCookie("username");
    var session = getCookie("session");

    var fullurl = server_url + '/backend/index.php?request=homeData&username=' + username + "&session=" + session;
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });

        sdata = await request.text();
        if(sdata == "no_email_verify"){
            uinf = document.getElementById("userinfo");
            uinf.innerHTML = "Sie müssen Ihre E-Mail Adresse bestätigen, bevor Sie Helfy nutzen können!<br><br><button class='btn btn-primary' onclick='self.location.href=\"login.html\"'>zurück zum Login</button>";
            console.log("no email verify");
        } else {
        sdata = JSON.parse(sdata);

        uinf = document.getElementById("userinfo");
        uinf.innerHTML = "<b>" + sdata[1] + " " + sdata[2] + "</b><br><a class='user' href=''>@" + sdata[0] + "</a><br><br>" + sdata[4] + " " + sdata[3];
        console.log("fetch success");
        }

    } catch (e) {
        console.log("fetch error");
        sdata = "fetch_error";
    }
}