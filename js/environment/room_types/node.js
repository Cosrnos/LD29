var NodeRoom = function() {
	//Room.call(this);
	this.canSpawnEntities = [],
	this.Spawner = function() {
		var entityToSpawn = _.sample(this.canSpawnEntities);

		if (entityToSpawn && entityToSpawn instanceof Entity) {
			var newEntity = Entities.CreateEntity(entityToSpawn);
			newEntity.SetRoom(this);
			this.mobs.push(newEntity);
		}
	}
};
NodeRoom.prototype = new Room();
NodeRoom.prototype.construtor = NodeRoom;

var TrogRoom = function() {
	NodeRoom.call(this);
	this.canSpawnEntities = [Trog];
}

TrogRoom.prototype = new NodeRoom();
TrogRoom.prototype.construtor = TrogRoom;