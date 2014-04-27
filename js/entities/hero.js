var HeroClass = {
	SCRUB: 0,
	WARRIOR: 1,
	MAGE: 2,
};

//Basic Hero
var Hero = function(pName) {
	Entity.apply(this);

	this.Species = "Human";
	this.HeroType = "";
	this.Class = HeroClass.SCRUB;

	this.expGainedInDungeon = 0; //This is the experience gained during this visit to the dungeon.
	var totalExp = 0;
	var nextLevelExp = 100;

	var move = (Object.create(HeroMoveAction));
	this.actions.push(move);

	this.lastMoveDir = null;
	this.Name = pName || "";

	this.Draw = function() {
		//debugger;
		var currentRoom = this.GetRoom();
		if (currentRoom) {
			if (!this.entity) {
				this.entity = new Lynx.Entity(World.Rooms.roomSize * currentRoom.x + 35, World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 1, 4, 4);
				this.entity.Color = 0x009933;
				Lynx.Scene.Layers[1].AddEntity(this.entity);
			} else {
				this.entity.X = World.Rooms.roomSize * currentRoom.x + 31;
				this.entity.Y = World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 1;
			}
		}
	}

	Object.defineProperty(this, "Experience", {
		get: function() {
			return totalExp;
		},
		set: function(pValue) {
			totalExp += pValue;
			this.expGainedInDungeon += pValue;
			if (totalExp >= nextLevelExp) {
				this.totalExp -= nextLevelExp;
				nextLevelExp = nextLevelExp * 1.5;
				this.Level++;
				this.LevelUp();
			}
		}
	});


	//Start AI
	this.NotifyKill = function(pEntityKilled) {
		this.Experience += pEntityKilled.Exp;
	};

	this.LevelUp = function() {
		this.Health += 2;
		this.BaseAttack += 1;
		Lynx.Log("Hero " + this.Name + " Has leveled up! (" + this.Level + ")");
	};

	//End AI

	this.Kill = function() {
		Lynx.Log("Hero " + this.Name + " has been killed!");

		//Get all entities that are attacking this hero and notifiy them of it's death.
		var self = this;
		_.each(World.Entities.content, function(mob) {
			if (mob.CurrentTarget === self) {
				mob.CurrentTarget = null;
				mob.NotifyKill(self);
			}
		});

		Lynx.Scene.Layers[1].RemoveEntity(this.entity);
		this.RemoveFromGame();
	};
};

Hero.prototype = new Entity();
Hero.prototype.constructor = Hero;

// Hero Definitions
//----------------------------