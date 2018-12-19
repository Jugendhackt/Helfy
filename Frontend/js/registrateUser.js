/*
Registration
*/

var server_url = "https://example.url.com";


async function existsUser() {
    var fullurl = server_url + '/backend/index.php?request=existsUser&username' + username;
    try {
        const request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });
        const data = await request.text();
        document.getElementById("answer").value = data;
        console.log("fetch success");


    } catch (e) {
        console.error('fetch error', e);
    }

}


async function registrateUser() {
    var username = document.getElementById("validationUsername").value;
    var password = document.getElementById("validationPassword").value;
    var passwordWdh = document.getElementById("validationPasswordWdh").value;
    var email = document.getElementById("validationEmail").value;
    var vname = document.getElementById("validationVname").value;
    var nname = document.getElementById("validationNname").value;
    var ort = document.getElementById("validationOrt").value;
    var plz = document.getElementById("validationPlz").value;
    var fullurl = server_url + '/backend/index.php?request=registrateUser&username=' + username + '&password=' + password + '&email=' + email + '&vname=' + vname + '&nname=' + nname + '&plz=' + plz + '&ort=' + ort;
    if (password == passwordWdh) {
        try {
            const request = await fetch(fullurl, {
                method: "GET",
                dataType: "application/x-www-form-urlencoded",
            });
            const data = await request.text();
            console.log("js running");
            console.log(fullurl);


        } catch (e) {
            console.error('fetch error', e);
        }
    }

}


async function registrateUserFromData(username, password, passwordWdh, email, vname, nname, ort, plz) {
    var fullurl = server_url + '/backend/index.php?request=registrateUser&username=' + username + '&password=' + password + '&email=' + email + '&vname=' + vname + '&nname=' + nname + '&plz=' + plz + '&ort=' + ort;
    if (password == passwordWdh) {
        try {
            const request = await fetch(fullurl, {
                method: "GET",
                dataType: "application/x-www-form-urlencoded",
            });
            const data = await request.text();
            console.log(data);
            if (data == "failed") {
                console.log("registration failed");
                document.getElementById("simpleoutput").innerHTML = "Der Benutzername ist bereits vergeben!";
            } else {
                console.log("registration success");
                document.getElementById("simpleoutput").innerHTML = "Erfolgreich!<br><br>Sie bekommen nun eine E-Mail mit einem Bestätigungslink. Diesen müssen Sie öffnen um ihren Account nutzen zu können.";
            }


        } catch (e) {
            console.error('fetch error', e);
            document.getElementById("simpleoutput").innerHTML = "Die Verbindung zum Server ist fehlgeschlagen!";
        }
    } else {
        document.getElementById("simpleoutput").innerHTML = "Die Passwörter sind nicht gleich!";
    }
}