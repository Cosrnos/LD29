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

	SetupScene: function() {
		Lynx.Start();
	},
	Ready: function() {
		World.Rooms.push(new Room(8, 5));
		walk(World.Rooms.content[0], 5, 0);
		World.Rooms.hashMap[8][5].entity.Color = 0xFF0000;

		var john = new Hero();
		john.Name = "John";
		var hugo = new Trog();
		hugo.Name = "Hugo";
		john.GiveItem(new HP10Potion(), 1);
		john.Experience += 99;
		john.UseItem("HP 10 Potion");
		john.EquipItem(new WoodenSword());
		while (hugo.HealthDelta < hugo.Health) {
			john.Attack(hugo);
		}
	}
};

var Entities = Entities || {};
Entities.content = [];
Entities.createEntity = function(entity) {
	var newEntity = new entity();
	Entities.content.push(newEntity);
	return newEntity;
}

var Action = function (pName, pCost) {
	this.Name = pName || "";
	this.Cost = pCost || 1;
	this.Use = function (pEntity) {};
};
var AttackAction = new Action("Attack", 1);

AttackAction.Use = function (pEntity, pTarget) {
	pTarget.TakeDamage(pEntity.BaseAttack, pEntity);
};
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

var Entity = function () {

	var currentRoom = null;
	var items = [];
	var actions = [AttackAction];

	this.Id = 0;
	this.Name = "";
	this.Species = "";
	this.Level = 1;
	this.Gold = 0;
	this.Exp = 1; //Exp to be awarded to the attacker on kill
	this.InCombat = false;

	this.Health = 10;
	this.HealthDelta = 0;
	this.Mana = 0;
	this.ManaDelta = 0;
	this.BaseAttack = 1;
	this.BaseDefense = 1;
	this.BaseMagic = 1;
	this.ActionPoints = 1;

	this.Equipment = {};

	this.Equipment[EquipSlot.ACCESSORY] = null;
	this.Equipment[EquipSlot.ARMOR] = null;
	this.Equipment[EquipSlot.WEAPON] = null;

	//Start AI

	this.Think = function () {
		//AI Logic goes here.
		this.Idle();
	};

	this.Idle = function () {};

	this.Attack = function (pTarget) {
		this.UseAction("Attack", pTarget);
	};

	this.Run = function () {};

	this.UseAction = function (pName, pTarget) {
		var actionObject = _.find(actions, function (pA) {
			return pA.Name == pName;
		});

		if (typeof actionObject === 'undefined')
			return false;

		actionObject.Use(this, pTarget);
	};

	//End AI
	this.TakeDamage = function (pDamage, pAttacker) {
		//TODO: Fix Defense algorithm
		var realHit = Math.floor(pDamage - this.BaseDefense);
		this.HealthDelta += realHit;
		if (this.HealthDelta >= this.Health) {
			pAttacker.NotifyKill(this);
			this.Kill();
		}
	};

	this.NotifyKill = function (pAttacker) {

	};

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

		if (item !== -1 && (item.Type & ItemType.USABLE) !== 0) {
			item.Use(this);
			Lynx.Log("Hero " + this.Name + " has used a(n) " + item.Name);
			items.splice(item, 1);
		}
	};

	this.EquipItem = function (pEquip) {
		if ((pEquip.Type & ItemType.EQUIPABLE) === 0) {
			return;
		}

		if (this.Equipment[pEquip.EquipSlot] !== null) {
			this.GiveItem(this.Equipment[pEquip.EquipSlot]);
			this.Equipment[pEquip.EquipSlot].Unequip(this);
		}
		this.Equipment[pEquip.EquipSlot] = pEquip;
		pEquip.Equip(this);
	};

	this.SetRoom = function (pRoom) {
		if (pRoom instanceof Room) {
			currentRoom = pRoom;
		}
	};

	this.Kill = function () {
		Lynx.Log("Entity " + this.Name + " has been killed!");
	};
};

// Entity Definitions
//--------------------------
var HeroClass = {
	SCRUB: 0,
	WARRIOR: 1,
};

//Basic Hero
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

// Hero Definitions
//----------------------------

// Warrior
//--------------------------

var Warrior = function () {
	Hero.call(this);

	this.Class = HeroClass.WARRIOR;
};

var World = World || {};

