var Message = function(pHeader, pContent, pCallback)
{
	this.Disposed = true;
	
	this.AcceptButton = {
		Text: "Continue",
		Callback: pCallback
	};
	
	this.DenyButton = {
		Text: "Cancel",
		Callback: function(){}.bind,
		Show: false
	};
	
	this.Header = pHeader;
	this.Content = pContent;
	
	this.Show = function(){
		document.getElementById("messageHeader").innerHTML = this.Header;
		document.getElementById("messageBlock").innerHTML = this.Content;
		
		document.getElementById("messageConfirm").innerHTML = this.AcceptButton.Text;
		document.getElementById("messageConfirm").onclick = this.AcceptButton.Callback.bind(this);
		
		var deny = document.getElementById("messageCancel");
		if(this.DenyButton.Show)
		{
			deny.style.visibility = "visible";
			deny.onclick = this.DenyButton.Callback.bind(this);
		}
		else
		{
			deny.style.visibility = "hidden";	
			deny.onclick = function(){};
		}
		document.getElementById("fader-container").style.visibility = "visible";
		this.Disposed = false;
		Game.ActiveMenu = this;
	}
	
	this.Hide = function(){
		document.getElementById("fader-container").style.visibility = "hidden";
		this.Disposed = true;
	};
	
};