

function formatChat(jsondata,hdr){
if(!hdr){hdr=""}

if(jsondata){
if(relayMessages == true){
//Username/Date can still cause XSS. i'll keep this security risk here for the fun of it
msg(hdr+'<span style="color: blue">'+jsondata["username"]+" ("+jsondata["time"]+")"+"</span>",fhtml(jsondata["msg"]))
}
return hdr+'<span style="color: blue">'+jsondata["username"]+" ("+jsondata["time"]+")"+"</span>"+": "+fhtml(jsondata["msg"]);
}else{
return "Error: Incorrect Input Parameters"
Log("Chat Formatter Error","Incorrect Input Parameters")
}
}



function publicChatNote(data){

$('chatData').innerHTML = '<div><span style="color: green"><i>' + fhtml(data) + '</i></span></div>' + $('chatData').innerHTML;

}

function publicChatMessage(jdata,isprivate,chatroom){

var ct = Ext.DomHelper.insertFirst(document.body, {}, true)
var chatTip = new Ext.Tip({html: "_", applyTo: ct, shadow: false}) 

var hdr = ""
if(isprivate){
hdr = '<span style="color: green">Private Message </span>'
}

if(chatroom){
hdr = '<span style="color: green">chat '+chatroom+' </span>';//lovely XSS...
}

$('chatData').innerHTML = '<div>' +  formatChat(jdata,hdr) + '</div>' + $('chatData').innerHTML;

if(jdata.username == user){
jdata.username = "local"
}

addUser(jdata.username)
chatTip.body.dom.innerHTML = hdr+fhtml(jdata.msg)
chatTip.show()
chatTip.setPosition(Ext.get(jdata.username).getX()+32,Ext.get(jdata.username).getY())
Ext.get(ct).fadeOut({duration: 5, remove: true, callback: function(){chatTip.destroy()}})

}


function insertLog(message){
var jdata = {}
jdata.time = (new Date).format("g:i:sa");
jdata.username = "<span style='color: red'>localsystem</span>"
jdata.msg = Ext.util.JSON.encode(message)
$('chatData').innerHTML = '<div>' +  formatChat(jdata) + '</div>' + $('chatData').innerHTML;
}


function log(message,tag){

if(taglog){
if(tag){
if(!logTags[tag]){
logTags[tag] = [message]
}else{
logTags[tag].push(message)
}
}
}

if(showallmessages == true){
insertLog(message)
}
}

Log=log;

function tagCloud(){

}
