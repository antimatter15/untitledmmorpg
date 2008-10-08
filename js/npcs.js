var loadedNPCs = [];
var solidNPCs = [];
var npcStats = {}; //for npc fighting

var orgNStat = {}; //original stats to revert to when defeated ;)
var portalDB = {};


var useConcat = true; //faster!

/*
NPC API
{//begin markup
"solid":true, //if people can walk over or not: boolean, true or false
title:"beejaguar", // the title of it if you want a label on top of it
text:"This was a user-made monster", // the data for the tool tip that shows up when you hover your mouse over it
stats:{ //initialize stat object
"level":3, //simple, the fighting level
"mp":30, //mp, just any other (MMO)RPG
"mpMax":30, //maximum MP
"hpMax":30, //maximum HP
"hp":30, //health
"money":450, //money, as in how much money is earned when it is defeated
"shield":2 //shield
} //end stat object
}//end markup
*/

function npcupdate(){
chatRequest({type: "npc",type: "group/update"})
}

function loadNPCs(layer){
Ext.Ajax.request({
url: "data/npc/"+((layer)?layer:cLay.id)+".txt",
success: function(e){
//msg("agnortix rulz haxxorz lulz crap lorem ipsum whatever",e.responseText)
handleNPC(e.responseText.toString().split(","))
}
})
return "Loading NPCs (Ajax)"
}


function guiLand(){
Ext.MessageBox.prompt("Land Type (sprite id)","Type the name of the sprite to turn into a land patch",function(a,b){
if(a=="ok"){
Ext.MessageBox.prompt("Dimensions [X,Y]","Type Dimensions of the Land Patch in [X,Y] format",function(a1,b1){
if(a1=="ok"){
patchNPC(b,Ext.util.JSON.decode(b1));
}
})

}
})
}


function patchNPC(type,dim,loc,npcid){
if(!loc){loc = currentLocation}
if(!npcid){
npcid = "landpatch" + Math.floor(899*Math.random()+100)
}
Ext.Ajax.request({
url: "php/newuser.php",
params: {action:"toNPC", username: npcid},
success: function(){
log("Request Sucessful; Sending NPC Info")

updateNPC({
to: npcid,
from:npcid,
dim:dim,
patchtype: type,
location:loc,
loc:loc,
subtype:"patch"
})
}
})


}

function newNPC(spriteid,cloneme,extraconfig,npcid){
if(!npcid){
npcid = spriteid + Math.floor(899*Math.random()+100)
}
var uc = "pseudo";


Ext.Ajax.request({
url: "php/newuser.php",

params: {username: npcid, action: (cloneme==true)?"cloneuser":"clonesprite", clone: user, sprite: spriteid},
success: function(){
log("Request Sucessful; Running User2NPC Utility")
Ext.Ajax.request({
url: "php/newuser.php",
params: {action:"toNPC",username: npcid,layer: cLay.id},
success: function(){
log("Request Sucessful; Running NPC Data Updater")
extraconfig['to'] = npcid
extraconfig['from'] = npcid
updateNPC(extraconfig)
}
})
}
})
}




function updateNPC(config){
log("Updating NPC Profile")


if(!config['type']){config['type']="NPC"}
if(!config['location']){config['location'] = currentLocation}


updateProfile(config['to'],config)

}


