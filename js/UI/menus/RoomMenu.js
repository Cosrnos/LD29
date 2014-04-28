var UI = UI || {};

UI.RoomMenu = new Menu("Room", true);

UI.RoomMenu.NodeOption = UI.RoomMenu.NodeChange = UI.RoomMenu.AddOption("Add Node &raquo;", function () {
	UI.RoomMenu.Hide();
	UI.AddNodeMenu.Target = this;
	UI.AddNodeMenu.ShowAt(UI.RoomMenu.X, UI.RoomMenu.Y);
	return true;
});
/*
UI.RoomMenu.KillOption = UI.RoomMenu.AddOption("Kill Mobs", function () {
	while (this.mobs.length > 0)
		this.mobs[0].Kill();

	return true;
});
*/

UI.RoomMenu.RemoveNodeOption = UI.RoomMenu.AddOption("Remove Nodes", function () {
	this.type = new EmptyRoom(this);
	return true;
});
/*
UI.RoomMenu.DigOption = UI.RoomMenu.AddOption("Dig Some!!", function() {
	walk(this, 4, World.Rooms.content.length + 5, 0);
	return true;
});

UI.RoomMenu.SpawnPlayerOption = UI.RoomMenu.AddOption("Spawn Player", function() {
	var type = Warrior;
	if (Date.now() % 2 === 0)
		type = Mage;

	var newEntity = World.Entities.createEntity(type);
	newEntity.Name = "Hero #0x" + Date.now().toString(16);
	newEntity.BaseAttack = 5;
	newEntity.BaseMagic = 5;
	newEntity.BaseDefense = 10;

	newEntity.SetRoom(this);
	return true;
});
*/
