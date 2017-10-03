using UnityEngine;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Collections;
using System.IO;
using System.Reflection;
using Parse;

public class battleHud : MonoBehaviour {

	public bool isActive = false;
	abilityLib jutsu;
	// Use this for initialization

	void Start () {


		if(gameObject.GetComponent<Avatar>().AvatarIndex == 0){
			gameObject.GetComponent<Unit>().selectUnitBtn(0);
		}
		gameObject.AddComponent<abilityLib>();
		jutsu = this.GetComponent<abilityLib>();
	}

	public static Texture LoadCharacterImage(string imgName) {
		Texture img;
		img = (Texture)Resources.Load("images/character-icons/"+imgName);
		return img;
	}

	public static Texture LoadMoveImage(string imgName) {
		Texture img;
		img = (Texture)Resources.Load("images/move-icons/"+imgName);
		return img;
	}
		
	
	// Update is called once per frame
	void Update () {

		//Snap back to Avatar when its your turn

		if(this.GetComponent<Unit>().callTurnStart == true){
			if(this.GetComponent<Unit>().selectUnitBtn != null){
				if(this.GetComponent<Avatar>().AvatarIndex == 3){
					this.GetComponent<Unit>().selectUnitBtn(3);
				}
				if(this.GetComponent<Avatar>().AvatarIndex == 2){
					this.GetComponent<Unit>().selectUnitBtn(2);
				}
				if(this.GetComponent<Avatar>().AvatarIndex == 1){
					this.GetComponent<Unit>().selectUnitBtn(1);
				}
				if(this.GetComponent<Avatar>().AvatarIndex == 0){
					this.GetComponent<Unit>().selectUnitBtn(0);
				}
			}
			this.GetComponent<Unit>().callTurnStart = false;
		}

	}


