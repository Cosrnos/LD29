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
};

var Room = function(x, y) {

	this.id = 0;
	//position of this room.
	this.x = x;
	this.y = y;

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
	Lynx.Scene.AddEntity(this.entity);

	//Add hallway
	var middle = Math.floor((World.Rooms.roomSize * 0.8) / 2);
	var hallWidth = Math.floor(6);
	var hallLength = Math.floor(10);
	var hallWOffset = (middle - Math.floor(hallWidth /2));
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
				Lynx.Scene.AddEntity(this.nHall);

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
				Lynx.Scene.AddEntity(this.sHall);
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
				Lynx.Scene.AddEntity(this.eHall);
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
				Lynx.Scene.AddEntity(this.wHall);
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
walk = function(room, maxDepth, minRooms, depth) {

	var createRooms = function(room, maxDepth, depth) {
		if (depth >= maxDepth || !room) {
			return;
		}
		//Sometime create a coridor three rooms long.
		if (Math.random() >= 0.8) {

			var direction = _.sample(['n', 's', 'w', 'e']);
			var x = 0;
			newRoom = room.addRoom(direction);
			while (newRoom && x < 3) {
				x += 1;
				newRoom = newRoom.addRoom(direction);
			}
			if (newRoom) {
				createRooms(newRoom, maxDepth, depth + 1);
			}
		}
		//debugger;
		//Randomly create rooms in each direction.
		if (Math.random() >= 0.6) {
			if (room.addRoom('n')) {
				createRooms(room.North, maxDepth, depth + 1);
			}
		}
		if (Math.random() >= 0.6) {
			if (room.addRoom('s')) {
				createRooms(room.South, maxDepth, depth + 1);
			}
		}
		if (Math.random() >= 0.6) {
			if (room.addRoom('e')) {
				createRooms(room.East, maxDepth, depth + 1);
			}
		}
		if (Math.random() >= 0.6) {
			if (room.addRoom('w')) {
				createRooms(room.West, maxDepth, depth + 1);
			}
		}
	}

	var initialRoomNum = World.Rooms.content.length;
	createRooms(room, maxDepth, depth);
	while (World.Rooms.content.length < minRooms) {
		//var randRoom = _.sample(World.Rooms.content);
		createRooms(room, maxDepth, depth);

	}

};