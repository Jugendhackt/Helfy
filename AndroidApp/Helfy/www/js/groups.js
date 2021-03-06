/*
	groups.js - create, edit and lookup groups

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

var server_url = getCookie("server_url");


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


async function newGroup(tnum) {
    var runon = false;
    var sameusername = false;
    var name = document.getElementById("groupname").value;
    var users = getCookie("username");
    var description = document.getElementById("description").value;
    
    runon = (name != "" && description != "");
    for(i = 2; i <= tnum; i++){
        users = users + "," + document.getElementById("validationUsername" + i).value;
        if(document.getElementById("validationUsername" + i).value == ""){
            runon = false;
        }

        if(document.getElementById("validationUsername" + i).value == getCookie("username")){
        sameusername = true;
        }
    }
    if(runon){
        var fullurl = server_url + '/backend/index.php?request=newGroup&username=' + getCookie("username") + "&session=" + getCookie("session") + "&users=" + users + "&groupname=" + name + "&description=" + description;
        try {
            let request = await fetch(fullurl, {
                method: "GET",
                dataType: "application/x-www-form-urlencoded",
            });

            data = await request.text();
            console.log(data);
            console.log("fetch success");
            document.getElementById("errorline").innerHTML = "Gruppe erfolgreich erstellt!";
            document.getElementById("errorline").style.color = "green";

        } catch (e) {
            console.error('fetch error', e);
            data = "fetch_error";
        }
    } else {
        document.getElementById("errorline").innerHTML = "Füllen Sie alle Felder aus!";
        document.getElementById("errorline").style.color = "red";        
    }

    if (sameusername){
        document.getElementById("errorline").innerHTML = "Sie können sich nicht selbst zu einer Gruppe hinzufügen!";
        document.getElementById("errorline").style.color = "red";
    }

    

setTimeout(function (){

    self.location.href = "home.html";
  
  }, 500);
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

async function getGroups(){
    var fullurl = server_url + '/backend/index.php?request=getGroups&username=' + getCookie("username") + "&session=" + getCookie("session");
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });

        data = await request.json();
        var div = document.getElementById("notification");
        if(data == "failed"){
            var noti = document.createElement("div");
            noti.setAttribute("role", "alert");
            noti.setAttribute("class", "alert alert-warning");
            noti.innerHTML = 'Falsche Sitzungsdaten, bitte melden Sie sich erneut an.';
            div.appendChild(noti)
        } else {
            for(i in data){
                var noti = document.createElement("div");
                noti.setAttribute("role", "alert");
                noti.setAttribute("id", "alert" + data[i][4]);
                noti.setAttribute("class", "alert alert-dark");
                noti.style.paddingBottom = "0";
                usersLs = data[i][1].split(",");
                users = ""
                for(j in usersLs){
                    users += "<a class='user' href='profile.html?user=" + usersLs[j] + "'>@" + usersLs[j] + "</a> ";
                }
                noti.innerHTML = '<h5 class="alert-heading">' + data[i][0] + "</h5><p>" + data[i][3] + "</p><p>Teilnehmer: " + users + "<p style='margin-bottom: 0; color: red; text-align: right; margin-bottom: 1%; cursor: pointer;' onclick='leaveGroup(\"" + data[i][4] + "\")'>Gruppe verlassen</p>";
                div.appendChild(noti)
            }
        }

        console.log(data);
        console.log("fetch success");

    } catch (e) {
        console.error('fetch error', e);
        data = "fetch_error";
    }
}

async function leaveGroup(groupHash){
    var username = getCookie("username");
    var session = getCookie("session");

    var fullurl = server_url + '/backend/index.php?request=leaveGroup&username=' + username + '&session=' + session + '&groupHash=' + groupHash;
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });

        console.log("fetch success");

    } catch (e) {
        console.error('fetch error', e);
        data = "fetch_error";
    }

    document.getElementById("alert" + groupHash).style.display = "none";
}

async function addGroups(){
    var fullurl = server_url + '/backend/index.php?request=getGroups&username=' + getCookie("username") + "&session=" + getCookie("session");
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });

        data = await request.json();
        var auswahl = document.getElementById("gruppenauswahl");

        if(data == "failed"){
            document.getElementById("einschraenken").style.display = "none";
            var newauswahl = document.createElement("option");
                newauswahl.setAttribute("value", "failed");
                newauswahl.setAttribute("selected", "selected");
                newauswahl.innerHTML = "Falsche Sitzungsdaten!";
                auswahl.appendChild(newauswahl);
        } else {

            var newnauswahl = document.createElement("option");
                newnauswahl.setAttribute("value", "public");
                newnauswahl.setAttribute("id", "einschraenken");
                newnauswahl.innerHTML = "-- Suchergebnisse einschränken --";
                auswahl.appendChild(newnauswahl);

            for(i in data){
                var newauswahl = document.createElement("option");
                newauswahl.setAttribute("value", "group" + data[i][4]);
                newauswahl.innerHTML = data[i][5]; //data[i][5] should be the group-ID
                console.log(data[i]);
                auswahl.appendChild(newauswahl);
            }
            if(data.length == 0){
                document.getElementById("einschraenken").style.display = "none";
                var newauswahl = document.createElement("option");
                newauswahl.setAttribute("value", "nomember");
                newauswahl.setAttribute("selected", "selected");
                newauswahl.innerHTML = "Sie sind noch kein Teilnehmer einer Gruppe!";
                auswahl.appendChild(newauswahl);
            }
        }

        console.log(data);
        console.log("fetch success");

    } catch (e) {
        console.error('fetch error', e);
        data = "fetch_error";
    }
}

async function addGroupsm(){
    var fullurl = server_url + '/backend/index.php?request=getGroups&username=' + getCookie("username") + "&session=" + getCookie("session");
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });

        data = await request.json();
        var auswahlm = document.getElementById("gruppenauswahlm");

        if(data == "failed"){
            document.getElementById("einschraenkenm").style.display = "none";
            var newauswahlm = document.createElement("option");
                newauswahlm.setAttribute("value", "failed");
                newauswahlm.setAttribute("selected", "selected");
                newauswahlm.innerHTML = "Falsche Sitzungsdaten!";
                auswahlm.appendChild(newauswahlm);
        } else {

            var newnauswahlm = document.createElement("option");
                newnauswahlm.setAttribute("value", "0");
                newnauswahlm.setAttribute("id", "einschraenken");
                newnauswahlm.innerHTML = "-- Suchergebnisse einschränken --";
                auswahlm.appendChild(newnauswahlm);

            for(i in data){
                var newauswahlm = document.createElement("option");
                newauswahlm.setAttribute("value", "group" + data[i][4]);
                newauswahlm.innerHTML = data[i][0];
                auswahlm.appendChild(newauswahlm);
            }
            if(data.length == 0){
                document.getElementById("einschraenkenm").style.display = "none";
                var newauswahlm = document.createElement("option");
                newauswahlm.setAttribute("value", "nomember");
                newauswahlm.setAttribute("selected", "selected");
                newauswahlm.innerHTML = "Sie sind noch kein Teilnehmer einer Gruppe!";
                auswahlm.appendChild(newauswahlm);
            }

            if(getCookie("username") == ""){
                document.getElementById("einschraenkenm").style.display = "none";
                var newauswahlm = document.createElement("option");
                newauswahlm.setAttribute("value", "nologin");
                newauswahlm.setAttribute("selected", "selected");
                newauswahlm.innerHTML = "Bitte melden sie sich an!";
                auswahlm.appendChild(newauswahlm);
            }
        }

        console.log(data);
        console.log("fetch success");

    } catch (e) {
        console.error('fetch error', e);
        data = "fetch_error";
    }
}