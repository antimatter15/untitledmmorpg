
 var usermagics = {}
 var magicCount = 0;
 
 
var MagicDD =  Ext.extend(Ext.dd.DDProxy, {
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
	
	usemagic(el.dom.id,dragEl)
	}else{
	Ext.MessageBox.alert("Oops!","No magic transfer yet :P")
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
 Ext.get("magic").appendChild(el);
 Ext.get(document.body).appendChild(dragEl)
 el.applyStyles({position:'', width:''});
//dragEl.hide()
 }
});

Ext.onReady(function(){


 
 
 
 
})

function addmagic(type,action){
if(magicCount == 0){
$("magic").innerHTML = ""
}
var ni = document.createElement("div")
ni.className = "dd-magic"
magicCount++
ni.id = "magic"+magicCount
ni.innerHTML = type
usermagics["magic"+magicCount] = {name: type,action: action}
$("magic").appendChild(ni)

Ext.QuickTips.getQuickTip().register({
    target: ni,
    title: "magic: "+type,
    text: "Drag me over to the user to use it on<br>magic info should go here!!!"
});

Ext.get(ni).on("click",function(e,o){
usemagic(o.id)
})

Ext.get(ni).on("contextmenu",function(e,o) {
    e.stopEvent() // preventDefault + stopPropagation
if (!this.contextMenu) {
log("context menu on "+o.id)
this.contextMenu = new Ext.menu.Menu({
magics: [{
text: 'Use',
handler: function(){usemagic(o.id)}
}]
});
}
var xy = e.getXY();
this.contextMenu.showAt(xy);
})
Ext.get(ni).dd = new  MagicDD(Ext.get(ni), 'magic');

}


function usemagic(id,dragEl){
var desc = usermagics[id].name
	
Ext.MessageBox.confirm("Are you sure?","Are you sure you want to use "+desc+"?",function(a){
if(a == "yes"){

        //Ext.get(id).fadeOut({remove: true})
		if(dragEl){
		dragEl.hide()
		}
		try{
		 Ext.get("magic").appendChild(el);
		el.applyStyles({position:'', width:''});
       }catch(err){}
		runmagic(usermagics[id].action)
		
		//usermagics[id] = null
		var z = 0;
		for(var i in usermagics){
		if(usermagics[i]){
		z++
		}
		}
		if(z == 0){
		$("magic").innerHTML = "Looks like you used all of you magics!"
		}
		//magicCount--
		
		msg("Used "+desc,"You have sucessfully used "+desc)
}else{
try{
 Ext.get("magic").appendChild(el);
 el.applyStyles({position:'', width:''});
}catch(err){}
 }

},this)
}

var magicactions = {}

function runmagic(magicid){
if(!magicactions[magicid]){
Ext.Ajax.request({
url: "data/items/"+magicid+".js",
success: function(r){
magicactions[magicid] = new Function(r.responseText)

magicactions[magicid]()
}
})
}else{
magicactions[magicid]()
}

}

function update_magic(){
$("magic").innerHTML = ""
addmagic("Attack (basic)","basicattack")
parse_list(user,"magics",function(magics){
for(var i = 0; i < magics.length; i ++){
addmagic(magics[i].title,magics[i].aid);
}
})
}

