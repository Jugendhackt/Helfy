/* 
Search Bar
 */

function getPos() { // Wird ausgeführt bei Klick auf GPS
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(convert);
    }
}

function convert(input) { // Konvertiert input von getPos in String um
    let lat = input.coords.latitude;
    let lon = input.coords.longitude;
    checkPos(lat + ',' + lon)
}

function readInput() { // Wird ausgeführt durch Form searchbar
    let inputElement = document.getElementById("searchbar");
    let inputContent = inputElement.value;
    console.log(inputElement);
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
}

/*
Load Page
*/

async function showRoutes() {
    try {
        const request = await fetch('http://192.168.10.60/helfy/backend/index.php');
        const data = await request.json();

        console.log(data)
    } catch (e) {
        console.error('fetch error', e);
    }
}