var user = "guest" + Math.floor(Math.random()*8999+1000)
var cLay;
var loginWindow;




Ext.onReady(function(){//iFone Support
//alert(navigator.userAgent)
if(navigator.userAgent.match(/iPhone/g)){
msg("Apple iPhone Display mode","You are now using the iPhone viewing mode")
//alert("IPWN!"
setInterval(function(){
viewport.setWidth(1024)
viewport.setHeight(800)
setTimeout(function(){window.scrollTo(0, 1);}, 100); //remove toolbar
},1000)
}
})


Ext.onReady(function(){

Ext.QuickTips.init();
var qtip = Ext.QuickTips.getQuickTip();
qtip.interceptTitles = true;

initMap("map1x1")
addUser("local",true,[100,100])
})



Ext.onReady(function(){
setTimeout(function(){
loadPChatLog(10,function(){


loadUsers()
loadNPCs("map1x1")


})
},1000)
})

function reloadUser(username){
var userid = username
if(!username){
username = user
userid = "local"
}

if(username != "local"){
$(userid+"_icon").src = 'data/usericon/'+username+'.gif?'+Math.random().toString()
}
}




 var msgCt;
 function msg(title, data){
    if(!msgCt){
        msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
    }
    msgCt.alignTo(document, 't-t');
    Ext.DomHelper.append(msgCt, {html:makeBox(title,data)
	}, true).slideIn('t').pause(2).ghost("t", {remove:true});
}

function makeBox(title,data){
	return (['<div class="msg">',
    '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
    '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', title, '</h3>', data, '</div></div></div>',
    '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
    '</div>'].join(''))
}

Ext.onReady(function(){
$("profile").innerHTML = '<table><tr><td><span><b>Username: </b></span>'+
'<span id="pUsername">N/A</span></td></tr><tr><td><span><b>Level: </b></span>'+
'<span id="pLevel">N/A</span></td></tr><tr><td><span><b>Exp: </b></span>'+
'<span id="pExp">N/A</span></td></tr><tr><td><span><b>HP: </b></span>'+
'<span id="pHP2">N/A</span><div style="width: 90%;height: 5px;background-color:#D8D4D2">'+
'<div id="pHP" style="width: 60%;height: 100%;background-color: red">'+
'</div></div></td></tr><tr><td><span><b>MP: </b></span><span id="pMP2">N/A</span>'+
'<div style="width: 90%;height: 5px;background-color:#D8D4D2">'+
'<div id="pMP" style="width: 60%;height: 100%;background-color: blue">'+
'</div></div></td></tr><tr><td><span><b>Money: </b></span>'+
'<span id="pMoney">N/A</span></td></tr></table>'
})

var uimg;
var dimg;
var limg;
var rimg;

/**
 * Clone Function
 */
Ext.ux.clone = function(o) {
    if(!o || 'object' !== typeof o) {
        return o;
    }
    var c = 'function' === typeof o.pop ? [] : {};
    var p, v;
    for(p in o) {
        if(o.hasOwnProperty(p)) {
            v = o[p];
            if(v && 'object' === typeof v) {
                c[p] = Ext.ux.clone(v);
            }
            else {
                c[p] = v;
            }
        }
    }
    return c;
}; // eo function clone  

