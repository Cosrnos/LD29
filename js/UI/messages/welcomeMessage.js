var welcomeMessage = new Message("You are the Dungeon!", (([
	"<p>Welcome to <strong>You are the Dungeon!</strong> In this game you get to dive beneath the surface of a dungeon and actually become the dungeon! As you grow, you'll need to become more challenging to attract more heroes to travel through your corridors and give you resources. Spawn more enemies and become the most notorious dungeon in the land!</p>",
	"<p>Let's get started by learning how to play! First, move around the map a bit. Use the wasd keys to navigate the map and use the mouse wheel to zoom in and out!</p>"]).join("\r\n")), function () {
	Lynx.AM.Get("soundBgm").Asset.addEventListener("ended", function () {
		this.currentTime = 0;
		this.play();
	}, false);
	Lynx.AM.Get("soundBgm").Asset.play();
	this.Hide();
});

welcomeMessage.AcceptButton.Text = "Continue";

var tutorialFirstScreen = new Message("Getting started", (([
	"<p>Over to your right is a sidebar showing all your stats! You start out at Level 1, and every player that reaches your treasure room will award you the amount of experience gained throughout the dungeon (So if they dont' kill anything, you don't get experience!) Every time you gain a level, you'll grow bigger and have more room for monsters!</p>",
	"<p>The icons below your experience bar are <strong>Lira</strong> and <strong>Doma</strong>. These are resources earned for each player that reaches your reward room or dies.</p>",
	"<p>You can't earn anything if you don't have any monsters though, so let's start with that! Click on any empty (pink) room to open the room menu!</p>"]).join("\r\n")), function () {
	Game.TutorialProgress++;
	this.Hide();
});