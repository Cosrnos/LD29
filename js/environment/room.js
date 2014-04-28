World.Rooms = {

	content: [], //Array that contains all the rooms.
	hashMap: {},
	roomSize: 50,

	//Add a room to the room array
	push: function(room) {
		var x = room.x * this.roomSize;
		var y = room.y * this.roomSize;

		if (!this.hashMap[room.x]) {
			this.hashMap[room.x] = {};
		}
		this.hashMap[room.x][room.y] = room;
		this.content.push(room);
	},

	//Finds a room whose origin cooridinates match [x,y]
	findRoom: function(x, y) {
		foundRoom = _.find(this.content, function(room) {
			if (room.x === x && room.y === y) {
				return true;
			}
		});
		return foundRoom;
	}
}

//This is the base RoomType type.
var EmptyRoom = function(parent) {
	this.parent = parent;
	this.destroy = function() {}
	this.Color = 0xDEADBE;
};

var Room = function(x, y) {

	this.id = 0;
	//position of this room.
	this.x = x;
	this.y = y;

	this.depth = 0;

	//Links to other rooms.
	this.North = null;
	this.South = null;
	this.East = null;
	this.West = null;

	this.name = '';
	var type = new EmptyRoom(this); //The type of room this is.
	this.mobs = []; //A list of creatures in the room.

	this.entity = new Lynx.Entity(World.Rooms.roomSize * x, World.Rooms.roomSize * y, World.Rooms.roomSize * 0.8, World.Rooms.roomSize * 0.8);
	this.entity.Color = 0xDEADBE;
	Lynx.Scene.Layers[0].AddEntity(this.entity);

	//Add hallway
	var middle = Math.floor((World.Rooms.roomSize * 0.8) / 2);
	var hallWidth = Math.floor(6);
	var hallLength = Math.floor(10);
	var hallWOffset = (middle - Math.floor(hallWidth / 2));
	var hallHOffset = (World.Rooms.roomSize - hallLength);

	var hallColor = 0xFFFFFF;

	this.nHall = new Lynx.Entity(World.Rooms.roomSize * x + hallWOffset, World.Rooms.roomSize * y - hallLength, hallWidth, hallLength);
	this.nHall.Color = hallColor;
	this.sHall = new Lynx.Entity(World.Rooms.roomSize * x + hallWOffset, World.Rooms.roomSize * y + hallHOffset, hallWidth, hallLength);
	this.sHall.Color = hallColor;
	this.eHall = new Lynx.Entity(World.Rooms.roomSize * x + hallHOffset, World.Rooms.roomSize * y + hallWOffset, hallLength, hallWidth);
	this.eHall.Color = hallColor;
	this.wHall = new Lynx.Entity(World.Rooms.roomSize * x - hallLength, World.Rooms.roomSize * y + hallWOffset, hallLength, hallWidth);
	this.wHall.Color = hallColor;

	Object.defineProperty(this, "type", {
		get: function() {
			return type;
		},
		set: function(newRoom) {
			if (type) {
				type.destroy();
			}
			type = newRoom;
			if (newRoom.Color) {
				this.entity.Color = newRoom.Color;
			}

		}
	});

	//Returns an array of movable directions form this room.
	this.getMovableDirs = function() {
		var dirs = [];
		if (this.North) {
			dirs.push('n');
		}
		if (this.South) {
			dirs.push('s');
		}
		if (this.East) {
			dirs.push('e');
		}
		if (this.West) {
			dirs.push('w');
		}
		return dirs;
	}

	//Picks a random exit from this room and returns that room.
	this.randomExit = function() {
		var dir = _.sample(this.getMovableDirs());

		if (dir === 'n') {
			return this.North;
		}
		if (dir === 's') {
			return this.South;
		}
		if (dir === 'e') {
			return this.East;
		}
		if (dir === 'w') {
			return this.West;
		}
		return false;
	}

	// this.getType = function()
	// this.setType = function(roomType) {
	// 	if (roomType.prototype instanceof EmptyRoom) {
	// 		if (this.type) {
	// 			this.type.destroy();
	// 		}
	// 		this.type = new roomType();
	// 	}
	// };

	//This add a room or creates a connection to an already existing room in the specified direction.
	this.addRoom = function(direction) {
		var newRoom;
		var error = '';
		var roomSize = World.Rooms.roomSize;

		direction = direction.toLowerCase();
		if (direction === "n" || direction === "north") {
			if (this.North === null) {
				//Check to see if thee is a room in that direction that this room isn't yet connected to.
				var foundRoom = World.Rooms.findRoom(x, y - 1)
				if (foundRoom) {
					this.North = foundRoom;
					foundRoom.South = this;
				} else {
					newRoom = new Room(x, y - 1);
					this.North = newRoom;
					newRoom.South = this;
				}
				Lynx.Scene.Layers[0].AddEntity(this.nHall);

			} else {
				error = "Room to the North already exists."
			}

		} else if (direction === "s" || direction === "south") {

			if (this.South === null) {
				var foundRoom = World.Rooms.findRoom(x, y + 1)
				if (foundRoom) {
					this.South = foundRoom;
					foundRoom.North = this;
				} else {
					newRoom = new Room(x, y + 1);
					this.South = newRoom;
					newRoom.North = this;
				}
				Lynx.Scene.Layers[0].AddEntity(this.sHall);
			} else {
				error = "Room to the South already exists."
			}

		} else if (direction === "e" || direction === "east") {
			if (this.East === null) {
				var foundRoom = World.Rooms.findRoom(x + 1, y)
				if (foundRoom) {
					this.East = foundRoom;
					foundRoom.West = this;
				} else {
					newRoom = new Room(x + 1, y);
					this.East = newRoom;
					newRoom.West = this;
				}
				Lynx.Scene.Layers[0].AddEntity(this.eHall);
			} else {
				error = "Room to the East already exists."
			}
		} else if (direction === "w" || direction === "west") {

			if (this.West === null) {
				var foundRoom = World.Rooms.findRoom(x - 1, y)
				if (foundRoom) {
					this.West = foundRoom;
					foundRoom.East = this;
				} else {
					newRoom = new Room(x - 1, y);
					this.West = newRoom;
					newRoom.East = this;
				}
				Lynx.Scene.Layers[0].AddEntity(this.wHall);
			} else {
				error = "Room to the West already exists.";
			}

		} else {
			error = 'No/Invalid Direction Specified When Creating Room';
		}

		if (error) {
			//console.log(error)
			delete newRoom;
			return false;
		}
		if (newRoom) {
			//newRoom.type = new EmptyRoom(this);
			newRoom.depth = this.depth + 1;
			newRoom.id = World.Rooms.content.length;
			World.Rooms.push(newRoom);
			return newRoom;
		} else if (foundRoom) {
			return foundRoom
		} else
			return false;
	}
};


//This creates a kinda-random dungeon, starting from 'room'
walk = function(room, maxGain) {
	var gained = 0;

	var createRooms = function(room, depth) {
		debugger;
		if (!room || gained >= maxGain) {
			return;
		}
		//Randomly create rooms in each direction.
		var dir = _.sample(['n', 's', 'w', 'e']);

		if (gained < maxGain) {
			if (room.addRoom(dir)) {
				gained++;

				if (dir === 'n') {
					createRooms(room.North, depth + 1);
				} else if (dir === 's') {
					createRooms(room.South, depth + 1);
				} else if (dir === 'e') {
					createRooms(room.East, depth + 1);
				} else if (dir === 'w') {
					createRooms(room.West, depth + 1);
				}
			}
		}
	}

	//var initialRoomNum = World.Rooms.content.length;
	createRooms(room, 0);
	while (gained < maxGain) {
		//var randRoom = _.sample(World.Rooms.content);

		createRooms(room, 0);

		var randRoom = room.randomExit();
		if (randRoom) {
			room = randRoom;
		}
	}
	Game.ScaleAllEntities();

};