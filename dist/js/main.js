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
Game = {
	Start: function() {
		this.Initialize();
		this.LoadAssets((function() {
			this.LoadComponents((function() {
				this.SetupScene();
				this.Ready();
			}).bind(this));
		}).bind(this));
	},

	Initialize: function() {
		//Set Globals here
		//Open preloader if needed
	},

	LoadAssets: function(pCallback) {
		//Queue assets here
		Lynx.AM.LoadQueue(pCallback);
	},

	LoadComponents: function(pCallback) {
		Lynx.CM.Load("Tracker", "Timer");
		Lynx.CM.On("ComponentManager.Ready", pCallback);
	},

	SetupScene: function () {
		Lynx.Start();
	},
	Ready: function () {
		var john = new Hero();
		john.Name = "John";
		var hugo = new Trog();
		hugo.Name = "Hugo";
		john.GiveItem(new HP10Potion(), 1);
		john.Experience += 99;
		john.UseItem("HP 10 Potion");

		hugo.TakeDamage(50, john);

		Game.Rooms.push(new Game.Room(400, 250));
		walk(Game.Rooms.content[0], 5, 0);
	}
};

var Hero = function () {

	var currentRoom = null;
	var items = [];
	var totalExp = 0;
	var nextLevelExp = 100;

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

	this.Id = 0;
	this.Name = "";
	this.Class = HeroClass.WARRIOR;
	this.Level = 1;
	this.Gold = 100;

	this.Health = 20;
	this.HealthDelta = 0;
	this.Mana = 10;
	this.ManaDelta = 0;
	this.BaseAttack = 1;
	this.BaseDefense = 1;
	this.BaseMagic = 1;
	this.ActionPoints = 3;

	this.Equipment = {
		Weapon: "Sword",
		Armor: "Chain",
		Accessory: "Severed human hand"
	};

	//Start AI

	this.Think = function () {
		//AI Logic goes here.
		this.Idle();
	};

	this.Idle = function () {};

	this.Attack = function (pTarget) {};

	this.Run = function () {};

	this.LevelUp = function () {
		this.Health += 2;
		this.BaseAttack += 1;
		Lynx.Log("Hero " + this.Name + " Has leveled up! (" + this.Level + ")");
	};

	this.TakeDamage = function (pDamage, pAttacker) {
		//TODO: Fix Defense algorithm
		var realHit = Math.floor(pDamage - this.BaseDefense);
		this.HealthDelta += realHit;
		if (this.HealthDelta >= this.Health) {
			this.Kill();
		}
	};

	//End AI

	this.GiveItem = function (pItem, pQuantity) {
		for (var i = 0; i < pQuantity; i++) {
			items.push(pItem);
		}
	};

	this.HasItem = function (pItemName, pQuantity) {
		var totalCount = 0;
		pQuantity = pQuantity || 1;

		for (var i = 0; i < items.length; i++) {
			if (items[i].Name === pItemName) {
				totalCount++;

				if (totalCount >= pQuantity) {
					return true;
				}
			}
		}

		return false;
	};

	this.TakeItem = function (pItemName, pQuantity) {
		var toRemove = 0;
		pQuantity = pQuantity || 1;

		for (var i = 0; i < items.length; i++) {
			if (items[i].Name === pItemName) {
				toRemove.push;
				if (toRemove.length === pQuantity)
					break;
			}
		}

		if (toRemove.length !== pQuantity) {
			return false;
		}

		for (var x = 0; x < toRemove.length; x++) {
			items.splice(toRemove[x], 1);
		}

		return true;
	};

	this.UseItem = function (pItemName) {
		var item = -1;
		for (var i = 0; i < items.length; i++) {
			if (items[i].Name === pItemName) {
				item = items[i];
				break;
			}
		}

		if (item !== -1) {
			item.Use(this);
			Lynx.Log("Hero " + this.Name + " has used a(n) " + item.Name);
			items.splice(item, 1);
		}
	};

	this.SetRoom = function (pRoom) {
		if (pRoom instanceof Room) {
			currentRoom = pRoom;
		}
	};

	this.Kill = function () {
		Lynx.Log("Hero " + this.Name + " has been killed!");
	};
};


var HeroClass = {
	WARRIOR: 0
};
var Item = function (pName) {
	this.Name = pName;
	this.Use = function (pHero) {};
	this.Equip = function (pHero) {};
	this.Unequip = function (pHero) {};
};

