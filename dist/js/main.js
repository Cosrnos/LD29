Game = {
	CameraVX: 0,
	CameraVY: 0,
	ActiveMenu: null,
	Scale: 1,
	TutorialProgress: 0,

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

		Lynx.AM.QueueImage('warrior', 'assets/warrior.png');
		Lynx.AM.QueueImage('mage', 'assets/mage.png');
		Lynx.AM.QueueImage('scout', 'assets/scout.png');
		// Lynx.AM.QueueImage('e-room', 'assets/DungeonWalls/d-E.png');
		// Lynx.AM.QueueImage('w-room', 'assets/DungeonWalls/d-W.png');
		// Lynx.AM.QueueImage('n-room', 'assets/DungeonWalls/d-N.png');
		// Lynx.AM.QueueImage('s-room', 'assets/DungeonWalls/d-S.png');
		// Lynx.AM.QueueImage('ne-room', 'assets/DungeonWalls/d-NE.png');
		// Lynx.AM.QueueImage('es-room', 'assets/DungeonWalls/d-ES.png');
		// Lynx.AM.QueueImage('ew-room', 'assets/DungeonWalls/d-EW.png');
		// Lynx.AM.QueueImage('ns-room', 'assets/DungeonWalls/d-NS.png');
		// Lynx.AM.QueueImage('nw-room', 'assets/DungeonWalls/d-NW.png');
		// Lynx.AM.QueueImage('sw-room', 'assets/DungeonWalls/d-SW.png');
		// Lynx.AM.QueueImage('esw-room', 'assets/DungeonWalls/d-ESW.png');
		// Lynx.AM.QueueImage('nes-room', 'assets/DungeonWalls/d-NES.png');
		// Lynx.AM.QueueImage('new-room', 'assets/DungeonWalls/d-NEW.png');
		// Lynx.AM.QueueImage('nsw-room', 'assets/DungeonWalls/d-NSW.png');
		// Lynx.AM.QueueImage('nesw-room', 'assets/DungeonWalls/d-NESW.png');
		Lynx.AM.QueueImage('e-room', 'assets/DungeonWalls/1-E.png');
		Lynx.AM.QueueImage('w-room', 'assets/DungeonWalls/1-W.png');
		Lynx.AM.QueueImage('n-room', 'assets/DungeonWalls/1-N.png');
		Lynx.AM.QueueImage('s-room', 'assets/DungeonWalls/1-S.png');
		Lynx.AM.QueueImage('ne-room', 'assets/DungeonWalls/2-NE.png');
		Lynx.AM.QueueImage('es-room', 'assets/DungeonWalls/2-ES.png');
		Lynx.AM.QueueImage('ew-room', 'assets/DungeonWalls/2-EW.png');
		Lynx.AM.QueueImage('ns-room', 'assets/DungeonWalls/2-NS.png');
		Lynx.AM.QueueImage('nw-room', 'assets/DungeonWalls/2-NW.png');
		Lynx.AM.QueueImage('sw-room', 'assets/DungeonWalls/2-SW.png');
		Lynx.AM.QueueImage('esw-room', 'assets/DungeonWalls/3-ESW.png');
		Lynx.AM.QueueImage('nes-room', 'assets/DungeonWalls/3-NES.png');
		Lynx.AM.QueueImage('new-room', 'assets/DungeonWalls/3-NEW.png');
		Lynx.AM.QueueImage('nsw-room', 'assets/DungeonWalls/3-NSW.png');
		Lynx.AM.QueueImage('nesw-room', 'assets/DungeonWalls/4-NESW.png');

		Lynx.AM.LoadQueue(pCallback);
	},

	LoadComponents: function(pCallback) {
		Lynx.CM.Load("Tracker", "Timer", "KeyboardEvents", "MouseEvents");
		Lynx.CM.On("ComponentManager.Ready", pCallback);
	},

	SetupScene: function() {
		Lynx.Scene.On("Keyboard.Press.W", function() {
			Game.CameraVY -= 1;
		});

		Lynx.Scene.On("Keyboard.Release.W", function() {
			Game.CameraVY += 1;
		});

		Lynx.Scene.On("Keyboard.Press.S", function() {
			Game.CameraVY += 1;
		});

		Lynx.Scene.On("Keyboard.Release.S", function() {
			Game.CameraVY -= 1;
		});

		Lynx.Scene.On("Keyboard.Press.A", function() {
			Game.CameraVX -= 1;
		});

		Lynx.Scene.On("Keyboard.Release.A", function() {
			Game.CameraVX += 1;
		});

		Lynx.Scene.On("Keyboard.Press.D", function() {
			Game.CameraVX += 1;
		});

		Lynx.Scene.On("Keyboard.Release.D", function() {
			Game.CameraVX -= 1;
		});

		Lynx.Scene.On("Update", function() {
			Lynx.Scene.Camera.X += Math.floor(Game.CameraVX * (Lynx.Main.Delta / 2));
			Lynx.Scene.Camera.Y += Math.floor(Game.CameraVY * (Lynx.Main.Delta / 2));
			if (Game.ActiveMenu === UI.RoomMenu) {
				Game.ActiveMenu.MoveBy(Math.floor(Game.CameraVX * (Lynx.Main.Delta / 2)), Math.floor(Game.CameraVY * (Lynx.Main.Delta / 2)));
			}
			return true;
		});

		Lynx.Start();
	},
	ScaleEntity: function(entity) {
		entity.Scale = Game.Scale;
	},
	ScaleAllEntities: function() {
		for (var i = 0; i < Lynx.Scene.Entities.length; i++) {
			var e = Lynx.Scene.Entities[i];
			e.Scale = Game.Scale;
		}

		_.each(Lynx.Scene.Layers, function(layer) {
			_.each(layer.Elements, function(element) {
				element.Scale = Game.Scale;
			});
		});
	},
	Ready: function() {

		Lynx.Scene.AddLayer();
		Lynx.Scene.AddLayer();


		Lynx.Scene.Camera.X = -Lynx.Scene.Width / 2 + 200;
		Lynx.Scene.Camera.Y = -Lynx.Scene.Height / 2 + 150;
		var entranceRoom = new Room(0, 0);
		entranceRoom.type = new EntranceRoom(entranceRoom);

		World.Rooms.push(entranceRoom);
		entranceRoom.addRoom('e').addRoom('e').addRoom('e');
		var lastRoom = _.last(World.Rooms.content);
		lastRoom.type = new TreasureRoom(lastRoom);

		World.TreasureRoom = lastRoom;
		//walk(World.Rooms.content[0], 5, 5, 0);
		//World.Rooms.hashMap[8][5].entity.Color = 0xFF0000;

		var john = World.Entities.createEntity(Warrior);
		john.Name = "John";
		john.GiveItem(new HP10Potion(), 4);
		john.EquipItem(new WoodenStick());
		john.BaseDefense = 10;

		john.SetRoom(World.Rooms.content[0]);
		World.Stats.lira = 15;
		/*
		var hugo = World.Entities.createEntity(GiantSpider);
		hugo.Name = "Giant Spider";
		hugo.SetRoom(World.Rooms.content[0]);
		john.CurrentTarget = hugo;
*/

		john.BaseSpeed = 2;
		Lynx.Scene.On("Update", function() {
			_.each(World.Entities.content, function(entity) {
				if (entity) {
					entity.Think();
					if (entity.Draw) {
						entity.Draw();
					}
				}
			});
			return true;
		});

		window.addEventListener("mousewheel", function(event) {
			if (Game.ActiveMenu !== null) {
				return;
			}

			if (event.wheelDelta > 0) {
				Game.Scale += (event.wheelDelta * 0.001);
			} else {
				Game.Scale -= (event.wheelDelta * -0.001);
			}
			if (Game.Scale > 5)
				Game.Scale = 5;
			if (Game.Scale < 0.5)
				Game.Scale = 0.5;

			if (Game.ActiveMenu === UI.RoomMenu) {
				//				Game.ActiveMenu.Scale = Game.Scale;
			}

			Game.ScaleAllEntities();
		}, false);

		Lynx.Scene.On("MouseEvents.Click", function(pMousePosition) {
			var gamePos = Viewport.ParseMousePosition(pMousePosition.X, pMousePosition.Y);
			if (Game.ActiveMenu !== null) {
				if (Game.ActiveMenu.Disposed) {
					Game.ActiveMenu = null;
				}
				return true;
			}
			//Test for Room Menu
			var room = World.Rooms.findRoom(Math.floor(gamePos.X / (World.Rooms.roomSize * Game.Scale)), Math.floor(gamePos.Y / (World.Rooms.roomSize * Game.Scale)));
			if (typeof room !== 'undefined') {
				if (Game.TutorialProgress === 0 && !(room.type instanceof EmptyRoom))
					return true;

				UI.RoomMenu.Target = room;
				if (room.type instanceof EmptyRoom)
					UI.RoomMenu.NodeChange.Element.innerHTML = "Add Node &raquo;";
				else
					UI.RoomMenu.NodeChange.Element.innerHTML = "Change Node &raquo;";

				if (room.type instanceof TreasureRoom || room.type instanceof EntranceRoom)
					UI.RoomMenu.NodeOption.Show = false;
				else
					UI.RoomMenu.NodeOption.Show = true;

				if (room.type instanceof EmptyRoom || room.type instanceof TreasureRoom || room.type instanceof EntranceRoom)
					UI.RoomMenu.RemoveNodeOption.Show = false;
				else
					UI.RoomMenu.RemoveNodeOption.Show = true;

				UI.RoomMenu.Name = "Room #" + room.id;
				UI.RoomMenu.ShowAt(pMousePosition.X, pMousePosition.Y);
				if (Game.TutorialProgress === 0) {
					tutorialAboutNodes.savePos(pMousePosition.X, pMousePosition.Y);
					tutorialAboutNodes.Show();
				}
				return true;
			}
		});

		//Scale entities to default scale
		Game.ScaleAllEntities();

		//UI.Out.UpdateExpbar(500000, 2000000);
		welcomeMessage.Show();
	}
};
Actions = [];

