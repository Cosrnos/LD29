var World = World || {};

World.Stats = new function() {



	//What are these?  WHO KNOWS!?!
	var fame = 0;
	var peril = 0;
	var lira = 0;
	var doma = 0;
	Object.defineProperty(this, "lira", {
		get: function(){
			return lira;
		},
		set: function(pValue){
			lira = pValue;
			UI.Out.Lira = pValue			
		}
	});
	
	Object.defineProperty(this, "doma", {
		get: function(){
			return doma;
		},
		set: function(pValue){
			doma = pValue;
			UI.Out.Doma = pValue;
		}
	});
	
	var level = 1;
	Object.defineProperty(this, "level", {
		set: function(pValue) {
			level = pValue;
			UI.Out.Level = pValue
		},
		get: function() {
			return level;
		}
	});
	
	var dungeonExp = 0;
	Object.defineProperty(this, "Experience", {
		set: function(pValue) {
			dungeonExp = pValue;
			UI.Out.Experience = pValue
		},
		get: function() {
			return dungeonExp;
		}
	});

	var heroesDied = 0;
	Object.defineProperty(this, "heroesDied", {
		set: function(pValue) {
			heroesDied = pValue;
		},
		get: function() {
			return heroesDied;
		}
	});

	var heroesAscended = 0;
	Object.defineProperty(this, "heroesAscended", {
		set: function(pValue) {
			heroesAscended = pValue;
		},
		get: function() {
			return heroesAscended;
		}
	});

	var dungeonGold = 0;
	Object.defineProperty(this, "dungeonGold", {
		set: function(pValue) {
			dungeonGold = pValue;
			//UI.Out.Experience = pValue
		},
		get: function() {
			return dungeonGold;
		}
	});
	var mobsSpawned = 0;
	Object.defineProperty(this, "mobsSpawned", {
		set: function(pValue) {
			mobsSpawned = pValue;
			//UI.Out.Experience = pValue
		},
		get: function() {
			return mobsSpawned;
		}
	});

	var mobsDied = 0;
	Object.defineProperty(this, "mobsDied", {
		set: function(pValue) {
			mobsDied = pValue;
			//UI.Out.Experience = pValue
		},
		get: function() {
			return mobsDied;
		}
	});

	var heroesSpawned = 0;
	Object.defineProperty(this, "heroesSpawned", {
		set: function(pValue) {
			heroesSpawned = pValue;
			//UI.Out.Experience = pValue
		},
		get: function() {
			return heroesSpawned;
		}
	});
}

World.LevelUp = function() {
	var level = World.Stats.level;
	level++;

	var tRoom = World.TreasureRoom;

	if (level <= 5) {
		walk(World.Rooms.content[0], 1);
		walk(tRoom, level - 2);
	} else {
		walk(World.Rooms.content[0], 1);
		walk(_.sample(World.Rooms.content), 2);
		walk(tRoom, level - 5);
	}



	var newTRoom = _.max(World.Rooms.content, function(room) {
		return Math.sqrt(room.x * room.x + room.y * room.y + room.id);
	});

	//Make sure the treasure room actually changed locations
	if (newTRoom !== tRoom) {
		newTRoom.type = tRoom.type;
		newTRoom.type.parent = newTRoom;
		tRoom.type = new EmptyRoom();

		World.TreasureRoom = newTRoom;
	}
	World.Stats.level += 1;


};

World.Entities = {
	content: [],
	ascendedHeroes: [],
	//USE THIS WHENEVER YOU CREATE AN ENTITY!!!!!
	createEntity: function(entityClass) {
		var newEntity = new entityClass();
		this.content.push(newEntity);

		if (newEntity instanceof Enemy) {
			World.Stats.mobsSpawned++;
		} else if (newEntity instanceof Hero) {
			World.Stats.heroesSpawned++;
		}

		return newEntity;
	},
	removeEntity: function(delEntity) {
		//Remove it from it's current room.
		//debugger;

		if (delEntity instanceof Enemy) {
			World.Stats.mobsDied++;
		} else if (delEntity instanceof Hero) {
			if(delEntity.expGainedInDungeon > 0)
				World.Stats.doma++;
			
			World.Stats.heroesDied++;
		}

		var currentRoom = delEntity.GetRoom();
		if (currentRoom) {
			_.remove(currentRoom.mobs, function(entity) {
				return entity === delEntity;
			});
		}
		//Remove it from the spawned list in the room in which it was spawed.
		if (delEntity.spawnedRoom) {
			_.remove(delEntity.spawnedRoom.spawnedEntities, function(entity) {
				return entity === delEntity;
			});
		}
		//Remove it from the global enitites registry.
		_.remove(this.content, function(entity) {
			return entity === delEntity;
		});
	},
	ascendHero: function(ascHero) {
		this.ascendedHeroes.push(ascHero);

		var currentRoom = ascHero.GetRoom();
		if (currentRoom) {
			_.remove(currentRoom.mobs, function(entity) {
				return entity === ascHero;
			});
		}
		//Remove it from the spawned list in the room in which it was spawed.
		if (ascHero.spawnedRoom) {
			_.remove(ascHero.spawnedRoom.spawnedEntities, function(entity) {
				return entity === ascHero;
			});
		}
		//Remove it from the global enitites registry.
		_.remove(this.content, function(entity) {
			return entity === ascHero;
		});
	},
}