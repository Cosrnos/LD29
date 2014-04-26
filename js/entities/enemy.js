var Enemy = function () {
	Entity.call(this);

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