function loadNPC(rawdata){
log("Parsing NPC")
//msg("new",rawdata)

//NEW API!!!!!!!!!!!!!


var absd = abstractData(rawdata,["NPC"])

log(absd)
//msg("New NPC Semidecoded JSON Object Crap",Ext.util.JSON.encode(absd))
//msg("New NPC Semidecoded JSON Object Crap",Ext.util.JSON.encode(absd))
var npcdata = Ext.util.JSON.decode(absd["NPC"]['data'])



if(npcdata['subtype']=="patch"){


log("Land Patch NPC: "+npcdata.to+"; Info "+Ext.util.JSON.encode(npcdata),"patchnpc")



if(npcdata['solid']==true){
log("Solid Patch NPC: "+npcdata.to,"patchnpc")
/*

solidNPCs.push(npcdata.to)

if(npcdata['dim'][0] > 35 || npcdata['dim'][1] > 35){
log("Large Patch NPC: "+npcdata.to,"patchnpc")
forcelist.push(npcdata.to)
}
*/

checkCollision.add(npcdata.to)
}else{
log("Non-Solid Land Patch: "+npcdata.to,"patchnpc")
}

loadedNPCs.push(npcdata.to)

return createPatch(npcdata.patchtype,npcdata.dim,npcdata.loc,npcdata.to)
}

addUser_dom(npcdata["to"], //name
(npcdata.title)?npcdata.title:"&nbsp;", //title (blank if none)
npcdata["location"],1) //Positioning

loadedNPCs.push(npcdata.to)

if(npcdata['solid']==true){
//solidNPCs.push(npcdata.to+"_icon")
checkCollision.add(npcdata.to)
}

if(npcdata['portal']){
//portalDB[npcdata.to] = npcdata['portal']
portal.add(npcdata.to,npcdata['portal'])
}

if(npcdata['stats']){
npcStats[npcdata.to]=Ext.util.JSON.decode(Ext.util.JSON.encode(npcdata['stats'])) //uh... another way to clone?
orgNStat[npcdata.to]=Ext.util.JSON.decode(Ext.util.JSON.encode(npcdata['stats']))

fight.add(npcdata.to)
}

///////////////////////////////////Context Menus/////////////////////////////////////
Ext.get(npcdata.to).on("contextmenu",function(e,o) {
    e.stopEvent() // preventDefault + stopPropagation
if (!this.contextMenu) {
log("context menu on "+o.id)
this.contextMenu = new Ext.menu.Menu({
items: [{
text: 'Battle/Atack',
handler: function(){npcattack(o.id.substr(0,o.id.indexOf("_")))}
},{
text: 'Get Stats',
handler: function(){npcgetstats(o.id.substr(0,o.id.indexOf("_")))}
},{
text: 'Remove NPC',
handler: function(){pRnpc(o.id.substr(0,o.id.indexOf("_")))}
}]
});
}
var xy = e.getXY();
this.contextMenu.showAt(xy);
})
///////////////////////////////////Context Menus/////////////////////////////////////
                                                         
                                                         
///////////////////////////////////Kool Tool Tips/////////////////////////////////////
if(npcdata.text){ //see if that person has a tool tip :)
log("NPC has text; load tooltip")
Ext.QuickTips.getQuickTip().register({
    target: npcdata.to+"_icon",
    title: "NPC "+npcdata.to,
    text: npcdata.text
});
}
}

function handleNPC(npclist){
if(npclist){
log("NPC List is present")

if(useConcat){
Ext.Ajax.request({
url:"php/concatuser.php",
params: {users: npclist.join(",")},
success: function(e){
log("NPC Profile Concat Data Length "+e.responseText.length)
//log("Got NPC Location/Info (Fconcat); Data: "+e.responseText)

var jdt = Ext.util.JSON.decode(e.responseText)
for(var i = 0; i < npclist.length; i++){
if(loadedNPCs.indexOf(npclist[i]) == -1){
log("Looping NPCs; Current: "+npclist[i])
if(npclist[i] != "" ){
if(jdt[npclist[i]]){
//msg(i+npclist[i],jdt[npclist[i]])
loadNPC(jdt[npclist[i]]);
}else{
log("npc not in database")
}
}else{
log("invalid NPC name")
}
}else{
log("NPC Already Loaded")
}
}

}
})
}else{
for(var i = 0; i < npclist.length; i++){
if(loadedNPCs.indexOf(npclist[i]) == -1){
log("Looping NPCs; Current: "+npclist[i])
if(npclist[i] != ""){
Ext.Ajax.request({
url: "userdata/"+npclist[i]+".txt",
success: function(e){
log("Got NPC Location/Info (Fajax); Data:"+e.responseText)

loadNPC(Ext.util.JSON.decode(e.responseText))
}
})
}else{
log("Error! Invalid NPC Name!")
}
}else{
log("NPC Already Loaded")
}
}

}

/////////////////Check To Remove NPCs/////////////////////
for(var ty = 0; ty < loadedNPCs.length; ty++){
if(npclist.indexOf(loadedNPCs[ty]) == -1){
//Remove NPC! AAH!
log("Removing NPC: " + loadedNPCs[ty])
removeNPC(loadedNPCs[ty])
}else{
log("Active, Present, and Registered")
}
}

}else{
log("No NPCs To add; Invalid List")
}
}

