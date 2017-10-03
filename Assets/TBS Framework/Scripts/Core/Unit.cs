using UnityEngine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Collections;

/// <summary>
/// Base class for all units in the game.
/// </summary>
public abstract class Unit : MonoBehaviour
{
    /// <summary>
    /// UnitClicked event is invoked when user clicks the unit. It requires a collider on the unit game object to work.
    /// </summary>
    public event EventHandler UnitClicked;
    /// <summary>
    /// UnitSelected event is invoked when user clicks on unit that belongs to him. It requires a collider on the unit game object to work.
    /// </summary>

    public event EventHandler UnitSelected;
    public event EventHandler UnitDeselected;
    /// <summary>
    /// UnitHighlighted event is invoked when user moves cursor over the unit. It requires a collider on the unit game object to work.
    /// </summary>
    public event EventHandler UnitHighlighted;
    public event EventHandler UnitDehighlighted;
    public event EventHandler<AttackEventArgs> UnitAttacked;
    public event EventHandler<AttackEventArgs> UnitDestroyed;
    public event EventHandler<MovementEventArgs> UnitMoved;

    public UnitState UnitState { get; set; }
    public void SetState(UnitState state)
    {
        UnitState.MakeTransition(state);
    }
	bool isTurnEnd = false;

    public List<Buff> Buffs { get; private set; }

    public int TotalHitPoints { get; private set; }
    protected int TotalMovementPoints;
    protected int TotalActionPoints;

    /// <summary>
    /// Cell that the unit is currently occupying.
    /// </summary>
    public Cell Cell { get; set; }


    public int HitPoints;
    public int AttackRange;
    public int AttackFactor;
    public int DefenceFactor;
	public int ActionPoints;
    public int MovementPoints;
	public int Level;
	public int Evasion;
	public string name;
	public int EXP;



    /// <summary>
    /// Determines speed of movement animation.
    /// </summary>
    public float MovementSpeed;
    
    /// <summary>
    /// Indicates the player that the unit belongs to. Should correspoond with PlayerNumber variable on Player script.
    /// </summary>
    public int PlayerNumber;

    /// <summary>
    /// Indicates if movement animation is playing.
    /// </summary>
    public bool isMoving { get; set; }

	public Unit thisUnitsTarget;

    private static IPathfinding _pathfinder = new AStarPathfinding();

	public int rangeOfAbility = 5;

	public Action<int> selectUnitBtn;
	public Action endTeamTurn;
	public Action<int> abilityRange;
	public Action launchAbility;
	public float aoeRange = 0;
	public float abilityRangeUI = 0;
	public bool abilityReadyToFire = false;
	public List<Cell> aoeCells;
	public List<string> excludedTargets;

	public bool abilityHitsSelf = false;

	public bool callTurnStart = false;

	public string abilityName = "";

	public GameObject aoeInstance;

	public Animator anim;
	public static bool inAttackAnimation = false;

	public static Unit abilityTarget;


    /// <summary>
    /// Method called after object instantiation to initialize fields etc. 
    /// </summary>
    public virtual void Initialize()
    {
		if(gameObject.GetComponent<Animator>() != null){
			anim = gameObject.GetComponent<Animator>();
		}
        Buffs = new List<Buff>();

        UnitState = new UnitStateNormal(this);

        TotalHitPoints = HitPoints;
        TotalMovementPoints = MovementPoints;
        TotalActionPoints = ActionPoints;
    }


	public void changeAnimation(string name){
		
		if(anim != null){
			switch (name.ToLower())
			{
				case "idle":
					anim.SetInteger("animState",0);
				break;
				case "move":
					anim.SetInteger("animState",1);
					TouchCamera.isInAction = true;
				break;
				case "melee":
					inAttackAnimation = true;
					anim.SetInteger("animState",2);
					TouchCamera.isInAction = true;
				break;
				case "range":
					inAttackAnimation = true;
					anim.SetInteger("animState",3);
					TouchCamera.isInAction = true;
				break;
				case "hit":
					anim.SetInteger("animState",4);
				break;
				case "focus":
					inAttackAnimation = true;
					anim.SetInteger("animState",5);
				break;
				default:
					anim.SetInteger("animState",0);
				break;
			}
		}

	}


