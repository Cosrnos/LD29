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

	this.spawnCooldown = 2000;

	this.spawnedEntities = [];

	//This should probablu go somewhere else.
	//Generats Normal (Gaussian) Distributed Random Numbers
	//Use to pick the level of heroes entering the dungeon.
	this.randomDist = function(mean, stdev) {
		var randomDist = (Math.random() * 2 - 1) + (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
		return Math.round(randomDist * stdev + mean);
	}

	this.HeroSpawner = function(newEntityToSpawn, maxSpawn) {
		var mobCount = 0;
		var entityToSpawn;

		if (!newEntityToSpawn) {
			return false
		} else {
			entityToSpawn = newEntityToSpawn;
			//Get the current count of 'entityToSpawn's.
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

				//I did this at 5:30 AM.  It might be stupid-crazy.  We'll see.
				newEntity.Experience = Math.abs(this.randomDist(Math.pow(2, World.Stats.level - 1) * 100, World.Stats.level * 100) - 50);

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