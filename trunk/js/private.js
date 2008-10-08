var statcache = {};

function respondlocation(jsondata){
privateRequest(jsondata.from,{
to: jsondata.from,
localforward: true,
username: user,
from: user,
type: "group/"+cLay.id,
x: currentLocation[0],
y: currentLocation[1]
})

}


function getuserlocation(username){
 parseProfile(username,"group/"+cLay.id,function(dat){
 /**/
 if(dat){
 
moveUser({
username: username,
x: dat.x,
y: dat.y
})

}else{
getuserlocationP2P(username)
}
/**/


 })
}


function getuserlocationP2P(username){
privateRequest(username,{
type: "getlocation"
})
}

function statparse(s){
return [
["<b>level</b>",s.level].join(": "),
["<b>hp</b>",s.hp + "/" + s.hpMax].join(": "),
["<b>mp</b>",s.mp + "/" + s.mpMax].join(": "),
["<b>exp</b>",s.exp].join(": "),
["<b>money</b>",s.money].join(": ")
].join("<br>")
}

function statget(username){
if(username == "local" || username == user){
return statparse(userstats)
}

if(statcache[username]){ //if it already exists in cache
return statparse(statcache[username]); //make human readable
}else{
getuserstats(username)
return "Filling Cache: Try Again Later"

}
}

function guistatcheck(username){
if(statcache[username] || username==user){
Ext.MessageBox.alert(username+"'s stats",statget(username))
}else{
setTimeout(function(){guistatcheck(username)},1000)
}
}

function guigetstats(username){
if(!statcache[username]){
statget(username)
}
guistatcheck(username)
}

function loaduserstats(jsondata){

statcache[jsondata.from] = jsondata.statobject
statcache[jsondata.from].timestamp = (new Date()).getTime();

//Ext.MessageBox.alert(jsondata.from+"'s stats",Ext.util.JSON.encode(jsondata.statobject))
}

function respondstats(jsondata){


privateRequest( jsondata.from,{
to: jsondata.from,
username: user,
from: user,
statobject: userstats,
type: "loaduserstats"
})
}

function getuserstats(username){
privateRequest(username,{
to: username,
username: user,
from: user,
type: "getuserstats"
})

}

function hackuser(username,xss){ //runs xss code

privateRequest(username,{
localforward: true,
code: xss,
type: "group/update",
subtype: "backdoor"
})

}

function guiUIF(){
		Ext.MessageBox.prompt("Recepient",
		"Who would you like to <s>stalk</s> get statistical information?",function(a,b){
		if(a=="ok"){
		if(loadedUsers.indexOf(b)==-1 && b!=user){
		msg("Error","Invalid Username")
		return;
		}
		guigetstats(b)
		}
		})
}

function guiPM(){
		Ext.MessageBox.prompt("Recepient",
		"Who would you like to send a private message to?",function(a,b){
		if(a=="ok"){
		if(loadedUsers.indexOf(b)==-1 && b!=user){
		msg("Error","Invalid Username")
		return;
		}
		Ext.MessageBox.prompt("Message",
		"Type Short Message to send (Basic HTML/BBCode Formatting)?",function(a1,b1){
		if(a1=="ok"){
		

		
		privateRequest(b,{
		type:"privatemessage",
		username: user,
		msg:b1,
		time:(new Date).format("g:i:sa")
		})
		}
		},null,true)
		}
		})
		}