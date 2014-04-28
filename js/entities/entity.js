var World = World || {};

var Entity = function() {


	this.items = [];
	var att = (Object.create(AttackAction));
	this.actions = [];
	this.actions.push(att);

	this.cooldowns = [];
	var available = [att];

	this.CurrentRoom = null;
	this.spawnedRoom = null; //THe room in which it spawned.
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
	this.BaseSpeed = 1;
	this.ActionPoints = 1;

	this.Equipment = {};

	this.Equipment[EquipSlot.ACCESSORY] = null;
	this.Equipment[EquipSlot.ARMOR] = null;
	this.Equipment[EquipSlot.WEAPON] = null;

	this.lastMoveDirection = null;

	this.xOffSet = 0;

	this.Draw = function() {
		//debugger;
		var currentRoom = this.GetRoom();
		if (currentRoom) {
			if (!this.entity) {
				//this.entity = new Lynx.Entity(World.Rooms.roomSize * currentRoom.x + 35, World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 1, 4, 4);
				if (this.image) {
					this.entity = new Lynx.Entity(this.image);
					this.entity.Height = 10;
					this.entity.Width = 10;
					this.entity.X = World.Rooms.roomSize * currentRoom.x + this.xOffSet;
					this.entity.Y = World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 2;
				} else {
					this.entity = new Lynx.Entity(World.Rooms.roomSize * currentRoom.x + this.xOffSet, World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 5, 4, 4);
					//this.entity.Color = this.Color;
					this.entity.Color = 0x009933;
				}

				Game.ScaleEntity(this.entity);
				Lynx.Scene.Layers[2].AddEntity(this.entity);

			} else {
				if (this.image) {
					this.entity.X = World.Rooms.roomSize * currentRoom.x + this.xOffSet;
					this.entity.Y = World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 2;
				} else {
					this.entity.X = World.Rooms.roomSize * currentRoom.x + this.xOffSet;
					this.entity.Y = World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 5;
				}
			}
		}
	};

	//Stupid Move Function.  Picks a random direction and goes.
	this.Move = function(direction) {
		var self = this;
		var currentRoom = this.GetRoom();
		var moveToRoom = null;

		if (currentRoom) {
			if (direction === "n" || direction === "north") {
				if (currentRoom.North) {
					this.lastMoveDirection = 'n';
					moveToRoom = currentRoom.North;
				}
			} else if (direction === "s" || direction === "south") {
				if (currentRoom.South) {
					this.lastMoveDirection = 's';
					moveToRoom = currentRoom.South;
				}
			} else if (direction === "e" || direction === "east") {
				if (currentRoom.East) {
					this.lastMoveDirection = 'e';
					moveToRoom = currentRoom.East;
				}
			} else if (direction === "w" || direction === "west") {
				if (currentRoom.West) {
					this.lastMoveDirection = 'w';
					moveToRoom = currentRoom.West;
				}
			}

			if (moveToRoom) {
				this.SetRoom(moveToRoom);
			}
		}
	}

	this.SetRoom = function(pRoom) {
		var self = this;
		//var currentRoom = this.getRoom()
		if (pRoom instanceof Room) {

			if (this.CurrentRoom) {
				_.remove(this.CurrentRoom.mobs, function(mob) {
					return mob === self;
				});
			}
			this.CurrentRoom = pRoom;
			pRoom.mobs.push(this);
		}

	};

	this.GetRoom = function(pRoom) {
		return this.CurrentRoom;
	};

	//Properties
	Object.defineProperty(this, "Alive", {
		get: function() {
			return this.Health > this.HealthDelta;
		}
	});

	//Start AI

	this.Think = function() {
		//See what's on cooldown and when we can use it next
		if (!this.Alive)
			return false;

		this.__updateCooldowns();
		this.Brain.call(this);
	};

	this.Brain = function() {
		//Individual AI Logic goes here.
	};

	this.__updateCooldowns = function() {
		var makeAvailable = [];
		var now = Date.now();
		for (var i = 0; i < this.cooldowns.length; i++) {
			if (this.cooldowns[i].CanUseAt <= now) {
				makeAvailable.push(this.cooldowns[i]);
			}
		}

		for (var x = 0; x < makeAvailable.length; x++) {
			this.cooldowns.splice(this.cooldowns.indexOf(makeAvailable[x]), 1);
			available.push(makeAvailable[x]);
		}
	};

	this.Idle = function() {};

	this.Run = function() {};

	this.OnCooldown = function(pName) {
		return (typeof _.find(this.cooldowns, {
			Name: pName
		}) !== 'undefined');
	};

	this.UseAction = function(pName, pTarget) {
		if (!this.Alive || this.OnCooldown(pName)) {
			return false;
		}

		var actionObject = _.find(this.actions, function(pA) {
			return pA.Name == pName;
		});

		if (typeof actionObject === 'undefined')
			return false;

		//	console.log(this.Name + " used " + pName);
		actionObject.Use(this, pTarget);
		actionObject.CanUseAt = Date.now() + Math.floor(actionObject.Cooldown / this.BaseSpeed);

		available.splice(available.indexOf(actionObject), 1);
		this.cooldowns.push(actionObject);

		return false;
	};

	this.GiveAction = function(pAction) {
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

		if (typeof _.find(this.actions, function(pA) {
			return pA.Name === pAction.Name;
		}) !== 'undefined') {
			return false;
		}

		this.actions.push(pAction);
		return true;
	};

	//End AI
	this.TakeDamage = function(pDamage, pAttacker) {
		//TODO: Fix Defense algorithm
		if (!this.Alive) {
			//return;
		}

		var realHit = Math.floor(pDamage - this.BaseDefense);
		if (realHit <= 0) {
			realHit = 1;
		}
		this.HealthDelta += realHit;

		if (this.HealthDelta >= this.Health) {
			this.Kill();
		}
	};

	this.NotifyKill = function(pAttacker) {

	};

	this.GiveItem = function(pItem, pQuantity) {
		for (var i = 0; i < pQuantity; i++) {
			this.items.push(pItem);
			if ((pItem.type & ItemType.EQUIPABLE) !== 0) {
				if (pItem.Rating > this.Equipment[pItem.EquipSlot].Rating) {
					this.EquipItem(pItem);
				}
			}
		}
	};

	this.HasItem = function(pItemName, pQuantity) {
		var totalCount = 0;
		pQuantity = pQuantity || 1;

		for (var i = 0; i < this.items.length; i++) {
			if (this.items[i].Name === pItemName) {
				totalCount++;

				if (totalCount >= pQuantity) {
					return true;
				}
			}
		}

		return false;
	};

	this.TakeItem = function(pItemName, pQuantity) {
		var toRemove = 0;
		pQuantity = pQuantity || 1;

		for (var i = 0; i < this.items.length; i++) {
			if (this.items[i].Name === pItemName) {
				toRemove.push;
				if (toRemove.length === pQuantity)
					break;
			}
		}

		if (toRemove.length !== pQuantity) {
			return false;
		}

		for (var x = 0; x < toRemove.length; x++) {
			this.items.splice(toRemove[x], 1);
		}

		return true;
	};

	this.UseItem = function(pItemName) {
		if (!this.Alive || this.OnCooldown(pItemName)) {
			return false;
		}

		var item = -1;
		for (var i = 0; i < this.items.length; i++) {
			if (this.items[i].Name === pItemName) {
				item = this.items[i];
				break;
			}
		}

		if (item !== -1 && (item.Type & ItemType.USABLE) !== 0) {
			item.Use(this);
			item.CanUseAt = Date.now() + Math.floor(item.Cooldown / this.BaseSpeed);
			Lynx.Log("Hero " + this.Name + " has used a(n) " + item.Name);

			this.items.splice(item, 1);
			available.splice(available.indexOf(item), 1);
			this.cooldowns.push(item);
			return true;

		}

		return false;
	};

	this.EquipItem = function(pEquip) {
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

	this.RemoveFromGame = function() {
		World.Entities.removeEntity(this);
	};

	this.Kill = function() {
		//Lynx.Log("Entity " + this.Name + " has been killed!");
		this.RemoveFromGame();
		//World.Entities.splice(World.Entities.indexOf(this), 1);
	};
};

// Entity Definitions
//--------------------------