var smil = {smilie: [":)",":smile:"],
shutup: [":X",":shutup:"],
woo: [":0",":o",":O",":woo:"],
tongue: [":P",":tongue:"],
grin: [":D",":grin:"],
lmao: ["XD",":lmao:"],
crying: [":'(",":cry:",":(",":sad:"],
love: ["<3",":love:"],
wink: [";)",":wink:"],
fu: [":fu:"],
angry: [":angry:"],
confused: [":/",":confused:"],
blush: [":blush:"]}



function fhtml(htm){ //enable simple tags like <br> and <i> and <u>
var bhm = function(st,sa){
htm = unescape(escape(htm).replace(new RegExp(escape(st),"g"),escape(sa)))
}

bhm("[br]","<br>")
bhm("[l]","<l>")
bhm("[/l]","</l>")
bhm("[b]","<b>")
bhm("[/b]","</b>")

bhm("this game sucks","this game is the most awesomest thing ever!"); //HA HA! Censoring!

htm = htm.escapeHTML();

var allowTag = function(st){
htm = htm.replace(new RegExp(st.escapeHTML(),"g"),st)
}
var allowedTags = ["<br>","<i>","</i>","<b>","</b>","&nbsp;"]
for(var i = 0; i < allowedTags.length; i++){
allowTag(allowedTags[i])
}
//'<img src="images/smilies/'+b+'.gif" alt="'+a+'">'
//var spr = function(a,b){
//htm = htm.replace(new RegExp(a.escapeHTML(),"g"),b)
//}


/*
smilie: [":)",":smile:"],
shutup: [":X",":shutup:"],
woo: [":0",":o",":O",":woo:"],
tongue: [":P",":tongue:"],
grin: [":D","grin"],
lmao: ["XD"],
crying: [":'(",":cry:"],
love: ["<3",":love:"],
wink: [";)"],
fu: [":fu:"]
*/
//var smil = {a:['b','t','z','w','h','i','r']}


for(var m in smil){
for(var i = 0; i < smil[m].length; i++){
//console.log(smil[m][i],m)
//spray(smil[m][i],m)
htm = unescape(escape(htm).replace(new RegExp(escape(smil[m][i]),"g"),escape('<img src="images/smilies/'+m+'.gif" alt="'+smil[m][i]+'">')))
}

}

return htm
}