var viewport;
function ocrap(){
Ext.MessageBox.alert("Oh Crap!","The selected feature has not been complete yet. ha ha!")
}

var ohcrap = ocrap;

function cMd(e){
Ext.MessageBox.alert("Switch View Mode To " + e.text, "You are about to switch to an alternate view mode",function(){
ocrap()
})
}
function about(){
Ext.MessageBox.alert("I MADE EVERYTHING!","This was written entirely by Antimatter15, all rights reserved 2008")
}
Ext.onReady(function(){

viewport = new Ext.Viewport({
layout:"border",
items:[{
    region:"center",
    title:"Game",
	iconCls: "mapicon",
	id: "layoutcenter",
	contentEl: "main", 
	tbar: [
	{text: "Edit", menu:{items: [
	{text: "Edit Sprites", icon: "images/page_edit.png",handler: showIDE},
	{text: "Copy User Icon", icon: "images/page_copy.png",handler: function(){
	Ext.MessageBox.prompt("Username To <s>Steal</s> Copy Icon From:","So, what user do you want to <s>steal</s> copy from?",function(a,b){
	if(a=="ok"){Ext.Ajax.request({url:"php/newuser.php",params:{action:"cloneuser",username: user,clone: b}})}
	})
	}},
	{text: "Sprite Templates", icon: "images/tux.png", menu: {items: [
	    {text: "You need to open the Sprite Editor prior to using any of these", disabled: true},
		{text: "Penguin" ,handler: function(){loadSprite("penguin")}},
		{text: "Toilet", handler: function(){loadSprite("toilet")}},
		{text: "Guest (Default)", handler: function(){loadSprite("guest")}},
		{text: "Grass", handler: function(){loadSprite("grass")}},
		{text: "Bush", handler: function(){loadSprite("bush")}},
		{text: "Dirt", handler: function(){loadSprite("dirt")}},
		{text: "Evil", handler: function(){loadSprite("evil")}},
		{text: "Eyed (usermade)", handler: function(){loadSprite("eyed")}},
		{text: "Elektro (usermade)", handler: function(){loadSprite("elektro")}},
		{text: "Koolio13 (usermade)", handler: function(){loadSprite("koolio13")}},
		{text: "Kamra (usermade)", handler: function(){loadSprite("kamra")}},
		{text: "Bejaguar (usermade)", handler: function(){loadSprite("bejaguar")}},
		{text: "Optimus Prime (usermade)", handler: function(){loadSprite("optimusprime")}}
	]}},

		//{text: "Update NPC Data", handler: guiUpdateNPC},
		
		{text: "Change My Name", icon: "images/page_edit.png",handler: function(){
		Ext.MessageBox.prompt("New Username","New Username:",function(e,x){
		if(e == "ok"){renameLocal(x)}})}}
		
	]}},
	{
	text: "View",
        menu: {items: [
		{text: "Set ViewBox", icon: "images/shape_ungroup.png", handler: guiViewBox},
	
		{text: "Find User", icon: "images/find.png",handler:function(){
		translateObjects(currentLocation[0]-50,currentLocation[1]-50);
		}}
        ]}},{
		text: "Tools",
		menu: {items: [
		
{text: "What's My Username",icon: "images/help.png",handler: function(){
msg("Your Username is...","Your Username Is "+user)}},
{text: "Auto Ping", icon: "images/wrench.png",handler: function(){createPing()}},
{text: "Sever Update", icon: "images/wrench_orange.png",handler: function(){checkUsers()}},
{text: "Update NPCs", icon: "images/arrow_refresh.png",handler: function(){loadNPCs(cLay.id)}}
		//}}
		]}
		},{
		text: "User", 
		menu: {items:[
		{icon: "images/email.png", text: "Private Message", handler: function(){guiPM()}},
		{icon: "images/vcard.png",text: "Get User Info",handler: function(){guiUIF()}},
		{icon: "images/group_add.png",text: "Create New Chatroom",handler: function(){guiNewChat()}}
		]}
		},{text: "Admin", disabled: true, id: "adminmenu", menu: {items: [
		{text: "Add NPC Here (JSON)",icon: "images/group_add.png",handler: guiAddNPC},
		{text: "Add NPC Here (GUI)",icon: "images/group_add.png",handler: guiNewNPC2},
		{text: "Add Land Patch Here",icon: "images/group_add.png",handler: guiLand},
		{text: "Send NPC Update Message", icon: "images/arrow_refresh.png",handler: function(){
npcupdate()
		}},
		{text: "Moderation", icon: "images/user_suit.png", menu:{items: [
		{text: "Disconnect User", handler: Admin.disconnect},
		{text: "Kill User (reset HP)",handler: Admin.kill},
		{text: "Temporarily Block User", handler: Admin.redirect}
		]}}
		]}		
		},{
		text: "Help",
		menu: {items: [
		{icon: "images/help.png",text: "About", handler: about},
		{text: "Report Bug", icon: "images/bug_add.png", handler: function(){
		Ext.MessageBox.alert("Hmm...","Wouldn't it be ironic if you hit a bug trying to report one? Well that just might happen...",function(){
		var f = document.createElement("img")
		f.src = "images/haha.png"
		f.style.position = "absolute"
		document.body.appendChild(f)
		var c = setInterval(function(){
		if(f.src.indexOf("borked.png") != -1){
		f.src = "images/haha.png"
		}else{
		f.src = "images/borked.png"
		}
		//console.log("happy!")
		},100)
		setTimeout(function(){
		clearInterval(c)
		f.parentNode.removeChild(f)
		msg("IT'S A BUG!!!","...or is it?")
		if(f.src.indexOf("borked.png") != -1){
		userstats.hp++
		userstats.exp+=40
		}
		},10000)
		msg("aah!","Don't you love the irony?")
		})}}
		]}
		}
		
		]
  },{
    region:"south",
    title:"Chat",
    split:true,
	iconCls: "talkicon",
    collapsible:true,
    titleCollapse:true,
    height:130,
    items:[{
        layout:"table",
        layoutConfig:{
          columns:1
        },
        defaults:{
          bodyStyle:"padding:0px;",
          style:"margin:0px;",
          border:false
        },
        border:false,
		contentEl: "chatDiv"
      }]
  },{
    iconCls: "sidebaricon",
    region:"west",
    title:"Accordian",
    split:true,
    collapsible:true,
    titleCollapse:true,
    width:130,
    layout:"fit",
    border:false,
    items:[{
        layout:"accordion",
        layoutConfig:{
          activeOnTop:false,
          animate:true,
          autoWidth:true,
          collapseFirst:false,
          fill:false,
          hideCollapseTool:false,
          titleCollapse:true
        },
        border:false,
        items:[{
            title:"Nav",
            xtype:"panel",
			border: false,
			iconCls: "navicon",
			contentEl: "nav"
          },{
            title:"Quests",border: false,
            xtype:"panel",
			iconCls: "questicon",
			contentEl: "quest"
          },{
            title:"Profile",border: false,
            xtype:"panel",
			iconCls: "profileicon",
			contentEl: "profile"
          },{
            xtype:"panel",border: false,
            title:"Members",
			iconCls: "memicon",
			contentEl: "mlst"
          },{
            xtype:"panel",border: false,
            title:"Admin",
			iconCls: "adminicon",
			contentEl: "admin"
          },{
            xtype:"panel",border: false,
            title:"Inventory",
			iconCls: "itemicon",
			contentEl: "items"
          },{
            xtype:"panel",border: false,
            title:"Abilities",
			iconCls: "magicicon",
			contentEl: "magic"
          },{
            xtype:"panel",border: false,
            title:"Guilds",
			iconCls: "groupicon",
			contentEl: "guilds"
          },{
            xtype:"panel",border: false,
            title:"Friends",
			iconCls: "friendicon",
			contentEl: "friends"
          },{
		  border: false,
		  title: "Shop (Buy Stuff)",
		  iconCls: "shopicon",
		  items: [
{text: "Teleportation - 500",  xtype: "button",
listeners: {'click': {fn:function(){buy("teleportworld","Teleport",500)}}}},
{text: "Cheap Healing - 20", xtype: "button",
listeners: {'click': {fn:function(){buy("cheaphealingpotion0","Cheap Healing Potion",20)}}}},
{text: "Good Healing - 60", xtype: "button",
listeners: {'click': {fn:function(){buy("goodhealing",60)}}}},
{text: "Full Health - 200",xtype: "button",
listeners: {'click': {fn:function(){buy("fullhealth",200)}}}},
{text: "Level Up - 200",xtype: "button",
listeners: {'click': {fn:function(){buy("levelup",200)}}}},
{text: "HP Max Up - 300", xtype: "button",
listeners: {'click': {fn:function(){buy("hpmaxup",300)}}}}
]
		  },{
            xtype:"panel",border: false,
            title:"Misc",
			iconCls: "miscicon",
			contentEl: "misc"
          }]
      }]
  }]
})
setChatHeight()
viewport.getLayout().south.panel.on("resize",function(){
setChatHeight()
})


viewport.getLayout().center.panel.on("resize",function(){
updateArrows()
})



})

function setChatHeight(){
Ext.get("chatData").setHeight(viewport.getLayout().south.panel.getSize().height-50)
}