function removeNPC(npcid){
loadedNPCs.splice(loadedNPCs.indexOf(npcid),1)
$(npcid+"_icon").src = "images/logout.gif"
setTimeout(function(){
$(npcid).parentNode.removeChild($(npcid))
},1500)
}


function pRnpc(npcid){
if(admin == true){
Ext.Ajax.request({
url: "php/newuser.php",
params: {action: "removeNPC",username: npcid,layer: cLay.id},
success: function(e){
msg("Removed NPC",e.responseText)
}
})
}else{
badPermissions()
}
}


function guiToNPC(){

		Ext.MessageBox.confirm("Are You Sure?","By Converting To an NPC, you will loose the ability to do any movements and, literally will be treated as a brick",function(a){
		if(a == "yes"){
		makeNPC()
		msg("Done","You should now consider yourself a useless brick")
		}else{
		msg("Cancelled","User To NPC Conversion Cancelled")
		}
		})
}

function guiAddNPC(){

Ext.MessageBox.prompt("NPC Type","Insert Type Of NPC (<u>Registered</u> Sprite SRC: Eg. grass, dirt, bush)",function(a1,b1){
if(a1 == "ok"){
Ext.MessageBox.prompt("NPC Config","Insert Configuration Options (JSON Format)",function(a,b){
if(a=="ok"){

var jdata = Ext.util.JSON.decode(b)
if(typeof(jdata)==typeof({yay:"happy"})){
var cloneme = false;
if(jdata.cloneme){
cloneme = jdata.cloneme
}

newNPC(b1.toLowerCase(),cloneme,jdata)
}



msg("Done","NPC Added!")
}
},null,true)

}
})

}


function guiUpdateNPC(){
Ext.MessageBox.prompt("Update NPC Data","This will update the properties of the NPC<br>Note that if you are not an NPC and just a normal user, this will do absolutely nothing. Enter JSON Object Markup for configuration",function(a,b){
if(a=="ok"){
updateNPC(Ext.util.JSON.decode(b))

//console.log(Ext.util.JSON.decode(b))
msg("Done","Data Updated!")
}else{
msg("Cancelled","NPC Update Cancelled")
}
},null,true)

}



function npcattack(npcid){
if(npcStats[npcid]){
lastAttacker = "NPC"
var expgain = 10+Math.round(5*Math.random()); //10, 11, 12, 13, 14, or 15
var damage = Math.floor(parseInt(userstats.level)*((parseInt(userstats.hp)/parseInt(userstats.hpMax))+5)*Math.random())
npcStats[npcid].hp = parseInt(npcStats[npcid].hp) -damage
userstats.exp += parseInt(expgain)
if(damage == 0){
msg("Attack Failed","The Attack on "+npcid+" has failed!")
}else{
msg("Attack Sucessful","You earn "+expgain+" experience points and made "+npcid+" loose "+damage+" health")

if(npcStats[npcid].hp < 1){
userstats.money += parseInt(Math.ceil(npcStats[npcid].money*(0.666)));//oooh!!! evil number

var pnid = $(npcid+"_icon").src
$(npcid+"_icon").src = "images/logout.gif"
setTimeout(function(){
$(npcid+"_icon").src = pnid
},1500)

msg("<span style='color: blue'>You have defeated "+npcid+"</span>","You gained "+npcStats[npcid].money*(0.66)+" money, "+(5*expgain)+
" experience, and the following items:"+npcStats[npcid].itemdesc)
if(npcStats[npcid].item && npcStats[npcid].itemdesc){
addItem(npcStats[npcid].itemdesc,npcStats[npcid].item);
}
//npcStats[npcid]=null; //just to kill efficiency :)
npcStats[npcid]=Ext.util.JSON.decode(Ext.util.JSON.encode(orgNStat[npcid]))


}

}

setTimeout(function(){ //wait for realism

var damage = Math.floor(parseInt(npcStats[npcid].level)*((parseInt(npcStats[npcid].hp)/parseInt(npcStats[npcid].hpMax))+5)*Math.random())

msg(npcid+" has attacked you!","You lose "+damage+" HP")

userstats.hp += -parseInt(damage)
},1000)
}else{
msg("Error: NPC Can Not Be Fought"," YOU CRUEL HEARTLESS PERSON! CAN'T YOU HEAR THE NPC's CRY FOR NONVIOLENCE?!?!")
}

}

