var server_url = "https://helfy.bluekite.de" // Define your server url here

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = "helfy_" + cname + "=" + cvalue + ";" + expires + ";path=/";
}

setCookie("server_url", server_url, 7)