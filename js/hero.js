var Hero = function () {

	var currentRoom = null;
	var items = [];
	var totalExp = 0;
	var nextLevelExp = 100;

	Object.defineProperty(this, "Experience", {
		get: function () {
			return totalExp;
		},
		set: function (pValue) {
			totalExp += pValue;
			if (totalExp >= nextLevelExp) {
				this.totalExp -= nextLevelExp;
				nextLevelExp = nextLevelExp * 1.5;
				this.Level++;
				this.LevelUp();
			}
		}
	});

	this.Id = 0;
	this.Name = "";
	this.Class = HeroClass.WARRIOR;
	this.Level = 1;
	this.Gold = 100;

	this.Health = 20;
	this.HealthDelta = 0;
	this.Mana = 10;
	this.ManaDelta = 0;
	this.BaseAttack = 1;
	this.BaseDefense = 1;
	this.BaseMagic = 1;
	this.ActionPoints = 3;

	this.Equipment = {
		Weapon: "Sword",
		Armor: "Chain",
		Accessory: "Severed human hand"
	};

	//Start AI

	this.Think = function () {
		//AI Logic goes here.
		this.Idle();
	};

	this.Idle = function () {};

	this.Attack = function (pTarget) {};

	this.Run = function () {};

	this.LevelUp = function () {
		this.Health += 2;
		this.BaseAttack += 1;
		Lynx.Log("Hero " + this.Name + " Has leveled up! (" + this.Level + ")");
	};

	this.TakeDamage = function (pDamage, pAttacker) {
		//TODO: Fix Defense algorithm
		var realHit = Math.floor(pDamage - this.BaseDefense);
		this.HealthDelta += realHit;
		if (this.HealthDelta >= this.Health) {
			this.Kill();
		}
	};

	//End AI

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