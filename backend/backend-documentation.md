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

    ["m.m","Max","Mustermann","Musterort","22222",["ORT=Musterort","PLZ=22222"],0]

It is ordered like this: `username, first name, last name, place, zip, settings, number of notifications`

#### registrateUser
    index.php?request=registrateUser&username=username&password=password&email=email&vname=firstName&nname=lastName&ort=place&plz=zip
Registrates user and returns `success` or `failed`.

#### existsUser
    index.php?request=existsUser&username=username
Checks wether username already exists and returns `true` in this case, otherwise it returns `false`.

#### checkSessionData
    index.php?request=checkSessionData&username=username&session=sessionid
Returns `correct` in case of a valid sessionID . If it is not valid it will return `incorrect`.  
If the e-mail address of the account hasn't been verified it will return `no_email_verify`.

#### newSession
    index.php?request=newSession&username=username&password=password
Used for login. Returns a sessionID (36 characters). If username and password are invalid it will return `failed`.

#### newGroup
    index.php?request=newGroup&username=username&session=sessionID&groupname=groupname&description=description&users=members
Creates a group. Members of the group ar given in a list seperated by ",".
Example: `max.mustermann,maxine.mustermann`
Returns `success` if it worked or `failed` if sessionID and username are invalid.

#### getNotifications
    index.php?request=getNotifications&username=username&session=sessionID
Returns all notifications for given user (JSON encoded).
Example: `[["welcome"],["joinGroup","468d4442-b4d2-4ce5-a507-1d2ed7deab3e","Test","m.m","This is a description"],["simple", "info", "This is a test notification"]]`
There are different possible notifications.
##### welcome
Used to display a welcome message when user registration succeed.
##### joinGroup
Invites an user to join a group. It contains the groupid, groupname, admin username and description.
##### simple
Used to display simple notifications. It contains the type of notification as well as the text it will display.

#### removeNotification
    index.php?request=removeNotification&username=username&session=sessionID&id=groupID&code=actionCode
Removes notifications. In case of a `joinGroup` notification it will asign the user to the group if `join` is given as code.

#### getGroups
    index.php?request=getGroups&username=username&session=sessionID
Returns all groups that the user joined (JSON encoded). Returns `failed` if sessionID or username is incorrect.

#### leaveGroup
    index.php?request=leaveGroup&username=username&session=sessionID&groupHash=c1849032-c8da-4f2d-aea4-4cc576ca9d81
Removes user from group. Returns `success` if everything went fine. Returns `failed` if sessionID or username is incorrect. Returns `failed_not_member` if user is not member of the group to leave.

#### changeEmail
    index.php?request=changeEmail&username=username&session=sessionID&email=me@example.com
Changes the email adress. The email adress has to be verified before a new login is possible. Returns `success` or `failed`.

#### changePassword
    index.php?request=changePassword&username=username&session=sessionID&password=asdf&passwordNew=ghjk
Changes the password. Returns `success`, `failed` (sessionID or password incorrect) or `failed_passwd` (wrong old password).

#### changeUsername
    index.php?request=changeUsername&username=username&session=sessionID&newUsername=nameuser
Changes the username and returns `success`, `username_already_taken` or `failed`.

#### offerRide
    index.php?request=offerRide&username=username&session=sessionID&from=fromLocation&to=toLocation&addr=addressee&time=timeOfRide
Returns `success` or `failed`.
##### fromLocation and toLocation
Use `userInput;lat;lon` e.g. `Berlin HBF;52.5249451;13.3696614`
##### addr (addressee)
Can be set to `all` (offer will be public) or `groups` (only group members can see your offer).
##### time
Date and time of your ride e.g. `2019-01-21 16:30`

#### getRides
    index.php?request=getRides&username=username&session=sessionID&location=userLocation&distance=searchRadius&time=timeToSearchFor
Returns all possible rides or `failed` (JSON encoded). For location format see `offerRide`.