var UI = UI || {};

UI.AddNodeMenu = new Menu("Add/Change Node", true);

UI.AddNodeMenu.AddOption("Trogs", function () {
	this.type = new TrogRoom(this);
	return true;
});