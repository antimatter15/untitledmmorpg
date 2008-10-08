

//Sprite Dev UI
var idewin;
var curCanvas;
var activeColor = "#000000";
var cMouseState = 0;

function loadSprite(name){
Ext.Ajax.request({
url: "php/parseimg.php",
method: "POST",
params: {sprite: name},
success: function(e){
loadSRC(e.responseText)
}
})
}


function exportSRC(){
var x = [];
var f = idewin.body.dom.firstChild
for(var i = 0; i < f.childNodes.length; i++){
var t = f.childNodes[i]
for(var i1 = 0; i1 < t.childNodes.length; i1++){
var p = t.childNodes[i1].style.backgroundColor
p = p.replace(/[a-z]/g,"")
p = p.replace("(","")
p = p.replace(/ /g,"")
p = p.replace(")","")
var r = p.split(",")
x.push([i1,i,r[0],r[1],r[2]].join("!"))
}
}
return x.join("|")
}

function loadSRC(txt){
if(!idewin){
showIDE()
}
var f = txt.split("|")
for(var i = 0; i < f.length; i++){
try{

if(parseInt(f[i].split("!")[5]) == 127){
idewin.body.dom.firstChild.childNodes[f[i].split("!")[1]].childNodes[f[i].split("!")[0]].style.backgroundColor="rgb(255,255,255)"
idewin.body.dom.firstChild.childNodes[f[i].split("!")[1]].childNodes[f[i].split("!")[0]].style.backgroundImage = "url('images/alpha.png')"
}else{
idewin.body.dom.firstChild.childNodes[f[i].split("!")[1]].childNodes[f[i].split("!")[0]].style.backgroundImage = ""
idewin.body.dom.firstChild.childNodes[f[i].split("!")[1]].childNodes[f[i].split("!")[0]].style.backgroundColor="rgb("+[f[i].split("!")[2],f[i].split("!")[3],f[i].split("!")[4]].join(",")+")"
}
}catch(err){}
}
}

function showIDE(){
idewin = new Ext.Window({
    width: 300,
    height: 350,
    minWidth: 300,
    minHeight: 350,
    minimizable: true,
    title: 'Sprite IDE',
    html: '',
	buttons: [{
        text: 'Close',
        handler: function(){
            idewin.hide();
        }
    },{
        text: 'Load',
        handler: function(){
            Ext.Ajax.request({
			url: "php/parseimg.php",
			method: "POST",
			params: {username: user},
			success: function(e){
			loadSRC(e.responseText)
			}
			})
        }
    },
	{
        text: 'Save',
        handler: function(){
		Ext.Ajax.request({
		url: "php/genimg.php",
		method: "POST",
		params: {src: exportSRC(), username: user},
		success: function(){
msg("Operation Sucessful","Sucessfully Saved Image")
reloadUser()
chatRequest({username: user, type: "group/update", subtype: "icon"}); //tell others that your icon changed



		}
		})   
        }
    }],
    keys: [{
        key: 27,  // hide on Esc
        fn: function(){
            idewin.hide();
        }
    }]
});
idewin.on('minimize', function(){
    idewin.toggleCollapse();
});
idewin.show();

idewin.body.dom.appendChild(makeCanvas())

colorwin = new Ext.Window({
    width: 400,
    height: 220,
    minWidth: 150,
    minHeight: 100,
    minimizable: true,
    title: 'Sprite IDE Color Picker',
    html: '',
    keys: [{
        key: 27,  // hide on Esc
        fn: function(){
            colorwin.hide();
        }
    }]
});
colorwin.on('minimize', function(){
    colorwin.toggleCollapse();
});
colorwin.show();

    var cl = ['00','33','66','99','CC','FE'];
    var clist = [];
    for(var r=0; r<cl.length; r++){
      for(var g=0; g<cl.length; g++){
        for(var b=0; b<cl.length; b++){
          clist[clist.length] = cl[r]+cl[g]+cl[b];
}
}
}		  
/*
clist = ["000000", "993300", "333300", "003300", "003366", "000080", "333399", "333333",
        "800000", "FF6600", "808000", "008000", "008080", "0000FF", "666699", "808080",
        "FF0000", "FF9900", "99CC00", "339966", "33CCCC", "3366FF", "800080", "969696",
        "FF00FF", "FFCC00", "FFFF00", "00FF00", "00FFFF", "00CCFF", "993366", "C0C0C0",
        "FF99CC", "FFCC99", "FFFF99", "CCFFCC", "CCFFFF", "99CCFF", "CC99FF", "FEFEFE"]
//*/
		var cp = new Ext.ColorPalette({style: {width: "380px"},value:'000000', colors: clist});  
cp.render(colorwin.body);
cp.on('select', function(palette, selColor){
activeColor = "#"+selColor
});

var tsc = new Ext.Button({
text: "Transparent Color",
applyTo: colorwin.body,
handler: function(){
activeColor = "#FFFFFF"
}
})

}


function makeCanvas(){
var nT = document.createElement("table")
nT.setAttribute("cellpadding","1px")
nT.setAttribute("cellborder","1px")
nT.setAttribute("cellspacing","1px")

for(var y = 0; y < 32;y++){
var nR = document.createElement("tr")
for(var x = 0; x < 32;x++){
var nC = document.createElement("td")
nC.style.width="7px"
nC.style.height="7px"
nC.style.backgroundColor = "#FFFFFF"
nC.setAttribute("name","y"+y+"x"+x)
nC.style.backgroundImage = "url('images/alpha.png')"


nC.className = "x-unselectable"

Ext.get(nC).on("mousedown",function(a,b){cMouseState = 1;fillCell(b);a.stopEvent()})
Ext.get(nC).on("mouseup",function(a,b){cMouseState = 0;fillCell(b);a.stopEvent()})


Ext.get(nC).on("mousemove", function(a,b){
if(cMouseState == 1){
fillCell(b)
}
a.stopEvent()
})

nR.appendChild(nC)
}
nT.appendChild(nR)
}

nT.className = "x-unselectable"

Ext.get(nT).on("blur",function(a){cMouseState = 0;a.stopEvent()})

return nT
}

function fillCell(b){
if(activeColor == "#FFFFFF"){
b.style.backgroundColor = "#FFFFFF"
b.style.backgroundImage = "url('images/alpha.png')"
}else{
b.style.backgroundImage = ""
b.style.backgroundColor = activeColor
}
}