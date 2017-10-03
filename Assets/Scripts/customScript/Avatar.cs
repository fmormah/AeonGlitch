using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Timers;
using System.Threading.Tasks;
using Parse;
using System;
using UnityEngine.Events;
using System.Text.RegularExpressions;

public class Avatar : Unit
{
	Coroutine PulseCoroutine;
	Coroutine avatarTrackCoroutine;
	public int AvatarIndex = -1;
	static bool index0Taken = false;
	static bool index1Taken = false;
	static bool index2Taken = false;
	static bool index3Taken = false;

	public ParseObject avatarParseObj;
	public ParseObject avatarParseTemplate;
	bool initAvatarBuild;


	public IEnumerable<ParseObject> plyrCollectionList;
	public IEnumerable<ParseObject> AvatarLibrary;

	public  string activeTeam;
	public  bool teamInitialized;

	public static List<Avatar> avatarList = new List<Avatar>(); 

	bool ghettoInit = false;

	public override void Initialize()
	{
		avatarList.Add(this);
		assignAvatarIndex();
		if(AvatarIndex == 0){
			//gameObj.GetComponent<Avatar>().OnMouseDown();
			//OnMouseDown();
			//Debug.Log(Cell.);
			//OnUnitSelected();
			//autoUnitSelected(this);
			//cell
			//autoSelectUnit();
		}
		base.Initialize();
		transform.position += new Vector3(0, 0, -1);

	}


	void assignAvatarIndex(){
		if(gameObject.tag == "Player"){


			if(!index3Taken){
				AvatarIndex = 3;
			}
			if(!index2Taken){
				AvatarIndex = 2;
			}
			if(!index1Taken){
				AvatarIndex = 1;
			}
			if(!index0Taken){
				AvatarIndex = 0;
			}

			if(AvatarIndex == 0){
				index0Taken = true;
			}
			if(AvatarIndex == 1){
				index1Taken = true;
			}
			if(AvatarIndex == 2){
				index2Taken = true;
			}
			if(AvatarIndex == 3){
				index3Taken = true;
			}
			
				
			gameObject.AddComponent<battleHud>();

			interfaceScript.dbUserName = "work@test.com";
			interfaceScript.dbUserId = "dwplInU3Gr";

			if(interfaceScript.dbUserName != null && gameObject.tag == "Player"){
				var query = ParseObject.GetQuery(interfaceScript.dbUserId+"_Collection").WhereEqualTo("collectionType", "avatar");
				query.FindAsync().ContinueWith(t =>
					{
						Debug.Log("Tring for collection..");
						plyrCollectionList = t.Result;
					});

				var query2 = ParseObject.GetQuery("Avatars").WhereEqualTo("collectionType", "avatar");
				query2.FindAsync().ContinueWith(t =>
					{
						Debug.Log("Tring for templates..");
						AvatarLibrary = t.Result;
						foreach(ParseObject c in AvatarLibrary){
						}
					});

			}
		}


	}

	public GameObject newAoeUI(){

		GameObject value = null;

		if(transform.Find(gameObject.name+ "_aoe_ring") == null){
			
			value = Instantiate(Resources.Load("prefabs/aoeUI", typeof(GameObject))) as GameObject;
			value.transform.parent = gameObject.transform;
			value.name = gameObject.name+ "_aoe_ring";
		}

		return value;
	}


	public void RemoveAoeUI(){
		if(transform.Find(gameObject.name+ "_aoe_ring") != null){
			Destroy(transform.Find(gameObject.name+ "_aoe_ring").gameObject);
		}
	}



	public override bool IsCellMovableTo(Cell cell)
	{
		return base.IsCellMovableTo(cell) && (cell as MyOtherHexagon).GroundType != GroundType.Water;
		//Prohibits moving to cells that are marked as water.
	}
	public override bool IsCellTraversable(Cell cell)
	{
		return base.IsCellTraversable(cell) && (cell as MyOtherHexagon).GroundType != GroundType.Water;
		//Prohibits moving through cells that are marked as water.
	}


	public override void OnUnitDeselected()
	{
		base.OnUnitDeselected();
		StopCoroutine(PulseCoroutine);
		StopCoroutine(avatarTrackCoroutine);
		gameObject.GetComponent<battleHud>().isActive = false;
		transform.localScale = new Vector3(0.9f, 0.9f, 0.9f);
	}

	public override void MarkAsAttacking(Unit other)
	{
		//StartCoroutine(Jerk(other,0.25f));

		thisUnitsTarget = other;

		int distance = Cell.GetDistance(other.Cell);
		if(distance > 1){
			changeAnimation("range");
		}else{
			changeAnimation("melee");
		}
	}
	public override void MarkAsDefending(Unit other)
	{
		StartCoroutine(Glow(new Color(1, 0.5f, 0.5f),1));
	}
	public override void MarkAsDestroyed()
	{
	}

