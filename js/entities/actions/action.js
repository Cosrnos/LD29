Actions = [];

var Action = function(pName, pCooldown) {
	this.Name = pName || "";
	this.Cooldown = pCooldown || 500;
	this.CanUseAt = 0;
	this.Use = function(pEntity) {};

	Actions.push(this);
};