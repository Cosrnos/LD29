var UI = UI || {};

UI.RoomMenu = new Menu("Room", true);
UI.RoomMenu.AddOption("Add Node &raquo;", function () {
	this.type = new TrogRoom(this);
	return true;
});