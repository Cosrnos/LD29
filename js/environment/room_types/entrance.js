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