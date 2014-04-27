var MoveAction = new Action("Move", 2000);

MoveAction.Use = function(pEntity) {

	if (Math.random() > 0.6) {
		var currentRoom = pEntity.GetRoom();
		var directions = currentRoom.getMovableDirs();
		pEntity.Move(_.sample(directions));
	}

};