var Action = function(pName, pCooldown) {
	this.Name = pName || "";
	this.Cooldown = pCooldown || 500;
	this.CanUseAt = 0;
	this.Use = function(pEntity) {};

	Actions.push(this);
};
var Item = function(pName) {
	this.Name = pName;
	this.Type = ItemType.JUNK;
	this.EquipSlot = EquipSlot.NONE;
	this.Use = function(pHero) {};
	this.Cost = 1;
	this.Equip = function(pHero) {};
	this.Unequip = function(pHero) {};
	this.Rating = 0;
	this.Cooldown = 1000;
	this.CanUseAt = 0;
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
var Menu = function (pName, pClose) {
	this.Target = null;
	this.Disposed = true;
	this.Name = pName;
	
	var x = 0;
	var y = 0;
	var scale = 1;
	
	Object.defineProperty(this, "X", {
		get: function(){
			return x * scale;
		},
		set: function(pX){
			x = pX;
		}
	});
	
	Object.defineProperty(this, "Y", {
		get: function(){
			return y * scale;
		},
		set: function(pY){
			y = pY;
		}
	});
		
	pClose = pClose || true;

	var options = [];

	var element = document.createElement("div");
	element.id = "ui-" + pName;
	element.style.position = "absolute";
	element.style.zIndex = 9;
	element.style.position.top = 0;
	element.style.position.left = 0;
	element.style.background = "#c7b299";
	element.style.padding = "10px 10px";
	element.style.width = "300px";
	element.style.border = "3px solid #362f2d";
	element.style.borderRadius = "5px";

	element.style.visibility = "hidden";
	var Option = function (pName, pClickCallback, pParent) {
		var that = {};
		that.Parent = pParent;
		that.Show = true;
		that.Name = pName;

		that.Element = document.createElement("button");
		that.Element.innerHTML = pName;
		that.Element.style.background = "#362f2d";
		that.Element.style.border = "1px solid #000000";
		that.Element.style.borderRadius = "5px";

		that.Element.style.width = "100%";
		that.Element.style.display = "block";
		that.Element.style.color = "#ffffff";
		that.Element.style.fontSize = "18px";
		that.Element.style.outline = "0px";
		that.Element.style.cursor = "pointer";

		that.Element.onmouseover = function () {
			that.Element.style.background = "#534741";
		};

		that.Element.onmouseout = function () {
			that.Element.style.background = "#362f2d";
		};

		that.Element.onclick = function (e) {
			if (pClickCallback.call(pParent.Target))
				pParent.Hide();

			e.preventDefault();
		};

		return that;
	};

	this.AddOption = (function (pName, pClickCallback) {
		var o = new Option(pName, pClickCallback, this);
		options.push(o);
		return o;
	}).bind(this);

	this.RemoveOption = function (pO) {
		if (options.indexOf(pO) > -1) {
			options.splice(options.indexOf(pO), 1);
		}
	};

	this.MoveBy = function (pX, pY) {
		if (pX === 0 && pY === 0)
			return;

		x = x - pX;
		y = y - pY;
		this.CalculatePosition();
	}

	this.ShowAt = function (pX, pY) {
		this.X = pX;
		this.Y = pY;
		//Rebuild
		element.innerHTML = "";
		var menuHead = document.createElement("h3");
		menuHead.style.fontSize = "22px";
		menuHead.style.color = "#333333";
		menuHead.style.margin = "0px";
		menuHead.style.padding = "0px 0px 10px 10px";
		menuHead.style.textDecoration = "underline";
		menuHead.innerHTML = this.Name;
		element.appendChild(menuHead);

		for (var i = 0; i < options.length; i++) {
			if(options[i].Show)
				element.appendChild(options[i].Element);
		}
		if (pClose) {
			element.appendChild(new Option("Close", function () {
				return true;
			}, this).Element);
		}
		element.style.left = this.X + "px";
		element.style.top = this.Y + "px";
		element.style.visibility = "visible";
		this.Disposed = false;
		Game.ActiveMenu = this;
	};
	
	Object.defineProperty(this, "Scale", {
		get: function(){
			return scale;
		},
		set: function(pValue){
			scale = pValue;
			this.CalculatePosition();
		}
	});
	
	this.CalculatePosition = function(){
		element.style.top = this.Y + "px";
		element.style.left = this.X + "px";	
	};

	this.Hide = function () {
		element.style.visibility = "hidden";
		this.Disposed = true;
	};

	document.body.appendChild(element);
}

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
var UI = UI || {};

UI.AddNodeMenu = new Menu("Add/Change Node", true);

UI.AddNodeMenu.AddOption("Trogs", function() {
	this.type = new TrogRoom(this);
	return true;
});

UI.AddNodeMenu.AddOption("Spiders", function() {
	this.type = new SpiderRoom(this);
	return true;
});

UI.AddNodeMenu.AddOption("Treasure", function() {
	this.type = new TreasureRoom(this);
	return true;
});
var Message = function(pHeader, pContent, pCallback)
{
	this.Disposed = true;
	
	this.AcceptButton = {
		Text: "Continue",
		Callback: pCallback
	};
	
	this.DenyButton = {
		Text: "Cancel",
		Callback: function(){}.bind,
		Show: false
	};
	
	this.Header = pHeader;
	this.Content = pContent;
	
	this.Show = function(){
		document.getElementById("messageHeader").innerHTML = this.Header;
		document.getElementById("messageBlock").innerHTML = this.Content;
		
		document.getElementById("messageConfirm").innerHTML = this.AcceptButton.Text;
		document.getElementById("messageConfirm").onclick = this.AcceptButton.Callback.bind(this);
		
		var deny = document.getElementById("messageCancel");
		if(this.DenyButton.Show)
		{
			deny.style.visibility = "visible";
			deny.onclick = this.DenyButton.Callback.bind(this);
		}
		else
		{
			deny.style.visibility = "hidden";	
			deny.onclick = function(){};
		}
		document.getElementById("fader-container").style.visibility = "visible";
		this.Disposed = false;
		Game.ActiveMenu = this;
	}
	
	this.Hide = function(){
		document.getElementById("fader-container").style.visibility = "hidden";
		this.Disposed = true;
	};
	
};
var UI = UI || {};

UI.Out = new(function() {
	var that = {};
	var lvlOut = document.getElementById("stat-level-out");
	var expOut = document.getElementById("stat-exp-out");
	var liraOut = document.getElementById("stat-lira-out");
	var domaOut = document.getElementById("stat-doma-out");

	Object.defineProperty(that, "Level", {
		set: function(pValue) {
			lvlOut.innerHTML = pValue;
		}
	});

	Object.defineProperty(that, "Experience", {
		set: function(pValue) {
			expOut.innerHTML = pValue;
		}
	});

	Object.defineProperty(that, "ExperienceBar", {
		set: function(pValue) {
			document.getElementById("stat-expbar-out").style.width = pValue + "%";
		}
	});

	Object.defineProperty(that, "Lira", {
		set: function(pValue) {
			liraOut.innerHTML = pValue;
		}
	});

	Object.defineProperty(that, "Doma", {
		set: function(pValue) {
			domaOut.innerHTML = pValue;
		}
	});


	that.UpdateExpbar = function(pCurrent, pTotal) {
		var progress = Math.floor((pCurrent / pTotal) * 100);
		that.Experience = pCurrent;
		that.ExperienceBar = progress;
	};
	return that;
})();
var UI = UI || {};

UI.RoomMenu = new Menu("Room", true);
UI.RoomMenu.NodeChange = UI.RoomMenu.AddOption("Add Node &raquo;", function() {
	UI.RoomMenu.Hide();
	UI.AddNodeMenu.Target = this;
	UI.AddNodeMenu.ShowAt(UI.RoomMenu.X, UI.RoomMenu.Y);
	return true;
});
UI.RoomMenu.AddOption("Kill Mobs", function() {
	while (this.mobs.length > 0)
		this.mobs[0].Kill();

	return true;
});
UI.RoomMenu.AddOption("Remove Nodes", function() {
	this.type = new EmptyRoom(this);
	return true;
});

UI.RoomMenu.AddOption("Dig Some!!", function() {
	walk(this, 4, World.Rooms.content.length + 5, 0);
	return true;
});

UI.RoomMenu.AddOption("Spawn Player", function() {
	var type = Warrior;
	if (Date.now() % 2 === 0)
		type = Mage;

	var newEntity = World.Entities.createEntity(type);
	newEntity.Name = "Hero #0x" + Date.now().toString(16);
	newEntity.BaseAttack = 5;
	newEntity.BaseMagic = 5;
	newEntity.BaseDefense = 10;

	newEntity.SetRoom(this);
	return true;
});
var UI = UI || {};

UI.AddNodeMenu = new Menu("Add/Change Node", true);

UI.AddNodeMenu.TrogOption = UI.AddNodeMenu.AddOption("Trogs (15 Lira)", function() {
	if(World.Stats.lira < 15)
	{
		Lynx.Log("You don't have enough Lira for that action!");
		return true;
	}
	World.Stats.lira -= 15;
	this.type = new TrogRoom(this);
	return true;
});

UI.AddNodeMenu.AddOption("Spiders (30 Lira)", function() {
	if(World.Stats.lira < 30)
	{
		Lynx.Log("You don't have enough Lira for that action!");
		return true;
	}
	World.Stats.lira -= 30;
	this.type = new SpiderRoom(this);
	return true;
});

UI.AddNodeMenu.AddOption("DBG Treasure", function() {
	this.type = new TreasureRoom(this);
	return true;
});
var UI = UI || {};

UI.RoomMenu = new Menu("Room", true);

UI.RoomMenu.NodeOption = UI.RoomMenu.NodeChange = UI.RoomMenu.AddOption("Add Node &raquo;", function() {
	UI.RoomMenu.Hide();
	UI.AddNodeMenu.Target = this;
	UI.AddNodeMenu.ShowAt(UI.RoomMenu.X, UI.RoomMenu.Y);
	return true;
});

UI.RoomMenu.KillOption = UI.RoomMenu.AddOption("Kill Mobs", function() {
	while (this.mobs.length > 0)
		this.mobs[0].Kill();

	return true;
});

UI.RoomMenu.RemoveNodeOption = UI.RoomMenu.AddOption("Remove Nodes", function() {
	this.type = new EmptyRoom(this);
	return true;
});

UI.RoomMenu.DigOption = UI.RoomMenu.AddOption("Dig Some!!", function() {
	walk(this, 4, World.Rooms.content.length + 5, 0);
	return true;
});

UI.RoomMenu.SpawnPlayerOption = UI.RoomMenu.AddOption("Spawn Player", function() {
	var type = Warrior;
	if (Date.now() % 2 === 0)
		type = Mage;

	var newEntity = World.Entities.createEntity(type);
	newEntity.Name = "Hero #0x" + Date.now().toString(16);
	newEntity.BaseAttack = 5;
	newEntity.BaseMagic = 5;
	newEntity.BaseDefense = 10;

	newEntity.SetRoom(this);
	return true;
});
var testMessage = new Message("Test", "Testing testing testing", function(){
	this.Hide();
});
var tutorialAboutNodes = new Message("Nodes", (([
	"<p>Great job! Clicking on a room opens a menu of available actions for that room. The first option is Adding or Changing <strong>Nodes</strong>. A Node is anything that can spawn a monster. When you add or change a node, you can select what kind of monster to spawn. Each monster costs a certain amount of <strong>Lira,</strong>, <strong>Doma</strong> or both! Lira is obtained for every player that completes the dungeon, and doma for every player that dies. You only get Lira or Doma if the player has killed at least one enemy!</p>",
	"<p>Right now, there are no enemies for our dungeon, so you aren't getting any resources. Let's spend all our Lira and create a <strong>Trog</strong> node!</p>"]).join("\r\n")), function(){
	Game.TutorialProgress++;
	this.Hide();
	UI.RoomMenu.ShowAt(tutorialAboutNodes.SavedX, tutorialAboutNodes.SavedY);
});
tutorialAboutNodes.SavedX = 0;
tutorialAboutNodes.SavedY = 0;
tutorialAboutNodes.savePos = function(pX, pY){
	this.SavedX = pX;
	this.SavedY = pY;
}

tutorialAboutNodes.AcceptButton.Text = "Okay!";
var welcomeMessage = new Message("You are the Dungeon!", (([
	"<p>Welcome to <strong>You are the Dungeon!</strong> In this game you get to dive beneath the surface of a dungeon and actually become the dungeon! As you grow, you'll need to become more challenging to attract more heroes to travel through your corridors and give you resources. Spawn more enemies and become the most notorious dungeon in the land!</p>",
	"<p>Let's get started by learning how to play!</p>"]).join("\r\n")), function(){
	this.Hide();
	tutorialFirstScreen.Show();
});

welcomeMessage.AcceptButton.Text = "Continue";

var tutorialFirstScreen = new Message("Getting started", (([
	"<p>Over to your right is a sidebar showing all your stats! You start out at Level 1, and every player that reaches your treasure room will award you the amount of experience gained throughout the dungeon (So if they dont' kill anything, you don't get experience!) Every time you gain a level, you'll grow bigger and have more room for monsters!</p>",
	"<p>The icons below your experience bar are <strong>Lira</strong> and <strong>Doma</strong>. These are resources earned for each player that reaches your reward room or dies.</p>",
	"<p>You can't earn anything if you don't have any monsters though, so let's start with that! Click on any empty (pink) room to open the room menu!</p>"]).join("\r\n")), function(){
	this.Hide();
});

var AttackAction = new Action("Attack", 500);

AttackAction.Use = function (pEntity, pTarget) {
	pTarget.TakeDamage(pEntity.BaseAttack, pEntity);
};
var BiteAction = new Action("Bite", 1500);
BiteAction.Use = function (pEntity, pTarget) {
	pTarget.TakeDamage(pEntity.BaseAttack * 1.2, pEntity);
};
var FireblastAction = new Action("Fireblast", 2000);

FireblastAction.Use = function(pEntity, pTarget) {
	console.log('Fireblast!')
	pTarget.TakeDamage(pEntity.BaseMagic * 1.5, pEntity);
};
var HeavyAttackAction = new Action("Heavy Attack", 1000);

HeavyAttackAction.Use = function (pEntity, pTarget) {
	pTarget.TakeDamage(pEntity.BaseAttack * 1.5, pEntity);
};
var MoveAction = new Action("Move", 2000);

MoveAction.Use = function(pEntity) {

	if (Math.random() > 0.6) {
		var currentRoom = pEntity.GetRoom();
		var directions = currentRoom.getMovableDirs();
		pEntity.Move(_.sample(directions));
	}
};


var HeroMoveAction = new Action("HeroMove", 2000);
HeroMoveAction.Use = function(pEntity) {
	var lastMoveDirection = pEntity.lastMoveDirection;
	if (Math.random() > 0.6) {
		var currentRoom = pEntity.GetRoom();
		var directions = currentRoom.getMovableDirs();
		if (directions.length > 1 && lastMoveDirection) {
			var remove = undefined;
			if (lastMoveDirection === 'n') {
				remove = 's';
			} else if (lastMoveDirection === 's') {
				remove = 'n'
			} else if (lastMoveDirection === 'e') {
				remove = 'w'
			} else if (lastMoveDirection === 'w') {
				remove = 'e'
			}

			_.remove(directions, function(dir) {
				return dir === remove;
			});
		}
		pEntity.Move(_.sample(directions));
	}
};

//The scout move is very fast, and heals the scout 1 HP
//for every move;
var ScoutMoveAction = new Action("ScoutMoveAction", 250);
ScoutMoveAction.Use = function(pEntity) {
	var lastMoveDirection = pEntity.lastMoveDirection;
	if (Math.random() > 0.6) {
		var currentRoom = pEntity.GetRoom();
		var directions = currentRoom.getMovableDirs();
		if (directions.length > 1 && lastMoveDirection) {
			var remove = undefined;
			if (lastMoveDirection === 'n') {
				remove = 's';
			} else if (lastMoveDirection === 's') {
				remove = 'n'
			} else if (lastMoveDirection === 'e') {
				remove = 'w'
			} else if (lastMoveDirection === 'w') {
				remove = 'e'
			}

			_.remove(directions, function(dir) {
				return dir === remove;
			});
		}

		//Heal!
		pEntity.HealthDelta -= 1;
		if (pEntity.HealthDelta < 0) {
			pEntity.HealthDelta = 0;
		}

		pEntity.Move(_.sample(directions));
	}
};
var Enemy = function() {
	Entity.apply(this);
	var move = (Object.create(MoveAction));
	this.actions.push(move);

	this.Drops = [];

	this.Color = 0x0000ff;
	var originalTakeDamage = this.TakeDamage;
	//Add hallway

	this.xOffSet = 7; //Enemys line up on the left side of a room.


	this.AddDrop = function(pItem, pChance) {
		var drop = Object.create(pItem);
		pItem.Chance = pChance;
		this.Drops.push(pItem);
	};

	this.TakeDamage = function(pAmount, pAttacker) {
		originalTakeDamage.call(this, pAmount, pAttacker);
		this.CurrentTarget = pAttacker;
	}

	this.Brain = function() {
		var thinking = true;
		while (thinking) {
			if (this.CurrentTarget !== null) {
				if (!this.OnCooldown("Attack")) {
					this.UseAction("Attack", this.CurrentTarget);
					continue;
				}
			} else {
				var heroInRoom = _.find(this.GetRoom().mobs, function(pa) {
					return pa instanceof Hero
				});
				if (typeof heroInRoom !== 'undefined') {
					this.CurrentTarget = heroInRoom;
					continue;
				}

				if (!this.OnCooldown("Move")) {
					this.UseAction("Move");
					continue;
				}
			}

			thinking = false;
		}
	}

	this.Kill = function() {
		Lynx.Log("Enemy " + this.Species + " has been killed!");

		var self = this;
		var attackers = _.filter(World.Entities.content, function(mob) {
			return mob.CurrentTarget === self;
		});

		var numAttackers = attackers.length;

		//RECALCULATE THE EXPERIENCE GIVEN DEPENDING ON THE NUMBER OF ATTACKERS!!!
		//This forumla boosts the experience gained based with the number of attackers then
		//divies it up.
		this.Exp = Math.ceil((this.Exp / numAttackers) * (1 + 0.25 * (numAttackers - 1)));

		_.each(attackers, (function(pAttacker) {
			if (this.Drops.length > 0) {
				var totalChance = this.Drops.length * 100;
				var dropChance = 0;
				var currentChanceRate = 0;
				_.each(this.Drops, function(pDrop) {
					dropChance += pDrop.Chance;
				});
				var roll = Math.floor(Math.random() * totalChance);

				_.each(this.Drops, function(pDrop) {
					if (roll <= pDrop.Chance + currentChanceRate) {
						//Drop found.
						pAttacker.GiveItem(Object.create(pDrop));
						Lynx.Log(pAttacker.Name + " picked up a(n) " + pDrop.Name);
						return;
					} else {
						currentChanceRate += pDrop.Chance;
					}
				});
			}

			pAttacker.CurrentTarget = null;
			pAttacker.NotifyKill(self);


		}).bind(this));

		Lynx.Scene.Layers[2].RemoveEntity(this.entity);

		this.RemoveFromGame();
	};
};

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

//Enemy Definitions
//-----------------------------

//Level 1-5
var Trog = function() {
	Enemy.apply(this);
	this.Species = "Trog";
	this.Exp = 40;
	this.Gold = 25;
	this.Health = 5;
	this.Mana = 0;
	this.BaseDefense = 0;
	this.AddDrop(new HP10Potion(), 10);
	this.AddDrop(new WoodenStick(), 5);
	this.AddDrop(new TatteredClothes(), 5);
	this.AddDrop(new Ring(), 5);
};

Trog.prototype = new Enemy();
Trog.prototype.constructor = Trog;

var Spider = function() {
	Enemy.apply(this);
	this.Species = "Spider";
	this.Level = 3;
	this.Exp = 60;
	this.BaseAttack = 2;
	this.Gold = 25;
	this.Health = 7;
	this.Mana = 0;
	this.AddDrop(new HP10Potion(), 15);
	this.AddDrop(new WoodenStick(), 5);
	this.AddDrop(new TatteredClothes(), 5);
	this.AddDrop(new Ring(), 5);
	this.Color = 0x000000;
};

Spider.prototype = new Enemy();
Spider.prototype.constructor = Spider;

var Bat = function() {
	Enemy.apply(this);
	this.Species = "Bat";
	this.Level = 5;
	this.Exp = 90;
	this.Gold = 25;
	this.BaseAttack = 3;
	this.Health = 10;
	this.Mana = 0;
	this.AddDrop(new HP10Potion(), 20);
	this.AddDrop(new WoodenStick(), 10);
	this.AddDrop(new TatteredClothes(), 10);
	this.AddDrop(new Ring(), 10);
};

Bat.prototype = new Enemy();
Bat.prototype.constructor = Bat;

//Level 6-10
var Goblin = function() {
	Enemy.apply(this);
	this.Species = "Goblin";
	this.Level = 7;
	this.Exp = 125;
	this.Gold = 25;
	this.BaseAttack = 3;
	this.BaseDefense = 2;
	this.Health = 15;
	this.Mana = 0;
	this.AddDrop(new HP10Potion(), 20);
	this.AddDrop(new WoodenStick(), 15);
	this.AddDrop(new TatteredClothes(), 15);
	this.AddDrop(new Ring(), 15);
};

Goblin.prototype = new Enemy();
Goblin.prototype.constructor = Goblin;

var GiantSpider = function() {
	Enemy.apply(this);
	this.Species = "Giant Spider";
	this.Level = 10;
	this.BaseAttack = 5;
	this.BaseDefense = 3;
	this.Exp = 200;
	this.Health = 20;

	this.Color = 0xffffff;

	this.Brain = function() {
		var thinking = true;
		while (thinking) {
			if (this.CurrentTarget !== null) {
				if (!this.OnCooldown("Attack")) {
					this.UseAction("Attack", this.CurrentTarget);
					continue;
				}

				if (!this.OnCooldown("Bite")) {
					this.UseAction("Bite", this.CurrentTarget);
					continue;
				}
			} else {
				var heroInRoom = _.find(this.GetRoom().mobs, function(pa) {
					return pa instanceof Hero
				});
				if (typeof heroInRoom !== 'undefined') {
					this.CurrentTarget = heroInRoom;
					continue;
				}

				if (!this.OnCooldown("Move")) {
					if (!this.CurrentTarget) {
						this.UseAction("Move");
						continue;
					}
				}
			}

			thinking = false;
		}
	}

	this.GiveAction("Bite");
	this.AddDrop(new BronzeSword(), 20);
};

GiantSpider.prototype.constructor = GiantSpider;
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

	this.image = null;
	this.xOffSet = 31;
	// this.Draw = function() {
	// 	//debugger;
	// 	var currentRoom = this.GetRoom();
	// 	if (currentRoom) {
	// 		if (!this.entity) {
	// 			//this.entity = new Lynx.Entity(World.Rooms.roomSize * currentRoom.x + 35, World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 1, 4, 4);
	// 			if (this.image) {
	// 				this.entity = new Lynx.Entity(this.image);
	// 				this.entity.Height = 10;
	// 				this.entity.Width = 10;
	// 				this.entity.X = World.Rooms.roomSize * currentRoom.x + 28;
	// 				this.entity.Y = World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 1;
	// 			} else {
	// 				this.entity = new Lynx.Entity(World.Rooms.roomSize * currentRoom.x + 31, World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 1, 4, 4);
	// 				//this.entity.Color = this.Color;
	// 				this.entity.Color = 0x009933;
	// 			}

	// 			Game.ScaleEntity(this.entity);
	// 			Lynx.Scene.Layers[2].AddEntity(this.entity);

	// 		} else {
	// 			if (this.image) {
	// 				this.entity.X = World.Rooms.roomSize * currentRoom.x + 28;
	// 				this.entity.Y = World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 1;
	// 			} else {
	// 				this.entity.X = World.Rooms.roomSize * currentRoom.x + 31;
	// 				this.entity.Y = World.Rooms.roomSize * currentRoom.y + currentRoom.mobs.indexOf(this) * 5 + 1;
	// 			}
	// 		}
	// 	}
	// };

	Object.defineProperty(this, "Experience", {
		get: function() {
			return totalExp;
		},
		set: function(pValue) {
			totalExp = pValue;

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
		this.expGainedInDungeon += pEntityKilled.Exp;
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

		Lynx.Scene.Layers[2].RemoveEntity(this.entity);
		this.RemoveFromGame();
	};
};

Hero.prototype = new Entity();
Hero.prototype.constructor = Hero;

// Hero Definitions
//----------------------------
// Mage
//--------------------------

var Mage = function(pName) {
	Hero.apply(this);
	this.Class = HeroClass.Mage;
	this.Name = pName || "Mage";
	this.HeroType = "MAGE";
	this.image = Lynx.AM.Get("mage").Asset;

	this.GiveAction("Fireblast");

	this.LevelUp = function() {
		this.Health += 2;
		this.BaseAttack += 1;
		this.BaseMagic += 2;
		Lynx.Log("Hero " + this.Name + " Has leveled up! (" + this.Level + ")");
	};

	this.Brain = function() {
		var thinking = true;
		while (thinking) {
			if (this.CurrentTarget !== null) {
				if (!this.OnCooldown("Attack")) {
					Lynx.Log(this.Name + " is attacking!");
					this.UseAction("Attack", this.CurrentTarget);
					continue;
				}

				if (!this.OnCooldown("Fireblast")) {
					this.UseAction("Fireblast", this.CurrentTarget);
					continue;
				};
				if (!this.OnCooldown("HP 10 Potion")) {
					//Only try to use if health is at 30%
					if (this.HealthDelta >= this.Health * 0.7) {
						var result = this.UseItem("HP 10 Potion", this);
						if (result) {
							continue;
						}
					}
				};


			} else {
				var enemyInRoom = _.find(this.GetRoom().mobs, function(pa) {
					return pa instanceof Enemy
				});
				if (typeof enemyInRoom !== 'undefined') {
					this.CurrentTarget = enemyInRoom;
					continue;
				}

				//If we're in the TreasureRoom and not fighting, ASCEND!
				if (this.GetRoom().type instanceof TreasureRoom) {
					this.GetRoom().type.Ascend(this);
				}

				if (!this.OnCooldown("HeroMove")) {
					this.UseAction("HeroMove");
					continue;
				}
			}
			thinking = false;
		}
	};
};

Mage.prototype = new Hero();
Mage.prototype.constructor = Mage;
// Mage
//--------------------------

var Scout = function(pName) {
	Hero.apply(this);
	this.Class = HeroClass.Scout;
	this.Name = pName || "Scout";
	this.HeroType = "SCOUT";
	this.image = Lynx.AM.Get("scout").Asset;

	//this.GiveAction("Fireblast");

	var move = (Object.create(ScoutMoveAction));
	this.actions.push(move);

	this.LevelUp = function() {
		this.Health += 1;
		this.BaseAttack += (1 % 2); //Gain Attack every other level.
		Lynx.Log("Hero " + this.Name + " Has leveled up! (" + this.Level + ")");
	};

	this.Brain = function() {
		var thinking = true;
		while (thinking) {
			if (this.CurrentTarget !== null) {
				if (!this.OnCooldown("Attack")) {
					Lynx.Log(this.Name + " is attacking!");
					this.UseAction("Attack", this.CurrentTarget);
					continue;
				}

				// if (!this.OnCooldown("Fireblast")) {
				// 	this.UseAction("Fireblast", this.CurrentTarget);
				// 	continue;
				// };
				if (!this.OnCooldown("HP 10 Potion")) {
					//Only try to use if health is at 30%
					if (this.HealthDelta >= this.Health * 0.7) {
						var result = this.UseItem("HP 10 Potion", this);
						if (result) {
							continue;
						}
					}
				};


			} else {
				var enemyInRoom = _.find(this.GetRoom().mobs, function(pa) {
					return pa instanceof Enemy
				});
				if (typeof enemyInRoom !== 'undefined') {
					this.CurrentTarget = enemyInRoom;
					continue;
				}

				//If we're in the TreasureRoom and not fighting, ASCEND!
				if (this.GetRoom().type instanceof TreasureRoom) {
					this.GetRoom().type.Ascend(this);
				}

				if (!this.OnCooldown("ScoutMoveAction")) {
					this.UseAction("ScoutMoveAction");
					continue;
				}
			}
			thinking = false;
		}
	};
};

Scout.prototype = new Hero();
Scout.prototype.constructor = Scout;
// Warrior
//--------------------------

var Warrior = function(pName) {
	Hero.apply(this);
	this.HeroType = "WARRIOR";
	this.Class = HeroClass.WARRIOR;
	this.Name = pName || "WARRIOR";

	this.image = Lynx.AM.Get('warrior').Asset;

	this.GiveAction("Heavy Attack");

	this.LevelUp = function() {
		this.Health += 2;
		this.BaseAttack += 2;
		Lynx.Log("Hero " + this.Name + " Has leveled up! (" + this.Level + ")");
	};

	this.Brain = function() {
		var thinking = true;
		while (thinking) {
			if (this.CurrentTarget !== null) {
				if (!this.OnCooldown("Attack")) {
					this.UseAction("Attack", this.CurrentTarget);
					continue;
				}

				if (!this.OnCooldown("Heavy Attack")) {
					this.UseAction("Heavy Attack", this.CurrentTarget);
					continue;
				}

				if (!this.OnCooldown("HP 10 Potion")) {
					//Only try to use if health is at 30%
					if (this.HealthDelta >= this.Health * 0.7) {
						var result = this.UseItem("HP 10 Potion", this);
						if (result) {
							continue;
						}
					}
				};

			} else {
				var enemyInRoom = _.find(this.GetRoom().mobs, function(pa) {
					return pa instanceof Enemy
				});
				if (typeof enemyInRoom !== 'undefined') {
					this.CurrentTarget = enemyInRoom;
					continue;
				}

				//If we're in the TreasureRoom and not fighting, ASCEND!
				if (this.GetRoom().type instanceof TreasureRoom) {
					this.GetRoom().type.Ascend(this);
				}

				if (!this.OnCooldown("HeroMove")) {
					this.UseAction("HeroMove");
					continue;
				}

			}
			thinking = false;
		}
	};
};

Warrior.prototype = new Hero();
Warrior.prototype.constructor = Warrior;
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
		var foundRoom = _.find(this.content, function(room) {
			if (room.x === x && room.y === y) {
				return true;
			}
		});
		return foundRoom;
	}
};