	public void OnMouseDown()
    {
		
		if(Cell.isWithinAbilityRange){
			abilityTarget = this;
		}
		if (UnitClicked != null){
            UnitClicked.Invoke(this, new EventArgs());
		}
		
    }


    public virtual void OnMouseEnter()
    {
		if (UnitHighlighted != null){
            UnitHighlighted.Invoke(this, new EventArgs());
		}
    }
    protected virtual void OnMouseExit()
    {
		if (UnitDehighlighted != null){
            UnitDehighlighted.Invoke(this, new EventArgs());
		}
    }
    
    public virtual void DealDamage(Unit other)
    {
		if (isMoving){
            return;
		}
		
		if (ActionPoints == 0){
            return;
		}


        ActionPoints--;
        other.Defend(this, AttackFactor);

        if (ActionPoints == 0)
        {
            SetState(new UnitStateMarkedAsFinished(this));
            MovementPoints = 0;
        }  

		if(!abilityReadyToFire){
			MarkAsAttacking(other);
		}else{
			abilityReadyToFire = false;
		}
    }
    /// <summary>
    /// Attacking unit calls Defend method on defending unit. 
    /// </summary>
    
	public void showHit(){
		if(thisUnitsTarget.anim!= null){
			thisUnitsTarget.changeAnimation("hit");
		}
	}

	protected virtual void Defend(Unit other, int damage)
    {
		//Debug.Log(other.gameObject.tag+" ready to attack is: "+other.abilityReadyToFire);
       

		if(!other.abilityReadyToFire){
			HitPoints -= Mathf.Clamp(damage - DefenceFactor, 1, damage);  //Damage is calculated by subtracting attack factor of attacker and defence factor of defender. If result is below 1, it is set to 1.
		}

		MarkAsDefending(other);
	

		if (UnitAttacked != null)
            UnitAttacked.Invoke(this, new AttackEventArgs(other, this, damage));

        if (HitPoints <= 0)
        {
            if (UnitDestroyed != null)
                UnitDestroyed.Invoke(this, new AttackEventArgs(other, this, damage));
            OnDestroyed();
        }
    }

	public void takeHit(Unit other, int damage)
	{
		//Debug.Log(other.gameObject.tag+" ready to attack is: "+other.abilityReadyToFire);
		MarkAsDefending(other);
	

		HitPoints -= Mathf.Clamp(damage - DefenceFactor, 1, damage);  //Damage is calculated by subtracting attack factor of attacker and defence factor of defender. If result is below 1, it is set to 1.

		if (UnitAttacked != null)
			UnitAttacked.Invoke(this, new AttackEventArgs(other, this, damage));

		if (HitPoints <= 0)
		{
			if (UnitDestroyed != null)
				UnitDestroyed.Invoke(this, new AttackEventArgs(other, this, damage));
			OnDestroyed();
		}
	}


	public void moveToNextAvatar(int index){

		foreach (Avatar gameObj in Avatar.avatarList)
		{
			if(gameObj != null){
				if(gameObj.tag == "Player")
				{
					
					if(gameObj.GetComponent<Avatar>().AvatarIndex == index){
						gameObj.GetComponent<Unit>().selectUnitBtn(index);//.OnMouseDown();
						gameObj.GetComponent<Unit>().OnMouseDown();
					}
				}
			}
		}

	}

    public virtual void Move(Cell destinationCell, List<Cell> path)
    {
        if (isMoving)
            return;

        var totalMovementCost = path.Sum(h => h.MovementCost);
        if (MovementPoints < totalMovementCost)
            return;

        MovementPoints -= totalMovementCost;

        Cell.IsTaken = false;
        Cell = destinationCell;
        destinationCell.IsTaken = true;

		if (MovementSpeed > 0){
            StartCoroutine(MovementAnimation(path));
		}
		else{
            transform.position = Cell.transform.position;
		}

        if (UnitMoved != null)
            UnitMoved.Invoke(this, new MovementEventArgs(Cell, destinationCell, path));    
    }
    protected virtual IEnumerator MovementAnimation(List<Cell> path)
    {
        isMoving = true;

		changeAnimation("move");

        path.Reverse();
        foreach (var cell in path)
        {
            while (new Vector2(transform.position.x,transform.position.y) != new Vector2(cell.transform.position.x,cell.transform.position.y))
            {
				if(cell.transform.position.x > transform.position.x){
					transform.localRotation = Quaternion.Euler(0, 0, 0);
				}else{
					transform.localRotation = Quaternion.Euler(0, 180, 0);
				}
                transform.position = Vector3.MoveTowards(transform.position, new Vector3(cell.transform.position.x,cell.transform.position.y,transform.position.z), Time.deltaTime * MovementSpeed);
                yield return 0;
            }
        }
        isMoving = false;
		changeAnimation("idle");
		StopCoroutine(MovementAnimation(path));
    }

