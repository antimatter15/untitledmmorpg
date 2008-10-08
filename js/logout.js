/*
There are 3 approaches in this system to detect logouts. Each has specific drawbacks.
-Ping
-Connection Logging
-onbecforeunload event hooking

The first, named "Ping" is just like what it sounds like. There is virtually no server interaction, it's almost purely
client-side, a client distributes a "ping" signal, which if all the attached clients respond to within a given (user-
defined) timeout, is logged as "active" or else it is marked "inactive" and is assumed to be logged-out.

The Second, named Connection Logging is much more advanced, but the underlying concept is simple. Every time a
new comet request is created, it logs some data associated to the user saying that the user has an "active" connection
when the connection is closed (when data is sent) then the log is altered and the data is no longer flagged "active" but
flagged "inactive" and also given a timestamp. It is the nature of the application to request a new connection if/when
the previous connection is closed-instantaneously. A seperate script determines the active/inactive users by a simple
process. It loops through all referenced users in the log, and checks two things: First, if the connection is "active" or "inactive"
and Second, if it is flagged "inactive" then it checks it's timestamp is younger than a selected grace period. If the
connection from the user has been closed for a while, then it is considered a closed connection and is marked
logged out.

The 3rd is incredably unreliable, but is easy to implement, and when it does work, it's the most responsive.
It attaches a function to the onbeforeunload event, so when the browser window/tab is closed, then
it creates final request saying "i've logged out everyone!" and you are removed accordingly. It seemlessly
integrates with the core archetecture.

There are drawbacks to each method. Pinging is very unorganized. It relates little to the main archetecture.
But it is very accurate, to some extent. Connection Logging is obviously more complicated, but results are 
instantaneous. There is no need to wait a certain duration before getting the latest results. It can be easily
integrated into the core structure of the system.
*/

function exitGame(){
chatRequest({username: user, subtype: "remove", type: "group/update"})
}

function kill(){ //this will cause all connected users to die a horrible, firey, painful death, engulfed in  flames

chatSendAlpha("eval openBackdoor('exitGame()')"); //even more evil, this basically logs out everyone in the game

setTimeout(function(){
chatRequest({username: "local", subtype: "remove", type: "group/update"})
},10000); //wait 10 seconds for the evil to spread first...


}

function save_world(){ //what can i say? you can save the world...
chatRequest({username: "I-saved-you", type: "group/update"})
}

function createPing(){
Ext.Ajax.request({
url: "php/ping.php",
params: {action: "reset"},
success: function(e){
chatRequest({type: "group/update", subtype: "ping"})
}
})
}

function loadPing(){
Ext.Ajax.request({
url: "php/ping.php",
params: {username: user},
success: function(e){
var ea = e.responseText.split(",")
uListUpdate(ea)
}
})
}

function respondPing(){
log("responding to ping request")
//Some code to respond to a ping request goes here
Ext.Ajax.request({
url: "php/ping.php",
params: {username: user},
success: function(e){
log("ping return successful.")

setTimeout(loadPing,10000)
//console.log(e)
}
})
//a ping in this program, is a request by the server (or by a client redireting to a server)
//to check who's actually alive and who has been reincarnated, if a client dies not respond 
//within a 30 second period  of time, then the player is marked as logged out, and recieves 
//the friendly explode. It is triggered either randomly, or by a new user. the details have not
//yet been fully decided.
}



function uListUpdate(ea){
if(ea.length < 1){return};//quickpatch with no research

var zf = "<b>Online Members</b><br>";
for(var iz = 0; iz < ea.length; iz++){
zf+="<a href='javascript:guigetstats(\""+ea[iz]+"\")'>"+ea[iz]+"</a><br>"
}
$("mlst").innerHTML = zf+"<br><input type='button' onclick='ocrap()' value='View All Members'>"


log("(Users) Updating Users List")
log("(Users) Starting Remove Loop")
for(var i = 0; i < loadedUsers.length; i++){ //remove users
if(ea.indexOf(loadedUsers[i]) == -1){
if(loadedUsers[i] != "local"){
log("(Users) Removing User: "+loadedUsers[i])
removeUser(loadedUsers[i])
}
}else{
log(loadedUsers[i]+" Is loaded and active")
}
}
log("(Users) Starting Add Loop")
for(var i = 0; i < ea.length; i++){ //add users
if(loadedUsers.indexOf(ea[i]) == -1){
if(ea[i] != user && ea[i] != ""){ // if not self and if not blank
log("(Users) Adding User: "+ea[i])
addUser(ea[i])
}
}else{
log(ea[i]+"is active and present")
}
}
}

function checkUsers(){
log("Starting Ajax Request")
Ext.Ajax.request({
url: "php/checkactive.php",
success: function(){
log("Updated Active Log")
loadUsers()

}
})
}

function loadUsers(){

Ext.Ajax.request({
url: "data/misc/userslist.txt",
success: function(e){
log("Loaded Active User List")
var f = Ext.util.JSON.decode(e.responseText)
log("JSON Decode")
if(f.type=="userlist"){
log("Updating Users List")
uListUpdate(f.active)
//log("Updating NPC Lists")
//handleNPC(f.np cs)
}
}
})
}

function reportExit(username){
if(username != "local"){
chatRequest({username: username, subtype: "remove", type: "group/update"})
}else{
msg("Ha Ha","You're stuck here, wether you like it or not<br><div style='font-size: x-small'>Actually you can type removeUser('local') through the command line...")
}
}

function pReportExit(username){
if(admin==true){
reportExit(username)
}else{
badPermissions()
}
}

window.onbeforeunload = exitGame