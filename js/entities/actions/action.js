var Action = function (pName, pCost) {
	this.Name = pName || "";
	this.Cost = pCost || 1;
	this.Use = function (pEntity) {};
};