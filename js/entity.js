var Entity = function () {

	var currentRoom = null;
	var items = [];

	this.Id = 0;
	this.Name = "";
	this.Species = "";
	this.Level = 1;
	this.Gold = 0;
	this.Exp = 1; //Exp to be awarded to the attacker on kill

	this.Health = 10;
	this.HealthDelta = 0;
	this.Mana = 0;
	this.ManaDelta = 0;
	this.BaseAttack = 1;
	this.BaseDefense = 1;
	this.BaseMagic = 1;
	this.ActionPoints = 1;

	this.Equipment = {};

	this.Equipment[EquipSlot.ACCESSORY] = null;
	this.Equipment[EquipSlot.ARMOR] = null;
	this.Equipment[EquipSlot.WEAPON] = null;

	//Start AI

	this.Think = function () {
		//AI Logic goes here.
		this.Idle();
	};

	this.Idle = function () {};

	this.Attack = function (pTarget) {};

	this.Run = function () {};

	//End AI
	this.TakeDamage = function (pDamage, pAttacker) {
		//TODO: Fix Defense algorithm
		var realHit = Math.floor(pDamage - this.BaseDefense);
		this.HealthDelta += realHit;
		if (this.HealthDelta >= this.Health) {
			pAttacker.NotifyKill(this);
			this.Kill();
		}
	};

	this.NotifyKill = function (pAttacker) {

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

		if (item !== -1 && (item.Type & ItemType.USABLE) !== 0) {
			item.Use(this);
			Lynx.Log("Hero " + this.Name + " has used a(n) " + item.Name);
			items.splice(item, 1);
		}
	};

	this.EquipItem = function (pEquip) {
		if ((pEquip.Type & ItemType.EQUIPABLE) === 0) {
			return;
		}

		if (this.Equipment[pEquip.EquipSlot] !== null) {
			this.GiveItem(this.Equipment[pEquip.EquipSlot]);
			this.Equipment[pEquip.EquipSlot].Unequip(this);
		}
		this.Equipment[pEquip.EquipSlot] = pEquip;
		pEquip.Equip(this);
	};

	this.SetRoom = function (pRoom) {
		if (pRoom instanceof Room) {
			currentRoom = pRoom;
		}
	};

	this.Kill = function () {
		Lynx.Log("Entity " + this.Name + " has been killed!");
	};
};
