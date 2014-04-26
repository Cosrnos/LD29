var Item = function (pName) {
	this.Name = pName;
	this.Use = function (pHero) {};
	this.Equip = function (pHero) {};
	this.Unequip = function (pHero) {};
};

var HP10Potion = function () {
	Item.call(this, "HP 10 Potion");

	this.Use = function (pHero) {
		pHero.HealthDelta -= 10;
		if (pHero.HealthDelta < 0) {
			pHero.HealthDelta = 0;
		}
	};
};