var Hero = function () {

	var currentRoom = null;
	var items = [];

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
	this.ActionPoints = 3;
	this.Equipment = {
		Weapon: "Sword",
		Armor: "Chain",
		Accessory: "Severed human hand"
	};

	this.GiveItem = function (pItem, pQuantity) {
		for (var i = 0; i < pQuantity; i++) {
			items.push(pItem);
		}
	};

	this.HasItem = function (pItemName, pQuantity) {
		var totalCount = 0;
		pQuantity = pQuantity || 1;

		for (var i = 0; i < items.length; i++) {
			if (items[i].Name === pItemName) {
				totalCount++;

				if (totalCount >= pQuantity) {
					return true;
				}
			}
		}

		return false;
	};

	this.TakeItem = function (pItemName, pQuantity) {
		var toRemove = 0;
		pQuantity = pQuantity || 1;

		for (var i = 0; i < items.length; i++) {
			if (items[i].Name === pItemName) {
				toRemove.push;
				if (toRemove.length === pQuantity)
					break;
			}
		}

		if (toRemove.length !== pQuantity) {
			return false;
		}

		for (var x = 0; x < toRemove.length; x++) {
			items.splice(toRemove[x], 1);
		}

		return true;
	};

	this.UseItem = function (pItemName) {
		var item = -1;
		for (var i = 0; i < items.length; i++) {
			if (items[i].Name === pItemName) {
				item = items[i];
				break;
			}
		}

		if (item !== -1) {
			item.Use(this);
			Lynx.Log("Hero " + this.Name + " has used a(n) " + item.Name);
			items.splice(item, 1);
		}
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