var NodeRoom = function (parent) {
	EmptyRoom.apply(this, [parent]);

	var originalDestroy = this.destroy;
	this.destroy = function () {
		originalDestroy();
	};

	this.maxSpawnedEntities = 0;
	this.spawnedEntities = [];
	this.canSpawnEntities = [],
	this.Spawner = function (newEntityToSpawn, maxSpawn) {
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
			_.each(this.spawnedEntities, function (mob) {
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
				return newEntity;
			} else {
				return false;
			}
		}
	};
};
NodeRoom.prototype = new EmptyRoom();
NodeRoom.prototype.constructor = NodeRoom;

var TrogRoom = function (parent) {
	NodeRoom.apply(this, [parent]);
	var originalDestroy = this.destroy;
	//Need to destpry RoomTypes or these Intervals will go haywire.
	this.destroy = function () {
		clearInterval(this.timer);
		originalDestroy();
	};
	this.Color = 0xee3300;
	this.Texture = Lynx.AM.Get("trogNode").Asset;
	this.maxSpawnedEntities = 5;
	this.canSpawnEntities = [Trog];
	this.spawnCooldown = 5000;
	this.timer = setInterval(this.Spawner.bind(this), this.spawnCooldown);
};
//TrogRoom.prototype = new NodeRoom();
//TrogRoom.prototype.constructor = TrogRoom;

var SpiderRoom = function (parent) {
	NodeRoom.apply(this, [parent]);
	var originalDestroy = this.destroy;
	//Need to destroy RoomTypes or these Intervals will go haywire.
	this.destroy = function () {
		clearInterval(this.timer);
		clearInterval(this.timer2);
		originalDestroy();
	};

	this.Texture = Lynx.AM.Get("spiderNode").Asset;
	this.maxSpawnedEntities = 6;
	this.canSpawnEntities = [Spider, GiantSpider];
	this.spawnCooldown = 10000;

	this.timer = setInterval(this.Spawner.bind(this, GiantSpider, 1), 120000);
	this.timer2 = setInterval(this.Spawner.bind(this, Spider, 5), 5000);
};

var BatRoom = function (parent) {
	NodeRoom.apply(this, [parent]);
	var originalDestroy = this.destroy;
	//Need to destpry RoomTypes or these Intervals will go haywire.
	this.destroy = function () {
		clearInterval(this.timer);
		originalDestroy();
	};

	this.Texture = Lynx.AM.Get("batNode").Asset;
	this.maxSpawnedEntities = 5;
	this.canSpawnEntities = [Bat];
	this.spawnCooldown = 6000;

	this.timer = setInterval(this.Spawner.bind(this, Bat, 5), 4500);
};

var GoblinRoom = function (parent) {
	NodeRoom.apply(this, [parent]);
	var originalDestroy = this.destroy;
	//Need to destpry RoomTypes or these Intervals will go haywire.
	this.destroy = function () {
		clearInterval(this.timer);
		originalDestroy();
	};

	this.Texture = Lynx.AM.Get("goblinNode").Asset;
	this.maxSpawnedEntities = 3;
	this.canSpawnEntities = [Goblin];
	this.spawnCooldown = 10000;

	this.timer = setInterval(this.Spawner.bind(this, Goblin, 3), 10000);
};


var BlobmanRoom = function (parent) {
	NodeRoom.apply(this, [parent]);
	var originalDestroy = this.destroy;
	//Need to destroy RoomTypes or these Intervals will go haywire.
	this.destroy = function () {
		clearInterval(this.timer);
		originalDestroy();
	};

	this.Texture = Lynx.AM.Get("blobmanNode").Asset;

	this.timer = setInterval(this.Spawner.bind(this, BlobMan, 4), 7500);
};

var DarkKnightRoom = function (parent) {
	NodeRoom.apply(this, [parent]);
	var originalDestroy = this.destroy;
	//Need to destroy RoomTypes or these Intervals will go haywire.
	this.destroy = function () {
		clearInterval(this.timer);
		originalDestroy();
	};

	this.Texture = Lynx.AM.Get("dkNode").Asset;

	this.timer = setInterval(this.Spawner.bind(this, DarkKnight, 1), 90000);
};