var UI = UI || {};

UI.AddNodeMenu = new Menu("Add/Change Node", true);

UI.AddNodeMenu.TrogOption = UI.AddNodeMenu.AddOption("Trogs (2 Lira)", function () {
	if (World.Stats.lira < 2) {
		Lynx.Log("You don't have enough Lira for that action!");
		return true;
	}
	World.Stats.lira -= 2;
	this.type = new TrogRoom(this);
	if (Game.TutorialProgress === 2)
		tutorialAfterSpawnTrog.Show();
	return true;
});

UI.AddNodeMenu.AddOption("Spiders (4 Lira)", function () {
	if (World.Stats.lira < 4) {
		Lynx.Log("You don't have enough Lira for that action!");
		return true;
	}
	World.Stats.lira -= 4;
	this.type = new SpiderRoom(this);
	return true;
});

UI.AddNodeMenu.AddOption("Blobman (3 Lira, 3 Doma)", function () {
	if (World.Stats.lira < 3 || World.Stats.doma < 3) {
		Lynx.Log("You don't have enough Lira for that action!");
		return true;
	}
	World.Stats.lira -= 3;
	World.Stats.doma -= 3;
	this.type = new BlobmanRoom(this);
	return true;
});

UI.AddNodeMenu.AddOption("Goblin (4 Lira, 4 Doma)", function () {
	if (World.Stats.lira < 4 || World.Stats.doma < 4) {
		Lynx.Log("You don't have enough Resources for that action!");
		return true;
	}
	World.Stats.lira -= 4;
	World.Stats.doma -= 4;
	this.type = new GoblinRoom(this);
	return true;
});

UI.AddNodeMenu.AddOption("Bats (6 Lira)", function () {
	if (World.Stats.lira < 6) {
		Lynx.Log("You don't have enough Lira for that action!");
		return true;
	}
	World.Stats.lira -= 6;
	this.type = new BatRoom(this);
	return true;
});


UI.AddNodeMenu.AddOption("Dark Knight (15 Lira)", function () {
	if (World.Stats.lira < 15) {
		Lynx.Log("You don't have enough resources for that action!");
		return true;
	}
	World.Stats.lira -= 15;
	this.type = new DarkKnightRoom(this);
	return true;
});

/*
UI.AddNodeMenu.AddOption("DBG Treasure", function () {
	this.type = new TreasureRoom(this);
	return true;
});
*/