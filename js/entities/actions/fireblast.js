var FireblastAction = new Action("Fireblast", 2000);

FireblastAction.Use = function (pEntity, pTarget) {
	pTarget.TakeDamage(pEntity.BaseMagic * 1.5, pEntity);
};