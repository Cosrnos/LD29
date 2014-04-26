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

	SetupScene: function () {},
	Ready: function () {
		var john = new Hero();
		john.Name = "John";
		var hugo = new Trog();
		hugo.Name = "Hugo";

		john.Kill();
		hugo.Kill();
	}
};