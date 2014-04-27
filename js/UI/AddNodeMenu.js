var UI = UI || {};

UI.AddNodeMenu = new Menu("Add/Change Node", true);

UI.AddNodeMenu.AddOption("Trogs", function() {
	this.type = new TrogRoom(this);
	return true;
});

UI.AddNodeMenu.AddOption("Spiders", function() {
	this.type = new SpiderRoom(this);
	return true;
});