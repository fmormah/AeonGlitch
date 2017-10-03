using UnityEngine;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Collections;

/// <summary>
/// CellGrid class keeps track of the game, stores cells, units and players objects. It starts the game and makes turn transitions. 
/// It reacts to user interacting with units or cells, and raises events related to game progress. 
/// </summary>
public class CellGrid : MonoBehaviour
{
    public event EventHandler GameStarted;
    public event EventHandler GameEnded;
    public event EventHandler TurnEnded;

	bool winnerDecleared = false;
	int charRef = 0;
    
    private CellGridState _cellGridState;//The grid delegates some of its behaviours to cellGridState object.
    public CellGridState CellGridState
    {
        private get
        {
            return _cellGridState;
        }
        set
        {
            if(_cellGridState != null)
                _cellGridState.OnStateExit();
            _cellGridState = value;
            _cellGridState.OnStateEnter();
        }
    }

    public int NumberOfPlayers { get; private set; }

    public Player CurrentPlayer
    {
        get { return Players.Find(p => p.PlayerNumber.Equals(CurrentPlayerNumber)); }
    }
    public int CurrentPlayerNumber { get; private set; }

    public Transform PlayersParent;

    public List<Player> Players { get; private set; }
    public List<Cell> Cells { get; private set; }
    public List<Unit> Units { get; private set; }

    void Start()
    {
        Players = new List<Player>();
        for (int i = 0; i < PlayersParent.childCount; i++)
        {
            var player = PlayersParent.GetChild(i).GetComponent<Player>();
            if (player != null)
                Players.Add(player);
            else
                Debug.LogError("Invalid object in Players Parent game object");
        }
        NumberOfPlayers = Players.Count;
        CurrentPlayerNumber = Players.Min(p => p.PlayerNumber);

        var gridGenerator = GetComponent<ICellGridGenerator>();
        if (gridGenerator != null)
        {
            Cells = gridGenerator.GenerateGrid();
            foreach (var cell in Cells)
            {
                cell.CellClicked += OnCellClicked;
                cell.CellHighlighted += OnCellHighlighted;
                cell.CellDehighlighted += OnCellDehighlighted;
            }
        }      
        else
            Debug.LogError("No ICellGridGenerator script attached to cell grid");

        var unitGenerator = GetComponent<IUnitGenerator>();
        if (unitGenerator != null)
        {
            Units = unitGenerator.SpawnUnits(Cells);
            foreach (var unit in Units)
            {
                unit.UnitClicked += OnUnitClicked;
                unit.UnitDestroyed += OnUnitDestroyed;
            }
        }
        else
            Debug.LogError("No IUnitGenerator script attached to cell grid");
        
        StartGame();
    }

    private void OnCellDehighlighted(object sender, EventArgs e)
    {
        CellGridState.OnCellDeselected(sender as Cell);
    }
    private void OnCellHighlighted(object sender, EventArgs e)
    {
        CellGridState.OnCellSelected(sender as Cell);
    } 
    private void OnCellClicked(object sender, EventArgs e)
    {
        CellGridState.OnCellClicked(sender as Cell);
    }

    private void OnUnitClicked(object sender, EventArgs e)
    {
        CellGridState.OnUnitClicked(sender as Unit);
    }
    private void OnUnitDestroyed(object sender, AttackEventArgs e)
    {
        Units.Remove(sender as Unit);
        var totalPlayersAlive = Units.Select(u => u.PlayerNumber).Distinct().ToList(); //Checking if the game is over
        if (totalPlayersAlive.Count == 1)
        {
			GameEnded += OnGameEnded;
			if(GameEnded != null){
                GameEnded.Invoke(this, new EventArgs());
       		
			}
		}
    }

	public void OnGameEnded(object sender, EventArgs e)
	{
		charRef = ((sender as CellGrid).CurrentPlayerNumber);
		winnerDecleared = true;
		Debug.Log("Player " + ((sender as CellGrid).CurrentPlayerNumber) + " wins!");
	}

