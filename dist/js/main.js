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

		var john = new Warrior("John");
		john.EquipItem(new WoodenSword());
		var hugo = new Trog();
		john.CurrentTarget = hugo;
		Lynx.Scene.On("Update", function() {
			john.Think();
		});
	}
};

var Entities = Entities || {};
Entities.content = [];
Entities.createEntity = function(entity) {
	var newEntity = new entity();
	Entities.content.push(newEntity);
	return newEntity;
}
Actions = [];

var Action = function (pName, pCooldown) {
	this.Name = pName || "";
	this.Cooldown = pCooldown || 500;
	this.CanUseAt = 0;
	this.Use = function (pEntity) {};

	Actions.push(this);
};
var Item = function (pName) {
	this.Name = pName;
	this.Type = ItemType.JUNK;
	this.EquipSlot = EquipSlot.NONE;
	this.Use = function (pHero) {};
	this.Cost = 1;
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
var World = World || {};

World.Entities = [];

var Entity = function () {

	var currentRoom = null;
	var items = [];
	var actions = [AttackAction];
	var cooldowns = [];
	var available = [AttackAction];

	this.Id = 0;
	this.Name = "";
	this.Species = "";
	this.Level = 1;
	this.Gold = 0;
	this.Exp = 1; //Exp to be awarded to the attacker on kill
	this.InCombat = false;
	this.CurrentTarget = null;

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

	//Properties
	Object.defineProperty(this, "Alive", {
		get: function () {
			return this.Health > this.HealthDelta;
		}
	});

	//Start AI

	this.Think = function () {
		//See what's on cooldown and when we can use it next
		__updateCooldowns();
		this.Brain.call(this);
	};

	this.Brain = function () {
		//Individual AI Logic goes here.
	};

	function __updateCooldowns() {
		var makeAvailable = [];
		var now = Date.now();
		for (var i = 0; i < cooldowns.length; i++) {
			if (cooldowns[i].CanUseAt <= now) {
				makeAvailable.push(cooldowns[i]);
			}
		}

		for (var x = 0; x < makeAvailable.length; x++) {
			cooldowns.splice(cooldowns.indexOf(makeAvailable[x]), 1);
			available.push(makeAvailable[x]);
		}
	}

	this.Idle = function () {};

	this.Attack = function (pTarget) {
		this.UseAction("Attack", pTarget);
	};

	this.Run = function () {};

	this.OnCooldown = function (pName) {
		return (typeof _.find(cooldowns, {
			Name: pName
		}) !== 'undefined');
	};

	this.UseAction = function (pName, pTarget) {
		if (!this.Alive || this.OnCooldown(pName)) {
			return false;
		}

		var actionObject = _.find(actions, function (pA) {
			return pA.Name == pName;
		});

		if (typeof actionObject === 'undefined')
			return false;

		actionObject.Use(this, pTarget);
		actionObject.CanUseAt = Date.now() + actionObject.Cooldown;

		available.splice(available.indexOf(actionObject), 1);
		cooldowns.push(actionObject);

		return false;
	};

	this.GiveAction = function (pAction) {
		if (!pAction.hasOwnProperty("Name")) {
			//Try finding it on a global level
			var ta = _.find(Actions, {
				Name: pAction
			});
			if (typeof ta !== 'undefined') {
				//We have anaction with that name so we'll use it
				pAction = Object.create(ta);
			}
		}

		if (typeof _.find(actions, function (pA) {
			return pA.Name === pAction.Name;
		}) !== 'undefined') {
			return false;
		}

		actions.push(pAction);
		return true;
	};

	//End AI
	this.TakeDamage = function (pDamage, pAttacker) {
		//TODO: Fix Defense algorithm
		if (!this.Alive) {
			return;
		}

		var realHit = Math.floor(pDamage - this.BaseDefense);
		this.HealthDelta += realHit;
		if (this.HealthDelta >= this.Health) {
			this.Kill();
			pAttacker.CurrentTarget = null;
			pAttacker.NotifyKill(this);
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
		if (!this.Alive) {
			return false;
		}

		var item = -1;
		for (var i = 0; i < items.length; i++) {
			if (items[i].Name === pItemName) {
				item = items[i];
				break;
			}
		}

		if (item !== -1 && (item.Type & ItemType.USABLE) !== 0 && item.Cost <= this.ActionPoints) {
			this.ActionPoints -= item.Cost;
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
		World.Entities.splice(World.Entities.indexOf(this), 1);
	};

	World.Entities.push(this);
};

// Entity Definitions
//--------------------------
var AttackAction = new Action("Attack", 500);

AttackAction.Use = function (pEntity, pTarget) {
	pTarget.TakeDamage(pEntity.BaseAttack, pEntity);
};
var HeavyAttackAction = new Action("Heavy Attack", 1000);

HeavyAttackAction.Use = function (pEntity, pTarget) {
	Lynx.Log(pEntity.Name + " used Heavy Attack!!");
	pTarget.TakeDamage(pEntity.BaseAttack * 2, pEntity);
};
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
// Warrior
//--------------------------

var Warrior = function (pName) {
	this.Class = HeroClass.WARRIOR;
	this.Name = pName || "WARRIOR";

	this.GiveAction("Heavy Attack");

	this.Brain = function () {
		if (this.CurrentTarget !== null) {
			if (!this.OnCooldown("Attack")) {
				Lynx.Log(this.Name + " is attacking!");
				this.Attack(this.CurrentTarget);
			}
		}
	};
};

Warrior.prototype = new Hero();
Warrior.prototype.constructor = Warrior;
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
	this.type = new EmptyRoom(); //The type of room this is.
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

	// this.setType = function(roomType) {
	// 	if (roomType.prototype instanceof Room) {
	// 		if (this.type) {
	// 			delete this.type;
	// 		}
	// 		this.type = new roomType();
	// 	}
	// };

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
			newRoom.type = new EmptyRoom(this);
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
//This is the base RootType type.
var EmptyRoom = function(parent) {
	this.parent = parent;
	//Room.call(this);
};
// EmptyRoom.prototype = new Room();
// EmptyRoom.prototype.constructor = EmptyRoom;

var NodeRoom = function(parent) {
	EmptyRoom.apply(this, [parent]);
	this.maxSpawnedEntities = 0;
	this.spawnedEntities = [];
	this.canSpawnEntities = [],
	this.Spawner = function() {
		var entityToSpawn = _.sample(this.canSpawnEntities);
		if (entityToSpawn && entityToSpawn.prototype instanceof Entity) {
			if (this.spawnedEntities.length < this.maxSpawnedEntities) {
				var newEntity = Entities.createEntity(entityToSpawn);
				newEntity.SetRoom(this);
				this.parent.mobs.push(newEntity);
				this.spawnedEntities.push(newEntity);
				console.log('Spawned a ' + newEntity.Species);
				return newEntity;
			} else {
				return false;
			}
		}
	};
};
NodeRoom.prototype = new EmptyRoom();
NodeRoom.prototype.constructor = NodeRoom;

var TrogRoom = function(parent) {
	NodeRoom.apply(this, [parent]);

	this.maxSpawnedEntities = 5;
	this.canSpawnEntities = [Trog];
	this.spawnCooldown = 20000;
	setInterval(function() {
		//Only spawn in the maxSpawnedEntities limit hsn't been reached.
		if (this.spawnedEntities.length < this.maxSpawnedEntities) {
			this.Spawner();
		}
	}.bind(this), this.spawnCooldown);
};

TrogRoom.prototype = new NodeRoom();
TrogRoom.prototype.constructor = TrogRoom;
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