//This is the base RoomType type.
var EmptyRoom = function(parent) {
	this.parent = parent;
	this.destroy = function() {};
	this.Color = 0xDEADBE;
};

var Room = function(x, y) {

	this.id = 0;
	//position of this room.
	this.x = x;
	this.y = y;

	this.depth = 0;

	//Links to other rooms.
	this.North = null;
	this.South = null;
	this.East = null;
	this.West = null;

	this.name = '';
	var type = new EmptyRoom(this); //The type of room this is.
	this.mobs = []; //A list of creatures in the room.

	this.entity = new Lynx.CE(World.Rooms.roomSize * x, World.Rooms.roomSize * y, World.Rooms.roomSize, World.Rooms.roomSize);
	this.entity.Color = 0xDEADBE;

	this.background = new Lynx.Entity(World.Rooms.roomSize * x, World.Rooms.roomSize * y, World.Rooms.roomSize, World.Rooms.roomSize);
	this.background.Texture = Lynx.AM.Get('nesw-room').Asset;

	Lynx.Scene.Layers[0].AddElement(this.entity);
	Lynx.Scene.Layers[1].AddEntity(this.background);


	Object.defineProperty(this, "type", {
		get: function() {
			return type;
		},
		set: function(newRoom) {
			if (type) {
				type.destroy();
			}
			type = newRoom;
			if (newRoom.Color) {
				this.entity.Color = newRoom.Color;
			}

		}
	});

	//Returns an array of movable directions form this room.
	this.getMovableDirs = function() {
		var dirs = [];
		if (this.North) {
			dirs.push('n');
		}
		if (this.East) {
			dirs.push('e');
		}
		if (this.South) {
			dirs.push('s');
		}
		if (this.West) {
			dirs.push('w');
		}
		return dirs;
	};

	//Picks a random exit from this room and returns that room.
	this.randomExit = function() {
		var dir = _.sample(this.getMovableDirs());

		if (dir === 'n') {
			return this.North;
		}
		if (dir === 's') {
			return this.South;
		}
		if (dir === 'e') {
			return this.East;
		}
		if (dir === 'w') {
			return this.West;
		}
		return false;
	};


	//This add a room or creates a connection to an already existing room in the specified direction.
	this.addRoom = function(direction) {
		var newRoom;
		var error = '';
		var roomSize = World.Rooms.roomSize;

		direction = direction.toLowerCase();
		if (direction === "n" || direction === "north") {
			if (this.North === null) {
				//Check to see if thee is a room in that direction that this room isn't yet connected to.
				var foundRoom = World.Rooms.findRoom(x, y - 1);
				if (foundRoom) {
					this.North = foundRoom;
					foundRoom.South = this;
				} else {
					newRoom = new Room(x, y - 1);
					this.North = newRoom;
					newRoom.South = this;
				}

			} else {
				error = "Room to the North already exists.";
			}

		} else if (direction === "s" || direction === "south") {

			if (this.South === null) {
				var foundRoom = World.Rooms.findRoom(x, y + 1);
				if (foundRoom) {
					this.South = foundRoom;
					foundRoom.North = this;
				} else {
					newRoom = new Room(x, y + 1);
					this.South = newRoom;
					newRoom.North = this;
				}

			} else {
				error = "Room to the South already exists.";
			}

		} else if (direction === "e" || direction === "east") {
			if (this.East === null) {
				var foundRoom = World.Rooms.findRoom(x + 1, y);
				if (foundRoom) {
					this.East = foundRoom;
					foundRoom.West = this;
				} else {
					newRoom = new Room(x + 1, y);
					this.East = newRoom;
					newRoom.West = this;
				}

			} else {
				error = "Room to the East already exists.";
			}
		} else if (direction === "w" || direction === "west") {

			if (this.West === null) {
				var foundRoom = World.Rooms.findRoom(x - 1, y);
				if (foundRoom) {
					this.West = foundRoom;
					foundRoom.East = this;
				} else {
					newRoom = new Room(x - 1, y);
					this.West = newRoom;
					newRoom.East = this;
				}

			} else {
				error = "Room to the West already exists.";
			}

		} else {
			error = 'No/Invalid Direction Specified When Creating Room';
		}

		if (error) {
			//console.log(error)
			delete newRoom;
			return false;
		}

		var roomAssetName = this.getMovableDirs().join('') + "-room";
		this.background.Texture = Lynx.AM.Get(roomAssetName).Asset;

		if (newRoom) {
			//newRoom.type = new EmptyRoom(this);
			var roomAssetName = newRoom.getMovableDirs().join('') + "-room";
			newRoom.background.Texture = Lynx.AM.Get(roomAssetName).Asset;

			newRoom.depth = this.depth + 1;
			newRoom.id = World.Rooms.content.length;
			World.Rooms.push(newRoom);

			return newRoom;
		} else if (foundRoom) {
			var roomAssetName = foundRoom.getMovableDirs().join('') + "-room";
			foundRoom.background.Texture = Lynx.AM.Get(roomAssetName).Asset;
			return foundRoom
		} else
			return false;
	}
};


