using System;
using UnityEngine;

public class UnitStateMarkedAsFinished : UnitState
{
    public UnitStateMarkedAsFinished(Unit unit) : base(unit)
    {      
    }

    public override void Apply()
    {
        _unit.MarkAsFinished();
		int x = _unit.GetComponent<Avatar>().AvatarIndex+1;
		if(x > 3){
			x = 0;
		}
		_unit.selectUnitBtn(x);
    }

    public override void MakeTransition(UnitState state)
    {
        if(state is UnitStateNormal)
        {
            state.Apply();
            _unit.UnitState = state;
        }
    }
}

