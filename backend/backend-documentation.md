# Helfy Backend Documentation
This documentation is about how to use the Helfy API.
  
### Usage
The API is placed on the Sever at `/backend/index.php`.
You can call the API via an URL encoded GET request.
For example `helfy.example.com/backend/index.php?request=version` will return `Helfy backend v0.1`.
The parameter `request` is always required.
  
### Requests
#### version
    index.php?request=version
Returns current version of backend e.g. `Helfy backend v0.1`.
  
#### homeData
    index.php?request=homeData&username=username&session=sessionid
Returns neccesarry data for the home-user-page encoded as JSON. Example output:

    ["m.m","Max","Mustermann","Musterort","11111"]

It is ordered like this: `username, first name, last name, place, zip`

#### registrateUser
    index.php?request=registrateUser&username=username&password=password&email=email&vname=firstName&nname=lastName&ort=place&plz=zip
Registrates user and returns `success` or `failed`.

#### existsUser
    index.php?request=existsUser&username=username
Checks wether username already exists and returns `true` in this case, otherwise it returns `false`.

#### checkSessionData
    index.php?request=homeData&username=username&session=sessionid
Returns `correct` in case of a valid sessionID . If it is not valid it will return `incorrect`.  
If the e-mail address of the account hasn't been verified it will return `no_email_verify`.

#### newSession
    index.php?request=homeData&username=username&password=password
Used for login. Returns a sessionID (36 characters). If username and password are invalid it will return `failed`.

#### newGroup
    index.php?request=newGroup&username=username&session=sessionID&groupname=groupname&description=description&users=members
Creates a group. Members of the group ar given in a list seperated by ",".
Example: `max.mustermann,maxine.mustermann`
Returns `success` if it worked or `failed` if sessionID and username are invalid.