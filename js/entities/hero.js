var HeroClass = {
	SCRUB: 0,
	WARRIOR: 1,
};

//Basic Hero
var Hero = function(pName) {

	var totalExp = 0;
	var nextLevelExp = 100;

	this.Name = pName || "";

	this.Draw = function() {
		//debugger;
		var currentRoom = this.GetRoom();
		if (currentRoom) {
			if (!this.entity) {
				this.entity = new Lynx.Entity(World.Rooms.roomSize * currentRoom.x + 35, World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 1, 4, 4);
				this.entity.Color = 0x00ffff;
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
		Lynx.Scene.Layers[1].RemoveEntity(this.entity);
		this.RemoveFromGame();
	};
};

Hero.prototype = new Entity();
Hero.prototype.constructor = Hero;

// Hero Definitions
//----------------------------