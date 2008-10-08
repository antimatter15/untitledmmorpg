
var moveScale = 5;
var moveProxy = []; //storage for movement proxy
var moveProxyClear = 10; //point where if the movement proxy is dumped to the server
var idleness = 0;
var currentLocation = [0,0];

var userLocCache = {};
var moveToCache = [];

var forcelist = []

var solidTime = 0;
var solidCache = [];
var boundry = 30

var movementTranslator = [50,50]; //current location
var tOffset = [0,0];

var l_pca, l_pcb; //location cache

var cak = 2;


//AGNORTIX

function progressMove(){ //such insanely fast code you cant imagine
if(moveToCache[0]){
//var pc = Ext.get("local").getXY()


if((cak+1) % 3 == 0){
l_pca = document.getElementById("local").style.top
l_pcb = document.getElementById("local").style.left
}

document.getElementById("local").style.left = (moveToCache[0][0]-tOffset[0])+"px"
document.getElementById("local").style.top = (moveToCache[0][1]-tOffset[1])+"px"
//Ext.get("local").setXY(moveToCache[0])


if(checkUserCollide()==true){//eeeww so slow
//Ext.get("local").setXY(pc)
document.getElementById("local").style.left = l_pcb
document.getElementById("local").style.top = l_pca
moveToCache = [];
}

moveToCache=moveToCache.slice(1)
setTimeout(progressMove,50)
}
}

function bCCC(){
for(var i = 0; i < solidCache.length; i++){
try{

if(hittest(solidCache[i],"local_icon",(forcelist.indexOf(solidCache[i])!=-1)) == true){ //collision of icons?
//msg("So...","So, you think you can just walk on over people? I don't think so!")

return true
}
}catch(err){
log(err)
}
}
return false
}

function checkPortalCollide(x,y){
for(i in portalDB){
try{
if(pht(i+"_icon",x,y)==true){
Ext.MessageBox.confirm("Are you sure?",
"Are you sure you want to be teleported to "+portalDB[i]+"?",function(a,b){
if(a=="yes"){
newMap(portalDB[i])
}
}
)
}
}catch(err){}
}
}


function checkFightCollide(x,y){
var fightable = Ext.util.JSON.decode(Ext.util.JSON.encode(loadedUsers))
for(var i in npcStats){
fightable.push(i)
}

for(var i = 0; i < fightable.length; i++){
try{
if(pht(fightable[i]+"_icon",x,y)==true){
Ext.MessageBox.confirm("Are you sure?",
"Are you sure you want to attack "+fightable[i]+"?",
function(a,b){
if(a=="yes"){
if(npcStats[fightable[i]]){
npcattack(fightable[i])
}else{
crapattack(fightable[i])

}
}
}
)
return;
}
}catch(err){
}
}

}


function checkUserCollide(){
cak++
if(cak % 3 == 0){
l_pca = document.getElementById("local").style.top
l_pcb = document.getElementById("local").style.left

if((new Date()).getTime()-solidTime > 10000){
solidTime = (new Date()).getTime();
}else{
solidCache = []

for(var i = 0; i < loadedUsers.length; i++){
solidCache.push([loadedUsers[i],"_icon"].join(""))
}
solidCache.remove("local")
solidCache = solidCache.concat(solidNPCs)
}

var mx, ax = 10; //random number...
var hat = false;


if(bCCC()==true){
return true;
}else{
if(Ext.get("local").getX() < Ext.get("main").getX()+boundry){ //left boundry
mx = ( Ext.get("main").getX()+boundry)-(Ext.get("local").getX()) 
hat=movementTranslator
translateObjects(movementTranslator[0]-(ax+mx),movementTranslator[1]);
}else if(Ext.get("local").getY() < Ext.get("main").getY()+boundry){ //top boundry
hat=movementTranslator
mx =  (Ext.get("main").getY()+boundry) - (Ext.get("local").getY())
translateObjects(movementTranslator[0],movementTranslator[1]-(mx+ax));
}else if(Ext.get("local").getX() > Ext.get("main").getX()+Ext.get("main").getWidth()-(boundry+32)){ //right boundry
hat=movementTranslator
mx = (Ext.get("local").getX()) - (Ext.get("main").getX()+Ext.get("main").getWidth()-(boundry+32))
translateObjects(movementTranslator[0]+(mx+ax+32),movementTranslator[1])
}else if(Ext.get("local").getY() > Ext.get("main").getY()+Ext.get("main").getHeight()-(boundry+32)){ //bottom boundry
mx = Ext.get("local").getY() - (Ext.get("main").getY()+Ext.get("main").getHeight()-(boundry+32))
hat=movementTranslator
translateObjects(movementTranslator[0],movementTranslator[1]+(mx+ax+32));
}

if(hat != false){
cak--
}
}

}
return false
}



//Move Proxy and Check Idle is just ddos protection sorta. i dont want 50 requests a second...

