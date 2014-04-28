var tutorialAboutNodes = new Message("Nodes", (([
	"<p>Great job! Clicking on a room opens a menu of available actions for that room. The first option is Adding or Changing <strong>Nodes</strong>. A Node is anything that can spawn a monster. When you add or change a node, you can select what kind of monster to spawn. Each monster costs a certain amount of <strong>Lira,</strong>, <strong>Doma</strong> or both! Lira is obtained for every player that completes the dungeon, and doma for every player that dies. You only get Lira or Doma if the player has killed at least one enemy!</p>",
	"<p>Right now, there are no enemies for our dungeon, so you aren't getting any resources. Let's spend all our Lira and create a <strong>Trog</strong> node!</p>"]).join("\r\n")), function(){
	Game.TutorialProgress++;
	this.Hide();
	UI.RoomMenu.ShowAt(tutorialAboutNodes.SavedX, tutorialAboutNodes.SavedY);
});
tutorialAboutNodes.SavedX = 0;
tutorialAboutNodes.SavedY = 0;
tutorialAboutNodes.savePos = function(pX, pY){
	this.SavedX = pX;
	this.SavedY = pY;
}

tutorialAboutNodes.AcceptButton.Text = "Okay!";