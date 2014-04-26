Game = {
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
		Lynx.CM.Load("Tracker", "Timer");
		Lynx.CM.On("ComponentManager.Ready", pCallback);
	},

	SetupScene: function () {
		Lynx.Start();
	},
	Ready: function () {
		World.Rooms.push(new Room(400, 250));
		walk(World.Rooms.content[0], 5, 0);

		var john = new Hero();
		john.Name = "John";
		var hugo = new Trog();
		hugo.Name = "Hugo";
		john.GiveItem(new HP10Potion(), 1);
		john.Experience += 99;
		john.UseItem("HP 10 Potion");
		john.GiveAction("Heavy Attack");
		john.EquipItem(new WoodenSword());
		while (hugo.HealthDelta < hugo.Health) {
			john.UseAction("Heavy Attack", hugo);
		}
	}
};