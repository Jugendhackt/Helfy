/*
	registrateUser.js

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
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.

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
            document.getElementById("simpleoutput").innerHTML = "<center>Die Verbindung zum Server ist fehlgeschlagen!</center><br />";
        }
    } else {
        document.getElementById("simpleoutput").innerHTML = "Die Passwörter sind nicht gleich!";
    }
}