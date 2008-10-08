function initMap(name){
var newLayer = document.createElement("div")
newLayer.id=name
newLayer.style.height = "100%"
newLayer.style.width = "100%"
newLayer.style.position = "absolute"
newLayer.style.zIndex = 0;
newLayer.className="x-unselectable"

$("main").appendChild(newLayer)
cLay = newLayer
ssb.add("map","group/"+name)
//subscriptions.push("group/"+name)

mapInfo(name)
}


function guiWorldInfo(name){
parseProfile(name,"map",function(a){
if(a){
var cdt = Ext.util.JSON.decode(a['data'])
Ext.MessageBox.alert("World/Sector/Layer Info: "+name,
["Creator: "+cdt.creator,
"Background: "+cdt.bg
].join("<br>")
)
}else{
Ext.MessageBox.alert("Error","Non-Existant World")
}
})
}

function mapInfo(name){

parseProfile(name,"map",function(a){
if(a){
//./sprites/grass.gif

//alert(Ext.util.JSON.encode(a['data']))
cLay.style.backgroundImage = "url('"+Ext.util.JSON.decode(a['data'])['bg']+"')"
}else{

Ext.MessageBox.confirm("Discovery","You are entering undescovered territory, will you be daring enough to traverse where no man has gone before, and be forever remembered in this world as a brave explorer?",function(z){
if(z == "yes"){

updateProfile(name,{
type: "map",
name: name,
creator: user,
bg: "./sprites/grass.gif"
})
msg("Updating","Updating World")
setTimeout(function(){mapInfo(name)},1000)

}else{
cLay.innerHTML = "<h1>Oh Crap!</h1><br>You're stuck in a black hole!<br><br><br>";
}
})

}
})


}

function newMap(name){ 

//TODO: Find a way to do Faster Map Switching, without practicaly resetting whole system
if(cLay){
var omi = cLay.id
subscriptions.remove("group/"+omi)
}
loadedUsers = []

loadedNPCs = [];
solidNPCs = [];
npcStats = {}; 
orgNStat = {}; 
portalDB = {};

moveToCache = [];
movementTranslator = [50,50]; //current location
tOffset = [0,0];

cLay.parentNode.removeChild(cLay)

initMap(name)

addUser("local",true,[100,100])

reloadUser()

flushComet()
//privateRequest(user,{})

loadNPCs(name)
}
