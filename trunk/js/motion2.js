//Idea:

/*
Multiple event check-points associated with objects.



*/
Math.square = function(x){return x*x}


var _onClick = {}
var _onCollide = {}

var boundry = 30;
var moveScale = 5;
var tOffset = [0,0]
var moveToCache = [];
var moveProxy = {list: [],timestamp:0};
var currentLocation = [];
var movementTranslator = [50,50];
var userLocCache = {};

function move(x,y){
currentLocation = [(x-Ext.get("main").getX())+movementTranslator[0],
(y-Ext.get("main").getY())+movementTranslator[1]]
chatRequest({
type: "group/"+cLay.id,
x: (x-Ext.get("main").getX())+movementTranslator[0],
y: (y-Ext.get("main").getY())+movementTranslator[1],
username: user
})
moveProxy.list = [];
var xdiff = x-Ext.get("local").getX();
var ydiff = y-Ext.get("local").getY();
var xydist = Math.sqrt(Math.square(xdiff)+Math.square(ydiff))
moveToCache = []
var tms = xydist/moveScale
var gxc = Ext.get("local").getX()
var gyc = Ext.get("local").getY()
tOffset = Ext.get("main").getXY()
for(var p = 0; p < tms; p++){
moveToCache.push([parseInt(gxc+(xdiff/tms*p)),parseInt(gyc+(ydiff/tms*p))])
}
move.incremental();
checkClick(x,y)
}

move.incremental = function(){
if(moveToCache[0]){
updateViewport()
document.getElementById("local").style.left = (moveToCache[0][0]-tOffset[0])+"px"
document.getElementById("local").style.top = (moveToCache[0][1]-tOffset[1])+"px"
moveToCache = moveToCache.slice(1)
setTimeout(move.incremental,20);
setTimeout(checkCollision,200);

}
}

move.stop = function(){
moveToCache = [];
}

function updateViewport(){
/*
var mx, ax = 10; //random number...
if(Ext.get("local").getX() < Ext.get("main").getX()+boundry){ //left boundry
mx = ( Ext.get("main").getX()+boundry)-(Ext.get("local").getX()) 
translateObjects(movementTranslator[0]-(ax+mx),movementTranslator[1]);
}else if(Ext.get("local").getY() < Ext.get("main").getY()+boundry){ //top boundry
mx =  (Ext.get("main").getY()+boundry) - (Ext.get("local").getY())
translateObjects(movementTranslator[0],movementTranslator[1]-(mx+ax));
}else if(Ext.get("local").getX() > Ext.get("main").getX()+Ext.get("main").getWidth()-(boundry+32)){ //right boundry

mx = (Ext.get("local").getX()) - (Ext.get("main").getX()+Ext.get("main").getWidth()-(boundry+32))
translateObjects(movementTranslator[0]+(mx+ax+32),movementTranslator[1])
}else if(Ext.get("local").getY() > Ext.get("main").getY()+Ext.get("main").getHeight()-(boundry+32)){ //bottom boundry
mx = Ext.get("local").getY() - (Ext.get("main").getY()+Ext.get("main").getHeight()-(boundry+32))

translateObjects(movementTranslator[0],movementTranslator[1]+(mx+ax+32));
}
*/
}



function checkClick(x,y){
for(i in _onClick){
if(pht(i,x,y)==true){
_onClick[i](); //execute snippet
return true;
}
}
}

function checkCollision(){
//console.log("checkin")
for(i in _onCollide){
if(hittest(i+"_icon","local_icon")==true){
_onCollide[i](); //execute snippet
return true;
}
}
}

var portal = {add : function(id,location){
_onCollide[id] = function(){
Ext.MessageBox.confirm("Are you sure?",
"Are you sure you want to be teleported to "+location+"?",function(a,b){
if(a=="yes"){
newMap(location)
}
})
}

_onClick[id]  = _onCollide[id] 


}
}


checkCollision.add = function(domid){
_onCollide[domid] = new stopMovement()
}


var fight = {
add : function(id){
_onCollide[id] = function(){
Ext.MessageBox.confirm("Are you sure?","Are you sure you want to attack "+id+"?",
function(a,b){if(a=="yes"){
if(npcStats[id]){
npcattack(id)
}else{
crapattack(id)
}
}
})
}
_onClick[id]  = _onCollide[id] 
}
}

var stopMovement = function(){
return function(){
move.stop()
}
}


var goDirection = function(direction){
this.direction = direction;
this.move = function(){
Ext.get("local").move(direction,moveScale)
moveProxy.list.push([Ext.get("local").dom.style.left,Ext.get("local").dom.style.top])
moveProxy.timestamp = (new Date()).getTime()
}
}

setInterval(function(){
if(moveProxy.list.length > 10 || moveProxy.timestamp > (new Date()).getTime()-15000){ //if idle or full
chatRequest({
type: "group/"+cLay.id,
x: moveProxy[moveProxy.list.length-1][0]+movementTranslator[0],
y: moveProxy[moveProxy.list.length-1][1]+movementTranslator[1],
username: user
})
}
},2000)

var goleft = (new goDirection("left")).move;
var goright = (new goDirection("right")).move;
var goup = (new goDirection("up")).move;
var godown = (new goDirection("down")).move;

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

/////////Legacy Wrappers////////////


localMoveTo = move

function updateLocation(){
chatRequest({
type: "group/"+cLay.id,
x: currentLocation[0],
y: currentLocation[1],
username: user
})
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