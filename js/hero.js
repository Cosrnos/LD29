var Hero = function () {

	var totalExp = 0;
	var nextLevelExp = 100;

	Entity.call(this);

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
	this.Class = HeroClass.WARRIOR;
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


var HeroClass = {
	WARRIOR: 0
};