function npcgetstats(npcid){
if(npcStats[npcid]){
Ext.MessageBox.alert(npcid+"'s stats",statparse(npcStats[npcid]))
}else{
msg("Error","Stats Not Availiable: Maybe NPC is pacifist?")
}
}


function createPatch(type,dim,loc,id){
//Patch of land, floating somewhere
//type can be sand, water, grass, whitebrick

//createPatch("whitebrick",[200,104],[-100,100])

var np = document.createElement("div")
np.id = id
np.style.position = "absolute"
np.style.width = dim[0]+"px"
np.style.height = dim[1]+"px"

np.style.zIndex = 0

np.style.top = (parseFloat(loc[1])-movementTranslator[1])+"px"
np.style.left = (parseFloat(loc[0])-movementTranslator[0])+"px"

np.style.backgroundImage = "url('sprites/"+type+".gif')"
$(cLay).appendChild(np)
}

var fp;

function guiNewNPC2(){
fp = new Ext.form.FormPanel(
{
xtype:"form",
//title:"Create A New NPC",
labelWidth:330,
items:[{
    xtype:"textfield",
    fieldLabel:"<b>Sprite Template (Required, Lowercase Only type \"clone\" if it is to have the same sprite as the current user)</b>",
    name:"spritetemplate"
  },{
    xtype:"checkbox",
    fieldLabel:"Solid (if users can not walk over, optional)",
    boxLabel:"",
    name:"solid"
  },{
    xtype:"textfield",
    fieldLabel:"NPC Title (optional)",
    name:"title"
  },{
    xtype:"textfield",
    fieldLabel:"NPC story/description (the thing that shows when you hover your cursor over it, optional)",
    name:"text"
  },{
    xtype:"checkbox",
    fieldLabel:"Attack (Can the NPC be fought, optional)",
    boxLabel:"",
    name:"attack"
  },{
    xtype:"textfield",
    fieldLabel:"World/Sector/Layer to teleport users to when clicked on (optional)",
    name:"portal"
  },{
    xtype:"fieldset",
    title:"Attacking/Battle Stats (all required if npc can attack)",
    height:250,
    items:[{
        xtype:"numberfield",
        fieldLabel:"Level (Required if NPC can attack)",
        name:"level"
      },{
        xtype:"numberfield",
        fieldLabel:"HP (Health Points, Required if NPC can attack)",
        name:"hp"
      },{
        xtype:"numberfield",
        fieldLabel:"Maximum HP (Required if NPC can attack)",
        name:"hpMax"
      },{
        xtype:"numberfield",
        fieldLabel:"MP (Magic Points, Required if NPC can attack)",
        name:"mp"
      },{
        xtype:"numberfield",
        fieldLabel:"Maximum MP (Required if NPC can attack)",
        name:"mpMax"
      },{
        xtype:"numberfield",
        fieldLabel:"Money (Required if NPC can attack)",
        name:"money"
      },{
        xtype:"numberfield",
        fieldLabel:"Experience Points (Required if NPC can attack)",
        name:"exp"
      }]
  }]
}
)
var npcWindow = new Ext.Window({
title:"Create A New NPC",
width: 500,
height: 500,
    buttons: [{
    	handler: function(){
		
		var jd = fp.getForm().getValues()
		
		//newNPC(spriteid,cloneme,extraconfig,npcid)
		
		var nk = {}
		
		if(jd.solid){nk.solid=true}
		if(jd.title != ""){nk.title=jd.title}
		if(jd.text != ""){nk.text=jd.text}
		if(jd.portal != ""){nk.portal=jd.portal}
		
		if(jd.attack){
		nk.stats = {
	    level: jd.level,
		mp: jd.mp,
		mpMax: jd.mpMax,
		hp: jd.hp,
		hpMax: jd.hpMax,
		money: jd.money,
		exp: jd.exp
		}
		}
		newNPC(jd.spritetemplate.toLowerCase(),(jd.spritetemplate=="clone"),nk)
		msg("Done","NPC has been sucessfully created, please note that the update of the entire NPC database requires a user event.")
		
		setTimeout(function(){loadNPCs(cLay.id)},1000)
		//initUser(loginForm.form.items.items[0].getValue())
    	//loginWindow.hide();
		},
		
        text: 'Publish New NPC (Note, Database update requires page reload)'
    }],
    buttonAlign: 'right',
    items: [fp]

})
npcWindow.show()
//console.log(fp.getForm().getValues())
}



