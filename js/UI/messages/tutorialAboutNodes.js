var tutorialAboutNodes = new Message("Nodes", (([
	"<p>Great job! Clicking on a room opens a menu of available actions for that room. The first option is Adding or Changing <strong>Nodes</strong>. A Node is anything that can spawn a monster. When you add or change a node, you can select what kind of monster to spawn. Each monster costs a certain amount of <strong>Lira,</strong>, <strong>Doma</strong> or both! Lira is obtained for every player that completes the dungeon, and doma for every player that dies. You only get Lira or Doma if the player has killed at least one enemy!</p>",
	"<p>Right now, there are no enemies for our dungeon, so you aren't getting any resources. Let's spend all our Lira and create a <strong>Trog</strong> node!</p>"]).join("\r\n")), function () {
	Game.TutorialProgress++;
	this.Hide();
	UI.RoomMenu.ShowAt(tutorialAboutNodes.SavedX, tutorialAboutNodes.SavedY);
});
tutorialAboutNodes.SavedX = 0;
tutorialAboutNodes.SavedY = 0;
tutorialAboutNodes.savePos = function (pX, pY) {
	this.SavedX = pX;
	this.SavedY = pY;
}

tutorialAboutNodes.AcceptButton.Text = "Okay!";

var tutorialAfterSpawnTrog = new Message("Heroes", (([
	"<p>Awesome! Now that you have a trog node, you can start spawning monsters. Monsters will spawn automatically every few seconds and will let the heroes that enter have a challenge before reaching the exit. Heroes don't necessarily know where they're going so it could take them a while to reach the treasure room, but once they do all the experience they gain will be given to you!</p>",
	"<p>Let's wait for a few heroes to reach your treasure room. Notice how they players attempt to defeat the enemies in every room they enter!</p>"]).join("\r\n")), function () {
	Game.TutorialProgress++;
	this.Hide();
});

var tutorialLevelUp = new Message("Ding!", (([
	"<p>Congratulations! You are now Level 2!</p>",
	"<p>You've grown a bit and now have 1 more room than before! You can use new rooms to spawn more nodes to make your dungeon more challenging for the players that enter! As you level up, more heroes will hear of your trials and tribulations and come to investigate for themselves. Make sure you give them a challenge by having plenty of different monsters for your heroes to destroy or be destroyed by!</p>"
]).join("\r\n")), function () {
	Game.TutorialProgress++;
	this.Hide();
	tutorialEnd.Show();
});

var tutorialEnd = new Message("Go forth!", (([
	"<p>That's it for the tutorial! From this point on you'll be on your own. Keep adding and changing nodes and level up to get more rooms! Become the most legendary dungeon in the land!"]).join("\r\n")), function () {
	this.Hide();
});