/*

Profile Database Access Code

================================================================

This code communicates with each user's individual "profile" (more acurrately; a log) of the user.
It contains the "abstraction" code, which takes the data and converts it into a higher-level, and
more usable info. There is also the API for ease of profile access.

TODO:
Profile Updating.
NPC Profiles.

*/


function updateProfile(username,request){
//Remember, append, no replace


chatRequest({
writelog: "profile",//only log it
type: request.type, //so the profile parser is triggered
username: username,to: username, //well.... pretty self-explanitory
data:Ext.util.JSON.encode(request) // aah! the actual parsing!
})
}

function abstractData(rawdata,search,noremove){
var sxrd = rawdata.split("|").reverse(); //Split, soemthing, Reverse, Decoded.. it's not related to my sony sxrd rear-projection tv :)

var dout = {};

for(var i = 0; i < sxrd.length; i++){
for(var m = 0; m < search.length; m++){
//if(stripslashes(sxrd[i]).indexOf(search[m]) != -1){ //guessing...
try{
var data = Ext.util.JSON.decode(sxrd[i])
if(data.type == search[m]){


dout[search[m]]=data
search.remove(search[m])

}
}catch(err){}
//}
}
}
return dout
}

function abstractComponent(rawdata,type,noremove){ //abstracts a single data from a profile
var sxrd = rawdata.split("|").reverse();//Split, soemthing, Reverse, Decoded.. it's not related to my sony sxrd rear-projection tv :)
for(var i = 0; i < sxrd.length; i++){
//if(stripslashes(sxrd[i]).replace(/\//).indexOf(type) != -1){ //guessing...
try{
var data = Ext.util.JSON.decode(sxrd[i])
if(data.type == type){
return data;
}
}catch(err){}
//}
}
return null;
}


function aCL(rawdata,type){ //abstracts a single data from a profile
var sxrd = rawdata.split("|").reverse();//Split, soemthing, Reverse, Decoded.. it's not related to my sony sxrd rear-projection tv :)
var results = [];
for(var i = 0; i < sxrd.length; i++){

try{
var data = Ext.util.JSON.decode(sxrd[i])
if(data.type == type){

//return data;
results.push(data);
}
}catch(err){}
//}
}
return results;
}

function parseProfile(username,search,func,noremove){ //noremove only works if search is an array
Ext.Ajax.request({
url: "data/profile/"+username+".txt",
success: function(ex){
exr = ex.responseText;
if(noremove == true){
var ked = (aCL(ex.responseText,search))
}else if(typeof(search) == typeof(["microsoft","sucks"])){
var ked = (abstractData(ex.responseText,search,noremove))
}else if(typeof(search) == typeof("google is nice")){
var ked = (abstractComponent(ex.responseText,search,noremove))
}
if(ked){
func(ked);//just a letter away from offending some...
}else{
func(null);
}
},
failure: function(){
func(null)
}
})
}

function saveStats(){
updateProfile(user,{
type: "stats",
statobject: userstats
})
}
