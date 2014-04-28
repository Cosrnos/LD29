var UI = UI || {};

UI.AddNodeMenu = new Menu("Add/Change Node", true);

UI.AddNodeMenu.TrogOption = UI.AddNodeMenu.AddOption("Trogs (15 Lira)", function() {
	if(World.Stats.lira < 15)
	{
		Lynx.Log("You don't have enough Lira for that action!");
		return true;
	}
	World.Stats.lira -= 15;
	this.type = new TrogRoom(this);
	return true;
});

UI.AddNodeMenu.AddOption("Spiders (30 Lira)", function() {
	if(World.Stats.lira < 30)
	{
		Lynx.Log("You don't have enough Lira for that action!");
		return true;
	}
	World.Stats.lira -= 30;
	this.type = new SpiderRoom(this);
	return true;
});

UI.AddNodeMenu.AddOption("DBG Treasure", function() {
	this.type = new TreasureRoom(this);
	return true;
});