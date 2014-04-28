Game = {
	CameraVX: 0,
	CameraVY: 0,
	ActiveMenu: null,
	Scale: 1,

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
		Lynx.AM.QueueImage('fencer', 'assets/fencer.png');
		Lynx.AM.LoadQueue(pCallback);
	},

	LoadComponents: function(pCallback) {
		Lynx.CM.Load("Tracker", "Timer", "KeyboardEvents", "MouseEvents");
		Lynx.CM.On("ComponentManager.Ready", pCallback);
	},

	SetupScene: function() {
		Lynx.Scene.On("Keyboard.Press.W", function() {
			Game.CameraVY -= 1
		});

		Lynx.Scene.On("Keyboard.Release.W", function() {
			Game.CameraVY += 1
		});

		Lynx.Scene.On("Keyboard.Press.S", function() {
			Game.CameraVY += 1
		});

		Lynx.Scene.On("Keyboard.Release.S", function() {
			Game.CameraVY -= 1
		});

		Lynx.Scene.On("Keyboard.Press.A", function() {
			Game.CameraVX -= 1
		});

		Lynx.Scene.On("Keyboard.Release.A", function() {
			Game.CameraVX += 1
		});

		Lynx.Scene.On("Keyboard.Press.D", function() {
			Game.CameraVX += 1
		});

		Lynx.Scene.On("Keyboard.Release.D", function() {
			Game.CameraVX -= 1
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
	},
	Ready: function() {
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
		john.Name = "John"
		john.GiveItem(new HP10Potion(), 4);
		john.EquipItem(new WoodenSword());
		john.BaseDefense = 10;

		john.SetRoom(World.Rooms.content[0]);

		var hugo = World.Entities.createEntity(GiantSpider);
		hugo.Name = "Giant Spider"
		hugo.SetRoom(World.Rooms.content[0]);
		john.CurrentTarget = hugo;


		Lynx.Scene.AddLayer();

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
				Game.Scale += (event.wheelDelta * 0.001)
			} else {
				Game.Scale -= (event.wheelDelta * -0.001)
			}
			if (Game.Scale > 5)
				Game.Scale = 5;
			if (Game.Scale < 0.5)
				Game.Scale = 0.5

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
				UI.RoomMenu.Target = room;
				if (room.type instanceof EmptyRoom)
					UI.RoomMenu.NodeChange.Element.innerHTML = "Add Node &raquo;";
				else
					UI.RoomMenu.NodeChange.Element.innerHTML = "Change Node &raquo;";
				UI.RoomMenu.Name = "Room #" + room.id;
				UI.RoomMenu.ShowAt(pMousePosition.X, pMousePosition.Y);
				return true;
			}
		});

		//Scale entities to default scale
		Game.ScaleAllEntities();

		UI.Out.UpdateExpbar(500000, 2000000);
		welcomeMessage.Show();
	}
};