/*
================================================================================
PHP Counterpart of updater script (Updates NPCs from DB Version 1, to DB Version 2)
================================================================================
<?php

foreach(explode(",",file_get_contents("../data/misc/npcs.txt")) as $fn){

$url = "http://antimatter15.110mb.com/Game/users/".$fn.".gif";
$filename = "../data/usericon/".$fn.".gif";

echo "<div style='font-size: small; color: #FF0000'>";
echo "Checking Password<br>";
echo "Initing CURL<br>";
$ch = curl_init();
echo "Setting CURL Parameters<br>";
echo "URL:".$url."<br>";
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
echo "Executing CURL<br>";
$cd = curl_exec($ch);
echo "Opening File Handle to ".$filename."<br>";
$fh = fopen($filename, 'w') or die("can't open file");
echo "Writing Contents<br>";
fwrite($fh,$cd);
echo "Content Length: ".strlen($cd)."<br>";
echo "Checking File Size: ".filesize($filename)."<br>";
echo "Cleaning Up<br>";
fclose($fh);
curl_close($ch);
echo "Done<br>";

echo "</div><br>";
}
?>
================================================================================
T3h jAvAs(R1pT:
================================================================================
function updatedb(dblog,i){ //updates old databases to new ones!
var dbl = dblog.split("|")

var dli = Ext.util.JSON.decode(dbl[i])
if(dli.type == "NPC"){
if(dli.subtype == "patch"){
msg("Adding Land Patch "+dli.patchtype, "Loc: "+dli.loc.join(",")+" Dimensions: "+dli.loc.join(","))
log("Adding Land Patch Type "+dli.patchtype+" : Loc: "+dli.loc.join(",")+" Dimensions: "+dli.loc.join(","))
patchNPC(dli.patchtype,dli.dim,dli.loc,dli.to)
}else{
msg("Adding User",dli.to)
log(dli.to)
newNPC(dli.to.replace(/[0-9]/g,""),false,dli,dli.to)
}
}else{
msg("Invalid User Type","Cancelling...")
}
}

function audb(i){
Ext.Ajax.request({
url: "data/udb.txt",
success: function(e){updatedb(e.responseText,i)}
})
}

function ud(){
msg("Updating Database","Initializing Update Process")
Ext.Ajax.request({
url: "data/udb.txt",
success: function(e){
msg("DB Loaded","Initializing Loop")
var m = e.responseText.split("|")
for(var i = 0; i < m.length; i++){
setTimeout("audb("+i+")",2000*i);
}
}
})
}
*/