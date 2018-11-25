function getPos(id) { // Wird ausgeführt bei Klick auf GPS
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
            document.getElementById(id).value = lat + ',' + lon;
        });
    }
}

function readRoute() {

}