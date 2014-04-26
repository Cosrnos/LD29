// Warrior
//--------------------------

var Warrior = function (pName) {
	this.Class = HeroClass.WARRIOR;
	this.Name = pName || "WARRIOR";

	this.GiveAction("Heavy Attack");

	this.Brain = function () {
		if (this.CurrentTarget !== null) {
			if (!this.OnCooldown("Attack")) {
				Lynx.Log(this.Name + " is attacking!");
				this.Attack(this.CurrentTarget);
			}
		}
	};
};

Warrior.prototype = new Hero();
Warrior.prototype.constructor = Warrior;