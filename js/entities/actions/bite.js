var BiteAction = new Action("Bite", 1500);
BiteAction.Use = function (pEntity, pTarget) {
	pTarget.TakeDamage(pEntity.BaseAttack * 1.2, pEntity);
};