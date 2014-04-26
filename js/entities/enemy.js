var Enemy = function () {
	this.Kill = function () {
		Lynx.Log("Enemy " + this.Name + " has been killed!");
	};
};
Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

//Enemy Definitions
//-----------------------------

//Level 1-5
var Trog = function () {
	this.Species = "Trog";
	this.Experience = 50;
	this.Gold = 25;
	this.Health = 5;
	this.Mana = 0;
};

Trog.prototype = new Enemy();
Trog.prototype.constructor = Trog;