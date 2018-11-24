function getPos() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(checkPos);
    }
}

async function checkPos(search) {
    try {
        const request = await fetch('https://nominatim.openstreetmap.org/search/?format=json&limit=10&q=' + search.coords.latitude + ',' + search.coords.longitude);
        const data = await request.json();

        console.log(data[0]["display_name"]);
    } catch (e) {
        console.error('fetch error', e);
    }
}