var MoveAction = new Action("Move", 2000);

MoveAction.Use = function(pEntity) {

	if (Math.random() > 0.6) {
		var currentRoom = pEntity.GetRoom();
		var directions = currentRoom.getMovableDirs();
		pEntity.Move(_.sample(directions));
	}
};


var HeroMoveAction = new Action("HeroMove", 2000);
HeroMoveAction.Use = function(pEntity) {
	var lastMoveDirection = pEntity.lastMoveDirection;
	if (Math.random() > 0.6) {
		var currentRoom = pEntity.GetRoom();
		var directions = currentRoom.getMovableDirs();
		if (directions.length > 1 && lastMoveDirection) {
			var remove = undefined;
			if (lastMoveDirection === 'n') {
				remove = 's';
			} else if (lastMoveDirection === 's') {
				remove = 'n'
			} else if (lastMoveDirection === 'e') {
				remove = 'w'
			} else if (lastMoveDirection === 'w') {
				remove = 'e'
			}

			_.remove(directions, function(dir) {
				return dir === remove;
			});
		}
		pEntity.Move(_.sample(directions));
	}
};

//The scout move is very fast, and heals the scout 1 HP
//for every move;
var ScoutMoveAction = new Action("ScoutMoveAction", 250);
ScoutMoveAction.Use = function(pEntity) {
	var lastMoveDirection = pEntity.lastMoveDirection;
	if (Math.random() > 0.6) {
		var currentRoom = pEntity.GetRoom();
		var directions = currentRoom.getMovableDirs();
		if (directions.length > 1 && lastMoveDirection) {
			var remove = undefined;
			if (lastMoveDirection === 'n') {
				remove = 's';
			} else if (lastMoveDirection === 's') {
				remove = 'n'
			} else if (lastMoveDirection === 'e') {
				remove = 'w'
			} else if (lastMoveDirection === 'w') {
				remove = 'e'
			}

			_.remove(directions, function(dir) {
				return dir === remove;
			});
		}

		//Heal!
		pEntity.HealthDelta -= 1;
		if (pEntity.HealthDelta < 0) {
			pEntity.HealthDelta = 0;
		}

		pEntity.Move(_.sample(directions));
	}
};