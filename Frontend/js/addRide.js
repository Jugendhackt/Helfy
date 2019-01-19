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