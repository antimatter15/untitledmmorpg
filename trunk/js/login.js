
var loginForm;

Ext.onReady(function(){


var uTx = new Ext.form.TextField({
fieldLabel: 'Username',
name: 'user',
allowBlank: false,
vtype: 'alphanum',
value: user
})

uTx.on("specialkey",function(ax,by){//=C becasue i feel like using standard-form for no reason...
if(by.getKey()==13){ //loggy inny
		initUser(loginForm.form.items.items[0].getValue())
    	loginWindow.hide();
}
})


loginForm = new Ext.form.FormPanel({
		region: "center",

		        baseCls: 'x-plain',
			 baseParams: {
		        	module: 'login'
		        },
		        defaults: {
		        	width: 150
		        },
				cls: "login-form",
		        defaultType: 'textfield',
		        frame: false,
		        height: 70,
		        items: [uTx],
		        labelWidth:70
		        
})



loginWindow = new Ext.Window({
    buttons: [{
    	handler: function(){
		initUser(loginForm.form.items.items[0].getValue())
    	loginWindow.hide();
		},
		
        text: 'Login/Register'
    }],
	iconCls: "loginicon",
    buttonAlign: 'right',
    closable: false,
    draggable: true,
    height: 230,
    id: 'login-win',
    layout: 'border',
    minHeight: 230,
    minWidth: 350,
    plain: false,
	modal: true,
    resizable: true,
    items: [
    	new Ext.Panel({
				baseCls: 'x-plain',
				id: 'login-logo',
		        region: 'north',
				height: 80
			}),loginForm
			],
			
	title: 'Login/Register',
    width: 350
});
loginWindow.show()

})

function initUser(userid){
		
user=userid
	

	ldr = Ext.DomHelper.insertFirst("main", {id:'uLoadMask'}, true);
    Ext.DomHelper.append(ldr, {html:makeBox("Please Wait...","Loading Users, Sprites, and NPCs")
	}, true).slideIn('t');
	
	if($(user)){
removeUser(user)
	//Ext.get(user).fadeOut({remove: true})
	}

subscriptions.push("private/"+user);//I NEED MY MAIL!!!

chatComet = new ChatAPI();
chatComet.connect();

Ext.Ajax.request({
url: "php/newuser.php",
params: {username: user,action: "newuser"},
success: function(){


reloadUser()
setTimeout(function(){
reloadUser()

setTimeout(function(){Ext.get('uLoadMask').fadeOut({remove: true, duration: 1})},500)
//("Cheap Healing Potion","cheaphealingpotion0")
update_items()
update_magic()
update_friends()
update_quests()

parseProfile(user,["group/"+cLay.id,"stats"],function(e){
log(e)
if(e){
log("Acquired Profile Objects")
if(e['group/'+cLay.id]){
log("Loading Map Location")
var tdt = e['group/'+cLay.id]
//log(tdt)
localMoveTo((parseFloat(tdt.x)-movementTranslator[0])+Ext.get("main").getX(),
(parseFloat(tdt.y)-movementTranslator[1])+Ext.get("main").getY())
}else{
log("No Valid Map Location")
}
if(e.stats){
log("Loading User Profile")
var tdt = Ext.util.JSON.decode(e.stats.data)
log(tdt.statobject)
userstats = tdt.statobject
}else{
log("No Valid Profile Infomration")
}

}else{
log("No Parsable Profile Data")
}
setInterval(checkStatUpdate,10000)
})

},1000)
}
})	
	
}

function update_friends(){
parse_list(user,"friends",function(friends){
var friendpage = [];
for(var i = 0; i < friends.length; i ++){
friendpage.push(friends[i].name)
}
if(friendpage.length == 0){
friendpage[0]="I pity you, you have no friends! Add some!!!"
}
$("friends").innerHTML = "<b>Friends:</b><br>"+friendpage.join("<br>")
})
}

