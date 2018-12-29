/*
Display and interact with notifications
*/

var server_url = "https://example.url.com";


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