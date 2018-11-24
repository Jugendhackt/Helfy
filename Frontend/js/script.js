/* 
Search Bar
 */

 var lat = 0;
 var let = 0;

var latme = 0;
var lonme = 0;

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
        const request = await fetch('https://nominatim.openstreetmap.org/search/?format=json&limit=10&q=' + search);
        const data = await request.json();

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
        const request = await fetch('http://192.168.10.60/helfy/backend/index.php?request=nearbyRides&lat=48.39649305&lon=9.99022954542048', {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
        });
        const data = await request.json();

        console.log(data);

        var el = document.querySelector('div');
	
        // get element content as string
        console.log(el.innerHTML);
        
        el.innerHTML += '<article>';

        for(x in data){
            currentRoute = data[x];
            if(currentRoute["type"] == "1"){
                el.innerHTML += "<article style='margin-left: 200px;'><span id='frage'><b>Von: </b></span><span>" + currentRoute["start_klar"] + "</span><br /><span id='frage'><b>Nach: </b></span><span> " + currentRoute["ziel_klar"] + " </span><br /><span id='frage'><b>Fahrer: </b></span><span>" + currentRoute["fahrer_name"] + "</span><br><span id='frage'><b>Mitfahrer: </b></span><span><button>Mitfahren!</button></span><hr /></article>";
            } else {
                el.innerHTML += "<article style='margin-left: 200px;'><span id='frage'><b>Von: </b></span><span>" + currentRoute["start_klar"] + "</span><br /><span id='frage'><b>Nach: </b></span><span> " + currentRoute["ziel_klar"] + " </span><br /><span id='frage'><b>Fahrer: </b></span><span><button>Anbieten!</button></span><br><span id='frage'><b>Mitfahrer: </b></span><span>" + currentRoute["mitfahrer_name"] + "</span><hr /></article>";
            }
        }

        // append to the element's content
        el.innerHTML += "";
        
        
    } catch (e) {
        console.error('fetch error', e);
    }
    
}