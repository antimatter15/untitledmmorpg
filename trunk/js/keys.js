Ext.onReady(function(){
keyShortcuts = new Ext.KeyMap(document, [
	{
    key: 37,
    fn: function(){ goleft(); }
	},
	{
	key: 39,
	fn: function(){goright();}
	},
	{
	key: 38,
	fn: function(){goup();}
	},
	{
	key: 40,
	fn: function(){godown();}
	}
	]
	
	)
	

	
	})