/*
Registration
*/


async function registrateUser() {
    var server_url = "";

    var username = document.getElementById("validationUsername").value;
    var password = document.getElementById("validationPassword").value;
    var passwordWdh = document.getElementById("validationPasswordWdh").value;
    var email = document.getElementById("validationEmail").value;
    var vname = document.getElementById("validationVname").value;
    var nname = document.getElementById("validationNname").value;
    var ort = document.getElementById("validationOrt").value;
    var plz = document.getElementById("validationPlz").value;
    var fullurl = server_url + '/backend/index.php?request=registrateUser&username=' + username + '&password=' + password + '&email=' + email + '&vname=' + vname + '&nname=' + nname + '&plz=' + plz + '&ort=' + ort;
    if(password == passwordWdh){
        try {
        const request = await fetch(fullurl, {
            method: "GET",
            dataType: "application/x-www-form-urlencoded",
            });
            const data = await request.text();
            console.log("js running");
        
        
        } catch (e) {
            console.error('fetch error', e);
        }
    }
  
}