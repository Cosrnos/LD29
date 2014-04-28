var deathRayAction = new Action("DeathRay", 20000);
deathRayAction.Use = function (pEntity, pTarget) {
	pTarget.TakeDamage(pEntity.BaseAttack * 5, pEntity);
};