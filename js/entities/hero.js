var HeroClass = {
	SCRUB: 0,
	WARRIOR: 1,
};

//Basic Hero
var Hero = function (pName) {

	var totalExp = 0;
	var nextLevelExp = 100;

	this.Name = pName || "";

	Object.defineProperty(this, "Experience", {
		get: function () {
			return totalExp;
		},
		set: function (pValue) {
			totalExp += pValue;
			if (totalExp >= nextLevelExp) {
				this.totalExp -= nextLevelExp;
				nextLevelExp = nextLevelExp * 1.5;
				this.Level++;
				this.LevelUp();
			}
		}
	});

	this.Species = "Human";
	this.Class = HeroClass.SCRUB;
	//Start AI
	this.NotifyKill = function (pEntityKilled) {
		this.Experience += pEntityKilled.Exp;
	};

	this.LevelUp = function () {
		this.Health += 2;
		this.BaseAttack += 1;
		Lynx.Log("Hero " + this.Name + " Has leveled up! (" + this.Level + ")");
	};

	//End AI

	this.Kill = function () {
		Lynx.Log("Hero " + this.Name + " has been killed!");
	};
};

Hero.prototype = new Entity();
Hero.prototype.constructor = Hero;

// Hero Definitions
//----------------------------