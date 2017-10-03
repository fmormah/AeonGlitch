using System.Linq;
using UnityEngine;
using System;
using System.Collections.Generic;


public abstract class CellGridState
{
    protected CellGrid _cellGrid;
    
    protected CellGridState(CellGrid cellGrid)
    {
        _cellGrid = cellGrid;
    }

    public virtual void OnUnitClicked(Unit unit)
    { }
    
    public virtual void OnCellDeselected(Cell cell)
    {
		if(!cell.isWithinAbilityRange){
        	cell.UnMark();
		}
    }
    public virtual void OnCellSelected(Cell cell)
    {
		if(!cell.isWithinAbilityRange){
        	cell.MarkAsHighlighted();
		}
    }
    public virtual void OnCellClicked(Cell cell)
    { }

	public virtual void OnInit(Unit u, CellGrid cell)
	{ }

    public virtual void OnStateEnter()
    {
        if (_cellGrid.Units.Select(u => u.PlayerNumber).Distinct().ToList().Count == 1)
        {
            _cellGrid.CellGridState = new CellGridStateGameOver(_cellGrid);
        }
    }
    public virtual void OnStateExit()
    {
    }
}