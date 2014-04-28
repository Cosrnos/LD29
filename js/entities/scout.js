// Mage
//--------------------------

var Scout = function (pName) {
	Hero.apply(this);
	this.Class = HeroClass.Scout;
	this.Name = pName || "Scout";
	this.HeroType = "SCOUT";
	this.image = Lynx.AM.Get("scout").Asset;

	//this.GiveAction("Fireblast");

	var move = (Object.create(ScoutMoveAction));
	this.actions.push(move);

	this.LevelUp = function () {
		this.Health += 1;
		this.BaseAttack += (1 % 2); //Gain Attack every other level.
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

				// if (!this.OnCooldown("Fireblast")) {
				// 	this.UseAction("Fireblast", this.CurrentTarget);
				// 	continue;
				// };
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

				if (!this.OnCooldown("ScoutMoveAction")) {
					this.UseAction("ScoutMoveAction");
					continue;
				}
			}
			thinking = false;
		}
	};
};

Scout.prototype = new Hero();
Scout.prototype.constructor = Scout;
