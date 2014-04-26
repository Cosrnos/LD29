// Weapons
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
