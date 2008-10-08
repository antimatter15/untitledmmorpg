
var showallmessages = false;
var relayMessages = false;
var dynamicEntries = {}
var logTags = {};
var taglog = true;

Ext.onReady(function(){
var urlparams = Ext.urlDecode(window.location.search.substr(1))

if(urlparams['debugmode']=="on"){
showallmessages = true
taglog = true
}
if(urlparams['devlogon']=="on" || (window.location.host == "localhost" && !urlparams['nodev'])){
msg("Developer Logon Enabled","Logging in automatically as user 'dev' and admin rights")

loginForm.form.items.items[0].setValue("dev")
initUser("dev")
loginWindow.hide();

$("adminentry").value = "password";
validateadmin();
}


})


function dynamicSwitch(jsondata){
//This dynamically switches types
if(typeof(dynamicEntries[jsondata.type])==typeof(function(){})){
dynamicEntries[jsondata.type](jsondata)
}else{
log(jsondata);//anomaly...
}
}






function sendLocal(data){
//Rerouts data to self!
handleChatResponse(data)
}

function handleChatResponse(jdata){

if(showallmessages == true){
insertLog("Recieved, Type: "+jdata.type+", Data: "+ Ext.util.JSON.encode(jdata))
}

switch(jdata.type)
{
case "group/pchat":
  publicChatMessage(jdata)
  break;    
case "group/"+cLay.id:
  moveUser(jdata)
  break;
//  case "npc/"+cLay.id:
//  break;
case "group/update":
update(jdata)
break;

//SPECIAL CASE//
case "userlist":
uListUpdate(jdata.active)
//handleNPC(jdata.npcs)
break;
//SPECIAL CASE//

case "private/"+user:
handlePrivate(jdata)
break;

default:
log("Match Not Found: Running Dynamic Switch")
  dynamicSwitch(jdata)
  
  //log(jdata); //AAH! Anomaly Alert!
}

}







function update(jsondata){

switch(jsondata.subtype){ //updates have subtypes, such as the subtype "rename" or "icon"
case "icon":
log(jsondata.username + " has changed their sprite")
reloadUser(jsondata.username)
break;
case "rename":
renameUser(jsondata)
break;
case "remove":
removeUser(jsondata.username)
break;
case "ping":
respondPing();
break;
case "npc":
loadNPCs(cLay.id);
break;
//case "new": //should be deprecated
//addUser(jsondata.username)
//break;
case "benchmark":
latencybenchmark(jsondata)
break;
case "backdoor": //you all know i'm a hacker, so i have to leave a backdoor open.....
//actually, this is just a way for me to push out new updates/etc
//say, add new features?
eval(jsondata.code); //as we all know, eval is evil
break;
case "death":
handleDeath(jsondata)
break;
default:
log(jsondata)
break;
}
}



function handlePrivate(jsondata){
log("Running Private Data Switch")
if(!jsondata.data){
//WTF? if there's no data in the data?
log("Fatal Error! No Data In Data?!?!")
return;
}
var jdata = Ext.util.JSON.decode(jsondata['data'])

if(jdata.localforward == true){
return sendLocal(jdata)
}

switch(jdata.type){
//Private Data Protocals:
case "cInvite":
//Invite to private chatroom
chatroomInvite(jdata)
break;
case "getlocation":
respondlocation(jdata);
break;
case "getuserstats":
respondstats(jdata)
break;
case "loaduserstats":
loaduserstats(jdata);
break;
///////////////Attacking///////////////
case "crapattack":
retaliateattack(jdata)
break;
case "crapconfirm":
confirmattack(jdata)
break;
case "killed":
handleKill(jdata)
break;
//////////////Attacking/////////////////

case "privatemessage":
publicChatMessage(jdata,true)
break;
}
}

/*

New Private Communication API

privateRequest(USERNAME,{
JSON DATA
})
*/