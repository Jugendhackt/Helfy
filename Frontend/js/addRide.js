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