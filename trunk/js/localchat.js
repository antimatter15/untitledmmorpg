
function loadPChatLog(size,finfun){
Ext.Ajax.request({
url: "php/chatget.php?action=getlog&size="+size,
success: function(e){
try{
var clg = Ext.util.JSON.decode("["+e.responseText+"]")
$('chatData').innerHTML = " "
for(var i = 1; i < clg.length; i++){
$('chatData').innerHTML += '<div>' +  formatChat(clg[i]) + '</div>' ;
} 
}catch(err){
$('chatData').innerHTML = "Error Reloading Chat Logs, Less than 10 previous chats?."
}

finfun()
},
failure: function(){
Ext.MessageBox.alert("Crap Error!","Unable to retrieve chat logs!")
}

})
}



