var Item = function (pName) {
	this.Name = pName;
	this.Type = ItemType.JUNK;
	this.EquipSlot = EquipSlot.NONE;
	this.Use = function (pHero) {};
	this.Equip = function (pHero) {};
	this.Unequip = function (pHero) {};
};

var ItemType = {
	JUNK: 0x0,
	USABLE: 0X10,
	EQUIPABLE: 0X100
};

var EquipSlot = {
	NONE: 0x0,
	WEAPON: 0x1,
	ARMOR: 0X10,
	ACCESSORY: 0X100
};

//Item Definitions
//--------------------------------------------

//Potions
//--------------------------

//Health:

var HP10Potion = function () {
	Item.call(this, "HP 10 Potion");

	this.Type |= ItemType.USABLE;

	this.Use = function (pHero) {
		pHero.HealthDelta -= 10;
		if (pHero.HealthDelta < 0) {
			pHero.HealthDelta = 0;
		}
	};
};


//Equips
//--------------------------

var WoodenSword = function () {
	Item.call(this, "Wooden Sword");

	this.Type |= ItemType.EQUIPABLE;
	this.EquipSlot = EquipSlot.WEAPON;

	this.Equip = function (pHero) {
		pHero.BaseAttack += 2;
	};

	this.UnEquip = function (pHero) {
		pHero.BaseAttack -= 2;
	};
};

var TatteredClothes = function () {
	Item.call(this, "Tattered Clothes");

	this.Type |= ItemType.EQUIPABLE;
	this.EquipSlot = EquipSlot.ARMOR;

	this.Equip = function (pHero) {
		pHero.BaseDefense += 1;
	};

	this.Unequip = function (pHero) {
		pHero.BaseDefense -= 1;
	};
};

var Ring = function () {
	Item.call(this, "Ring");

	this.Type |= ItemType.EQUIPABLE;
	this.EquipSlot = EquipSlot.ACCESSORY;

	this.Equip = function (pHero) {
		pHero.BaseMagic += 1;
	};

	this.Unequip = function (pHero) {
		pHero.BaseMagic -= 1;
	};
};
