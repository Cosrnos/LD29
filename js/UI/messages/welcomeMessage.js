var welcomeMessage = new Message("You are the Dungeon!", (([
	"<p>Welcome to <strong>You are the Dungeon!</strong> In this game you get to dive beneath the surface of a dungeon and actually become the dungeon! As you grow, you'll need to become more challenging to attract more heroes to travel through your corridors and give you resources. Spawn more enemies and become the most notorious dungeon in the land!</p>",
	"<p>Let's get started by learning how to play!</p>"]).join("\r\n")), function(){
	this.Hide();
});

testMessage.AcceptButton.Text = "Continue";