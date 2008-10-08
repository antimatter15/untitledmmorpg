var errorType = "winnt"; //he he


function man(dcf){ //just like Unix
var apps = applications;

var args = "0: None";
if(apps[dcf].args){args=apps[dcf].args;}
return dcf + ": " + apps[dcf].desc + " Arguments " + args
}

function syshelp(){
var apps = applications;
var func;
var functionList = ["<i>syshelp v2 made by antimatter15</i><br>For More Function-Specific Help, use the MAN function"];
for(func in apps){
var funcRow = "<b>"+func+"</b>";
for(var i=0;i<20-func.length; i++){funcRow+="_";}
funcRow+=apps[func].desc
functionList.push(funcRow)
}

return functionList.join("<br>")
}


function parseCommand(query){
if(query.length < 1){
return ["No Command Line Application Specified"]
}

var apps = applications;
var func;
var hp = false;
for(func in apps){
if(query.substr(0,func.length) == func){
hp = true
break;
}
}


 

if(hp==false){
//Check if it's math...



try{
if(window[query.trim()]){
if(typeof(window[query.trim()]) == "function"){
return [window[query.trim()]()]
}else{
return [window[query.trim()]]
}
}else{

return [eval(query.trim())]; //execute math/ return as array

}
}catch(err){
}



var parseError = "Parse Error: Undefined Application"; //generic one that i made up

var eApp = "undefined";
if(query.indexOf(" ") > 0){
eApp = query.substr(0,query.indexOf(" "))
}else{
eApp = query
}


switch(errorType){
case "winnt":
parseError = "'"+eApp+"' is not recognized as an internal or external command, operable program or batch file."
break;
case "unix":
//i dono what a unix shell error looks like, i'm bored and wont open up xming/cygwin
break;
}



return [1337,"Generic Parse Error",parseError];//he he
}


if(query.substr(func.length).trim() == ""){
//if there are no arguments....
return [apps[func].fn()]
}else{
//if there are arguments... parse them
var args = query.substr(func.length).trim()

//return apps[func].fn.apply(null, args.split(" "))
return [apps[func].fn.apply(null, [args])]; //we really dont need the multi-arg support yet

}
}

var typeHist = [];
var ctIdx = 0;

Ext.onReady(function(){
try{
$("word").setAttribute("autocomplete","off")
Ext.get('word').on("keydown",function(a,b){

a.stopPropagation();

switch(a.button){
case 37:
//up
a.stopEvent();
try{

ctIdx = ctIdx -1
$('word').value = typeHist[ctIdx]
}catch(err){}
break;
case 39:
a.stopEvent();
try{
ctIdx = ctIdx + 1
$('word').value = typeHist[ctIdx]
}catch(err){}
//down
break;
}

})
}catch(err){}
})

function chatSend(){

var cv = $('word').value
typeHist.push(cv)
ctIdx = typeHist.length


chatSendAlpha(cv,$("groupid")[$("groupid").selectedIndex].value)

$('word').value=''

$("groupid").selectedIndex = 0
}


function chatSendAlpha(cv,groupid){ //wtf? what's the first greek letter got to do with this?


if((cv.replace(/ /g,"")).length == 0){return;} //make sure it's not blank


if(cv.indexOf(">") == 0 || cv.indexOf("$") == 0 || cv.indexOf("#") == 0){ 
var parsedValue = parseCommand(cv.substr(1)); //hmm.... for some reason I cant ever run eval 1336 + 1....
if(1337 == parsedValue[0]){
insertLog(parsedValue[2])
}else{
insertLog(parsedValue[0])
}
}else{

if(!groupid){groupid="pchat"}

chatRequest({type: "group/"+groupid, msg: cv,  time: (new Date).format("g:i:sa")});


}



}