// Warrior
//--------------------------

var Warrior = function(pName) {
	this.Class = HeroClass.WARRIOR;
	this.Name = pName || "WARRIOR";

	this.GiveAction("Heavy Attack");

	this.Brain = function() {
		var thinking = true;
		while (thinking) {
			if (this.CurrentTarget !== null) {
				if (!this.OnCooldown("Attack")) {
					this.UseAction("Attack", this.CurrentTarget);
					continue;
				}

				if (!this.OnCooldown("Heavy Attack")) {
					this.UseAction("Heavy Attack", this.CurrentTarget);
					continue;
				}
			} else {
				if (!this.OnCooldown("Move")) {
					this.UseAction("Move");
					continue;
				}
			}
			thinking = false;
		}
	};
};

Warrior.prototype = new Hero();
Warrior.prototype.constructor = Warrior;