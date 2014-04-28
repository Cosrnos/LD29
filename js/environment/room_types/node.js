var NodeRoom = function(parent) {
	EmptyRoom.apply(this, [parent]);

	var originalDestroy = this.destroy;
	this.destroy = function() {
		originalDestroy();
	}

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
			mobCount = this.spawnedEntities.length
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
	}
	this.timers = [];

	this.Color = 0xFF0000;

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
			mobCount = this.spawnedEntities.length
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
				console.log('A new ' + newEntity.HeroType + ' entered the dungeon!');
				return newEntity;
			} else {
				return false;
			}
		}
	};

	this.timers.push({
		name: 'Warrior',
		timer: setInterval(this.HeroSpawner.bind(this, Warrior, 3), 6000)
	});

	this.timers.push({
		name: 'Mage',
		timer: setInterval(this.HeroSpawner.bind(this, Mage, 2), 5000)
	});
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
		clearInterval(this.timer2);
		originalDestroy()
	}
	this.Color = 0xee0033;
	this.maxSpawnedEntities = 6;
	this.canSpawnEntities = [GiantSpider];
	this.spawnCooldown = 10000;

	this.timer = setInterval(this.Spawner.bind(this, GiantSpider, 1), 10000);
	this.timer2 = setInterval(this.Spawner.bind(this, Spider, 5), 5000);
};