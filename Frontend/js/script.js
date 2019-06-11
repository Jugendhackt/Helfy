/*
	script.js

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
rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
            server_url = rawFile.responseText;
        }
    }
}
rawFile.send(null);



var lat = 0;
var lon = 0;



function getPos() { // Wird ausgeführt bei Klick auf GPS
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(convert);
    }
}

function convert(input) { // Konvertiert input von getPos in String um
    lat = input.coords.latitude;
    lon = input.coords.longitude;
    checkPos(lat + ',' + lon)
}

function readInput() { // Wird ausgeführt durch Form searchbar
    inputElement = document.getElementById("searchbar");
    inputContent = inputElement.value;
    if (inputContent == "") {
        inputElement = document.getElementById("searchbar2");
        inputContent = inputElement.value;
    }
    console.log(inputContent);
    checkPos(inputContent);
}

function showOSM(lon, lonb, lat, latb) {
    scale = 0.0003;
    lonb = (parseFloat(lonb) - scale).toString();
    latb = (parseFloat(latb) - scale).toString();
    lon = (parseFloat(lon) + scale).toString();
    lat = (parseFloat(lat) + scale).toString();
    mosm = document.getElementById("mapOSM");
    mosm.innerHTML = '<iframe style="width: 100%; height: 200px;" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=' + lat + '%2C' + lon + '%2C' + latb + '%2C' + lonb + '&amp;layer=mapnik" style="border: 1px solid black"></iframe>'
}


async function checkPos(search) { // Suche Koordinaten, "wähle" erstes Ergebnis aus und gibts in input ein
    try {
        dtype = true;
        request = await fetch('https://nominatim.openstreetmap.org/search/?format=json&limit=1&city=' + search);
        data = await request.json();

        if (data.length == 0) {
            request = await fetch('https://nominatim.openstreetmap.org/search/?format=json&limit=1&q=' + search);
            data = await request.json();
            dtype = false;
        }

        lat = data[0]["lat"];
        lon = data[0]["lon"];

        console.log(data[0]["display_name"]);
        if (screen.width > 450) {
            inputElement = document.getElementById("searchbar");
        } else {
            inputElement = document.getElementById("searchbar2");
        }
        lk = data[0]["display_name"].split(", ")[3];
        if (!(lk.includes("Landkreis"))) {
            lk = data[0]["display_name"].split(", ")[2];
        }
        ort = data[0]["display_name"].split(", ")[0];
        if ("1234567890".includes(ort[0])) {
            ort = data[0]["display_name"].split(", ")[1] + " " + data[0]["display_name"].split(", ")[0];
            lk = data[0]["display_name"].split(", ")[2];
            if (lk.includes(ort)) {
                lk = data[0]["display_name"].split(", ")[3];
            }
        } else {
            lk = data[0]["display_name"].split(", ")[1];
            if (lk.includes(ort)) {
                lk = data[0]["display_name"].split(", ")[2];
            }
        }
        document.getElementById("var3").innerHTML = lat + ";" + lon;
        document.getElementById("loc").innerHTML = data[0]['display_name'];
        inputElement.value = ort + ", " + lk;

    } catch (e) {

        console.error('fetch error', e);
    }
    showOSM(data[0]["boundingbox"][0], data[0]["boundingbox"][1], data[0]["boundingbox"][2], data[0]["boundingbox"][3])
    document.getElementById("mapOSM").scrollIntoView();
    showRoutes();
}

/*
Load Page
*/

async function showRoutes() {
    var l_username = getCookie("username");
    var l_session = getCookie("session");
    search = document.getElementById("searchbar").value;
    locationX = search + ";" + document.getElementById("var3").innerHTML;
    var fullurl = server_url + '/backend/index.php?request=getRides&username=' + l_username + "&session=" + l_session + "&location=" + locationX + "&distance=10&time=now";
    try {
        let request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });

        data = await request.json();
        
        document.getElementById("angebot").innerHTML = "";

        for(i = 0; i < data.length; i++){
            vout = "<b>Von:</b> " + data[i]['location']['name'] + "<br>"
            vout += "<b>Nach:</b> " + data[i]['destination']['name'] + "<br>"
            var dxdate = new Date(data[i]['time']);
            vout += "<b>Wann:</b> " + dxdate.toLocaleDateString() + " um " + (dxdate.toLocaleTimeString() + " ").replace(":00 ", "") + " Uhr<br>"
            vout += "<b>Fahrer:</b> <a href='profile.html?user=" + data[i]['offerUser'] + "'>@" + data[i]['offerUser'] + "</a><br>"
            vout += "<b>Distanz:</b> " + parseInt(data[i]['destination']['distance']).toString() + " km (Strecke); " + parseInt(data[i]['location']['distance']).toString() + " km (Zum Abfahrtsort)<br><hr><br>"
            document.getElementById("angebot").innerHTML += vout;
        }
    
    } catch (e) {
        console.error('fetch error', e);
    }
}