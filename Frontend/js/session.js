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
    console.log(data);
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
    } else if (retcode == "no_email_verify") {
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
        if (sdata == "no_email_verify") {
            uinf = document.getElementById("userinfo");
            uinf.innerHTML = "Sie müssen Ihre E-Mail Adresse bestätigen, bevor Sie Helfy nutzen können!<br><br><button class='btn btn-primary' onclick='self.location.href=\"login.html\"'>zurück zum Login</button>";
            console.log("no email verify");
        } else if(sdata == "failed"){
            uinf = document.getElementById("userinfo");
            uinf.innerHTML = "Falsche oder fehlende Nutzerdaten.<br>Bitte melden Sie sich erneut an!<br><br><button class='btn btn-primary' onclick='self.location.href=\"login.html\"'>zurück zum Login</button>";
            console.log("invalid session");
        } else {
            sdata = JSON.parse(sdata);

            uinf = document.getElementById("userinfo");
            uinf.innerHTML = "<b>" + sdata[1] + " " + sdata[2] + "</b><br><a class='user' href=''>@" + sdata[0] + "</a><br><br>" + sdata[4] + " " + sdata[3];

            if(sdata[6] != "0"){
                uinf.innerHTML += "<br><br>";
                var notif = document.createElement("div");
                notif.setAttribute("class", "alert alert-info")
                notif.style.textAlign = "center";
                if(sdata[6] == "1"){
                    notif.innerHTML = "Sie haben <a class='alert-link' href='notification.html'>1 neue Benachrichtigung</a>!";
                } else {
                    notif.innerHTML = "Sie haben <a class='alert-link' href='notification.html'>" + sdata[6] + " neue Benachrichtigungen</a>!";
                }
                document.getElementById("userinfo").appendChild(notif);
            }

            var navPage = document.createElement("div");
            navPage.id = "formular";
            navPage.style.textAlign = "center";
            navPage.innerHTML = "<h5>Mitfahrgelegenheiten:" +
                "</h5><button class='btn btn-primary' onclick='self.location.href=\"mitfahrer.html\"'>In der Nähe suchen</button>" +
                "<button class='btn btn-primary' onclick='self.location.href=\"antrag.html\"'>Bieten</button><br>" +
                "<br><h5>Einkäufe:</h5><button class='btn btn-primary' onclick='self.location.href=\"einkauf.html\"'>Suchen</button>" +
                "<button class='btn btn-primary' onclick='self.location.href=\"einkauf.html\"'>Bieten</button>";
            var ih = document.getElementById("insertHere")
            ih.appendChild(navPage);
            console.log("fetch success");

            var groups = document.createElement("div");
            groups.id = "formular";
            groups.style.textAlign = "center";
            groups.innerHTML = "<h5>Gruppen:</h5>" +
                "<button class='btn btn-primary' onclick='self.location.href=\"newgroup.html\"'>Neue Gruppe erstellen</button><br>" +
                "";
            ih.appendChild(groups);
        }

    } catch (e) {
        console.log("fetch error");
        sdata = "fetch_error";
        uinf = document.getElementById("userinfo");
        uinf.innerHTML = "Verbindung zum Server fehlgeschlagen.";
        document.getElementById("logbtn").innerHTML = "Login";
        document.getElementById("logbtn").onclick = "self.location.href='login.html'";
    }
}


async function usernameVorschlag() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    var fullurl = server_url + '/backend/index.php?request=homeData&username=' + l_username + "&session=" + l_session;
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });
        sdata = await request.text();
        if (sdata == "no_email_verify") {
            console.log("no email verify");
        } else if(sdata == "failed"){
            console.log("invalid session");
        } else {
            sdata = JSON.parse(sdata);
            document.getElementById("usernameInp").value = sdata[1].toLowerCase() + "." + sdata[2].toLowerCase();
        }

    } catch (e) {
        console.error('fetch error', e);
        sdata = "fetch_error";
    }
}


async function logout() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    setCookie("username", "", 0);
    setCookie("password", "", 0);
    var fullurl = server_url + '/backend/index.php?request=logout&username=' + l_username + "&session=" + l_session;
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });

        data = await request.text();
        console.log("fetch success");
        window.location.href = "login.html";

    } catch (e) {
        console.error('fetch error', e);
        data = "fetch_error";
    }
}