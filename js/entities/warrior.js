// Warrior
//--------------------------

var Warrior = function(pName) {
	Hero.apply(this);
	this.HeroType = "WARRIOR";
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
				var enemyInRoom = _.find(this.GetRoom().mobs, function(pa) {
					return pa instanceof Enemy
				});
				if (typeof enemyInRoom !== 'undefined') {
					this.CurrentTarget = enemyInRoom;
					continue;
				}

				//If we're in the TreasureRoom and not fighting, ASCEND!
				if (this.GetRoom().type instanceof TreasureRoom) {
					this.GetRoom().type.Ascend(this);
				}

				if (!this.OnCooldown("HeroMove")) {
					this.UseAction("HeroMove");
					continue;
				}

			}
			thinking = false;
		}
	};
};

Warrior.prototype = new Hero();
Warrior.prototype.constructor = Warrior;