	private IEnumerator Jerk(Unit other, float movementTime)
	{
		var heading = other.transform.position - transform.position;
		var direction = heading / heading.magnitude;
		float startTime = Time.time;

		while(true)
		{
			var currentTime = Time.time;
			if (startTime + movementTime < currentTime)
				break;
			transform.position = Vector3.Lerp(transform.position, transform.position + (direction/2.5f), ((startTime + movementTime) - currentTime));
			yield return 0;
		}
		startTime = Time.time;
		while(true)
		{
			var currentTime = Time.time;
			if (startTime + movementTime < currentTime)
				break;
			transform.position = Vector3.Lerp(transform.position, transform.position - (direction/2.5f), ((startTime + movementTime) - currentTime));
			yield return 0;
		}
		transform.position = Cell.transform.position + new Vector3(0, 0, -1); 
	}
	private IEnumerator Glow(Color color, float cooloutTime)
	{
		var _renderer = GetComponent<SpriteRenderer>();
		float startTime = Time.time;

		while(true)
		{
			var currentTime = Time.time;
			if (startTime + cooloutTime < currentTime)
				break;

			_renderer.color = Color.Lerp(Color.white, color, (startTime + cooloutTime) - currentTime);
			yield return 0;
		}

		_renderer.color = Color.white;
	}
	private IEnumerator Pulse(float breakTime, float delay, float scaleFactor)
	{
		var baseScale = transform.localScale;
		while(true)
		{
			float time1 = Time.time;
			while(time1+delay > Time.time)
			{
				//transform.localScale = Vector3.Lerp(baseScale * scaleFactor, baseScale, (time1 + delay) - Time.time);
				yield return 0;
			}

			float time2 = Time.time;
			while(time2+delay > Time.time)
			{
				//transform.localScale = Vector3.Lerp(baseScale, baseScale * scaleFactor, (time2 + delay) - Time.time);
				yield return 0;
			}

			yield return new WaitForSeconds(breakTime);
		}      
	}


	private IEnumerator camTrack()
	{	
		//Show Character HUd
		if(gameObject.tag == "Player"){
			gameObject.GetComponent<battleHud>().isActive = true;
		}
		var baseScale = transform.localScale;
		GameObject.Find("Main Camera").GetComponent<TouchCamera>().cameraLock(gameObject);
		while(true)
		{
			GameObject.Find("Main Camera").GetComponent<TouchCamera>().cameraTrack(gameObject,0.1f);
			yield return new WaitForSeconds(0.01f);
		}      
	}



	public override void MarkAsFriendly()
	{
		SetHighlighterColor(new Color(0.75f,0.75f,0.75f,0.5f));
	}
	public override void MarkAsReachableEnemy()
	{
		SetHighlighterColor(new Color(1, 0, 0, 0.5f));
	}
	public override void MarkAsSelected()
	{
		PulseCoroutine = StartCoroutine(Pulse(1.0f,0.5f,1.25f));
		if(gameObject.tag == "Player"){
			avatarTrackCoroutine = StartCoroutine(camTrack());
		}

		SetHighlighterColor(new Color(0, 1, 0, 0.5f));
	}
	public override void MarkAsFinished()
	{
		SetColor(Color.gray);
		SetHighlighterColor(new Color(0.75f, 0.75f, 0.75f, 0.5f));
	}
	public override void UnMark()
	{
		SetHighlighterColor(Color.clear);
		SetColor(Color.white);
	}

	private void SetColor(Color color)
	{
		var _renderer = GetComponent<SpriteRenderer>();
		if (_renderer != null)
		{
			_renderer.color = color;
		}
	}
	private void SetHighlighterColor(Color color)
	{
		var highlighter = transform.Find("WhiteTile").GetComponent<SpriteRenderer>();
		if (highlighter != null)
		{
			highlighter.color = color;
		}
	}


	void Update(){

		if(!ghettoInit && gameObject.tag == "Player"){
			//InitAvatar();
			ghettoInit = true;
		}

		if(anim != null){
			if((anim.GetCurrentAnimatorStateInfo(0).IsName("melee".ToLower()) ||
				anim.GetCurrentAnimatorStateInfo(0).IsName("hit".ToLower()) ||
				anim.GetCurrentAnimatorStateInfo(0).IsName("range".ToLower())) &&
				anim.GetNextAnimatorStateInfo(0).fullPathHash ==0
			){
				changeAnimation("idle");
			}

			if(anim.GetCurrentAnimatorStateInfo(0).IsName("idle".ToLower())){
				if(anim.GetCurrentAnimatorStateInfo(0).normalizedTime < 0.5f){
					Unit.inAttackAnimation = false;
					TouchCamera.isInAction = false;
				}
			}
		}

		if(!initAvatarBuild && plyrCollectionList != null && AvatarLibrary != null){
			Debug.Log("start final init..");
			var query3 = ParseUser.Query.WhereEqualTo("username", interfaceScript.dbUserName).FindAsync().ContinueWith(t =>{
				
				IEnumerable<ParseUser> results = t.Result;
				foreach(ParseObject obj in results){
					activeTeam =  obj.Get<string>("activeTeam");


					var holdingList = obj.Get<List<object>>(activeTeam);
					IEnumerable<string> teamArray = holdingList.Cast<string>();

					Debug.Log("Tring for final init.."+plyrCollectionList.Count());
					foreach(ParseObject x in plyrCollectionList){
						if(x.ObjectId == teamArray.ToList()[AvatarIndex]){
							avatarParseObj = x;
							foreach(ParseObject j in AvatarLibrary){
								if(j.ObjectId == avatarParseObj.Get<string>("avatarID")){
									avatarParseTemplate = j;
									Debug.Log("Avatar Skin done");
								}
							}
						}
					}
				}

			});


			initAvatarBuild = true;
		}
	}
		
}
