//This is the base RootType type.
var EmptyRoom = function(parent) {
	this.parent = parent;
	this.destroy = function() {}
};
// EmptyRoom.prototype = new Room();
// EmptyRoom.prototype.constructor = EmptyRoom;

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

	this.maxSpawnedEntities = 5;
	this.canSpawnEntities = [Trog];
	this.spawnCooldown = 5000;
	// this.timer = setInterval(function() {
	// 	//Only spawn in the maxSpawnedEntities limit hsn't been reached.
	// 	if (this.spawnedEntities.length < this.maxSpawnedEntities) {
	// 		this.Spawner();
	// 	}
	// }.bind(this), this.spawnCooldown);
	this.timer = setInterval(this.Spawner.bind(this), this.spawnCooldown);
};

//TrogRoom.prototype = new NodeRoom();
//TrogRoom.prototype.constructor = TrogRoom;