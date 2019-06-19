/*
	session.js - session management of frontend
	Copyright 2019 Achim Stumpp, Jakob Stolze
 	This file is part of Helfy - https://github.com/Jugendhackt/Helfy
    Helfy is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    Helfy is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with Helfy.  If not, see <http://www.gnu.org/licenses/>.
    Diese Datei ist Teil von Helfy.
    Helfy ist Freie Software: Sie können es unter den Bedingungen
    der GNU General Public License, wie von der Free Software Foundation,
    Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
    veröffentlichten Version, weiter verteilen und/oder modifizieren.
    Helfy wird in der Hoffnung, dass es nützlich sein wird, aber
    OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
    Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
    Siehe die GNU General Public License für weitere Details.
    Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
    Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/



var server_url = "";

var rawFile = new XMLHttpRequest();
rawFile.open("GET", "server.txt", false);
rawFile.onreadystatechange = function (){
    if(rawFile.readyState === 4){
        if(rawFile.status === 200 || rawFile.status == 0){
                server_url = rawFile.responseText;
        }
    }
}
rawFile.send(null);

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

function settingsInvalidSession(){
    document.getElementById("formular1").innerHTML = "Falsche oder fehlende Nutzerdaten.<br>Bitte melden Sie sich erneut an!<br><br><button class='btn btn-primary' onclick='self.location.href=\"login.html\"'>zurück zum Login</button>";
    document.getElementById("formular1").style.textAlign = "center";
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
                setCookie("notification", sdata[6], 7);
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
            } else {
                document.getElementById("notifyBadge").setAttribute("style", "display: none;");
            }

            var navPage = document.createElement("div");
            navPage.id = "formular";
            navPage.style.textAlign = "center";
            navPage.innerHTML = "<h5>Hilfe suchen und anbieten" +
                "</h5><button class='btn btn-primary' onclick='self.location.href=\"mitfahrer.html\"'>Suchen</button>" +
                "<button class='btn btn-primary' onclick='self.location.href=\"antrag.html\"'>Anbieten</button><br>";
            var ih = document.getElementById("insertHere")
            ih.appendChild(navPage);
            console.log("fetch success");

            var groups = document.createElement("div");
            groups.id = "formular";
            groups.style.textAlign = "center";
            groups.innerHTML = "<h5>Gruppen</h5>" +
                "<button class='btn btn-primary' onclick='self.location.href=\"newgroup.html\"'>Neue Gruppe erstellen</button><br>" +
                "";
            ih.appendChild(groups);
            document.getElementById("notifyBadge").innerHTML = sdata[6];
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
            settingsInvalidSession();
            toRightUsername()

        } else {
            sdata = JSON.parse(sdata);
            document.getElementById("usernameInp").value = sdata[1].toLowerCase() + "." + sdata[2].toLowerCase();
        }

    } catch (e) {
        console.error('fetch error', e);
        sdata = "fetch_error";
    }
}


async function changeUsername() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    var newUsername = document.getElementById("usernameInp").value
    var fullurl = server_url + '/backend/index.php?request=changeUsername&username=' + l_username + "&session=" + l_session + "&newUsername=" + newUsername;
    if(newUsername == "" || newUsername == l_username){
        document.getElementById("no-username").style.display = "";
        document.getElementById("cusername").style.paddingTop = "";
    }
    else {
        document.getElementById("no-username").style.display = "none";
        document.getElementById("cusername").style.paddingTop = "20px";
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });
        sdata = await request.text();
        if (sdata == "username_already_taken") {
            console.log("username_already_taken");
        } else if(sdata == "failed"){
            console.log("invalid session");
            settingsInvalidSession();
            toRightUsername()
        } else {
            document.getElementById("h3username").innerHTML = "@" + newUsername;
            setCookie("username", newUsername, 7);
        }

    } catch (e) {
        console.error('fetch error', e);
        sdata = "fetch_error";
    }
  }
}

async function changePassword() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    var newPassword1 = document.getElementById("changepsswd1").value;
    var newPassword2 = document.getElementById("changepsswd2").value;
    var password = document.getElementById("oldpsswd").value;
    if(password == "" || newPassword1 == "" || newPassword1 == password){
        document.getElementById("no-password").style.display = "";
        document.getElementById("cpassword").style.paddingTop = "";
    }
    else{
        document.getElementById("no-password").style.display = "none";
        document.getElementById("cpassword").style.paddingTop = "20px";
    if(newPassword1 == newPassword2){
        document.getElementById("w-passwd-repeat").style.display = "none";
        var fullurl = server_url + '/backend/index.php?request=changePassword&username=' + l_username + "&session=" + l_session + "&passwordNew=" + newPassword1 + "&password=" + password;
        try {
            let request = await fetch(fullurl, {
                method: "GET",
                dataType: "application/x-www-form-urlencoded",
            });
            sdata = await request.text();
            console.log(sdata);
            if (sdata == "failed_passwd") {
                console.log("failed (wrong password)");
                document.getElementById("oldpsswd").setAttribute("style", "border-color: red;");
            } else if(sdata == "failed"){
                console.log("invalid session");
                settingsInvalidSession();
                toRightPsswd()
            } else {
                document.getElementById("oldpsswd").setAttribute("style", "");
                document.getElementById("pwdFeedback").innerHTML = "Erfolgreich!";
                document.getElementById("pwdFeedback").style.display = "";
                console.log("success");
            }

        } catch (e) {
            console.error('fetch error', e);
            sdata = "fetch_error";
        }
    }
    else{
        document.getElementById("w-passwd-repeat").style.display = "";
    }
 }
}


async function changeProfileSettings() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    var pblc = "0";
    if(document.getElementsByName("options")[1].checked){
        pblc = "1";
    }
    if(document.getElementsByName("options")[2].checked){
        pblc = "2";
    }

    var ml = "0";
    if(document.getElementsByName("optionsB")[1].checked){
        ml = "1";
    }

    var fullurl = server_url + '/backend/index.php?request=changeProfileSettings&username=' + l_username + "&session=" + l_session + "&mail=" + ml + "&type=" + pblc;
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });
        sdata = await request.text();
        console.log(sdata);
        if (sdata == "failed") {
            console.log("failed");
        } else {
            console.log("success");
        }

    } catch (e) {
        console.error('fetch error', e);
        sdata = "fetch_error";
    }
}

async function changeEmail() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    var email = document.getElementById("changeemailInp").value;
    var fullurl = server_url + '/backend/index.php?request=changeEmail&username=' + l_username + "&session=" + l_session + "&email=" + email;
    if(email == ""){
        document.getElementById("no-email").style.display = "";
        document.getElementById("cemail").style.paddingTop = "";
        document.getElementById("safety-note").style.display = "none";
    }
    else{
        document.getElementById("no-email").style.display = "none";
        document.getElementById("cemail").style.paddingTop = "20px";
        document.getElementById("safety-note").style.display = "";
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });
        sdata = await request.text();
        console.log(sdata);
        if(sdata == "failed"){
            console.log("invalid session");
            settingsInvalidSession();
            toRightEmail()
        } else {
            console.log("success");
            logout();
        }

    } catch (e) {
        console.error('fetch error', e);
        sdata = "fetch_error";
    }
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

async function setupSettings() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");

    var fullurl = server_url + '/backend/index.php?request=getSettings&username=' + l_username + "&session=" + l_session;
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });

        data = await request.json();
        console.log("success");

        prvt = data["PROFILE"][0];
        ml = data["PROFILE"][2];

        if(prvt != "1"){
            document.getElementsByName("options")[parseInt(prvt)].checked = true;
            document.getElementsByName("options")[1].checked = false;
            document.getElementById("la" + prvt).classList = "btn btn-outline-dark btn-sm active";
            document.getElementById("la1").classList = "btn btn-outline-dark btn-sm";
        } else {
            document.getElementsByName("options")[0].checked = false;
            document.getElementsByName("options")[2].checked = false;
            document.getElementsByName("options")[1].checked = true;
            document.getElementById("la0").classList = "btn btn-outline-dark btn-sm";
            document.getElementById("la2").classList = "btn btn-outline-dark btn-sm";
            document.getElementById("la1").classList = "btn btn-outline-dark btn-sm active";
        }

        if(ml == "0"){
            document.getElementsByName("optionsB")[0].checked = true;
            document.getElementsByName("optionsB")[1].checked = false;
            document.getElementById("lb0").classList = "btn btn-outline-dark btn-sm active";
            document.getElementById("lb1").classList = "btn btn-outline-dark btn-sm";
        } else {
            document.getElementsByName("optionsB")[1].checked = true;
            document.getElementsByName("optionsB")[0].checked = false;
            document.getElementById("lb1").classList = "btn btn-outline-dark btn-sm active";
            document.getElementById("lb0").classList = "btn btn-outline-dark btn-sm";
        }


    } catch (e) {
        console.error('fetch error', e);
        data = "fetch_error";
    }
}


function checkTime(){
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var currenttime = day + "." + month + "." + year + "," + hour + ":" + minutes;
    var getdate = document.querySelector("#date").value;

    if (month == 0){
        month = 12;
    }

    if (getdate <= currenttime){
        document.getElementById("maincontent").style.display = "none";
        document.getElementById("wrongdate").style.display = "";
    }
}

async function hideIfSessionInvalid() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    var fullurl = server_url + '/backend/index.php?request=checkSessionData&username=' + l_username + "&session=" + l_session;
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });

        data = await request.text();
        if(data != "correct"){
            document.getElementById("menu").style.display = "none";
            document.getElementById("loginLink").innerHTML = "Login";
        } else {
            document.getElementById("loginLink").innerHTML = "Home";
            document.getElementById("loginLink").href = "home.html";
        }
        console.log("fetch success");

    } catch (e) {
        console.error('fetch error', e);
        document.getElementById("menu").style.display = "none";
    }
}


function menu(){
    var username = getCookie("username");
    if (username == ""){
        document.getElementById("menu").style.display = "none";
    } else {
        document.getElementById("loginLink").innerHTML = "Home";
    }
    hideIfSessionInvalid();
}

function alreadyLoggedIn(){
    var username = getCookie("username");
    if (username != ""){
        self.location.href="home.html";
    }
}

function alreadyRegistrated(){
    var username = getCookie("username");
    if (username != ""){
        document.getElementById("maincontent").style.display = "none";
        document.getElementById("alreadyregistrated").style.display = "";
    }
}

function footer(){
    var thisdate = new Date;
    var thisyear = thisdate.getFullYear();

    document.getElementById("thisyear").innerHTML = thisyear;
}

async function setupPublicProfile(){
    var url_string = window.location.href;
    var url = new URL(url_string);
    var c = url.searchParams.get("user");

    var l_username = getCookie("username");
    var l_session = getCookie("session");

    var fullurl = server_url + '/backend/index.php?request=getPublicProfile&username=' + l_username + "&session=" + l_session + "&profile=" + c;
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });

        data = await request.json();
        if(data == "private"){
            document.getElementById("formular1").innerHTML = "<p style='text-align: center;'><b>@" + c + "</b></p><p>Dieses Profil ist privat.</p>"
            document.getElementById("formular1").innerHTML += "<br> <button class='btn btn-primary' onclick='self.location.href=\"chat.html?p=" + c + "\"'>Chat öffnen</button>"
        } else if(data == "failed"){
            document.getElementById("formular1").innerHTML = "<p>Fehlgeschlagen.</p>"
        } else if(data == "user_doesnt_exist"){
            document.getElementById("formular1").innerHTML = "<p>Dieser Benutzer existiert nicht.</p>"
        } else {
            document.getElementById("formular1").innerHTML = "<p><b>" + data["vname"] + " " + data["nname"] + "</b><br>@" + data["username"];
            if(data["email"] != "not_given"){
                document.getElementById("formular1").innerHTML += "Email: <a href='mailto:" + data["email"] + "'>" + data["email"] + "</a>";
            }
            document.getElementById("formular1").innerHTML += "</p>";
            document.getElementById("formular1").innerHTML += "<br> <button class='btn btn-primary' onclick='self.location.href=\"chat.html?p=" + c + "\"'>Chat öffnen</button>"
            console.log(data);
        }

    } catch (e) {
        console.error('fetch error', e);
data = "fetch_error";
}
}

async function searchUsername(){
    var l_username = getCookie("username");  
    var l_session = getCookie("session"); 
    var search = document.getElementById("searchUser").value 
    document.getElementById("notificationB").innerHTML = "";
    await getChats();
    var fullurl = server_url + '/backend/index.php?request=searchUser&username=' + l_username + '&session=' + l_session + '&q=' + search; 
    try {  
         let request = await fetch(fullurl, {
                method: "GET",
                dataType: "application/x-www-form-urlencoded",
            });
        uname = await request.json();
        var notified = true;

        if(uname == "failed"){
            alert("fehler");
        } else {
            var nBox = document.getElementById("searchnotification");
            nBox.innerHTML = "";

            var rn = true;
            var i = 0;
            var liste = Array();

            while(rn){
                if(document.getElementById("alert" + i) == null || i > 1000){
                    rn = false;
                } else {
                    n = document.getElementById("alert" + i).getElementsByTagName("a")[0].innerHTML;
                    liste.push(n);
                    i++;
                }
            }

            if (uname.length == 1){
                var noti = document.createElement("div");
                noti.setAttribute("role", "alert");
                noti.setAttribute("id", "alerts0");
                noti.setAttribute("class", "alert alert-success");
                state = "Privates Profil";
                var i = 0;
                if(uname[i]["name"] != "unknown"){
                    state = uname[i]["name"];
                }
                if(liste.includes(uname[i]["username"])){
                    n = document.getElementById("alert" + liste.indexOf(uname[i]["username"]));
                    n.getElementsByTagName("button")[0].innerHTML = "Offenen Chat betreten"
                    nBox.appendChild(n);
                } else {
                    noti.innerHTML = '<h5 class="alert-heading"><a class="alert-heading" href="profile.html?user=' + uname[i]["username"] + '"</a>' + uname[i]["username"] + '<div style="font-size: 12px;">' + state + '</div></h5>' + "<button class='btn btn-primary' onclick='self.location.href=\"chat.html?p=" + uname[i]["username"] + "\"'>Neuen Chat beginnen</button>";
                    nBox.appendChild(noti);
                }
                notified = false;
            } else if(uname.length == 0){
                var noti = document.createElement("div");
                noti.setAttribute("role", "alert");
                noti.setAttribute("id", "alerts0");
                noti.setAttribute("class", "alert alert-warning");
                noti.innerHTML = "Keine Suchtreffer für \"" + search + "\" gefunden.";
                nBox.appendChild(noti);
            } else {
                for(i in uname){
                    var noti = document.createElement("div");
                    noti.setAttribute("role", "alert");
                    noti.setAttribute("id", "alerts" + i);
                    noti.setAttribute("class", "alert alert-success");
                    state = "Privates Profil";
                    if(uname[i]["name"] != "unknown"){
                        state = uname[i]["name"];
                    }
                    if(liste.includes(uname[i]["username"])){
                        n = document.getElementById("alert" + liste.indexOf(uname[i]["username"]));
                        n.getElementsByTagName("button")[0].innerHTML = "Offenen Chat betreten"
                        nBox.appendChild(n);
                    } else {
                        noti.innerHTML = '<h5 class="alert-heading"><a class="alert-heading" href="profile.html?user=' + uname[i]["username"] + '"</a>' + uname[i]["username"] + '<div style="font-size: 12px;">' + state + '</div></h5>' + "<button class='btn btn-primary' onclick='self.location.href=\"chat.html?p=" + uname[i]["username"] + "\"'>Neuen Chat beginnen</button>";
                        nBox.appendChild(noti);
                    }
                }
            }
            
        }
    }
    catch (e) {
        console.error('fetch error', e);
}
}