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
		Lynx.Scene.On("Update", function () {
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
