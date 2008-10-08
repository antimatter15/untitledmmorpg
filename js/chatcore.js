var chatComet;

var subscriptions = ["group/pchat","misc/misc","group/update"]

var ChatAPI = Class.create();
ChatAPI.prototype = {
  
  timestamp: 0,
  url: 'php/chat.php',
  posturl: 'php/chatpost.php',
  proxy: false,
  noerror: true,
  initialize: function() { },

  connect: function()
  {
  log("Opening new comet chat connection")
  var aup = this.url
  if(this.proxy == true){
  aup = "php/proxy.php?target="+this.url
  log("Using Proxied Connection")
  }
    this.ajax = new Ajax.Request(aup, {
      method: 'get',
      parameters: { 'timestamp' : this.timestamp ,  //I just called you yesterday?!?!
	  username: user, //i'm me
	  subscriptions: subscriptions.join(",") //stop you stupid adversisement spam! I unsubscribed fourty two weeks ago!
	  },
      onSuccess: function(transport) {
        // handle the server response
		log("Sucessful Connection")
        var resp = transport.responseText;
        var respTS = parseFloat(resp.substr(0,resp.indexOf("!")))
		this.chatComet.timestamp = respTS;
		
		var respMG = resp.substr(resp.indexOf("!")+1);
		
        this.chatComet.handleResponse(respMG);
        this.chatComet.noerror = true;
      },
      onComplete: function(transport) {
        // send a new ajax request when this request is finished
        if (this.chatComet.noerror == false){
      
		log("Comet Connection Error")
		   log("Error Data: "+transport.responseText)
		   if(transport.responseText.toLowerCase().indexOf("maximum")!=-1){
		   log("Only Timeout Error; Retry Instantly")
		   this.chatComet.connect();
		   }else{
		   log("Connection Error, Retrying in 2 sec")
          setTimeout(function(){ chatComet.connect() }, 2000); 
		  }
        }else{
		log("No Error; Re-Connecting")
          this.chatComet.connect();
		  }
        this.chatComet.noerror = false; //reset error
      }
    });
    this.ajax.chatComet = this;
  
  },

  disconnect: function()
  {
   //no way to diconnect yet...
  },

  handleResponse: function(response)
  {
  
  log(response)
  
  handleChatResponse(Ext.util.JSON.decode(response)); //relay messages to type switch
  
  },

  doRequest: function(request)
  {
  
  if(!request['username']){request['username']=user}
  
  log("Sending: "+Ext.util.JSON.encode(request))
  
    new Ajax.Request(this.posturl, {
      method: 'post',
      parameters: request,
	  onSuccess: function(){
	  log("Data Sucessfully Sent")
	  }
    });
  }
}

