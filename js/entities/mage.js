// Mage
//--------------------------

var Mage = function(pName) {
	Hero.apply(this);
	this.Class = HeroClass.Mage;
	this.Name = pName || "Mage";

	this.GiveAction("Fireblast");

	this.Brain = function() {
		while (true) {
			if (this.CurrentTarget !== null) {
				if (!this.OnCooldown("Attack")) {
					Lynx.Log(this.Name + " is attacking!");
					this.UseAction("Attack", this.CurrentTarget);
					continue;
				}

				if (!this.OnCooldown("Fireblast")) {
					this.UseAction("Fireblast", this.CurrentTarget);
					continue;
				};
			} else {
				var enemyInRoom = _.find(this.GetRoom().mobs, function(pa) { return pa instanceof Enemy });
				if(typeof enemyInRoom !== 'undefined'){
					this.CurrentTarget = enemyInRoom;
					continue;
				}
				
				if (!this.OnCooldown("Move")) {
					this.UseAction("Move");
					continue;
				}
			}
			break;
		}
	};
};

Mage.prototype = new Hero();
Mage.prototype.constructor = Mage;