	void OnGUI(){

		if(this != null){


			if(gameObject.tag == "Player"){
			

				int startYBottom = Screen.height - 100;
				int sqrSize = Screen.width/5;
				int startX = (Screen.width/2) - (sqrSize*2);

				if(isActive){


					//************** Bottom UI **************//
					//Ability Buttons
					for(int i = 0; i < 4; i++){
						GUI.DrawTexture(new Rect(startX+(sqrSize*i), startYBottom, sqrSize, sqrSize), LoadMoveImage("test-move"));

						if(gameObject.GetComponent<Unit>().ActionPoints < 3){
							GUI.color = new Color(0,0,0,0.75f);
							GUI.DrawTexture(new Rect(startX+(sqrSize*i), startYBottom, sqrSize, sqrSize), LoadMoveImage("blank-img"));
							GUI.color = Color.white;
							if (GUI.Button(new Rect(startX+(sqrSize*i), startYBottom, sqrSize, sqrSize), "","label")){
								Debug.Log("Not enough AP");
							}
						}else{

							if (GUI.Button(new Rect(startX+(sqrSize*i), startYBottom, sqrSize, sqrSize), "","label")){
								// Name of the method we want to call.
								string name = "nova";
								typeof(abilityLib).GetMethod(name).Invoke(new abilityLib(), new[] {gameObject});
								gameObject.GetComponent<Unit>().ActionPoints = gameObject.GetComponent<Unit>().ActionPoints - 3;

							}

						}


					}

					//Character Buttons
					for(int i = 0; i < 4; i++){
						GUI.DrawTexture(new Rect(startX+(sqrSize*i), startYBottom - sqrSize, sqrSize, sqrSize), LoadCharacterImage("test-char"));
						if (GUI.Button(new Rect(startX+(sqrSize*i), startYBottom - sqrSize, sqrSize, sqrSize), "","label")){

							foreach (Avatar gameObj in Avatar.avatarList)
							{
								if(gameObj != null){
									if(gameObj.tag == "Player")
									{
										gameObj.GetComponent<Unit>().abilityReadyToFire = false;
										if(gameObj.GetComponent<Avatar>().AvatarIndex == i){
											gameObj.GetComponent<Unit>().selectUnitBtn(i);//.OnMouseDown();
										}
									}
								}
							}
						}

						if(this.GetComponent<Avatar>().AvatarIndex != i){
							GUI.color = new Color(0,0,0,0.75f);
							GUI.DrawTexture(new Rect(startX+(sqrSize*i), startYBottom - sqrSize, sqrSize, sqrSize), LoadMoveImage("blank-img"));
							GUI.color = Color.white;
						}

						//************** Top UI **************//
						//End Turn Btn
						if (GUI.Button(new Rect(startX, 10, sqrSize, 32), "End Turn")){
							gameObject.GetComponent<Unit>().endTeamTurn();
							foreach (Avatar gameObj in Avatar.avatarList)
							{
								if(gameObj != null)
								{
									gameObj.GetComponent<Avatar>().RemoveAoeUI();
									gameObj.GetComponent<Unit>().Cell.isWithinAbilityRange = false;
									gameObj.GetComponent<Unit>().Cell.UnMark();
								}
							}
							//isActive = false;
						}

					}



					//Health Bar
					GUI.color = new Color(0,0,0,0.9f);
					GUI.DrawTexture(new Rect(startX, startYBottom - (sqrSize+20), sqrSize*4, 10), LoadMoveImage("blank-img"));
					GUI.color = Color.red;
					GUI.DrawTexture(new Rect(startX, startYBottom - (sqrSize+20), sqrSize*2, 10), LoadMoveImage("blank-img"));
					GUI.color = Color.white;

					//Energy Bar
					GUI.color = new Color(0,0,0,0.9f);
					GUI.DrawTexture(new Rect(startX, startYBottom - (sqrSize+10), sqrSize*4, 10), LoadMoveImage("blank-img"));
					GUI.color = Color.blue;
					GUI.DrawTexture(new Rect(startX, startYBottom - (sqrSize+10), sqrSize*2, 10), LoadMoveImage("blank-img"));
					GUI.color = Color.white;

					//Name/Stats Label
					GUI.color = new Color(0,0,0,0.9f);
					GUI.DrawTexture(new Rect(startX,  startYBottom - (sqrSize+55), sqrSize*4, 35), LoadMoveImage("blank-img"));
					GUI.color = Color.white;
					GUI.skin.label.fontSize = Screen.width/22;
					GUI.skin.label.alignment = TextAnchor.MiddleLeft;
					GUI.Label(new Rect(startX+10,  startYBottom - (sqrSize+53), Screen.width, 20), "Name");



				}
					
				//Options Button
				if (GUI.Button(new Rect((startX+(sqrSize*3)) + sqrSize/2, 10, sqrSize/2, 32), "+")){

				}

				//Show Aoe Range
				if(!gameObject.GetComponent<Unit>().abilityReadyToFire){
					gameObject.GetComponent<Avatar>().RemoveAoeUI();
					gameObject.GetComponent<Unit>().Cell.isWithinAbilityRange = false;
					gameObject.GetComponent<Unit>().Cell.UnMark();
				}
				if(gameObject.GetComponent<Unit>().abilityRangeUI < ((5f + (gameObject.GetComponent<Unit>().aoeRange*1f)) * gameObject.GetComponent<Unit>().aoeRange)){
					foreach (Avatar gameObj in Avatar.avatarList)
					{
						if(gameObj != null){
							foreach(string t in gameObject.GetComponent<Unit>().excludedTargets){
								if(gameObj.tag == t)
								{
									if(gameObj.transform.Find(gameObj.name+ "_aoe_ring") != null){
										gameObj.GetComponent<Avatar>().RemoveAoeUI();
										gameObj.GetComponent<Unit>().Cell.isWithinAbilityRange = false;
										gameObj.GetComponent<Unit>().Cell.UnMark();
									}
								}
							}


							if(gameObj.tag == "EnemyAvatar" || gameObj.tag == "AlliedAvatar" || gameObj.tag == "Player")
							{
								if(gameObj.transform.Find(gameObj.name+ "_aoe_ring") != null){
									
									GameObject aoeObj = gameObj.transform.Find(gameObj.name+ "_aoe_ring").gameObject;
									float time = Time.time;

									Vector3 baseScale = aoeObj.transform.localScale;

									gameObject.GetComponent<Unit>().abilityRangeUI = gameObject.GetComponent<Avatar>().abilityRangeUI + 0.25f;
									aoeObj.transform.localScale = Vector3.Lerp(baseScale, new Vector3(1f*gameObject.GetComponent<Unit>().abilityRangeUI, 1f*gameObject.GetComponent<Unit>().abilityRangeUI, 1), (time + 0.5f) - Time.time);

								}
							}
						}
					}
				}

				//ShowAbilityName
				GUI.skin.label.fontSize = Screen.width/10;
				GUI.skin.label.alignment = TextAnchor.MiddleCenter;
				if(gameObject.GetComponent<Unit>().abilityReadyToFire){
					GUI.Label(new Rect(startX+10,  50, sqrSize*4, 50), gameObject.GetComponent<Unit>().abilityName);
				}
			}



		}



	}
}
