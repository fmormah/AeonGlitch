using UnityEngine;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Collections;
using System.IO;


class CellGridStateUnitSelected : CellGridState
{
    private Unit _unit;
    private List<Cell> _pathsInRange;
    private List<Unit> _unitsInRange;
	private List<Cell> _abilityRange;


    private Cell _unitCell;

    public CellGridStateUnitSelected(CellGrid cellGrid, Unit unit) : base(cellGrid)
    {
        _unit = unit;
        _pathsInRange = new List<Cell>();
        _unitsInRange = new List<Unit>();
		_abilityRange = new List<Cell>();
    }

    public override void OnCellClicked(Cell cell)
    {
		
	        if (_unit.isMoving)
	            return;
	        if(cell.IsTaken)
	        {
	            _cellGrid.CellGridState = new CellGridStateWaitingForInput(_cellGrid);
	            return;
	        }
	            
	        if(!_pathsInRange.Contains(cell))
	        {
	            _cellGrid.CellGridState = new CellGridStateWaitingForInput(_cellGrid);
	        }
	        else
	        {
	            var path = _unit.FindPath(_cellGrid.Cells, cell);
	            _unit.Move(cell,path);
	            _cellGrid.CellGridState = new CellGridStateUnitSelected(_cellGrid, _unit);
	        }

			foreach(Cell c in _cellGrid.Cells){
				if(c.isWithinAbilityRange){
					c.isWithinAbilityRange = false;
					c.UnMark();
					if(c.returnCellUnit(c) != null){
						c.returnCellUnit(c).GetComponent<Avatar>().RemoveAoeUI();
					}
				}
			}
		
    }
    public override void OnUnitClicked(Unit unit)
    {
		if(!Unit.inAttackAnimation){
			//_abilityRange = _unit.ShowAbilityRange(_cellGrid.Cells);

			if(unit.Cell.isWithinAbilityRange){
				_unit.launchAbility();
				//_unit.abilityReadyToFire = false;

				foreach(Cell c in _cellGrid.Cells){
					if(c.isWithinAbilityRange){
						c.isWithinAbilityRange = false;
						if(c.returnCellUnit(c) != null){
							c.returnCellUnit(c).GetComponent<Avatar>().RemoveAoeUI();
						}
					}
				}

				if(_unit.abilityHitsSelf){
					_unit.GetComponent<Avatar>().RemoveAoeUI();
				}
			}


	        if (unit.Equals(_unit) || unit.isMoving)
	            return;

	        if (_unitsInRange.Contains(unit) && _unit.ActionPoints > 0)
	        {
	            _unit.DealDamage(unit);
	            _cellGrid.CellGridState = new CellGridStateUnitSelected(_cellGrid, _unit);
	        }

	        if (unit.PlayerNumber.Equals(_unit.PlayerNumber))
	        {
	            _cellGrid.CellGridState = new CellGridStateUnitSelected(_cellGrid, unit);
	        }
		}
            
    }
    public override void OnCellDeselected(Cell cell)
    {
        base.OnCellDeselected(cell);

        foreach (var _cell in _pathsInRange)
        {
            _cell.MarkAsReachable();
        }
		foreach (var _cell in _abilityRange)
		{
			_cell.MarkAsAbilityReachable();
		}
        foreach (var _cell in _cellGrid.Cells.Except(_pathsInRange))
        {
			if(!_cell.isWithinAbilityRange){
            	_cell.UnMark();
			}
        }
    }
    public override void OnCellSelected(Cell cell)
    {
        base.OnCellSelected(cell);
        if (!_pathsInRange.Contains(cell)) return;
        var path = _unit.FindPath(_cellGrid.Cells, cell);
        foreach (var _cell in path)
        {
			_cell.MarkAsPath();
        }
    }


	public void showAbilityRange()
	{
		//replace 0 with ability cost
		if(_unit.ActionPoints > 0){
			_abilityRange = _unit.ShowAbilityRange(_cellGrid.Cells);

			if(_unit.GetComponent<Unit>().abilityHitsSelf){
				_abilityRange.Add(_unit.Cell);
			}

			foreach (var cell in _abilityRange)
			{
				cell.MarkAsAbilityReachable();

				if(cell.returnCellUnit(cell) != null){


					GameObject u = cell.returnCellUnit(cell);

					//Debug.Log(u.name);

					if(u.GetComponent<Unit>().Cell == cell){
						
						u.GetComponent<Unit>().aoeInstance = u.GetComponent<Avatar>().newAoeUI();

						GameObject aoeObj = u.GetComponent<Unit>().aoeInstance;
						//Debug.Log(aoeObj.name);
						//cell.MarkAsAbilityReachable();

						if(aoeObj != null){
							aoeObj.transform.position = new Vector3(u.transform.position.x,  u.transform.position.y,  u.transform.position.z);
							aoeObj.GetComponent<SpriteRenderer>().sortingOrder =  u.GetComponent<SpriteRenderer>().sortingOrder - 1;
							cell.isWithinAbilityRange = true;
						}

						_unit.aoeCells = u.GetComponent<Unit>().ShowAOERange(_abilityRange,_unit.aoeRange);
						if(_unit.GetComponent<Unit>().abilityHitsSelf){
							_unit.aoeCells.Add(_unit.Cell);
						}

						foreach (var aoeCell in _unit.aoeCells)
						{
							//aoeCell.MarkAsAOE();
						}

					}


				}
			}
		}
	}

    public override void OnStateEnter()
    {
		
        base.OnStateEnter();

        _unit.OnUnitSelected();
        _unitCell = _unit.Cell;
		//_unit.abilityReadyToFire = false;

        _pathsInRange = _unit.GetAvailableDestinations(_cellGrid.Cells);
        var cellsNotInRange = _cellGrid.Cells.Except(_pathsInRange);

        foreach (var cell in cellsNotInRange)
        {
			if(!cell.isWithinAbilityRange){
				cell.UnMark();
			}
        }
        foreach (var cell in _pathsInRange)
        {
            cell.MarkAsReachable();
        }

        if (_unit.ActionPoints <= 0) return;

        foreach (var currentUnit in _cellGrid.Units)
        {
            if (currentUnit.PlayerNumber.Equals(_unit.PlayerNumber))
                continue;

            var cell = currentUnit.Cell;
            if (cell.GetDistance(_unitCell) <= _unit.AttackRange)
            {
                currentUnit.SetState(new UnitStateMarkedAsReachableEnemy(currentUnit));
                _unitsInRange.Add(currentUnit);
            }
        }
        
        if (_unitCell.GetNeighbours(_cellGrid.Cells).FindAll(c => c.MovementCost <= _unit.MovementPoints).Count == 0 
			&& _unitsInRange.Count == 0){
            _unit.SetState(new UnitStateMarkedAsFinished(_unit));
		}

		foreach(Cell c in _cellGrid.Cells){
			if(c.isWithinAbilityRange){
				c.isWithinAbilityRange = false;
				if(c.returnCellUnit(c) != null){
					c.returnCellUnit(c).GetComponent<Avatar>().RemoveAoeUI();
				}
			}
		}

    }
    public override void OnStateExit()
    {
        _unit.OnUnitDeselected();
        foreach (var unit in _unitsInRange)
        {
            if (unit == null) continue;
            unit.SetState(new UnitStateNormal(unit));
        }
        foreach (var cell in _cellGrid.Cells)
        {
			if(!cell.isWithinAbilityRange){
				cell.UnMark();
			}
        }   
    }
}