    /// <summary>
    /// Method is called at the start of each turn.
    /// </summary>
    public virtual void OnTurnStart()
    {
        MovementPoints = TotalMovementPoints;
        ActionPoints = TotalActionPoints;
		isTurnEnd = false;

        SetState(new UnitStateMarkedAsFriendly(this));

		callTurnStart = true;
    }
    /// <summary>
    /// Method is called at the end of each turn.
    /// </summary>
    public virtual void OnTurnEnd()
    {
        Buffs.FindAll(b => b.Duration == 0).ForEach(b => { b.Undo(this); });
        Buffs.RemoveAll(b => b.Duration == 0);
        Buffs.ForEach(b => { b.Duration--; });

        SetState(new UnitStateNormal(this));
		isTurnEnd = true;

		if(this.tag == "Player"){
			int nextIndex = this.GetComponent<Avatar>().AvatarIndex + 1;
			if(nextIndex > 3){
				nextIndex = 0;
			}
			moveToNextAvatar(nextIndex);
		}

		//Debug.Log("Player Number: "+PlayerNumber);
		//selectUnitBtn();
    }
    /// <summary>
    /// Method is called when units HP drops below 1.
    /// </summary>
    protected virtual void OnDestroyed()
    {
        Cell.IsTaken = false;
        MarkAsDestroyed();
        Destroy(gameObject);
    }

    /// <summary>
    /// Method is called when unit is selected.
    /// </summary>
    public virtual void OnUnitSelected()
    {
        SetState(new UnitStateMarkedAsSelected(this));
		if (UnitSelected != null){
            UnitSelected.Invoke(this, new EventArgs());
		}

    }
    /// <summary>
    /// Method is called when unit is deselected.
    /// </summary>
    public virtual void OnUnitDeselected()
    {
        SetState(new UnitStateMarkedAsFriendly(this));
		if (UnitDeselected != null){
            UnitDeselected.Invoke(this, new EventArgs());
		}

    }

    ///<summary>
    /// Method indicates if unit is capable of moving to cell given as parameter.
    /// </summary>
    public virtual bool IsCellMovableTo(Cell cell)
    {
        return !cell.IsTaken;
    }
    /// <summary>
    /// Method indicates if unit is capable of moving through cell given as parameter.
    /// </summary>
    public virtual bool IsCellTraversable(Cell cell)
    {
        return !cell.IsTaken;
    }
    /// <summary>
    /// Method returns all cells that the unit is capable of moving to.
    /// </summary>
    public List<Cell> GetAvailableDestinations(List<Cell> cells)
    {
        var ret = new List<Cell>();
        var cellsInMovementRange = cells.FindAll(c => IsCellMovableTo(c) && c.GetDistance(Cell) <= MovementPoints);

        var traversableCells = cells.FindAll(c => IsCellTraversable(c) && c.GetDistance(Cell) <= MovementPoints);
        traversableCells.Add(Cell);

        foreach (var cellInRange in cellsInMovementRange)
        {
            if (cellInRange.Equals(Cell)) continue;

            var path = FindPath(traversableCells, cellInRange);
            var pathCost = path.Sum(c => c.MovementCost);
            if(pathCost > 0 && pathCost <= MovementPoints)
                ret.AddRange(path);
        }
        return ret.FindAll(IsCellMovableTo).Distinct().ToList();
    }

