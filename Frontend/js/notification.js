/*
	notification.js - display and interact with notifications

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

async function getNotifications() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    var fullurl = server_url + '/backend/index.php?request=getNotifications&username=' + l_username + "&session=" + l_session;
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
                var nBox = document.getElementById("notification");
                var noti = document.createElement("div");
                noti.setAttribute("role", "alert");
                noti.setAttribute("id", "alert" + i);
                if(ntfcn[i][0] == "welcome"){
                    noti.setAttribute("class", "alert alert-success");
                    noti.innerHTML = '<button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="closeAlert(' + i + ', \'NULL\')"><span aria-hidden="true">&times;</span></button>' + 
                    '<h5 class="alert-heading">Willkommen bei <strong>Helfy</strong></h5>' +
                    'Sie haben sich erfolgreich registriert!';
                    nBox.appendChild(noti);
                    notified = false;
                }
                if(ntfcn[i][0] == "joinGroup"){
                    noti.setAttribute("class", "alert alert-info");
                    noti.innerHTML = '<h5 class="alert-heading">Einladung zu <i>' + ntfcn[i][2] + '</i></h5>' +
                    '<p >Sie wurden von <a href="user.html?u=' + ntfcn[i][3] + '" class="user">@' + ntfcn[i][3] + '</a> eingeladen, der Gruppe <i>' + ntfcn[i][2] + '</i> beizutreten.</p>' +
                    'Diese Einladung <a href="#" class="alert-link" onclick="closeAlert(' + i + ', \'join\')">Annehmen</a> oder <a href="#" class="alert-link" onclick="closeAlert(' + i + ', \'reject\')">Ablehnen</a>.'
                    nBox.appendChild(noti);
                    notified = false;
                }
                if(ntfcn[i][0] == "simple"){
                    noti.setAttribute("class", "alert alert-" + ntfcn[i][1]);
                    noti.innerHTML = '<button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="closeAlert(' + i + ', \'NULL\')"><span aria-hidden="true">&times;</span></button>' + ntfcn[i][2];
                    nBox.appendChild(noti);
                    notified = false;
                }
            }
            if(notified){
                var nBox = document.getElementById("notification");
                var noti = document.createElement("div");
                noti.setAttribute("role", "alert");
                noti.setAttribute("id", "alert" + i);
                noti.setAttribute("class", "alert alert-dark");
                noti.innerHTML = 'Keine Benachrichtigungen.';
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
        }
        console.log("fetch success");

    } catch (e) {
        console.error('fetch error', e);
        data = "fetch_error";
    }

}

async function closeNotification(id, code) {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    var fullurl = server_url + '/backend/index.php?request=removeNotification&username=' + l_username + "&session=" + l_session + "&id=" + id + "&code=" + code;
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });

        data = await request.text();
        console.log(data);
    
    } catch (e) {
        console.error('fetch error', e);
        data = "fetch_error";
    }
}

async function closeAlert(id, code){
    var nBox = document.getElementById("notification");
    var noti = document.getElementById("alert" + id);
    noti.innerHTML = "Wird entfernt..."
    await closeNotification(id, code);
    nBox.removeChild(noti);
    getNotifications();
}