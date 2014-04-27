var Enemy = function() {
	var originalTakeDamage = this.TakeDamage;
	//Add hallway
	this.Draw = function() {
		//debugger;
		var currentRoom = this.GetRoom();
		if (currentRoom) {
			if (!this.entity) {
				this.entity = new Lynx.Entity(World.Rooms.roomSize * currentRoom.x + 5, World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 1, 4, 4);
				this.entity.Color = 0x0000ff;
				Lynx.Scene.Layers[1].AddEntity(this.entity);
			} else {
				this.entity.X = World.Rooms.roomSize * currentRoom.x + 5;
				this.entity.Y = World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 1;
			}
		}
	}

	this.TakeDamage = function(pAmount, pAttacker) {
		originalTakeDamage.call(this, pAmount, pAttacker);
		this.CurrentTarget = pAttacker;
	}

	this.Brain = function() {
		var thinking = true;
		while (thinking) {
			if (this.CurrentTarget !== null) {
				if (!this.OnCooldown("Attack")) {
					this.Attack(this.CurrentTarget);
					continue;
				}
			}

			thinking = false;
		}
	}

	this.Kill = function() {
		Lynx.Log("Enemy " + this.Species + " has been killed!");
		Lynx.Scene.Layers[1].RemoveEntity(this.entity);
		this.RemoveFromGame();
	};
};

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

//Enemy Definitions
//-----------------------------

//Level 1-5
var Trog = function() {
	this.Species = "Trog";
	this.Experience = 50;
	this.Gold = 25;
	this.Health = 5;
	this.Mana = 0;
};

Trog.prototype = new Enemy();
Trog.prototype.constructor = Trog;

var Spider = function() {
	this.Species = "Spider";
	this.Level = 3;
	this.Experience = 70;
	this.BaseAttack = 2;
	this.Gold = 25;
	this.Health = 7;
	this.Mana = 0;
};

Spider.prototype = new Enemy();
Spider.prototype.constructor = Spider;

var Bat = function() {
	this.Species = "Bat";
	this.Level = 5;
	this.Experience = 90;
	this.Gold = 25;
	this.BaseAttack = 3;
	this.Health = 10;
	this.Mana = 0;
};

Bat.prototype = new Enemy();
Bat.prototype.constructor = Bat;

//Level 6-10
var Goblin = function() {
	this.Species = "Goblin";
	this.Level = 7;
	this.Experience = 150;
	this.Gold = 25;
	this.BaseAttack = 3;
	this.BaseDefense = 2;
	this.Health = 15;
	this.Mana = 0;
};

Goblin.prototype = new Enemy();
Goblin.prototype.constructor = Goblin;

var GiantSpider = function() {
	this.Species = "Giant Spider";
	this.Level = 10;
	this.BaseAttack = 5;
	this.BaseDefense = 3;
	this.Experience = 200;
	this.Health = 20;

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
			}

			thinking = false;
		}
	}

	this.GiveAction("Bite");
};

GiantSpider.prototype = new Spider();
GiantSpider.prototype.constructor = GiantSpider;