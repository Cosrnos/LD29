var Hero = function () {

	var currentRoom = null;

	this.Id = 0;
	this.Name = "";
	this.Class = HeroClass.WARRIOR;
	this.Level = 1;
	this.Experience = 0;
	this.Gold = 100;
	this.Health = 20;
	this.HealthDelta = 0;
	this.Mana = 10;
	this.ManaDelta = 0;
	this.Equipment = {
		Weapon: "Sword",
		Armor: "Chain",
		Accessory: "Severed human hand"
	};

	this.SetRoom = function (pRoom) {
		if (pRoom instanceof Room) {
			currentRoom = pRoom;
		}
	};

	this.Kill = function () {
		Lynx.Log("Hero " + this.Name + " has been killed!");
	};
};


var HeroClass = {
	WARRIOR: 0
};