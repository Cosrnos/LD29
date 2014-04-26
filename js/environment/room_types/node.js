//This is the base RootType type.
var EmptyRoom = function(parent) {
	this.parent = parent;
	//Room.call(this);
};
// EmptyRoom.prototype = new Room();
// EmptyRoom.prototype.constructor = EmptyRoom;

var NodeRoom = function(parent) {
	EmptyRoom.apply(this, [parent]);
	this.maxSpawnedEntities = 0;
	this.spawnedEntities = [];
	this.canSpawnEntities = [],
	this.Spawner = function() {
		var entityToSpawn = _.sample(this.canSpawnEntities);
		if (entityToSpawn && entityToSpawn.prototype instanceof Entity) {
			if (this.spawnedEntities.length < this.maxSpawnedEntities) {
				var newEntity = Entities.createEntity(entityToSpawn);
				newEntity.SetRoom(this);
				this.parent.mobs.push(newEntity);
				this.spawnedEntities.push(newEntity);
				console.log('Spawned a ' + newEntity.Species);
				return newEntity;
			} else {
				return false;
			}
		}
	};
};
NodeRoom.prototype = new EmptyRoom();
NodeRoom.prototype.constructor = NodeRoom;

var TrogRoom = function(parent) {
	NodeRoom.apply(this, [parent]);

	this.maxSpawnedEntities = 5;
	this.canSpawnEntities = [Trog];
	this.spawnCooldown = 20000;
	setInterval(function() {
		//Only spawn in the maxSpawnedEntities limit hsn't been reached.
		if (this.spawnedEntities.length < this.maxSpawnedEntities) {
			this.Spawner();
		}
	}.bind(this), this.spawnCooldown);
};

TrogRoom.prototype = new NodeRoom();
TrogRoom.prototype.constructor = TrogRoom;