var AttackAction = new Action("Attack", 500);

AttackAction.Use = function (pEntity, pTarget) {
	pTarget.TakeDamage(pEntity.BaseAttack, pEntity);
};