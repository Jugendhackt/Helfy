/*
	addRide.js

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


function getPos(id) { // Wird ausgeführt bei Klick auf GPS
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
            document.getElementById(id).value = lat + ',' + lon;
        });
    }
}

document.getElementById("einstellen").addEventListener("click", (event) => {
    event.preventDefault();
    let startElement = document.getElementById('startPlace');
    let endElement = document.getElementById('endPlace');
    let start = sendOSM(startElement.value);
    let end = sendOSM(endElement.value);
    start.then((result) => {
        console.log(result[0]['display_name']);
        startElement.value = result[0]['display_name'];
    })
    end.then((result) => {
        console.log(result[0]['display_name']);
        endElement.value = result[0]['display_name'];
        
    })
    //startElement.value = start.value[0]['display_name'];
    //endElement.value = end.value[0]['display_name'];

})

async function sendOSM(search) {
    try {
        const request = await fetch('https://nominatim.openstreetmap.org/search/?format=json&limit=1&q=' + search);
        return(await request.json());
    } catch (e) {
        console.error('fetch error', e);
    }
}

async function fahrtWeiter(){
    document.getElementById("btnWeiter").style.display = "none";
    search = document.getElementById("von").value;
    searchb = document.getElementById("nach").value;
    try {
        const request = await fetch('https://nominatim.openstreetmap.org/search/?format=json&limit=1&q=' + search, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });
        data = await request.json();

        const requestb = await fetch('https://nominatim.openstreetmap.org/search/?format=json&limit=1&q=' + searchb, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });
        sdata = await requestb.json();

        preview = "<b>Wollen Sie wirklich diese Fahrt anbieten?</b><br><br>";
        if(data[0]['display_name'].split(",")[0].length > 3){
            preview += "Von: " + data[0]['display_name'].split(",")[0] + ", " + data[0]['display_name'].split(",")[1];
        } else {
            preview += "Von: " + data[0]['display_name'].split(",")[1] + " " + data[0]['display_name'].split(",")[0] + ", " + data[0]['display_name'].split(",")[2];
        }
        preview += "<br>";
        if(sdata[0]['display_name'].split(",")[0].length > 3){
            preview += "Nach: " + sdata[0]['display_name'].split(",")[0] + ", " + sdata[0]['display_name'].split(",")[1];
        } else {
            preview += "Nach: " + sdata[0]['display_name'].split(",")[1] + " " + sdata[0]['display_name'].split(",")[0] + ", " + sdata[0]['display_name'].split(",")[2];
        }

        document.getElementById("var1").innerHTML = search + ";" + data[0]['lat'] + ";" + data[0]['lon'];
        document.getElementById("var2").innerHTML = searchb + ";" + sdata[0]['lat'] + ";" + sdata[0]['lon'];

        document.getElementById("btnAnbieten").style.display = "";
        document.getElementById("previewFahrt").innerHTML = preview + "<br><br>";

    } catch (e) {
        console.error('fetch error', e);
        document.getElementById("btnWeiter").style.display = "";
        document.getElementById("btnWeiter").innerHTML = "Erneut versuchen";
    }
}


async function fahrtAnbieten(){
    von = document.getElementById("var2").innerHTML;
    nach = document.getElementById("var1").innerHTML;
    if(document.getElementById("selectPublic").selectedIndex == 0){
        addr = "all";
    } else {
        addr = "groups";
    }
    if(datime = document.getElementById("datePick").value != ""){
        datime = document.getElementById("datePick").value + " ";
        datime += document.getElementById("timePick").value;
    } else {
        datime = document.getElementById("datePickM").value + " ";
        datime += document.getElementById("timePickM").value;
        console.log(document.getElementById("mobile").style);
    }
    console.log(datime);
    var fullurl = server_url + '/backend/index.php?request=offerRide&username=' + getCookie("username") + "&session=" + getCookie("session") + "&addr=" + addr + "&from=" + von + "&to=" + nach + "&time=" + datime;
    try {
        const request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });
        data = await request.text();
        if(data == "success"){
            document.getElementById("btnAnbieten").style.display = "none";
            document.getElementById("previewFahrt").innerHTML = "<b>Erfolgreich!</b>"
        } else {
            document.getElementById("previewFahrt").innerHTML = "<b>Fehlgeschlagen!</b>"
        }
        console.log(data);

    } catch (e) {
        console.error('fetch error', e);
        document.getElementById("btnWeiter").style.display = "";
        document.getElementById("btnAnbieten").style.display = "none";
        document.getElementById("previewFahrt").innerHTML = "<b>Fehlgeschlagen!</b>"
        document.getElementById("btnWeiter").innerHTML = "Erneut versuchen";
    }
}