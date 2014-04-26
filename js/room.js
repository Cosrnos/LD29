Game.Rooms = {

	content: [], //Array that contains all the rooms.

	//Add a room to the room array
	push: function(room) {
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
Game.Room = function(x, y) {

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
	this.type = {}; //The type of room this is.
	this.mobs = []; //A list of creatures in the room.

	this.entity = new Lynx.Entity(x, y, 40, 40);
	this.entity.Color = 0xDEADBE;
	Lynx.Scene.AddEntity(this.entity);

	//Add hallway
	this.nHall = new Lynx.Entity(x + 17, y - 10, 6, 10);
	this.nHall.Color = 0xFF0000;
	this.sHall = new Lynx.Entity(x + 17, y + 40, 6, 10);
	this.sHall.Color = 0xFF0000;
	this.eHall = new Lynx.Entity(x + 40, y + 17, 10, 6);
	this.eHall.Color = 0xFF0000;
	this.wHall = new Lynx.Entity(x - 10, y + 17, 10, 6);
	this.wHall.Color = 0xFF0000;

	//This add a room or creates a connection to an already existing room in the specified direction.
	this.addRoom = function(direction) {
		var newRoom;
		var error = '';

		direction = direction.toLowerCase();
		if (direction === "n" || direction === "north") {
			if (this.North === null) {
				//Check to see if thee is a room in that direction that this room isn't yet connected to.
				var foundRoom = Game.Rooms.findRoom(x, y - 50)
				if (foundRoom) {
					this.North = foundRoom;
					foundRoom.South = this;
				} else {
					newRoom = new Game.Room(x, y - 50);
					this.North = newRoom;
					newRoom.South = this;
				}
				Lynx.Scene.AddEntity(this.nHall);

			} else {
				error = "Room to the North already exists."
			}

		} else if (direction === "s" || direction === "south") {

			if (this.South === null) {
				var foundRoom = Game.Rooms.findRoom(x, y + 50)
				if (foundRoom) {
					this.South = foundRoom;
					foundRoom.North = this;
				} else {
					newRoom = new Game.Room(x, y + 50);
					this.South = newRoom;
					newRoom.North = this;
				}
				Lynx.Scene.AddEntity(this.sHall);
			} else {
				error = "Room to the South already exists."
			}

		} else if (direction === "e" || direction === "east") {
			if (this.East === null) {
				var foundRoom = Game.Rooms.findRoom(x + 50, y)
				if (foundRoom) {
					this.East = foundRoom;
					foundRoom.West = this;
				} else {
					newRoom = new Game.Room(x + 50, y);
					this.East = newRoom;
					newRoom.West = this;
				}
				Lynx.Scene.AddEntity(this.eHall);
			} else {
				error = "Room to the East already exists."
			}
		} else if (direction === "w" || direction === "west") {

			if (this.West === null) {
				var foundRoom = Game.Rooms.findRoom(x - 50)
				if (foundRoom) {
					this.West = foundRoom;
					foundRoom.East = this;
				} else {
					newRoom = new Game.Room(x - 50, y);
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
			console.log(error)
			delete newRoom;
			return false;
		}
		if (newRoom) {
			newRoom.id = Game.Rooms.content.length;
			Game.Rooms.push(newRoom);
			return newRoom;
		} else if (foundRoom) {
			return foundRoom
		} else
			return false;
	}
};


//This creates a kinda-random dungeon, starting from 'room'
walk = function(room, maxDepth, depth) {
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
			walk(newRoom, maxDepth, depth + 1);
		}
	}
	debugger;
	//Randomly create rooms in each direction.
	if (Math.random() >= 0.6) {
		if (room.addRoom('n')) {
			walk(room.North, maxDepth, depth + 1);
		}
	}
	if (Math.random() >= 0.6) {
		if (room.addRoom('s')) {
			walk(room.South, maxDepth, depth + 1);
		}
	}
	if (Math.random() >= 0.6) {
		if (room.addRoom('e')) {
			walk(room.East, maxDepth, depth + 1);
		}
	}
	if (Math.random() >= 0.6) {
		if (room.addRoom('w')) {
			walk(room.West, maxDepth, depth + 1);
		}
	}
};