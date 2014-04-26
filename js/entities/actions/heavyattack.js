var HeavyAttackAction = new Action("Heavy Attack", 1000);

HeavyAttackAction.Use = function (pEntity, pTarget) {
	Lynx.Log(pEntity.Name + " used Heavy Attack!!");
	pTarget.TakeDamage(pEntity.BaseAttack * 2, pEntity);
};