// Mage
//--------------------------

var Mage = function (pName) {
	Hero.apply(this);
	this.Class = HeroClass.Mage;
	this.Name = pName || "Mage";
	this.HeroType = "MAGE";
	this.image = Lynx.AM.Get("mage").Asset;

	this.GiveAction("Fireblast");

	this.LevelUp = function () {
		this.Health += 2;
		this.BaseAttack += 1;
		this.BaseMagic += 2;
		if (!this.SPAWNING)
			Lynx.Log("Hero " + this.Name + " Has leveled up! (" + this.Level + ")");
	};

	this.Brain = function () {
		var thinking = true;
		while (thinking) {
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
				if (!this.OnCooldown("HP 10 Potion")) {
					//Only try to use if health is at 30%
					if (this.HealthDelta >= this.Health * 0.7) {
						var result = this.UseItem("HP 10 Potion", this);
						if (result) {
							continue;
						}
					}
				};


			} else {
				var enemyInRoom = _.find(this.GetRoom().mobs, function (pa) {
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

Mage.prototype = new Hero();
Mage.prototype.constructor = Mage;
