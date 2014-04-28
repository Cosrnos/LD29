// Weapons
//--------------------------

var WoodenStick = function () {
	Item.call(this, "Wooden Stick");

	this.Type |= ItemType.EQUIPABLE;
	this.EquipSlot = EquipSlot.WEAPON;

	this.Equip = function (pHero) {
		pHero.BaseAttack += 2;
	};

	this.Unequip = function (pHero) {
		pHero.BaseAttack -= 2;
	};
};

var BronzeSword = function(){
	Item.call(this, "Bronze Sword");
	this.Rating = 1;
	
	this.Type |= ItemType.EQUIPABLE;
	this.EquipSlot = EquipSlot.WEAPON;
	this.Equip = function (pHero) {
		pHero.BaseAttack += 4;
	};
	
	this.Unequip = function (pHero) {
		phero.BaseAttack -= 4;
	};
}
