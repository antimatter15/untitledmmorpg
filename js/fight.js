var userstats = {
level: 1,
hpMax: 20,
mpMax: 20,
hp: 15,
mp: 15,
exp: 1,
money: 250,
shield: 1 //0-1; 0 means invincible; 1 means takes full damage
}

var statCache = {};

var lastAttacker = "";



function checkStatUpdate(){
if(Ext.util.JSON.encode(statCache) != Ext.util.JSON.encode(userstats)){
saveStats();
}
statCache = Ext.util.JSON.decode(Ext.util.JSON.encode(userstats))
}


function updateStats(){
$("pUsername").innerHTML = user
$("pHP").style.width = (userstats.hp/userstats.hpMax)*100+"%"
$("pMP").style.width = (userstats.mp/userstats.mpMax)*100+"%"
$("pHP2").innerHTML = userstats.hp+"/"+userstats.hpMax
$("pMP2").innerHTML = userstats.mp+"/"+userstats.mpMax
$("pLevel").innerHTML = userstats.level
$("pExp").innerHTML = userstats.exp
$("pMoney").innerHTML = userstats.money
checkStats()
}

function handleDeath(jsondata){

}

function handleKill(jsondata){
if(jsondata.killer == user){
if(jsondata.money > -5){ //ha ha! hackers can exploit this function to steal $5 from people!
//...........but that is seriously nothing.... it's almost as worthless as the US Dollar :) 

removeUser(jsondata.me)

userstats += jsondata.prestats.money*(0.66);//Tax :)

var expgain = jsondata.prestats.level*(jsondata.prestats.exp/10)-userstats.level

msg("<span style='color: blue'>You have defeated "+jsondata.me+"</span>","You gained "+jsondata.prestats.money*(0.66)+" money, "+expgain+
" experience, and the following items:"+"NOT AVAILIABLE")
}
}
}

function respawn(){

if(lastAttacker != "NPC"){
privateRequest(lastAttacker,{killer: lastAttacker,type:"killed",prestats: userstats,me: user})


}

Ext.MessageBox.progress("Please Wait 10 seconds to respawn.","You have been killed. Please wait 10 seconds to respawn.","10 seconds")
var uf = function(x){Ext.MessageBox.updateProgress(1-(x/10),(10-x)+" seconds remaining")}
uf(0);
setTimeout(function(){uf(1)},1000)
setTimeout(function(){uf(2)},2000)
setTimeout(function(){uf(3)},3000)
setTimeout(function(){uf(4)},4000)
setTimeout(function(){uf(5);exitGame();},5000)
setTimeout(function(){uf(6)},6000)
setTimeout(function(){uf(7)},7000)
setTimeout(function(){uf(8)},8000)
setTimeout(function(){uf(9)},9000)
setTimeout(function(){uf(10)},10000)
setTimeout(function(){
Ext.MessageBox.hide()
msg("Finished Respawning","You have been revived from the dead by a team of happy feces")

//localMoveTo(Ext.get("main").getX()+100,Ext.get("main").getY()+100)


userstats.exp = 0; //reset experience

userstats.money = 10; //reset money

},11000)
}


function checkStats(){
if(userstats.hp < 1){
userstats.hp = 10; //trick to stop re-respawning, but probably is unneeded :)

msg("Bye Bye.","You have Died.")
setTimeout(respawn,1500);
}

if(userstats.exp > userstats.level * 50){
userstats.exp = userstats.exp - (userstats.level * 50); //reset+remainder
userstats.level++; //add level
userstats.hpMax+=2;

userstats.hp = userstats.hpMax; //full health
msg("Level Up","You are now level "+userstats.level+". And you have regained full health")
saveStats()
}
}

Ext.onReady(function(){
setInterval(function(){updateStats()},3000);
})

function loaduserstats(jsondata){
Ext.MessageBox.alert(jsondata.from+"'s stats",Ext.util.JSON.encode(jsondata.statobject))
}

//////////////////////////////////////////////////////////////////////////////////////////////////
/*
Award Of: Worst Security Model Ever
Goes To: This random untitled game, for relying on the client to keep track of everything in a highly insecure proxied P2P type manner
*/
//////////////////////////////////////////////////////////////////////////////////////////////////


function retaliateattack(jsondata){
msg("Attacked","Y OU 'V E BE EN HI T!")

lastAttacker = jsondata.from

var issuccess = (jsondata.damage!=0);

var expgain = 10+Math.round(5*Math.random()); //10, 11, 12, 13, 14, or 15

var tmsg = "";

switch(issuccess){
case true:
tmsg = "You loose "+jsondata.damage+" HP";
break;
case false:
tmsg = "The attack missed! You earned 2 exp";
userstats.exp += 2
expgain += (-3);//their exp gain is discounted in accordinance to accuracy
break;
}

msg(jsondata.from+" has just attacked you",tmsg)
userstats.hp+=(-1 * jsondata.damage); //TODO: Multiply by the efficiency of shield
updateStats()


privateRequest(jsondata.from,{
to: jsondata.from,
from: user,
damage: jsondata.damage,
expgain: expgain,
hit: issuccess,
type: "crapconfirm"
})



}

function confirmattack(jsondata){
if(jsondata.hit == true){
msg("Attack Successful","You have enflicted "+jsondata.damage+" damage to "+jsondata.to+". You gain "+jsondata.expgain+" experience points")
}else{
msg("Attack Missed","You're attack on "+jsondata.from+" missed, but you still gain "+jsondata.expgain+" experience points")
}
userstats.exp += jsondata.expgain
}

function crapattack(username){
msg("Initializing PoC attack on "+username,"...aka the Proof Of Concept/Piece Of Crap attack")

if(userstats.level > 1000){
dragonfire(username);


}else{
privateRequest(username,{
to: username,
from: user,
damage: Math.floor(userstats.level*((userstats.hp/userstats.hpMax)+5)*Math.random()),
type: "crapattack"
})

}
}

function dragonfire(username){
msg("the best attack ever","you killed "+username) 

privateRequest(username,{
to: username,
from: user,
damage: 105,
type: "crapattack"
})
}
