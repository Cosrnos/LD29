var TreasureRoom = function (parent) {
	EmptyRoom.apply(this, [parent]);

	var originalDestroy = this.destroy;
	this.destroy = function () {
		//clearInterval(this.timer);
		originalDestroy();
	};

	this.Texture = Lynx.AM.Get("rewardTile").Asset;

	this.maxSpawnedEntities = 0;
	this.spawnedEntities = [];
	this.canSpawnEntities = [];

	//A Hero has entered the Treasure Room!!! Rejoice!
	this.Ascend = function (hero) {
		if (hero.expGainedInDungeon > 0)
			World.Stats.lira++;

		World.Stats.heroesAscended++;
		World.Stats.Experience += hero.expGainedInDungeon;
		World.Stats.fame += hero.Level;

		Lynx.Scene.Layers[2].RemoveEntity(hero.entity);

		console.log(hero.Name + " has Ascended!");

		World.Entities.ascendHero(hero);
	};

	this.Spawner = function () {
		var entityToSpawn = _.sample(this.canSpawnEntities);
		if (entityToSpawn && entityToSpawn.prototype instanceof Entity) {
			if (this.spawnedEntities.length < this.maxSpawnedEntities) {
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
