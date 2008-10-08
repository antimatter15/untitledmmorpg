var quests = ["Quest 1"];
var qdesc = {
"Quest 1": "Go to the scary land of feces and determine and defeat the <i>it</i>."
}

function update_quests(){

parse_list(user,"qfinished",function(fqt){
var questpage = [];
for(var i = 0; i < quests.length; i ++){
var is_done = false;

for(var m = 0; m < fqt.length; m++){
if(fqt[m].name == quests[i]){
is_done = true
}
}

if(is_done == true){
questpage.push("<s>"+quests[i]+"</s>")
}else{
questpage.push("<span title='"+qdesc[quests[i]]+"'>"+quests[i]+"</span>")
}


}
$("quest").innerHTML = "<b>Quests:</b><br>"+questpage.join("<br>")
})


}