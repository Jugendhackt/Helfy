/* 
Search Bar
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