var exr = ""


/*
smart subscirption management system functions, higher level API

instead of memorizing 'map0x0' or such, it should be grouped by a ID

so management would be much easier, such as csb.replace("map","sueprawesonewguy")

under object named "csb" for CometSuBscriptions
includes functions: 
ssb.add
ssb.remove
*/
var smartsub = {};

var ssb = {
add: function(type,feed){
if(smartsub[type]){
unsubscribe(smartsub[type],true); //unsubscribe first, no flush
}
subscribe(feed,true); //subscribe, no flush

smartsub[type] = feed; //modify

flushComet(); //flushy-poo
},
remove: function(type){
unsubscribe(smartsub[type],true);
smartsub[type] = null
flushComet()
}

}


function flushComet(){
if(chatComet){
privateRequest(user,{}); //Send message to self; flushes connection and updates subscriptions
}
}

function chatRequest(request){
if(chatComet){
chatComet.doRequest(request);
}
}

function privateRequest(to,request){

var m_request = request
if(!m_request["to"]){m_request["to"]=to}
if(!m_request["from"]){m_request["from"]=user}

chatRequest({
to: m_request.to,
type: "private/"+m_request.to,
from: m_request.from,
data: Ext.util.JSON.encode(m_request),
username: user
})
}

function subscribe(feed,noflush){
if(subscriptions.indexOf(feed) == -1){ //no point if already there...
subscriptions.push(feed); //add it to the subscriptions list
if(!noflush){
flushComet();
}
}
}

function unsubscribe(feed,noflush){
if(subscriptions.indexOf(feed) != -1){ //no point if not there...
subscriptions.remove(feed); //remove it to the subscriptions list
if(!noflush){
flushComet();
}
}
}

function groupchat(){
chatSendAlpha(cv,groupid)
}

function chatroomInvite(jdata){
Ext.MessageBox.confirm(jdata.from+" has invited you to "+jdata.chatid,
"Would you like to join chat "+jdata.chatid+"?",
function(e){
if(e == "yes"){
joinRoom(jdata.chatid)
}else{
msg("Invite Cancelled","You just blew your opportunity to be cyberbullied... you suck")
}
})

}


function joinRoom(chatid){
if(subscriptions.indexOf("group/"+chatid) == -1){
subscribe("group/"+chatid)
dynamicEntries['group/'+chatid] = function(ex){
publicChatMessage(ex,null,chatid)
}
$("groupid")[$("groupid").length] = new Option("Chat "+chatid, chatid)
msg("Joined Chatroom","You are now in chat "+chatid)
publicChatNote(user+" has joined chat "+chatid)
}else{
msg("You're Popular!","Woah! it looks like you are already in this chat!")
}
}

function inviteChat(username,chatid,msg){
privateRequest(username,{
type: "cInvite",
chatid: chatid,
msg: msg
})

}

function newChat(invites,chatid,msg){

joinRoom(chatid)

for(var i = 0; i < invites.length; i ++){
inviteChat(invites[i],chatid,msg)
}
}


function guiInviteChat(username){
Ext.MessageBox.prompt("Name of chatroom","What chatroom do you want to invite "+username+" to?",function(a,b){
if(a=="ok"){

inviteChat(username,b,"Join Chat?  Sender Bot: Type B")

if(subscriptions.indexOf("group/"+b) == -1){
joinRoom(b)
}

}
})
}

function guiNewChat(){
Ext.MessageBox.prompt("Name of chatroom","What do you want to name your chatroom?",function(a1,b1){
if(a1 == "ok"){
Ext.MessageBox.prompt("Invitations to send","Who would you like to invite to chatroom "+b1+"? (note: users seperated by a comma)",function(a2,b2){
if(a2 == "ok"){
newChat(b2.split(","),b1,"Join Chat? Sender Bot: Type A")
}
})
}
})
}
