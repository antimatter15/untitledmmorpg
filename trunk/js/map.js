Ext.onReady(function(){
setTimeout(function(){

uimg = document.createElement("img")
dimg = document.createElement("img")
limg = document.createElement("img")
rimg = document.createElement("img")

Ext.get(uimg).on("mousedown", function(a){
a.stopPropagation()
translateObjects(movementTranslator[0],movementTranslator[1]-30)
return false
})
Ext.get(dimg).on("mousedown", function(a){
a.stopPropagation()
translateObjects(movementTranslator[0],movementTranslator[1]+30)
return false
})
Ext.get(limg).on("mousedown", function(a){
a.stopPropagation()
translateObjects(movementTranslator[0]-30,movementTranslator[1])
return false
})
Ext.get(rimg).on("mousedown", function(a){
a.stopPropagation()
translateObjects(movementTranslator[0]+30,movementTranslator[1])
return false
})

$("main").appendChild(uimg)
$("main").appendChild(dimg)
$("main").appendChild(limg)
$("main").appendChild(rimg)


uimg.src = "images/arrow_up.gif"
dimg.src = "images/arrow_down.gif"
limg.src = "images/arrow_left.gif"
rimg.src = "images/arrow_right.gif"
uimg.style.position = "absolute"
dimg.style.position = "absolute"
limg.style.position = "absolute"
rimg.style.position = "absolute"

uimg.style.zIndex = 20
dimg.style.zIndex = 20
limg.style.zIndex = 20
rimg.style.zIndex = 20


updateArrows(); //do now, do later

setInterval(updateArrows,10000);


},1000)
})


function updateArrows(){


uimg.style.left = (Ext.get("main").getWidth()/2)-24+"px"
uimg.style.top = 0

dimg.style.left = (Ext.get("main").getWidth()/2)-24+"px"
dimg.style.top = (Ext.get("main").getHeight()-30)+"px"

limg.style.left = 0
limg.style.top = ((Ext.get("main").getHeight()/2)-24)+"px"

rimg.style.left = (Ext.get("main").getWidth())-30+"px"
rimg.style.top = ((Ext.get("main").getHeight()/2)-24)+"px"



}