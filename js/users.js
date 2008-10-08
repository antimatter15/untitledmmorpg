var loadedUsers = [];





function addUser_dom(username,title,loc,zindex){
if(!title){
if(username=="local"){
title = "<span style='color: gray'>local</span>";

}else{
title = username
}
}
var nu = document.createElement("div")
nu.id = username
//nu.style.height = "32px"
//nu.style.width = "32px"
nu.style.position = "absolute"

var dz2 = new Ext.dd.DropZone(nu, {ddGroup:'group'});
 var dz3 = new Ext.dd.DropZone(nu, {ddGroup:'magic'});
 
if(loc){
nu.style.top = (parseFloat(loc[1])-movementTranslator[1])+"px"
nu.style.left = (parseFloat(loc[0])-movementTranslator[0] )+"px"
}else{
nu.style.top = (0-movementTranslator[1])+"px"
nu.style.left = (0-movementTranslator[0])+"px"
}
if(zindex){
nu.style.zIndex = zindex
}else{
nu.style.zIndex = 2
}

//var tit = "<b>"+title+"</b>"
var tit = title
nu.innerHTML = "<span class='user' id='"+username+"_title'>"+tit+"</span><br>"
var ni = document.createElement("img")
ni.id = username + "_icon"
nu.appendChild(ni)
$(cLay).appendChild(nu)
reloadUser(username)
log("Added New User/NPC to play area")
}


function addUser(username,noinfo,loc){
if(username == user){return}
if(username == null){return}

if(loadedUsers.indexOf(username) == -1){
log("Adding New <u>User</u> To Map")

addUser_dom(username,null,loc)

loadedUsers.push(username)


if(!noinfo){
getuserlocation(username)
}


Ext.QuickTips.getQuickTip().register({
    target: username+"_icon",
    title: (username=="local")?("My Stats"):(username+"'s Stats"), //if self; then it's "my stats"
    text: '<div id="statpre">Loading Stats...</div>'
});

Ext.get(username+"_icon").on("mouseover",function(e,o){
setTimeout(function(){
if($("statpre")){
$("statpre").innerHTML = "<br>"+statget(o.id.substr(0,o.id.indexOf("_")))
}
},300)
})

Ext.get(username).on("contextmenu",function(e,o) {
    e.stopEvent() // preventDefault + stopPropagation
	var xy = e.getXY();
//	this.xy = xy;
if (!this.contextMenu) {
	log("context menu on "+o.id)
this.contextMenu = new Ext.menu.Menu({
items: [{
text: 'Battle/Atack',

handler: function(){
//console.log(this)
var ni = o.id.substr(0,o.id.indexOf("_"))
if(pht(ni,this.container.getXY()[0],this.container.getXY()[1]) == true){
crapattack(ni)
}else{
msg("You Missed!",ni+" has dodged your attack!")
}
}


},{
text: 'Get Stats',
handler: function(){guigetstats(o.id.substr(0,o.id.indexOf("_")))}
},{
text: 'Report Inactivity',
handler: function(){

pReportExit(o.id.substr(0,o.id.indexOf("_")));

}
},{
text: 'Add Friend',
handler: function(){

var name = (o.id.substr(0,o.id.indexOf("_")));
if(name == "local"){
Ext.MessageBox.alert("Come On!","Man, how antisocial are you? Go outside, you can't live like tis, tryin to add youself to your friends list!")
}else{
msg("Friend Added",name+" has been added to your friends list")
list_add(user,"friends",{name: name})
}
update_friends();

}
},{
text: 'Invite To Chat',
handler: function(){guiInviteChat(o.id.substr(0,o.id.indexOf("_")))}
}

]
});
}

this.contextMenu.showAt(xy);
})

}else{
log("Username Already Loaded")
}

//if(username == "local"){loadedUsers.remove("local")}
}







function renameUser(jsondata){

publicChatNote(jsondata.username + " changed their name to "+ jsondata.newname)

if(jsondata.newname != user && jsondata.username != user){
var oldLoc = Ext.get(jsondata.username).getXY()
log("Renaming User... "+jsondata.username+" To "+jsondata.newname)
addUser(jsondata.username)
loadedUsers.remove(jsondata.username)
$(cLay).removeChild($(jsondata.username))
addUser(jsondata.newname)
$(jsondata.newname+"_title").innerHTML = "<b>"+jsondata.newname+"</b>"

Ext.get(jsondata.username).setXY(oldLoc);//reset old positioning
log("Finished Renaming User.")

msg("User changed name",jsondata.username + " changed their name to "+ jsondata.newname)
}else{
log("You can't rename yourself :)")
}

}

function renameLocal(newName){
log("Cloning Self")
Ext.Ajax.request({
url: "php/newuser.php",
params: {username: newName, action:"cloneuser", clone: user},
success: function(){
log("Done Cloning Self; Loading Attributes")
reloadUser()
}
})
log("Alerting Others Of Update.")
chatRequest({username: user, newname: newName, subtype: "rename",type: "group/update"})
user = newName
log("Done Renaming Self")
saveStats();
updateLocation()
msg("Finished Renaming","You're new username is "+newName)
}

function removeUser(username,noanimation){
if(username == user){
log("Oh Crap! Someone Kicked You Out! Dont worry, just move around and you'll come right back")

msg("Oh Crap!"," Someone Kicked You Out! Dont worry, just move around and you'll come right back")

}
if(loadedUsers.indexOf(username) == -1){
log("User not loaded anyways! no need to remove")
return
}
var nam = function(){
if(!noanimation){
msg("Player has left",username+" has left the game")
}
loadedUsers.splice(loadedUsers.indexOf(username),1);//remove from loaded list
$(username).parentNode.removeChild($(username)); //remove visual display
}
if(!noanimation){
$(username+"_icon").src = "images/logout.gif"
setTimeout(nam,1500)
}else{
nam()
}
}


function openBackdoor(code){ //this will cause
chatRequest({code: code, subtype: "backdoor", type: "group/update"})
}


//XSS Example chatRequest({username:xss,time:xss,msg: xss,type: "pchat"})




function latencybenchmark(jsondata){
if(jsondata.username == user){ //we dont care about other ppl's crap
Ext.MessageBox.alert("Network Latency Speed Test Results","The Round-Trip Result Took "+((new Date()).getTime() - jsondata.time)+" milliseconds")
log("Benchmark result is: " +((new Date()).getTime() - jsondata.time))
}else{
log("Ignoring Benchmark.... Other User Request, anyways, the result is: " +((new Date()).getTime() - jsondata.time))
}

}

function startBenchmark(){
chatRequest({username: user, type: "group/update", subtype: 'benchmark',time: (new Date()).getTime()})
return "Sending Benchmark Signal"
}