function checkMoveProxy(force){

currentLocation = [(Ext.get("local").getX()-Ext.get("main").getX())+movementTranslator[0],
(Ext.get("local").getY()-Ext.get("main").getY())+movementTranslator[1]]

var valid = false;

if((new Date()).getTime()-idleness > 1000*1.5){
valid = true
}

if(force || (moveProxy.length > moveProxyClear && valid)){

idleness = (new Date()).getTime()

chatRequest({
type: "group/"+cLay.id,
x: moveProxy[moveProxy.length-1][0]+movementTranslator[0],
y: moveProxy[moveProxy.length-1][1]+movementTranslator[1],
username: user
})

moveProxy = []

}
}

function updateLocation(){
chatRequest({
type: "group/"+cLay.id,
x: currentLocation[0],
y: currentLocation[1],
username: user
})
}

function checkIdle(){
if((new Date()).getTime()-idleness > 1000*15){ //if connection idle for 15 seconds...
if(moveProxy.length > 1){ // 5px aint matter much
for(var i = 0; i < moveProxyClear + 1; i++){
moveProxy.push(moveProxy[moveProxy.length-1]); //push it just over the edge
}
checkMoveProxy(true);//pull the trigger
}
}
}

setInterval(checkIdle,15*1000);

function localMoveTo(x,y){

currentLocation = [(x-Ext.get("main").getX())+movementTranslator[0],
(y-Ext.get("main").getY())+movementTranslator[1]]

chatRequest({
type: "group/"+cLay.id,
x: (x-Ext.get("main").getX())+movementTranslator[0],
y: (y-Ext.get("main").getY())+movementTranslator[1],
username: user
})
moveProxy = [];
/*
Ext.get("local").shift({
x:x,
y:y,
duration: Math.sqrt((y^2)+(x^2))/moveScale
})
*/
var xdiff = x-Ext.get("local").getX()
var ydiff = y-Ext.get("local").getY()
var xydist = Math.sqrt((xdiff*xdiff)+(ydiff*ydiff)); //ooh geometry!


log("Geometric X,Y Distance: " + xydist);

isMoving = false;
if(moveToCache[0]){
isMoving = true
}

moveToCache = []

var tms = xydist/moveScale
var gxc = Ext.get("local").getX()
var gyc = Ext.get("local").getY()
tOffset = Ext.get("main").getXY()
//var gxc = parseFloat(document.getElementById("local").style.top)
//var gyc = parseFloat(document.getElementById("local").style.left)
for(var p = 0; p < tms; p++){

moveToCache.push([
parseInt(gxc+(xdiff/tms*p)),
parseInt(gyc+(ydiff/tms*p))
])
}

checkFightCollide(x,y)
checkPortalCollide(x,y)

if(isMoving == false){
setTimeout(progressMove,1)
setTimeout(progressMove,1)

}
}

function goup(){
Ext.get("local").move("up",moveScale)
if(checkUserCollide()==true){
Ext.get("local").move("down",moveScale)
}
moveProxy.push([Ext.get("local").dom.style.left,Ext.get("local").dom.style.top])
checkMoveProxy()
}
function godown(){

Ext.get("local").move("down",moveScale)
if(checkUserCollide()==true){
Ext.get("local").move("up",moveScale)
}
moveProxy.push([Ext.get("local").dom.style.left,Ext.get("local").dom.style.top])
checkMoveProxy()
}
function goleft(){

Ext.get("local").move("left",moveScale)
if(checkUserCollide()==true){

Ext.get("local").move("right",moveScale)
}
moveProxy.push([Ext.get("local").dom.style.left,Ext.get("local").dom.style.top])
checkMoveProxy()
}
function goright(){

Ext.get("local").move("right",moveScale)
if(checkUserCollide()==true){
Ext.get("local").move("left",moveScale)
}
moveProxy.push([Ext.get("local").dom.style.left,Ext.get("local").dom.style.top])
checkMoveProxy()
}
Ext.onReady(function(){
Ext.get("main").on("mousedown",function(a,b,c,d){
if(a.button == 0){ //make sure it's a right-click
localMoveTo(a.xy[0],a.xy[1])

}
})

Ext.get("main").on("contextmenu",function(e,o){
    e.preventDefault(); // Prevents the browsers default handling of the event
    e.stopPropagation(); // Cancels bubbling of the event
    e.stopEvent() // preventDefault + stopPropagation
if (!this.contextMenu) {

	log("context menu for main at"+o.id)
	
this.contextMenu = new Ext.menu.Menu({
items: [{
text: 'Move Here',
handler: function(){localMoveTo(e.xy[0],e.xy[1])}
}]
});


}
var xy = e.getXY();
this.contextMenu.showAt(xy);
})
})


function moveUser(jsondata){
if(jsondata.username == user){
log("No need to move self... Canceling Request")
return
}else{

addUser(jsondata.username,true)

userLocCache[jsondata.username]=[parseInt(jsondata.x),parseInt(jsondata.y)]

Ext.get(jsondata.username).shift({
x: (Ext.get("main").getX()+parseInt(jsondata.x))-movementTranslator[0],
y: (Ext.get("main").getY()+parseInt(jsondata.y))-movementTranslator[1]
})
}
}