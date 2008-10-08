/*
NOTE: This is NOT localization! This is for gemometric translation of user/npc locations!

Also can be known as viewboxes :)
*/

function translateObjects(nx,ny){
var mainObjects = $(cLay).childNodes
var mt0 = nx-movementTranslator[0]
var mt1 = ny-movementTranslator[1]
for(var i = 0; i < mainObjects.length; i++){
Ext.get(mainObjects[i]).setX(Ext.get(mainObjects[i]).getX()-mt0)
Ext.get(mainObjects[i]).setY(Ext.get(mainObjects[i]).getY()-mt1)
}
movementTranslator = [nx,ny]
updateArrows()
}

function guiViewBox(){
Ext.MessageBox.prompt("View Box","Enter the coordinates for the starting top left corner of the view box [X,Y] format",function(a,b){
if(a == "ok"){
var nb = Ext.util.JSON.decode(b)
if(nb[0] && nb[1]){
translateObjects(nb[0],nb[1])
msg("Changed Viewbox","Viewbox is now "+nb[0]+"x"+nb[1])
}else{
msg("Error!","Invalid Input")
}
}
})
}