    public List<Cell> FindPath(List<Cell> cells, Cell destination)
    {
        return _pathfinder.FindPath(GetGraphEdges(cells), Cell, destination);
    }
	/// <summary>
	/// Method returns all cells that the unit's ability is capable of moving to.
	/// </summary>
	public List<Cell> ShowAbilityRange(List<Cell> cells)
	{
		var ret = new List<Cell>();
		var cellsInMovementRange = cells.FindAll(c => c.GetDistance(Cell) <= rangeOfAbility);

		var traversableCells = cells.FindAll(c => c.GetDistance(Cell) <= rangeOfAbility);
		traversableCells.Add(Cell);

		foreach (var cellInRange in cellsInMovementRange)
		{
			if (cellInRange.Equals(Cell)) continue;

			ret.AddRange(cellsInMovementRange);
		}
		return ret;//.FindAll(IsCellMovableTo).Distinct().ToList();
	}

	public List<Cell> ShowAOERange(List<Cell> cells, float aoeRange)
	{
		aoeRange--;
		var ret = new List<Cell>();
		var cellsInMovementRange = cells.FindAll(c => c.GetDistance(Cell) <= aoeRange);

		var traversableCells = cells.FindAll(c => c.GetDistance(Cell) <= aoeRange);
		traversableCells.Add(Cell);

		foreach (var cellInRange in cellsInMovementRange)
		{
			if (cellInRange.Equals(Cell)) continue;

			ret.AddRange(cellsInMovementRange);
		}
		return ret;//.FindAll(IsCellMovableTo).Distinct().ToList();
	}
    /// <summary>
    /// Method returns graph representation of cell grid for pathfinding.
    /// </summary>
    protected virtual Dictionary<Cell, Dictionary<Cell, int>> GetGraphEdges(List<Cell> cells)
    {
        Dictionary<Cell, Dictionary<Cell, int>> ret = new Dictionary<Cell, Dictionary<Cell, int>>();
        foreach (var cell in cells)
        {
            if (IsCellTraversable(cell) || cell.Equals(Cell))
            {
                ret[cell] = new Dictionary<Cell, int>();
                foreach (var neighbour in cell.GetNeighbours(cells).FindAll(IsCellTraversable))
                {
                    ret[cell][neighbour] = neighbour.MovementCost;
                }
            }
        }
        return ret;
    }

    /// <summary>
    /// Gives visual indication that the unit is under attack.
    /// </summary>
    /// <param name="other"></param>
    public abstract void MarkAsDefending(Unit other);
    /// <summary>
    /// Gives visual indication that the unit is attacking.
    /// </summary>
    /// <param name="other"></param>
    public abstract void MarkAsAttacking(Unit other);
    /// <summary>
    /// Gives visual indication that the unit is destroyed. It gets called right before the unit game object is
    /// destroyed, so either instantiate some new object to indicate destruction or redesign Defend method. 
    /// </summary>
    public abstract void MarkAsDestroyed();

    /// <summary>
    /// Method marks unit as current players unit.
    /// </summary>
    public abstract void MarkAsFriendly();
    /// <summary>
    /// Method mark units to indicate user that the unit is in range and can be attacked.
    /// </summary>
    public abstract void MarkAsReachableEnemy();
    /// <summary>
    /// Method marks unit as currently selected, to distinguish it from other units.
    /// </summary>
    public abstract void MarkAsSelected();
    /// <summary>
    /// Method marks unit to indicate user that he can't do anything more with it this turn.
    /// </summary>
    public abstract void MarkAsFinished();
    /// <summary>
    /// Method returns the unit to its base appearance
    /// </summary>
    public abstract void UnMark();

}

public class MovementEventArgs : EventArgs
{
    public Cell OriginCell;
    public Cell DestinationCell;
    public List<Cell> Path;

    public MovementEventArgs(Cell sourceCell, Cell destinationCell, List<Cell> path)
    {
        OriginCell = sourceCell;
        DestinationCell = destinationCell;
        Path = path;
    }
}
public class AttackEventArgs : EventArgs
{
    public Unit Attacker;
    public Unit Defender;

    public int Damage;

    public AttackEventArgs(Unit attacker, Unit defender, int damage)
    {
        Attacker = attacker;
        Defender = defender;

        Damage = damage;
    }
}