//This creates a kinda-random dungeon, starting from 'room'
walk = function(room, maxGain) {
	var gained = 0;

	var createRooms = function(room, depth) {
		if (!room || gained >= maxGain) {
			return;
		}
		//Randomly create rooms in each direction.
		var dir = _.sample(['n', 's', 'w', 'e']);

		if (gained < maxGain) {
			if (room.addRoom(dir)) {
				gained++;

				if (dir === 'n') {
					createRooms(room.North, depth + 1);
				} else if (dir === 's') {
					createRooms(room.South, depth + 1);
				} else if (dir === 'e') {
					createRooms(room.East, depth + 1);
				} else if (dir === 'w') {
					createRooms(room.West, depth + 1);
				}
			}
		}
	}

	//var initialRoomNum = World.Rooms.content.length;
	createRooms(room, 0);
	while (gained < maxGain) {
		//var randRoom = _.sample(World.Rooms.content);

		createRooms(room, 0);

		var randRoom = room.randomExit();
		if (randRoom) {
			room = randRoom;
		}
	}
	Game.ScaleAllEntities();

};
//The entrance to the dungeon.  It spawns heros.
var EntranceRoom = function(parent) {
	NodeRoom.apply(this, [parent]);
	var originalDestroy = this.destroy;
	//Need to destory RoomTypes or these Intervals will go haywire.
	this.destroy = function() {
		_.each(this.timers, function(timer) {
			clearInterval(timer.timer);
		});
		originalDestroy();
	};
	this.timers = [];

	this.Color = 0xFF0000;

	this.potionsGiven = 3;

	this.maxSpawnedEntities = 3;
	this.canSpawnEntities = [Warrior, Mage];
	this.spawnCooldown = 2000;

	this.spawnedEntities = [];

	this.HeroSpawner = function(newEntityToSpawn, maxSpawn) {
		var mobCount = 0;
		var entityToSpawn;

		//IF there is no specified newEntityToSpawn, we pick one at random from
		//canSpawnEntities.
		if (!newEntityToSpawn) {
			entityToSpawn = _.sample(this.canSpawnEntities);
			maxSpawn = this.maxSpawnedEntities;
			mobCount = this.spawnedEntities.length;
		} else {
			entityToSpawn = newEntityToSpawn;
			_.each(this.spawnedEntities, function(mob) {
				if (mob instanceof entityToSpawn) {
					mobCount++;
				}
			});
		}
		//Now that we've determined what to spawn, let's see if we should.
		if (entityToSpawn && entityToSpawn.prototype instanceof Entity) {
			if (mobCount < maxSpawn) {
				var newEntity = World.Entities.createEntity(entityToSpawn);
				newEntity.SetRoom(this.parent);
				newEntity.spawnedRoom = this;

				newEntity.GiveItem(new HP10Potion(), this.potionsGiven);

				this.spawnedEntities.push(newEntity);
				console.log('A new ' + newEntity.HeroType + ' entered the dungeon!');
				return newEntity;
			} else {
				return false;
			}
		}
	};

	this.timers.push({
		name: 'Warrior',
		timer: setInterval(this.HeroSpawner.bind(this, Warrior, 3), 25000)
	});

	this.timers.push({
		name: 'Mage',
		timer: setInterval(this.HeroSpawner.bind(this, Mage, 2), 30000)
	});
};
var NodeRoom = function(parent) {
	EmptyRoom.apply(this, [parent]);

	var originalDestroy = this.destroy;
	this.destroy = function() {
		originalDestroy();
	};

	this.maxSpawnedEntities = 0;
	this.spawnedEntities = [];
	this.canSpawnEntities = [],
	this.Spawner = function(newEntityToSpawn, maxSpawn) {
		var mobCount = 0;
		var entityToSpawn;

		//IF there is no specified newEntityToSpawn, we pick one at random from
		//canSpawnEntities.
		if (!newEntityToSpawn) {
			entityToSpawn = _.sample(this.canSpawnEntities);
			maxSpawn = this.maxSpawnedEntities;
			mobCount = this.spawnedEntities.length;
		} else {
			entityToSpawn = newEntityToSpawn;
			_.each(this.spawnedEntities, function(mob) {
				if (mob instanceof entityToSpawn) {
					mobCount++;
				}
			});
		}

		//Now that we've determined what to spawn, let's see if we should.
		if (entityToSpawn && entityToSpawn.prototype instanceof Entity) {
			if (mobCount < maxSpawn) {
				var newEntity = World.Entities.createEntity(entityToSpawn);
				newEntity.SetRoom(this.parent);
				newEntity.spawnedRoom = this;

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
	var originalDestroy = this.destroy;
	//Need to destpry RoomTypes or these Intervals will go haywire.
	this.destroy = function() {
		clearInterval(this.timer);
		originalDestroy();
	};
	this.Color = 0xee3300;
	this.maxSpawnedEntities = 5;
	this.canSpawnEntities = [Trog];
	this.spawnCooldown = 5000;
	this.timer = setInterval(this.Spawner.bind(this), this.spawnCooldown);
};
//TrogRoom.prototype = new NodeRoom();
//TrogRoom.prototype.constructor = TrogRoom;

var SpiderRoom = function(parent) {
	NodeRoom.apply(this, [parent]);
	var originalDestroy = this.destroy;
	//Need to destpry RoomTypes or these Intervals will go haywire.
	this.destroy = function() {
		clearInterval(this.timer);
		clearInterval(this.timer2);
		originalDestroy();
	};

	this.Color = 0xee0033;
	this.maxSpawnedEntities = 6;
	this.canSpawnEntities = [GiantSpider];
	this.spawnCooldown = 10000;

	this.timer = setInterval(this.Spawner.bind(this, GiantSpider, 1), 10000);
	this.timer2 = setInterval(this.Spawner.bind(this, Spider, 5), 5000);
};
var TreasureRoom = function(parent) {
	EmptyRoom.apply(this, [parent]);

	var originalDestroy = this.destroy;
	this.destroy = function() {
		//clearInterval(this.timer);
		originalDestroy();
	};

	this.Color = 0xF2D70C;

	this.maxSpawnedEntities = 0;
	this.spawnedEntities = [];
	this.canSpawnEntities = [];

	//A Hero has entered the Treasure Room!!! Rejoice!
	this.Ascend = function(hero) {
		if(hero.expGainedInDungeon > 0)
			World.Stats.lira++;
		
		World.Stats.heroesAscended++;
		World.Stats.Experience += hero.expGainedInDungeon;
		World.Stats.fame += hero.Level;

		Lynx.Scene.Layers[2].RemoveEntity(hero.entity);

		console.log(hero.Name + " has Ascended!");

		World.Entities.ascendHero(hero);
	};

	this.Spawner = function() {
		var entityToSpawn = _.sample(this.canSpawnEntities);
		if (entityToSpawn && entityToSpawn.prototype instanceof Entity) {
			if (this.spawnedEntities.length < this.maxSpawnedEntities) {
				var newEntity = World.Entities.createEntity(entityToSpawn);
				newEntity.SetRoom(this.parent);
				newEntity.spawnedRoom = this;

				this.spawnedEntities.push(newEntity);
				console.log('Spawned a ' + newEntity.Species);
				return newEntity;
			} else {
				return false;
			}
		}
	};
};
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

var HP10Potion = function() {
	Item.call(this, "HP 10 Potion");

	this.Type |= ItemType.USABLE;

	this.Cooldown = 2000;

	this.Use = function(pHero) {
		pHero.HealthDelta -= 10;
		if (pHero.HealthDelta < 0) {
			pHero.HealthDelta = 0;
		}
	};
};
// Weapons
//--------------------------

var WoodenStick = function () {
	Item.call(this, "Wooden Stick");

	this.Type |= ItemType.EQUIPABLE;
	this.EquipSlot = EquipSlot.WEAPON;

	this.Equip = function (pHero) {
		pHero.BaseAttack += 2;
	};

	this.Unequip = function (pHero) {
		pHero.BaseAttack -= 2;
	};
};

var BronzeSword = function(){
	Item.call(this, "Bronze Sword");
	this.Rating = 1;
	
	this.Type |= ItemType.EQUIPABLE;
	this.EquipSlot = EquipSlot.WEAPON;
	this.Equip = function (pHero) {
		pHero.BaseAttack += 4;
	};
	
	this.Unequip = function (pHero) {
		phero.BaseAttack -= 4;
	};
}

var World = World || {};

World.Stats = new function() {



	//What are these?  WHO KNOWS!?!
	var fame = 0;
	var peril = 0;

	var nextLevelExp = 200;
	Object.defineProperty(this, "nextLevelExp", {
		set: function(pValue) {
			nextLevelExp = pValue;
			//UI.Out.Level = pValue
		},
		get: function() {
			return nextLevelExp;
		}
	});

	var lira = 0;

	Object.defineProperty(this, "lira", {
		get: function() {
			return lira;
		},
		set: function(pValue) {
			lira = pValue;
			UI.Out.Lira = pValue
		}
	});

	var doma = 0;
	Object.defineProperty(this, "doma", {
		get: function() {
			return doma;
		},
		set: function(pValue) {
			doma = pValue;
			UI.Out.Doma = pValue;
		}
	});


	var level = 1;
	Object.defineProperty(this, "level", {
		set: function(pValue) {
			level = pValue;
			UI.Out.Level = pValue
		},
		get: function() {
			return level;
		}
	});

	var dungeonExp = 0;
	Object.defineProperty(this, "Experience", {
		set: function(pValue) {
			dungeonExp = pValue;
			UI.Out.Experience = pValue
			UI.Out.ExperienceBar = Math.floor((dungeonExp / nextLevelExp) * 100);

			if (dungeonExp >= nextLevelExp) {
				World.LevelUp();
			}

		},
		get: function() {
			return dungeonExp;
		}
	});

	var heroesDied = 0;
	Object.defineProperty(this, "heroesDied", {
		set: function(pValue) {
			heroesDied = pValue;
		},
		get: function() {
			return heroesDied;
		}
	});

	var heroesAscended = 0;
	Object.defineProperty(this, "heroesAscended", {
		set: function(pValue) {
			heroesAscended = pValue;
		},
		get: function() {
			return heroesAscended;
		}
	});

	var dungeonGold = 0;
	Object.defineProperty(this, "dungeonGold", {
		set: function(pValue) {
			dungeonGold = pValue;
			//UI.Out.Experience = pValue
		},
		get: function() {
			return dungeonGold;
		}
	});
	var mobsSpawned = 0;
	Object.defineProperty(this, "mobsSpawned", {
		set: function(pValue) {
			mobsSpawned = pValue;
			//UI.Out.Experience = pValue
		},
		get: function() {
			return mobsSpawned;
		}
	});

	var mobsDied = 0;
	Object.defineProperty(this, "mobsDied", {
		set: function(pValue) {
			mobsDied = pValue;
			//UI.Out.Experience = pValue
		},
		get: function() {
			return mobsDied;
		}
	});

	var heroesSpawned = 0;
	Object.defineProperty(this, "heroesSpawned", {
		set: function(pValue) {
			heroesSpawned = pValue;
			//UI.Out.Experience = pValue
		},
		get: function() {
			return heroesSpawned;
		}
	});
}

World.LevelUp = function() {
	var level = World.Stats.level;
	level++;


	World.Stats.Experience -= World.Stats.nextLevelExp;
	World.Stats.nextLevelExp = World.Stats.nextLevelExp * 2;

	// totalExp += pValue;
	// this.expGainedInDungeon += pValue;
	// if (totalExp >= nextLevelExp) {
	// 	this.totalExp -= nextLevelExp;
	// 	nextLevelExp = nextLevelExp * 1.5;
	// }

	//At level 5, adds the ability to attract Scouts!
	if (level === 5) {

		var entrance = World.Rooms.content[0].type;
		debugger;
		entrance.timers.push({
			name: 'Scout',
			timer: setInterval(entrance.HeroSpawner.bind(entrance, Scout, 1), 30000)
		});
	}

	var tRoom = World.TreasureRoom;

	if (level <= 5) {
		walk(World.Rooms.content[0], 1);
		walk(tRoom, level - 2);
	} else {
		walk(World.Rooms.content[0], 1);
		walk(_.sample(World.Rooms.content), 2);
		walk(tRoom, level - 5);
	}



	var newTRoom = _.max(World.Rooms.content, function(room) {
		return Math.sqrt(room.x * room.x + room.y * room.y + room.id);
	});

	//Make sure the treasure room actually changed locations
	if (newTRoom !== tRoom) {
		newTRoom.type = tRoom.type;
		newTRoom.type.parent = newTRoom;
		tRoom.type = new EmptyRoom();

		World.TreasureRoom = newTRoom;
	}
	World.Stats.level += 1;


};

World.Entities = {
	content: [],
	ascendedHeroes: [],
	//USE THIS WHENEVER YOU CREATE AN ENTITY!!!!!
	createEntity: function(entityClass) {
		var newEntity = new entityClass();
		this.content.push(newEntity);

		if (newEntity instanceof Enemy) {
			World.Stats.mobsSpawned++;
		} else if (newEntity instanceof Hero) {
			World.Stats.heroesSpawned++;
		}

		return newEntity;
	},
	removeEntity: function(delEntity) {
		//Remove it from it's current room.
		//debugger;

		if (delEntity instanceof Enemy) {
			World.Stats.mobsDied++;
		} else if (delEntity instanceof Hero) {
			if (delEntity.expGainedInDungeon > 0)
				World.Stats.doma++;

			World.Stats.heroesDied++;
		}

		var currentRoom = delEntity.GetRoom();
		if (currentRoom) {
			_.remove(currentRoom.mobs, function(entity) {
				return entity === delEntity;
			});
		}
		//Remove it from the spawned list in the room in which it was spawed.
		if (delEntity.spawnedRoom) {
			_.remove(delEntity.spawnedRoom.spawnedEntities, function(entity) {
				return entity === delEntity;
			});
		}
		//Remove it from the global enitites registry.
		_.remove(this.content, function(entity) {
			return entity === delEntity;
		});
	},
	ascendHero: function(ascHero) {
		this.ascendedHeroes.push(ascHero);

		var currentRoom = ascHero.GetRoom();
		if (currentRoom) {
			_.remove(currentRoom.mobs, function(entity) {
				return entity === ascHero;
			});
		}
		//Remove it from the spawned list in the room in which it was spawed.
		if (ascHero.spawnedRoom) {
			_.remove(ascHero.spawnedRoom.spawnedEntities, function(entity) {
				return entity === ascHero;
			});
		}
		//Remove it from the global enitites registry.
		_.remove(this.content, function(entity) {
			return entity === ascHero;
		});
	},
}