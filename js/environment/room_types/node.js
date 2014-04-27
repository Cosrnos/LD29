var NodeRoom = function(parent) {
	EmptyRoom.apply(this, [parent]);

	var originalDestroy = this.destroy;
	this.destroy = function() {
		originalDestroy();
	}

	this.maxSpawnedEntities = 0;
	this.spawnedEntities = [];
	this.canSpawnEntities = [],
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

//The entrance to the dungeon.  It spawns heros.
var EntranceRoom = function(parent) {
	NodeRoom.apply(this, [parent]);
	var originalDestroy = this.destroy;
	//Need to destory RoomTypes or these Intervals will go haywire.
	this.destroy = function() {
		clearInterval(this.timer);
		originalDestroy()
	}
	this.Color = 0xFF00FF;

	this.maxSpawnedEntities = 3;
	this.canSpawnEntities = [Warrior, Mage];
	this.spawnCooldown = 2000;

	this.spawnedEntities = [];

	this.HeroSpawner = function() {
		var entityToSpawn = _.sample(this.canSpawnEntities);
		//debugger;
		if (entityToSpawn && entityToSpawn.prototype instanceof Entity) {
			if (this.spawnedEntities.length < this.maxSpawnedEntities) {
				var newEntity = World.Entities.createEntity(entityToSpawn);
				newEntity.SetRoom(this.parent);
				newEntity.spawnedRoom = this;

				this.spawnedEntities.push(newEntity);
				console.log('A new ' + newEntity.HeroType + ' entered the dungeon!');
				return newEntity;
			} else {
				return false;
			}
		}
	};

	this.timer = setInterval(this.HeroSpawner.bind(this), this.spawnCooldown);
}

NodeRoom.prototype = new EmptyRoom();
NodeRoom.prototype.constructor = NodeRoom;

var TrogRoom = function(parent) {
	NodeRoom.apply(this, [parent]);
	var originalDestroy = this.destroy;
	//Need to destpry RoomTypes or these Intervals will go haywire.
	this.destroy = function() {
		clearInterval(this.timer);
		originalDestroy()
	}
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
		originalDestroy()
	}
	this.Color = 0xee0033;
	this.maxSpawnedEntities = 2;
	this.canSpawnEntities = [GiantSpider];
	this.spawnCooldown = 10000;

	this.timer = setInterval(this.Spawner.bind(this), this.spawnCooldown);
};