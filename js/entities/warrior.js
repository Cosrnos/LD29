// Warrior
//--------------------------

var Warrior = function () {
	Hero.call(this);

	this.Class = HeroClass.WARRIOR;

	this.GiveAction("Heavy Attack");
};