World.Rooms = {

	content: [], //Array that contains all the rooms.
	hashMap: {},
	roomSize: 50,

	//Add a room to the room array
	push: function(room) {
		var x = room.x * this.roomSize;
		var y = room.y * this.roomSize;

		if (!this.hashMap[room.x]) {
			this.hashMap[room.x] = {};
		}
		this.hashMap[room.x][room.y] = room;
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

var Room = function(x, y) {

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

	this.entity = new Lynx.Entity(World.Rooms.roomSize * x, World.Rooms.roomSize * y, 40, 40);
	this.entity.Color = 0xDEADBE;
	Lynx.Scene.AddEntity(this.entity);

	//Add hallway
	this.nHall = new Lynx.Entity(World.Rooms.roomSize * x + 17, World.Rooms.roomSize * y - 10, 6, 10);
	this.nHall.Color = 0xFF0000;
	this.sHall = new Lynx.Entity(World.Rooms.roomSize * x + 17, World.Rooms.roomSize * y + 40, 6, 10);
	this.sHall.Color = 0xFF0000;
	this.eHall = new Lynx.Entity(World.Rooms.roomSize * x + 40, World.Rooms.roomSize * y + 17, 10, 6);
	this.eHall.Color = 0xFF0000;
	this.wHall = new Lynx.Entity(World.Rooms.roomSize * x - 10, World.Rooms.roomSize * y + 17, 10, 6);
	this.wHall.Color = 0xFF0000;

	//This add a room or creates a connection to an already existing room in the specified direction.
	this.addRoom = function(direction) {
		var newRoom;
		var error = '';
		var roomSize = World.Rooms.roomSize;

		direction = direction.toLowerCase();
		if (direction === "n" || direction === "north") {
			if (this.North === null) {
				//Check to see if thee is a room in that direction that this room isn't yet connected to.
				var foundRoom = World.Rooms.findRoom(x, y - 1)
				if (foundRoom) {
					this.North = foundRoom;
					foundRoom.South = this;
				} else {
					newRoom = new Room(x, y - 1);
					this.North = newRoom;
					newRoom.South = this;
				}
				Lynx.Scene.AddEntity(this.nHall);

			} else {
				error = "Room to the North already exists."
			}

		} else if (direction === "s" || direction === "south") {

			if (this.South === null) {
				var foundRoom = World.Rooms.findRoom(x, y + 1)
				if (foundRoom) {
					this.South = foundRoom;
					foundRoom.North = this;
				} else {
					newRoom = new Room(x, y + 1);
					this.South = newRoom;
					newRoom.North = this;
				}
				Lynx.Scene.AddEntity(this.sHall);
			} else {
				error = "Room to the South already exists."
			}

		} else if (direction === "e" || direction === "east") {
			if (this.East === null) {
				var foundRoom = World.Rooms.findRoom(x + 1, y)
				if (foundRoom) {
					this.East = foundRoom;
					foundRoom.West = this;
				} else {
					newRoom = new Room(x + 1, y);
					this.East = newRoom;
					newRoom.West = this;
				}
				Lynx.Scene.AddEntity(this.eHall);
			} else {
				error = "Room to the East already exists."
			}
		} else if (direction === "w" || direction === "west") {

			if (this.West === null) {
				var foundRoom = World.Rooms.findRoom(x - 1, y)
				if (foundRoom) {
					this.West = foundRoom;
					foundRoom.East = this;
				} else {
					newRoom = new Room(x - 1, y);
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
			newRoom.id = World.Rooms.content.length;
			World.Rooms.push(newRoom);
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
	//debugger;
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

var NodeRoom = function() {
	//Room.call(this);
	this.canSpawnEntities = [],
	this.Spawner = function() {
		var entityToSpawn = _.sample(this.canSpawnEntities);

		if (entityToSpawn && entityToSpawn instanceof Entity) {
			var newEntity = Entities.CreateEntity(entityToSpawn);
			newEntity.SetRoom(this);
			this.mobs.push(newEntity);
		}
	}
};
NodeRoom.prototype = new Room();
NodeRoom.prototype.construtor = NodeRoom;

var TrogRoom = function() {
	NodeRoom.call(this);
	this.canSpawnEntities = [Trog];
}

TrogRoom.prototype = new NodeRoom();
TrogRoom.prototype.construtor = TrogRoom;
// Accessories
//--------------------------

var Ring = function () {
	Item.call(this, "Ring");

	this.Type |= ItemType.EQUIPABLE;
	this.EquipSlot = EquipSlot.ACCESSORY;

	this.Equip = function (pHero) {
		pHero.BaseMagic += 1;
	};

	this.Unequip = function (pHero) {
		pHero.BaseMagic -= 1;
	};
};

// Armors
//--------------------------

var TatteredClothes = function () {
	Item.call(this, "Tattered Clothes");

	this.Type |= ItemType.EQUIPABLE;
	this.EquipSlot = EquipSlot.ARMOR;

	this.Equip = function (pHero) {
		pHero.BaseDefense += 1;
	};

	this.Unequip = function (pHero) {
		pHero.BaseDefense -= 1;
	};
};

var Item = function (pName) {
	this.Name = pName;
	this.Type = ItemType.JUNK;
	this.EquipSlot = EquipSlot.NONE;
	this.Use = function (pHero) {};
	this.Equip = function (pHero) {};
	this.Unequip = function (pHero) {};
};

var ItemType = {
	JUNK: 0x0,
	USABLE: 0X10,
	EQUIPABLE: 0X100
};

var EquipSlot = {
	NONE: 0x0,
	WEAPON: 0x1,
	ARMOR: 0X10,
	ACCESSORY: 0X100
};

//Item Definitions
//--------------------------------------------

// Potions
//--------------------------

//Health:

var HP10Potion = function () {
	Item.call(this, "HP 10 Potion");

	this.Type |= ItemType.USABLE;

	this.Use = function (pHero) {
		pHero.HealthDelta -= 10;
		if (pHero.HealthDelta < 0) {
			pHero.HealthDelta = 0;
		}
	};
};

// Weapons
//--------------------------

var WoodenSword = function () {
	Item.call(this, "Wooden Sword");

	this.Type |= ItemType.EQUIPABLE;
	this.EquipSlot = EquipSlot.WEAPON;

	this.Equip = function (pHero) {
		pHero.BaseAttack += 2;
	};

	this.UnEquip = function (pHero) {
		pHero.BaseAttack -= 2;
	};
};
