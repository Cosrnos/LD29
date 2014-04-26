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