var HP10Potion = function () {
	Item.call(this, "HP 10 Potion");

	this.Use = function (pHero) {
		pHero.HealthDelta -= 10;
		if (pHero.HealthDelta < 0) {
			pHero.HealthDelta = 0;
		}
	};
};
Game.Rooms = {

	content: [], //Array that contains all the rooms.

	//Add a room to the room array
	push: function(room) {
		this.content.push(room);
	},

	//Finds a room whose origin cooridinates match [x,y]
	findRoom: function(x, y) {
		foundRoom = _.find(this.content, function(room) {
			if (room.x === x && room.y === y) {
				return true;
			}
		});
		return foundRoom;
	}
}
Game.Room = function(x, y) {

	this.id = 0;
	//position of this room.
	this.x = x;
	this.y = y;

	//Links to other rooms.
	this.North = null;
	this.South = null;
	this.East = null;
	this.West = null;

	this.name = '';
	this.type = {}; //The type of room this is.
	this.mobs = []; //A list of creatures in the room.

	this.entity = new Lynx.Entity(x, y, 40, 40);
	this.entity.Color = 0xDEADBE;
	Lynx.Scene.AddEntity(this.entity);

	//Add hallway
	this.nHall = new Lynx.Entity(x + 17, y - 10, 6, 10);
	this.nHall.Color = 0xFF0000;
	this.sHall = new Lynx.Entity(x + 17, y + 40, 6, 10);
	this.sHall.Color = 0xFF0000;
	this.eHall = new Lynx.Entity(x + 40, y + 17, 10, 6);
	this.eHall.Color = 0xFF0000;
	this.wHall = new Lynx.Entity(x - 10, y + 17, 10, 6);
	this.wHall.Color = 0xFF0000;

	//This add a room or creates a connection to an already existing room in the specified direction.
	this.addRoom = function(direction) {
		var newRoom;
		var error = '';

		direction = direction.toLowerCase();
		if (direction === "n" || direction === "north") {
			if (this.North === null) {
				//Check to see if thee is a room in that direction that this room isn't yet connected to.
				var foundRoom = Game.Rooms.findRoom(x, y - 50)
				if (foundRoom) {
					this.North = foundRoom;
					foundRoom.South = this;
				} else {
					newRoom = new Game.Room(x, y - 50);
					this.North = newRoom;
					newRoom.South = this;
				}
				Lynx.Scene.AddEntity(this.nHall);

			} else {
				error = "Room to the North already exists."
			}

		} else if (direction === "s" || direction === "south") {

			if (this.South === null) {
				var foundRoom = Game.Rooms.findRoom(x, y + 50)
				if (foundRoom) {
					this.South = foundRoom;
					foundRoom.North = this;
				} else {
					newRoom = new Game.Room(x, y + 50);
					this.South = newRoom;
					newRoom.North = this;
				}
				Lynx.Scene.AddEntity(this.sHall);
			} else {
				error = "Room to the South already exists."
			}

		} else if (direction === "e" || direction === "east") {
			if (this.East === null) {
				var foundRoom = Game.Rooms.findRoom(x + 50, y)
				if (foundRoom) {
					this.East = foundRoom;
					foundRoom.West = this;
				} else {
					newRoom = new Game.Room(x + 50, y);
					this.East = newRoom;
					newRoom.West = this;
				}
				Lynx.Scene.AddEntity(this.eHall);
			} else {
				error = "Room to the East already exists."
			}
		} else if (direction === "w" || direction === "west") {

			if (this.West === null) {
				var foundRoom = Game.Rooms.findRoom(x - 50)
				if (foundRoom) {
					this.West = foundRoom;
					foundRoom.East = this;
				} else {
					newRoom = new Game.Room(x - 50, y);
					this.West = newRoom;
					newRoom.East = this;
				}
				Lynx.Scene.AddEntity(this.wHall);
			} else {
				error = "Room to the West already exists.";
			}

		} else {
			error = 'No/Invalid Direction Specified When Creating Room';
		}

		if (error) {
			console.log(error)
			delete newRoom;
			return false;
		}
		if (newRoom) {
			newRoom.id = Game.Rooms.content.length;
			Game.Rooms.push(newRoom);
			return newRoom;
		} else if (foundRoom) {
			return foundRoom
		} else
			return false;
	}
};


//This creates a kinda-random dungeon, starting from 'room'
walk = function(room, maxDepth, depth) {
	if (depth >= maxDepth || !room) {
		return;
	}
	//Sometime create a coridor three rooms long.
	if (Math.random() >= 0.8) {

		var direction = _.sample(['n', 's', 'w', 'e']);
		var x = 0;
		newRoom = room.addRoom(direction);
		while (newRoom && x < 3) {
			x += 1;
			newRoom = newRoom.addRoom(direction);
		}
		if (newRoom) {
			walk(newRoom, maxDepth, depth + 1);
		}
	}
	debugger;
	//Randomly create rooms in each direction.
	if (Math.random() >= 0.6) {
		if (room.addRoom('n')) {
			walk(room.North, maxDepth, depth + 1);
		}
	}
	if (Math.random() >= 0.6) {
		if (room.addRoom('s')) {
			walk(room.South, maxDepth, depth + 1);
		}
	}
	if (Math.random() >= 0.6) {
		if (room.addRoom('e')) {
			walk(room.East, maxDepth, depth + 1);
		}
	}
	if (Math.random() >= 0.6) {
		if (room.addRoom('w')) {
			walk(room.West, maxDepth, depth + 1);
		}
	}
};