var AttackAction = new Action("Attack", 1);

AttackAction.Use = function (pEntity, pTarget) {
	pTarget.TakeDamage(pEntity.BaseAttack, pEntity);
};