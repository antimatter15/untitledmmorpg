
///////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////version 2 is faster... hopefully//////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////Collision Detection Core V2//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////By antimatter15///////////////////////////////////
////////////////////////////////////////////////////////////////copyright 2008//////////////
////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////ihopeitisfaster...///////////////////////////////////////////////////////



function hittest(obj1,obj2,force){
try{

//console.log("testing "+obj1+" and "+obj2)

var eg1 = Ext.get(obj1)
var eg2 = Ext.get(obj2)

var o1x = eg1.getX()
var o1y = eg1.getY()

var o2x = eg2.getX()
var o2y = eg2.getY()

var xdiff = o2x-o1x; //collision detection script improvements
var ydiff = o2y-o1y; 

if(Math.sqrt((xdiff*xdiff)+(ydiff*ydiff))<51 || force){

var o1w = eg1.getWidth()
var o1h = eg1.getHeight()

var o2w = eg2.getWidth()
var o2h = eg2.getHeight()

return (sht2(o1x,o1y,o1w,o1h,o2x,o2y,o2w,o2h) || sht2(o2x,o2y,o2w,o2h,o1x,o1y,o1w,o1h))
}else{
return false; 
}
}catch(err){
log("Collision Detection Between "+obj1+" and "+obj2+" failed: "+Ext.util.JSON.encode(err))
return false;
}
}



function pht2(xc,yc,ow,oh,x,y){ //pht stands for "Point HitTest" and the 2 is because this is version 2
return ((x>xc) && (y>yc) && (x<xc+ow) && (y<yc+oh)); //if all are true, then collision occured
}

function sht2(o1x,o1y,o1w,o1h,o2x,o2y,o2w,o2h){ //sht stands for "Super [Point] Hit Test, which uses 2 objects
var maxX = o1x+o1w
var maxY = o1y+o1h
return (
pht2(o2x,o2y,o2w,o2h,o1x,o1y) ||
pht2(o2x,o2y,o2w,o2h,maxX,o1y) || 
pht2(o2x,o2y,o2w,o2h,o1x,maxY) || 
pht2(o2x,o2y,o2w,o2h,maxX,maxY) 
)
}

function pht(obj,x,y){ //object, X, Y
//Ext.get(obj).getX()+Ext.get(obj).getWidth()  //Max Width
//Ext.get(obj).getY()+Ext.get(obj).getHeight()  //Max Height
//Ext.get(obj).getX()  //Min Width
//Ext.get(obj).getY()  //Min Height

var xc = Ext.get(obj).getX()
var yc = Ext.get(obj).getY()

var minX = (x>xc); //passes min X
var minY = (y>yc); //passes min Y

var maxX = (x<xc+Ext.get(obj).getWidth()); //passes max x
var maxY = (y<yc+Ext.get(obj).getHeight()); //passes max y

return (minX && minY && maxX && maxY); //if all are true, then collision occured
}

/*
OLD VERSION:

[also easier to read/understand: probably easily portable to other plaforms?!?!]

function pht(obj,x,y){ //object, X, Y
//Ext.get(obj).getX()+Ext.get(obj).getWidth()  //Max Width
//Ext.get(obj).getY()+Ext.get(obj).getHeight()  //Max Height
//Ext.get(obj).getX()  //Min Width
//Ext.get(obj).getY()  //Min Height

var xc = Ext.get(obj).getX()
var yc = Ext.get(obj).getY()

var minX = (x>xc); //passes min X
var minY = (y>yc); //passes min Y

var maxX = (x<xc+Ext.get(obj).getWidth()); //passes max x
var maxY = (y<yc+Ext.get(obj).getHeight()); //passes max y

return (minX && minY && maxX && maxY); //if all are true, then collision occured
}

function sht(obj1,obj2){

var minX = Ext.get(obj1).getX()
var minY = Ext.get(obj1).getY()


var maxX = minX+Ext.get(obj1).getWidth()
var maxY = minY+Ext.get(obj1).getHeight()
/ *
return [
pht(obj2,minX,minY), //top left
pht(obj2,maxX,minY), //top right
pht(obj2,minX,maxY), //bottom left
pht(obj2,maxX,maxY) //bottom right
]
* /

return (
pht(obj2,minX,minY) || //top left
pht(obj2,maxX,minY) || //top right
pht(obj2,minX,maxY) || //bottom left
pht(obj2,maxX,maxY) //bottom right
)
}

function hittest1(obj1,obj2,force){
if(Ext.get(obj2) && Ext.get(obj1)){

var xdiff = Ext.get(obj2).getX()-Ext.get(obj1).getX()
var ydiff = Ext.get(obj2).getY()-Ext.get(obj1).getY()
var xydist = Math.sqrt((xdiff*xdiff)+(ydiff*ydiff)); //ooh geometry!

if(xydist < 50 || force){
return (sht(obj1,obj2) || sht(obj2,obj1))
}else{
return false
}
}else{
return false
}
}

*/