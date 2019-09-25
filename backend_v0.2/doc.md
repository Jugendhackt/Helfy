# Helfy API Dokumentation
Helfy ist eine Plattform zur Mitfahrervermittlung und Nachbarschftshilfe. Über diese API kann auf den Server von Helfy zugegriffen werden.


## Grundlegendes
Die API befindet sich auf dem Server bei `/backend/index.php`. Zum übergeben von Parametern wird POST genutzt. Der Parameter `request` wird immer übergeben. Eine Anfrage an einen Server mit der Adresse `https://helfy.example.com/backend/index.php` und dem POST Parameter `"request": "version"` gibt z.B. `Helfy backend v0.2.0` zurück.


## Requests
Der Parameter `request` kann verschiedene Werte haben. Alle unterstützten Werte von `request` bzw. alle möglichen Anfragen an die API sind hier aufgelistet und kurz erklärt.

#### version
```
"request": "version"
```
Gibt die aktuelle Version der API zurück, z.B. `Helfy backend v0.2.0`.

#### newSession
```
"request": "newSession"
"username": "max.mustermann"
"password": "test123"
```
Wird beim Login aufgerufen und gibt eine Session ID zurück. Sollten die Anmeldedaten falsch sein, wird `failed` zurückgegeben. Wenn die E-Mail Adresse noch nicht bestätigt wurde, wird `no_email_verify` zurückgegeben.
Eine Session ID sieht z.B. so aus: `1d63ebf3-dfcd-11e9-7f35-786cb74ac948`

#### registrateUser
```
"request": "registrateUser"
"username": "max.mustermann"
"password": "test123"
"email": "max.mustermann@example.com"
"vname": "Max"
"nname": "Mustermann"
"dateofbirth": "2000-01-01"
```
Bei vollständigen Angaben wird der Nutzer nun registriert. Um das Nutzerkonto zu aktivieren muss die E-Mail Adresse nun bestätigt werden. Wenn der Nutzername schon vergeben ist oder die Angaben unvollständig sind, wird `failed` zurückgegeben. Bei erfolgreicher Registrierung wird `success` zurückgegeben.