/*
* Game Applications accessable through chat/commandline
*
* Written by Antimatter15 2008
*/


Boolean.prototype.toggle=function(){return (this==true)?false:true}//Prototype Boolean Object, to add toggle() functionality


var applications = {
man: {
desc: "Gets Arguments/Description From Documented Function",
args: "1: Name of documented function",
fn: function(dcf){
return man(dcf)
}
},
startbenchmark: {
desc: "Tests the speed for a round-trip result from client to server back to client",
fn: startBenchmark
},
clearlog: {
desc: "Clears Local Chat Log",
fn: function(){
$('chatData').innerHTML = ""
return "Cleared Local Chat Log"
}},
cls: {
desc: "Clears Local Chat Log",
fn: function(){
$('chatData').innerHTML = ""
return "Cleared Local Chat Log"
}},
clear: {
desc: "Clears Local Chat Log",
fn: function(){
$('chatData').innerHTML = ""
return "Cleared Local Chat Log"
}},
syshelp: {
desc: "Shows Function/Command List",
fn: function(){
return syshelp()
}},
help: {
desc: "Shows Function/Command List",
fn: function(){
return syshelp()
}},
showall: {
desc: "Enable/Disable Verbose Logging",
fn: function(){
showallmessages = showallmessages.toggle()
return "Enabled/Disabled Display All Messages"
}},
repeat: {
desc: "Repeat action",
args: "1: parsable action",
fn: function(action){
Ext.MessageBox.prompt("Number Of Times","Repeat How Many Times?",function(a,b){
if(a=="ok"){for(var i = 0; i < parseInt(b); i++){
insertLog(parseCommand(action)[0])
}}})
return "Finished Loop"
}
},
relaymessage: {
desc: "Relay Messages from the chat box to a balloon dialog",
fn: function(){
relayMessages = relayMessages.toggle()
return "Messages will now (not) appear in a balloon dialog"
}},
eval: {
desc: "Evaluate Javascript Code",
args: "1: Javascript Code To Execute",
fn: function(jsc){
return eval(jsc)
}},
run: {
desc: "Run an undocumented function",
args: "1: Name Of Function",
fn: function(fnn){
return window[fnn]();
}},
loadlogs: {
desc: "Load public chat logs from a specified index",
args: "1: index; Can be 'all' or any number",
fn: function(length){
loadPChatLog(length,function(){})
}
},
changename: {
desc: "Change username",
args: "1: new username",
fn: renameLocal
},
openide: {
desc: "Open Sprite Editor",
fn: showIDE
},
time: {
desc: "Returns current time",
fn: function(){return (new Date).format("g:i:sa")}
},
echo: {
desc: "Echos a string",
args: "1: String",
fn: function(str){return str}
},
title: {
desc: "Sets Application Title",
args: "1: New Title",
fn: function(ntitle){document.title = ntitle}
},
addprog: {
desc: "Add Application from function",
args: "4: application name, Description, function, arguments",
fn: addFunction
},
_disconnectsys: {
desc: "DO NOT PRESS THIS BUTTON",
fn: function(){
chatComet.connect = function(){}
chatComet.doRequest = function(){}
chatSendAlpha('i got pwned because im dumb')
return "I told you not to press the button.... But NOO you didn't listen"
}
}
}

function addFunction(name,desc,fn,args){
applications[name] = {
desc: desc,
fn: fn,
args: args
}
}