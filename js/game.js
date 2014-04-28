Game = {
	CameraVX: 0,
	CameraVY: 0,
	ActiveMenu: null,
	Scale: 1,
	TutorialProgress: 0,
	Muted: false,

	Start: function () {
		this.Initialize();
		this.LoadAssets((function () {
			this.LoadComponents((function () {
				this.SetupScene();
				this.Ready();
			}).bind(this));
		}).bind(this));
	},

	Initialize: function () {
		//Set Globals here
		//Open preloader if needed
		loadingMessage.Show();
	},

	LoadAssets: function (pCallback) {
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

		Lynx.AM.QueueImage("emptyRoomTile", "assets/dgTiles/empty_room.png");
		Lynx.AM.QueueImage("entranceTile", "assets/dgTiles/entranceTile.png");
		Lynx.AM.QueueImage("rewardTile", "assets/dgTiles/rewardTile.png");
		Lynx.AM.QueueImage("batNode", "assets/dgTiles/batNode.png");
		Lynx.AM.QueueImage("trogNode", "assets/dgTiles/trogNode.png");
		Lynx.AM.QueueImage("spiderNode", "assets/dgTiles/spiderNode.png");
		Lynx.AM.QueueImage("goblinNode", "assets/dgTiles/goblinNode.png");
		Lynx.AM.QueueImage("trog", "assets/trog.png");
		Lynx.AM.QueueImage("spider", "assets/spider.png");
		Lynx.AM.QueueImage("spider-giant", "assets/giant-spider.png");
		Lynx.AM.QueueImage("goblin", "assets/goblin.png");
		Lynx.AM.QueueImage("bat", "assets/bat.png");

		Lynx.AM.QueueAudio("soundClick", "assets/sounds/click.wav");
		Lynx.AM.QueueAudio("soundAscent", "assets/sounds/ascent.wav");
		Lynx.AM.QueueAudio("soundDeath", "assets/sounds/death.wav");
		Lynx.AM.QueueAudio("soundBgm", "assets/sounds/bgm.mp3");

		Lynx.AM.LoadQueue(pCallback);
	},

	LoadComponents: function (pCallback) {
		Lynx.CM.Load("Timer", "KeyboardEvents", "MouseEvents");
		Lynx.CM.On("ComponentManager.Ready", pCallback);
	},

	SetupScene: function () {
		Lynx.Scene.On("Keyboard.Press.W", function () {
			Game.CameraVY -= 1;
		});

		Lynx.Scene.On("Keyboard.Release.W", function () {
			Game.CameraVY = 0;
			if (Game.TutorialProgress === 0)
				tutorialFirstScreen.Show();
		});

		Lynx.Scene.On("Keyboard.Press.S", function () {
			Game.CameraVY += 1;
		});

		Lynx.Scene.On("Keyboard.Release.S", function () {
			Game.CameraVY -= 1;
			if (Game.TutorialProgress === 0)
				tutorialFirstScreen.Show();
		});

		Lynx.Scene.On("Keyboard.Press.A", function () {
			Game.CameraVX -= 1;
		});

		Lynx.Scene.On("Keyboard.Release.A", function () {
			Game.CameraVX = 0;
			if (Game.TutorialProgress === 0)
				tutorialFirstScreen.Show();
		});

		Lynx.Scene.On("Keyboard.Press.D", function () {
			Game.CameraVX += 1;
		});

		Lynx.Scene.On("Keyboard.Release.D", function () {
			Game.CameraVX = 0;
			if (Game.TutorialProgress === 0)
				tutorialFirstScreen.Show();
		});

		Lynx.Scene.On("Keyboard.Press.M", function () {
			if (Game.Muted) {
				Lynx.AM.Get("soundBgm").Asset.volume = 1;
			} else {
				Lynx.AM.Get("soundBgm").Asset.volume = 0;
			}

			Game.Muted = !Game.Muted;
		});

		Lynx.Scene.On("Update", function () {
			Lynx.Scene.Camera.X += Math.floor(Game.CameraVX * (Lynx.Main.Delta / 2));
			Lynx.Scene.Camera.Y += Math.floor(Game.CameraVY * (Lynx.Main.Delta / 2));
			if (Game.ActiveMenu === UI.RoomMenu) {
				Game.ActiveMenu.MoveBy(Math.floor(Game.CameraVX * (Lynx.Main.Delta / 2)), Math.floor(Game.CameraVY * (Lynx.Main.Delta / 2)));
			}
			return true;
		});

		Lynx.Start();
	},
	ScaleEntity: function (entity) {
		entity.Scale = Game.Scale;
	},
	ScaleAllEntities: function () {
		for (var i = 0; i < Lynx.Scene.Entities.length; i++) {
			var e = Lynx.Scene.Entities[i];
			e.Scale = Game.Scale;
		}

		_.each(Lynx.Scene.Layers, function (layer) {
			_.each(layer.Elements, function (element) {
				element.Scale = Game.Scale;
			});
		});
	},
	Ready: function () {

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
		World.Stats.lira = 2;
		/*
		var hugo = World.Entities.createEntity(GiantSpider);
		hugo.Name = "Giant Spider";
		hugo.SetRoom(World.Rooms.content[0]);
		john.CurrentTarget = hugo;
*/

		john.BaseSpeed = 2;
		Lynx.Scene.On("Update", function () {
			_.each(World.Entities.content, function (entity) {
				if (entity) {
					entity.Think();
					if (entity.Draw) {
						entity.Draw();
					}
				}
			});
			return true;
		});

		window.addEventListener("mousewheel", function (event) {
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
		var cursor = "auto";
		Lynx.Scene.On("MouseEvents.Move", function (pMousePosition) {
			var gamePos = Viewport.ParseMousePosition(pMousePosition.X, pMousePosition.Y);
			if (Game.ActiveMenu !== null) {
				if (cursor === "pointer") {
					document.getElementById("viewport-container").style.cursor = "auto";
					cursor = "auto";
				}
				return true;
			}
			var room = World.Rooms.findRoom(Math.floor(gamePos.X / (World.Rooms.roomSize * Game.Scale)), Math.floor(gamePos.Y / (World.Rooms.roomSize * Game.Scale)));
			if (typeof room !== 'undefined') {
				document.getElementById("viewport-container").style.cursor = "pointer";
				cursor = "pointer";
			};

		});

		Lynx.Scene.On("MouseEvents.Click", function (pMousePosition) {
			var gamePos = Viewport.ParseMousePosition(pMousePosition.X, pMousePosition.Y);
			if (Game.TutorialProgress === 0)
				return true;

			if (Game.ActiveMenu !== null) {
				if (Game.ActiveMenu.Disposed) {
					Game.ActiveMenu = null;
				}
				return true;
			}
			//Test for Room Menu
			var room = World.Rooms.findRoom(Math.floor(gamePos.X / (World.Rooms.roomSize * Game.Scale)), Math.floor(gamePos.Y / (World.Rooms.roomSize * Game.Scale)));
			if (typeof room !== 'undefined') {
				if (Game.TutorialProgress === 1 && !(room.type instanceof EmptyRoom))
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
				if (!Game.Muted)
					Lynx.AM.Get("soundClick").Asset.play();
				if (Game.TutorialProgress === 1) {
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