	void OnGUI(){
		if(winnerDecleared){
			string endGmaebtn ="";

			if(charRef == 0){
				endGmaebtn = "You WIN!!";
			}else{
				endGmaebtn = "You Lose..";
			}

			if (GUI.Button(new Rect(10, Screen.height/2 , Screen.width - 20, 100), endGmaebtn)){
				interfaceScript.renderScreen = "story";
				Application.LoadLevel("interface");
				//new interfaceScript().LoadHTML("/html/account/index.html?username="+interfaceScript.dbUserName+"&password="+interfaceScript.dbPassWord);
			}

		}
	}
    
    /// <summary>
    /// Method is called once, at the beggining of the game.
    /// </summary>
    public void StartGame()
    {
		
	        if(GameStarted != null)
	            GameStarted.Invoke(this, new EventArgs());

	        Units.FindAll(u => u.PlayerNumber.Equals(CurrentPlayerNumber)).ForEach(u => { u.OnTurnStart(); });
	        Players.Find(p => p.PlayerNumber.Equals(CurrentPlayerNumber)).Play(this);

			//Assign Unit Menu Methods
			foreach(Unit u in Units){
			if(u.gameObject.tag == "Player"){
					u.selectUnitBtn = (x) => {
						/*
						CellGridStateUnitSelected CGS = new CellGridStateUnitSelected(this,u);
						CGS.OnStateEnter();
						CGS.OnCellClicked(u.Cell);
						CGS.OnUnitClicked(u);
						CGS.OnCellSelected(u.Cell);
						u.Cell.MarkAsHighlighted();

						u.OnUnitSelected();
						u.OnMouseEnter();
						*/


						foreach(Cell c in Cells){
							if(c.isWithinAbilityRange){
								c.isWithinAbilityRange = false;
								if(c.returnCellUnit(c) != null){
									c.returnCellUnit(c).GetComponent<Avatar>().RemoveAoeUI();
								}
							}
						}

						foreach (Avatar gameObj in Avatar.avatarList)
						{
							if(gameObj != null){
								if(gameObj.tag == "Player" && gameObj.GetComponent<Avatar>().AvatarIndex == x){
									gameObj.GetComponent<Unit>().Cell.OnMouseDown();
									gameObj.GetComponent<Unit>().OnMouseDown();
									//gameObj.GetComponent<Unit>().abilityReadyToFire = false;
								}
							}
						}

					};

					u.endTeamTurn = () => {EndTurn();};

					u.abilityRange = (x) => {
						
						foreach (Avatar gameObj in Avatar.avatarList)
						{
							if(gameObj != null){
								if(gameObj.tag == "Player" && gameObj.GetComponent<Avatar>().AvatarIndex == x){
									CellGridStateUnitSelected CGS = new CellGridStateUnitSelected(this,gameObj.GetComponent<Unit>());
									CGS.showAbilityRange();
								}
							}
						}

					};

				}
			}
		
    }
    /// <summary>
    /// Method makes turn transitions. It is called by player at the end of his turn.
    /// </summary>
    public void EndTurn()
    {
        if (Units.Select(u => u.PlayerNumber).Distinct().Count() == 1)
        {
            return;
        }
        CellGridState = new CellGridStateTurnChanging(this);

        Units.FindAll(u => u.PlayerNumber.Equals(CurrentPlayerNumber)).ForEach(u => { u.OnTurnEnd(); });

        CurrentPlayerNumber = (CurrentPlayerNumber + 1) % NumberOfPlayers;
        while (Units.FindAll(u => u.PlayerNumber.Equals(CurrentPlayerNumber)).Count == 0)
        {
            CurrentPlayerNumber = (CurrentPlayerNumber + 1)%NumberOfPlayers;
        }//Skipping players that are defeated.

        if (TurnEnded != null)
            TurnEnded.Invoke(this, new EventArgs());

        Units.FindAll(u => u.PlayerNumber.Equals(CurrentPlayerNumber)).ForEach(u => { u.OnTurnStart(); });
        Players.Find(p => p.PlayerNumber.Equals(CurrentPlayerNumber)).Play(this);     
    }
}
