var Enemy = function() {
	Entity.apply(this);
	var move = (Object.create(MoveAction));
	this.actions.push(move);

	this.Drops = [];

	this.Color = 0x0000ff;
	var originalTakeDamage = this.TakeDamage;
	//Add hallway

	this.xOffSet = 7; //Enemies line up on the left side of a room.


	this.AddDrop = function(pItem, pChance) {
		var drop = Object.create(pItem);
		pItem.Chance = pChance;
		this.Drops.push(pItem);
	};

	this.TakeDamage = function(pAmount, pAttacker) {
		originalTakeDamage.call(this, pAmount, pAttacker);
		this.CurrentTarget = pAttacker;
	}

	this.Brain = function() {
		var thinking = true;
		while (thinking) {
			if (this.CurrentTarget !== null) {
				if (!this.OnCooldown("Attack")) {
					this.UseAction("Attack", this.CurrentTarget);
					continue;
				}
			} else {
				var heroInRoom = _.find(this.GetRoom().mobs, function(pa) {
					return pa instanceof Hero
				});
				if (typeof heroInRoom !== 'undefined') {
					this.CurrentTarget = heroInRoom;
					continue;
				}

				if (!this.OnCooldown("Move")) {
					this.UseAction("Move");
					continue;
				}
			}

			thinking = false;
		}
	}

	this.Kill = function() {
		Lynx.Log("Enemy " + this.Species + " has been killed!");

		var self = this;
		var attackers = _.filter(World.Entities.content, function(mob) {
			return mob.CurrentTarget === self;
		});

		var numAttackers = attackers.length;

		//RECALCULATE THE EXPERIENCE GIVEN DEPENDING ON THE NUMBER OF ATTACKERS!!!
		//This forumla boosts the experience gained based with the number of attackers then
		//divies it up.
		this.Exp = Math.ceil((this.Exp / numAttackers) * (1 + 0.25 * (numAttackers - 1)));

		_.each(attackers, (function(pAttacker) {
			if (this.Drops.length > 0) {
				var totalChance = this.Drops.length * 100;
				var dropChance = 0;
				var currentChanceRate = 0;
				_.each(this.Drops, function(pDrop) {
					dropChance += pDrop.Chance;
				});
				var roll = Math.floor(Math.random() * totalChance);

				_.each(this.Drops, function(pDrop) {
					if (roll <= pDrop.Chance + currentChanceRate) {
						//Drop found.
						pAttacker.GiveItem(Object.create(pDrop));
						Lynx.Log(pAttacker.Name + " picked up a(n) " + pDrop.Name);
						return;
					} else {
						currentChanceRate += pDrop.Chance;
					}
				});
			}

			pAttacker.CurrentTarget = null;
			pAttacker.NotifyKill(self);
		}).bind(this));

		Lynx.Scene.Layers[2].RemoveEntity(this.entity);

		this.RemoveFromGame();
	};
};

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

//Enemy Definitions
//-----------------------------

//Level 1-5
var Trog = function() {
	Enemy.apply(this);
	this.Species = "Trog";
	this.Exp = 25;
	this.Gold = 25;
	this.Health = 5;
	this.Mana = 0;
	this.BaseAttack = 2;
	this.BaseDefense = 0;
	this.AddDrop(new HP10Potion(), 10);
	this.AddDrop(new WoodenStick(), 5);
	this.AddDrop(new TatteredClothes(), 5);
	this.AddDrop(new Ring(), 5);
	this.image = Lynx.AM.Get("trog").Asset;
};

Trog.prototype = new Enemy();
Trog.prototype.constructor = Trog;

var Spider = function() {
	Enemy.apply(this);
	this.Species = "Spider";
	this.Level = 3;
	this.Exp = 40;
	this.BaseAttack = 2;
	this.BaseDefense = 1;
	this.Gold = 25;
	this.Health = 10;
	this.Mana = 0;
	this.AddDrop(new HP10Potion(), 15);
	this.AddDrop(new WoodenStick(), 5);
	this.AddDrop(new TatteredClothes(), 5);
	this.AddDrop(new Ring(), 5);
	this.image = Lynx.AM.Get("spider").Asset;
};

Spider.prototype = new Enemy();
Spider.prototype.constructor = Spider;

var Bat = function() {
	Enemy.apply(this);
	this.Species = "Bat";
	this.Level = 5;
	this.Exp = 50;
	this.Gold = 25;
	this.BaseAttack = 4;
	this.BaseDefense = 2;
	this.Health = 15;
	this.Mana = 0;
	this.AddDrop(new HP10Potion(), 20);
	this.AddDrop(new WoodenStick(), 10);
	this.AddDrop(new TatteredClothes(), 10);
	this.image = Lynx.AM.Get("bat").Asset;
	this.AddDrop(new Ring(), 10);
};

Bat.prototype = new Enemy();
Bat.prototype.constructor = Bat;

//Level 6-10
var Goblin = function() {
	Enemy.apply(this);
	this.Species = "Goblin";
	this.Level = 7;
	this.Exp = 75;
	this.Gold = 25;
	this.BaseAttack = 3;
	this.BaseDefense = 2;
	this.Health = 15;
	this.Mana = 0;
	this.AddDrop(new HP10Potion(), 20);
	this.AddDrop(new WoodenStick(), 15);
	this.AddDrop(new TatteredClothes(), 15);
	this.AddDrop(new Ring(), 15);
	this.image = Lynx.AM.Get("goblin").Asset;
};

Goblin.prototype = new Enemy();
Goblin.prototype.constructor = Goblin;

var GiantSpider = function() {
	Enemy.apply(this);
	this.Species = "Giant Spider";
	this.Level = 10;
	this.BaseAttack = 5;
	this.BaseDefense = 3;
	this.Exp = 100;
	this.Health = 20;

	this.GiveAction("Bite");
	this.AddDrop(new BronzeSword(), 20);

	//this.Color = 0xffffff;
	this.entityScaleMultiplier = 1.5;
	this.image = Lynx.AM.Get("spider-giant").Asset;
	debugger;

	this.Brain = function() {
		var thinking = true;
		while (thinking) {
			if (this.CurrentTarget !== null) {
				if (!this.OnCooldown("Attack")) {
					this.UseAction("Attack", this.CurrentTarget);
					continue;
				}

				if (!this.OnCooldown("Bite")) {
					this.UseAction("Bite", this.CurrentTarget);
					continue;
				}
			} else {
				var heroInRoom = _.find(this.GetRoom().mobs, function(pa) {
					return pa instanceof Hero
				});
				if (typeof heroInRoom !== 'undefined') {
					this.CurrentTarget = heroInRoom;
					continue;
				}

				if (!this.OnCooldown("Move")) {
					if (!this.CurrentTarget) {
						this.UseAction("Move");
						continue;
					}
				}
			}

			thinking = false;
		}
	}
};
GiantSpider.prototype = new Enemy();
GiantSpider.prototype.constructor = GiantSpider;