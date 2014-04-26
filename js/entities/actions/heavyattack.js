var HeavyAttackAction = new Action("Heavy Attack", 1000);

HeavyAttackAction.Use = function (pEntity, pTarget) {
	pTarget.TakeDamage(pEntity.BaseAttack * 1.5, pEntity);
};