/*
ListAPI.

A very powerful system that can store lists on servers, retrieve, and parse
*/


function update_list_js(){
var headID = document.getElementsByTagName("head")[0];         
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = 'js/listapi.js';
headID.appendChild(newScript);
}


function parse_list(username, id, handler){
var list = {};

parseProfile(username,"list_"+id,function(data){
if(data){
//console.log(rawdata)
//data = Ext.util.JSON.decode(rawdata["list_"+id].data)


for(var i = data.length ; i > 0 ; i--){
try{
tdat = Ext.util.JSON.decode(data[i].data);
switch(tdat.listType){
case "add":
list[tdat.id]=(Ext.util.JSON.decode(tdat.data))
list[tdat.id].id = tdat.id
break;
case "remove":
//console.log("rem",tdat.id)
list[tdat.id]=null;
break;
}

}catch(err){
//ignore errors
}
}
var flist = [];
for(var u in list){
if(list[u] && list[u] != null){
flist.push(list[u])
}
}
handler(flist)
}else{
//oops! no list data
}
},true)

}

function list_core(username, list_id, data, data_id, list_action){
if(!data_id){
data_id = Math.round(Math.random()*10000).toString();
}

updateProfile(username, {
type: "list_"+list_id,
id: data_id,
listType: list_action,
data: Ext.util.JSON.encode(data)
})



return data_id;
}

function list_add(username, list_id, data, data_id){
return list_core(username, list_id, data, data_id, "add")
}
function list_remove(username, list_id, data_id){
return list_core(username, list_id, {}, data_id, "remove")
}