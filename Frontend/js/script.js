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
    let inputElement = document.getElementById("searchbar");
    let inputContent = inputElement.value;
    checkPos(inputContent);
}

async function checkPos(search) { // Suche Koordinaten, "wähle" erstes Ergebnis aus und gibts in input ein
    try {
        const request = await fetch('https://nominatim.openstreetmap.org/search/?format=json&limit=1&q=' + search);
        const data = await request.json();

        lat = data[0]["lat"];
        lon = data[0]["lon"];

        let inputElement = document.getElementById("searchbar");
        inputElement.value = data[0]["display_name"];
        
    } catch (e) {
        
        console.error('fetch error', e);
    }
    showRoutes();
}

/*
Load Page
*/

async function showRoutes() {
    try {
        const request = await fetch('http://192.168.10.60/helfy/backend/index.php?request=nearbyRides&lat=' + lat + '&lon=' + lon, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });
        const data = await request.json();

        console.log(data);

        var el = document.getElementById('angebot');
        var elb = document.getElementById('gesuche');
        // get element content as string
        console.log(el.innerHTML);
        // kommentar
        
        el.innerHTML = '';
        elb.innerHTML = '';

        for(x in data){
            currentRoute = data[x];
            if(currentRoute["type"] == "1"){
                el.innerHTML += "<article style='margin-left: 0px;'><span id='frage'><b>Von: </b></span><span>" + currentRoute["start_klar"] + "</span><br /><span id='frage'><b>Nach: </b></span><span> " + currentRoute["ziel_klar"] + " </span><br /><span id='frage'><b>Fahrer: </b></span><span>" + currentRoute["fahrer_name"] + "</span><br><span id='frage'><b>Mitfahrer: </b></span><span><button class='btn btn-dark'>Mitfahren!</button></span><hr /></article>";
            } else {
                elb.innerHTML += "<article style='margin-left: 0px;'><span id='frage'><b>Von: </b></span><span>" + currentRoute["start_klar"] + "</span><br /><span id='frage'><b>Nach: </b></span><span> " + currentRoute["ziel_klar"] + " </span><br /><span id='frage'><b>Fahrer: </b></span><span><button class='btn btn-dark'>Anbieten!</button></span><br><span id='frage'><b>Mitfahrer: </b></span><span>" + currentRoute["mitfahrer_name"] + "</span><hr /></article>";
            }
        }

        // append to the element's content
        el.innerHTML += "";
        
        
    } catch (e) {
        console.error('fetch error', e);
    }
    
}