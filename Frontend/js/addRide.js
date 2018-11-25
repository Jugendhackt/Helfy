function getPos(id) { // Wird ausgeführt bei Klick auf GPS
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
            document.getElementById(id).value = lat + ',' + lon;
        });
    }
}

document.getElementById("einstellen").addEventListener("click", function readRoute(event) {
    event.preventDefault();
    console.log('test')
    let startElement = document.getElementById('startPlace');
    let endElement = document.getElementById('endPlace');
    let start = sendOSM(startElement.value[0]['display_name']);
    let end = sendOSM(endElement.value[0]['display_name']);
    console.log(start,end);
    startElement.value = start.value[0]['display_name'];
    endElement.value = end.value[0]['display_name'];
    
})

function sendOSM(search) {
    try {
        const request = fetch('https://nominatim.openstreetmap.org/search/?format=json&limit=1&q=' + search);
        return(request.json);
    } catch (e) {
        console.error('fetch error', e);
    }
}