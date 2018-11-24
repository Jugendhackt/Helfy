function getPos() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(convert);
    }
}

function convert(input) {
    let lat = input.coords.latitude;
    let lon = input.coords.longitude;
    checkPos(lat + ',' + lon)
}

function readInput() {
    let inputElement = document.getElementById("searchbar");
    let inputContent = inputElement.value;
    console.log(inputElement);
    checkPos(inputContent);
}

async function checkPos(search) {
    try {
        const request = await fetch('https://nominatim.openstreetmap.org/search/?format=json&limit=10&q=' + search);
        const data = await request.json();

        let inputElement = document.getElementById("searchbar");
        inputElement.value = data[0]["display_name"];
    } catch (e) {
        console.error('fetch error', e);
    }
}