var Enemy = function () {
	var currentRoom = null;

	this.Id = 0;
	this.Name = "";
	this.Species = "";
	this.Level = 1;
	this.Experience = 0;
	this.Gold = 100;

	this.Health = 20;
	this.HealthDelta = 0;
	this.Mana = 0;
	this.ManaDelta = 0;
	this.BaseAttack = 1;
	this.BaseDefense = 1;
	this.BaseMagic = 1;
	this.ActionPoints = 3;

	this.Equipment = {
		Weapon: "None",
		Armor: "None",
		Accessory: "None"
	};

	//Start AI

	this.Think = function () {
		//AI Logic goes here.
		this.Idle();
	};

	this.Idle = function () {};

	this.Attack = function (pTarget) {};

	this.Run = function () {};

	this.TakeDamage = function (pDamage, pAttacker) {
		//TODO: Fix Defense algorithm
		var realHit = Math.floor(pDamage - this.BaseDefense);
		var newHealth = this.Health - this.HealthDelta - realHit;
		Lynx.Log("Enemy " + this.Name + " has been hit for " + realHit + " Damage (" + newHealth + " HP Remaining)");
		this.HealthDelta += realHit;
		if (this.HealthDelta >= this.Health) {
			pAttacker.Experience += this.Experience;
			this.Kill();
		}
	};

	//End AI

	this.SetRoom = function (pRoom) {
		if (pRoom instanceof Room) {
			currentRoom = pRoom;
		}
	};

	this.Kill = function () {
		Lynx.Log("Enemy " + this.Name + " has been killed!");
	};
};

//Enemy Definitions
//-----------------------------

//Level 1-5
var Trog = function () {
	Enemy.call(this);

	this.Species = "Trog";
	this.Experience = 50;
	this.Gold = 25;
	this.Health = 5;
	this.Mana = 0;
};

Trog.prototype = {
	construtor: Enemy
};