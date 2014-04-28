var HeroClass = {
	SCRUB: 0,
	WARRIOR: 1,
	MAGE: 2,
};

//Basic Hero
var Hero = function (pName) {
	Entity.apply(this);

	this.Species = "Human";
	this.HeroType = "";
	this.Class = HeroClass.SCRUB;

	this.expGainedInDungeon = 0; //This is the experience gained during this visit to the dungeon.
	this.fightsWon = 0;
	this.fun = 0;
	this.totalExp = 0;
	var nextLevelExp = 100;

	var move = (Object.create(HeroMoveAction));
	this.actions.push(move);

	this.lastMoveDir = null;
	this.Name = pName || "";

	this.image = null;
	this.xOffSet = 31; //Heros line up on the right side of the room.

	Object.defineProperty(this, "Experience", {
		get: function () {
			return this.totalExp;
		},
		set: function (pValue) {
			this.totalExp = pValue;

			while (this.totalExp >= nextLevelExp) {
				this.totalExp -= nextLevelExp;
				nextLevelExp = Math.floor(nextLevelExp * 1.75);
				this.Level++;
				this.LevelUp();
			}
		}
	});


	//Start AI

	this.NotifyKill = function (pEntityKilled) {

		//This formula makes killing lower level enemies give less exp, and vice versa.
		var experienceGained = pEntityKilled.Exp * Math.pow(1.1, pEntityKilled.Level - this.level);
		experienceGained = Math.min(experienceGained, pEntityKilled.Exp * 2);

		this.Experience += pEntityKilled.Exp;
		this.expGainedInDungeon += pEntityKilled.Exp;
		this.fightsWon++;

		this.fun += Math.min(0, (pEntityKilled.Level - this.level));
	};

	this.LevelUp = function () {
		this.Health += 2;
		this.BaseAttack += 1;
		Lynx.Log("Hero " + this.Name + " Has leveled up! (" + this.Level + ")");
	};

	//End AI

	this.Kill = function () {
		Lynx.Log("Hero " + this.Name + " has been killed!");
		if (!Game.Muted)
			Lynx.AM.Get("soundDeath").Asset.play();

		//Get all entities that are attacking this hero and notifiy them of it's death.
		var self = this;
		_.each(World.Entities.content, function (mob) {
			if (mob.CurrentTarget === self) {
				mob.CurrentTarget = null;
				mob.NotifyKill(self);
			}
		});

		Lynx.Scene.Layers[2].RemoveEntity(this.entity);
		this.RemoveFromGame();
	};
};

Hero.prototype = new Entity();
Hero.prototype.constructor = Hero;

// Hero Definitions
//----------------------------