/*
Create, edit and lookup groups
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


async function newGroup(tnum) {
    var runon = false;
    var name = document.getElementById("groupname").value;
    var users = getCookie("username");
    var description = document.getElementById("description").value;
    runon = (name != "" && description != "");
    for(i = 2; i <= tnum; i++){
        users = users + "," + document.getElementById("validationUsername" + i).value;
        if(document.getElementById("validationUsername" + i).value == ""){
            runon = false;
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
                noti.innerHTML = '<h5 class="alert-heading">' + data[i][0] + "</h5><p>" + data[i][3] + "</p><p>Teilnehmer: <a href='' class='user'>@" + data[i][1].replace(",", "</a> <a href='' class='user'>@") + "</a><p style='margin-bottom: 0; color: red; text-align: right; margin-bottom: 1%; cursor: pointer;' onclick='leaveGroup(\"" + data[i][4] + "\")'>Gruppe verlassen</p>";
                div.appendChild(noti)
            }
            if(data.length == 0){
                var noti = document.createElement("div");
                noti.setAttribute("role", "alert");
                noti.setAttribute("id", "alert");
                noti.setAttribute("class", "alert alert-dark");
                noti.innerHTML = 'Sie sind noch kein Teilnehmer einer Gruppe.<br>Erstellen Sie eine <a href="newgroup.html" class="alert-link">neue Gruppe</a> oder nehmen Sie eine Einladung an.';
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