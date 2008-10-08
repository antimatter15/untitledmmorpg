
 var useritems = {}
 var itemCount = 0;
 
 
 Ext.override(Ext.dd.DDProxy, {
    startDrag: function(x, y) {
        var dragEl = Ext.get(this.getDragEl());
        var el = Ext.get(this.getEl());
 
        dragEl.applyStyles({border:'','z-index':2000});
        dragEl.update(el.dom.innerHTML);
        dragEl.addClass(el.dom.className + ' dd-proxy');
    },
	onDragOver: function(e, targetId) {
   // console.log('dragOver: ' + targetId);
   
        var target = Ext.get(targetId);
        this.lastTarget = target;
        target.addClass('dd-over');
		//target.highlight()
    
},
onDragOut: function(e, targetId) {
  //  console.log('dragOut: ' + targetId);
   
        var target = Ext.get(targetId);
        this.lastTarget = null;
        target.removeClass('dd-over');
    
},
endDrag: function() {
//console.log("enddrag")
    var dragEl = Ext.get(this.getDragEl());
    var el = Ext.get(this.getEl());
    //console.log(this.lastTarget)
	if(this.lastTarget) {
	
	this.lastTarget.removeClass('dd-over')
	
if(this.lastTarget.id == "local"){
	
	useItem(el.dom.id,dragEl)
	}else{
	Ext.MessageBox.alert("Oops!","No Item transfer yet :P")
	}
	

}

//},this)

		
    //}
    //Ext.get('dd1-ct').removeClass('dd-over');
    //Ext.get('dd2-ct').removeClass('dd-over');
},
onInvalidDrop: function(e){

var el = Ext.get(this.getDragEl());
var dragEl = Ext.get(this.getDragEl());
 Ext.get("items").appendChild(el);
 Ext.get(document.body).appendChild(dragEl)
 el.applyStyles({position:'', width:''});
//dragEl.hide()
 }
});

Ext.onReady(function(){


 
 
 
 
})

function addItem(type,action, listid){
if(itemCount == 0){
$("items").innerHTML = ""
}
var ni = document.createElement("div")
ni.className = "dd-item"
itemCount++
ni.id = "item"+itemCount
ni.innerHTML = type
useritems["item"+itemCount] = {name: type,action: action, listid: listid}
$("items").appendChild(ni)

Ext.QuickTips.getQuickTip().register({
    target: ni,
    title: "Item: "+type,
    text: "Drag me over to the user to use it on<br>Item info should go here!!!"
});

Ext.get(ni).on("click",function(e,o){
useItem(o.id)
})

Ext.get(ni).on("contextmenu",function(e,o) {
    e.stopEvent() // preventDefault + stopPropagation
if (!this.contextMenu) {
log("context menu on "+o.id)
this.contextMenu = new Ext.menu.Menu({
items: [{
text: 'Use on self',
handler: function(){useItem(o.id)}
},{
text: 'Send to user',
handler: function(){ocrap(o.id)}
}]
});
}
var xy = e.getXY();
this.contextMenu.showAt(xy);
})
Ext.get(ni).dd = new Ext.dd.DDProxy(Ext.get(ni), 'group');

}


function useItem(id,dragEl){
var desc = useritems[id].name
	
Ext.MessageBox.confirm("Are you sure?","Are you sure you want to use "+desc+"?",function(a){
if(a == "yes"){

        Ext.get(id).fadeOut({remove: true})
		list_remove(user,"items",useritems[id].listid);
		if(		dragEl){
		dragEl.hide()
		}
		runItem(useritems[id].action)
		
		useritems[id] = null
		var z = 0;
		for(var i in useritems){
		if(useritems[i]){
		z++
		}
		}
		if(z == 0){
		$("items").innerHTML = "Looks like you used all of you items!"
		}
		itemCount--
		
		msg("Used "+desc,"You have sucessfully used "+desc)
}else{
 Ext.get("items").appendChild(el);
 el.applyStyles({position:'', width:''});
}

},this)
}

var itemactions = {}

function runItem(itemid){
if(!itemactions[itemid]){
Ext.Ajax.request({
url: "data/items/"+itemid+".js",
success: function(r){
itemactions[itemid] = new Function(r.responseText)

itemactions[itemid]()
}
})
}else{
itemactions[itemid]()
}

}


function update_items(){
$("items").innerHTML = "";
addItem("Cheap Healing Potion","cheaphealingpotion0")
parse_list(user,"items",function(items){
for(var i = 0; i < items.length; i ++){
addItem(items[i].title,items[i].aid, items[i].id);
}
})
}


function buy(itemid, title, cost){
userstats.money += -cost
addItem(title,itemid);
list_add(user,"items",{title: title, aid: itemid})

}

function shop(){
(new Ext.Window({
height: 200,
width: 200,
title: "Shop (Buy)",

items: [
{text: "Buy Teleportation - 500",  xtype: "button",
listeners: {'click': {fn:function(){buy("teleportworld","Teleport",500)}}}},
{text: "Buy Cheap Healing Potion - 20", xtype: "button",
listeners: {'click': {fn:function(){buy("cheaphealingpotion0","Cheap Healing Potion",20)}}}},
{text: "Buy Good Healing Potion - 60", xtype: "button",
listeners: {'click': {fn:function(){buy("goodhealing",60)}}}},
{text: "Full Health - 200",xtype: "button",
listeners: {'click': {fn:function(){buy("fullhealth",200)}}}},
{text: "Level Up - 200",xtype: "button",
listeners: {'click': {fn:function(){buy("levelup",200)}}}},
{text: "HP Max Up - 300", xtype: "button",
listeners: {'click': {fn:function(){buy("hpmaxup",300)}}}}
]
})).show()
}