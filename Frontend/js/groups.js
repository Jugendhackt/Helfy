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