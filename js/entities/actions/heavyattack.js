var HeavyAttackAction = new Action("Heavy Attack", 3);

HeavyAttackAction.Use = function (pEntity, pTarget) {
	Lynx.Log(pEntity.Name + " used Heavy Attack!!");
	pTarget.TakeDamage(pEntity.BaseAttack * 2, pEntity);
};