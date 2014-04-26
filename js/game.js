Game = {
	CameraVX: 0,
	CameraVY: 0,

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
	},

	LoadAssets: function (pCallback) {
		//Queue assets here
		Lynx.AM.LoadQueue(pCallback);
	},

	LoadComponents: function (pCallback) {
		Lynx.CM.Load("Tracker", "Timer", "KeyboardEvents");
		Lynx.CM.On("ComponentManager.Ready", pCallback);
	},

	SetupScene: function () {
		Lynx.Scene.On("Keyboard.Press.W", function () {
			Game.CameraVY -= 1
		});

		Lynx.Scene.On("Keyboard.Release.W", function () {
			Game.CameraVY += 1
		});

		Lynx.Scene.On("Keyboard.Press.S", function () {
			Game.CameraVY += 1
		});

		Lynx.Scene.On("Keyboard.Release.S", function () {
			Game.CameraVY -= 1
		});

		Lynx.Scene.On("Keyboard.Press.A", function () {
			Game.CameraVX -= 1
		});

		Lynx.Scene.On("Keyboard.Release.A", function () {
			Game.CameraVX += 1
		});

		Lynx.Scene.On("Keyboard.Press.D", function () {
			Game.CameraVX += 1
		});

		Lynx.Scene.On("Keyboard.Release.D", function () {
			Game.CameraVX -= 1
		});

		Lynx.Scene.On("Update", function () {
			Lynx.Scene.Camera.X += Math.floor(Game.CameraVX * (Lynx.Main.Delta / 2));
			Lynx.Scene.Camera.Y += Math.floor(Game.CameraVY * (Lynx.Main.Delta / 2));
		});

		Lynx.Start();
	},
	Ready: function () {
		World.Rooms.push(new Room(8, 5));
		walk(World.Rooms.content[0], 5, 0);
		World.Rooms.hashMap[8][5].entity.Color = 0xFF0000;

		var john = new Warrior("John");
		john.EquipItem(new WoodenSword());
		john.BaseDefense = 10;
		var hugo = new GiantSpider();
		hugo.Name = "Giant Spider"
		john.CurrentTarget = hugo;

		var sampleText = new Lynx.Text({
			Value: "Current Score: 0",
			Color: "#FFFFFF",
		});

		var statFrame = new Lynx.CanvasElement(0, Lynx.Scene.Height - 50, Lynx.Scene.Width, 50);
		statFrame.Color = 0xFF33CC;
		statFrame.Alpha = 0.5;
		statFrame.Static = true;

		Lynx.Scene.AddElement(statFrame);


		sampleText.Static = true;

		Lynx.Scene.AddElement(sampleText);

		john.BaseSpeed = 2;
		Lynx.Scene.On("Update", function () {
			john.Think();
			hugo.Think();
		});
	}
};

var Entities = Entities || {};
Entities.content = [];
Entities.createEntity = function (entity) {
	var newEntity = new entity();
	Entities.content.push(newEntity);
	return newEntity;
}