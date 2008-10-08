//Validation is not necessary due to the horrible security model, but there is a validation for the GUI for fake protection
var admin = false;


function badPermissions(){
msg("Permissions Error","You do not have adequate permissions to execute the parent function")
}

function validateadmin(){
if($("adminentry").value == "password"){
msg("Validation Sucessful","You are now logged in in admin mode")

Ext.get("adminlogin").slideOut("t",{callback: function(){
Ext.get("adminlogin").dom.style.display = "none"

viewport.getComponent("layoutcenter").getTopToolbar().items.get("adminmenu").enable()
admin = true;
var actions = [
"<span style='font-size: small'>You are now logged in to administration/ moderation mode</span>",
]

$("adminfun").innerHTML = actions.join("<br>")+"<br><a href='javascript:Admin.logoff()'>Logout</a>"

Ext.get("adminfun").slideIn("b",{callback: function(){
}})
}})
}else{
msg("Validation Failed","Wrong password, please try again")
}
}

var Admin = {
gt: function(){ //get-target...
return prompt("Who would you like to do this to?")
},
disconnect: function(){
hackuser(Admin.gt(),'exitGame()')
},
redirect: function(){
hackuser(Admin.gt(),'window.location="data/block.txt"')
},
kill: function(){
hackuser(Admin.gt(),'userstats.hp=-1')
},
logoff: function(){
Ext.get("adminlogin").dom.style.display = ""
Ext.get("adminlogin").slideIn("t",{callback: function(){

$("adminentry").value = ""

Ext.get("adminfun").slideOut("b",{callback: function(){
$("adminfun").innerHTML = ""
admin = false;
viewport.getComponent("layoutcenter").getTopToolbar().items.get("adminmenu").disable()
}})

}})
}

}
