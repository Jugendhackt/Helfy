/*
	chat.js - display and send messages

	Copyright 2019 Jakob Stolze

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

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){
            return pair[1];
        }
    }
    return(false);
}

async function getChats() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    if(getQueryVariable("p") != ""){
        var fullurl = server_url + '/backend/index.php?request=getChat&username=' + l_username + "&session=" + l_session + "&partner=" + getQueryVariable("p");
        try {
            let request = await fetch(fullurl, {
                method: "GET",
                dataType: "application/x-www-form-urlencoded",
            });

            data = await request.json();
            if(data == "invalid_receiver"){
                var nBox = document.getElementById("notification");
                var noti = document.createElement("div");
                noti.setAttribute("class", "formular");
                noti.innerHTML = "Es existiert keine Person mit dem Nutzernamen <i>@" + getQueryVariable("p") + "</i>";
                noti.style.textAlign = "center";
                nBox.appendChild(noti);
                nBox.setAttribute("class", "");
                document.getElementById("sendmdiv").remove()
            } else if(data != "failed"){
                ntfcn = data;
                console.log(data);
                notified = true;
                document.getElementById("notification").innerHTML = "";
                for(var i = 0; i < ntfcn.length; i++){
                    var nBox = document.getElementById("notification");
                    var noti = document.createElement("div");
                    document.getElementById("menu").style.display = "none";
                    document.getElementById("backbutton").style.display = "";
                    document.getElementById("footer").style.display = "none";
                    document.getElementById("header").innerHTML = "<a href='profile.html?user=" + getQueryVariable("p") + "' style='color: black;'>" + getQueryVariable("p") + "</a>";
                    noti.setAttribute("role", "alert");
                    noti.setAttribute("id", "alert" + i);
                    noti.style.wordWrap = "break-word";
                    if(ntfcn[i]["sender"] == l_username){
                        noti.setAttribute("class", "alert alert-success");
                        noti.style.width = "80%";
                        noti.style.float = "right";
                        noti.style.marginRight = "0.5%";
                        noti.innerHTML = ntfcn[i]["message"] + "<br>" + "<i><font style='font-size: 10px; float: right;'>" + ntfcn[i]["timestamp"] + "</i></font>";
                        nBox.appendChild(noti);
                        notified = false;
                        document.getElementById("alert" +  i).scrollIntoView()
                    } else {
                        noti.setAttribute("class", "alert alert-primary");
                        noti.style.width = "80%";
                        noti.style.float = "left";
                        noti.style.marginLeft = "0.5%";
                        noti.innerHTML = ntfcn[i]["message"] + "<br>" + "<font style='font-size: 10px; float: right;'><i>" + ntfcn[i]["timestamp"] + "</i></font>";
                        nBox.appendChild(noti);
                        notified = false;
                        document.getElementById("alert" + i).scrollIntoView()
                    }
                }
                if(notified){
                    var nBox = document.getElementById("notification");
                    var noti = document.createElement("div");
                    noti.setAttribute("role", "alert");
                    noti.setAttribute("id", "alert" + i);
                    noti.setAttribute("class", "alert alert-dark");
                    noti.innerHTML = 'Keine Nachrichten in diesem Chat.';
                    nBox.appendChild(noti);
                }
            } else {
                var nBox = document.getElementById("notification");
                var noti = document.createElement("div");
                noti.setAttribute("class", "formular");
                noti.innerHTML = "Falsche oder fehlende Nutzerdaten.<br>Bitte melden Sie sich erneut an!<br><br><button class='btn btn-primary' onclick='self.location.href=\"login.html\"'>zurück zum Login</button>";
                noti.style.textAlign = "center";
                nBox.appendChild(noti);
                nBox.setAttribute("class", "");
                document.getElementById("sendmdiv").innerHTML = "";
            }
            console.log("fetch success");

        } catch (e) {
            console.error('fetch error', e);
            data = "fetch_error";
        }
    } else {
        var fullurl = server_url + '/backend/index.php?request=getChats&username=' + l_username + "&session=" + l_session;
        document.getElementById("sendmdiv").remove()
        try {
            let request = await fetch(fullurl, {
                method: "GET",
                dataType: "application/x-www-form-urlencoded",
            });

            data = await request.text();
            if(data != "failed"){
                ntfcn = JSON.parse(data);
                console.log(data);
                notified = true;
                document.getElementById("notification").innerHTML = "";
                for(i in ntfcn){
                    var nBox = document.getElementById("notificationB");
                    var noti = document.createElement("div");
                    noti.setAttribute("role", "alert");
                    noti.setAttribute("id", "alert" + i);
                    noti.setAttribute("class", "alert alert-success");
                    noti.innerHTML = '<h5 class="alert-heading"><a class="alert-heading" href="profile.html?user=' + ntfcn[i] + '"</a>' + ntfcn[i] + '</h5>' + "<button class='btn btn-primary' onclick='self.location.href=\"chat.html?p=" + ntfcn[i] + "\"'>Chat betreten</button>"
                    nBox.appendChild(noti);
                    notified = false;
                }
                if(notified){
                    var nBox = document.getElementById("notification");
                    var noti = document.createElement("div");
                    noti.setAttribute("role", "alert");
                    noti.setAttribute("id", "alert" + i);
                    noti.setAttribute("class", "alert alert-dark");
                    noti.innerHTML = 'Du hast noch keine Chats.';
                    nBox.appendChild(noti);
                }
            } else {
                var nBox = document.getElementById("notification");
                var noti = document.createElement("div");
                noti.setAttribute("class", "formular");
                noti.innerHTML = "Falsche oder fehlende Nutzerdaten.<br>Bitte melden Sie sich erneut an!<br><br><button class='btn btn-primary' onclick='self.location.href=\"login.html\"'>zurück zum Login</button>";
                noti.style.textAlign = "center";
                nBox.appendChild(noti);
                nBox.setAttribute("class", "");
                document.getElementById("sendmdiv").innerHTML = "";
            }
            console.log("fetch success");

        } catch (e) {
            console.error('fetch error', e);
            data = "fetch_error";
        }
    }

}

async function sendMessage() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    var message = document.getElementById("messageSend").value;
    document.getElementById("messageSend").value = "";
    console.log(message);
    if(getQueryVariable("p") != ""){
        var fullurl = server_url + '/backend/index.php?request=sendMessage&username=' + l_username + "&session=" + l_session + "&partner=" + getQueryVariable("p") + "&message=" + message;
        try {
            let request = await fetch(fullurl, {
                method: "GET",
                dataType: "application/x-www-form-urlencoded",
            });

            data = await request.text();

            if(data == "success"){
                document.getElementById("sendmdiv").setAttribute("class", "alert alert-success")
                getChats();
                document.getElementById("sendmdiv").setAttribute("class", "alert alert-dark")
            } else {
                document.getElementById("sendmdiv").setAttribute("class", "alert alert-warning")
                document.getElementById("messageSend").value = message;
            }
        } catch (e) {
            console.error('fetch error', e);
            data = "fetch_error";
        }
    }
}