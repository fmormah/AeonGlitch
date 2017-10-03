using UnityEngine;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Collections;
using System.IO;
public class abilityLib : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public void initJutsu(GameObject gObj, string name, float aoeRange, int abilityRange, Action abilityMethod, bool targetPlayers = false, bool targetEnemies = true, bool targetAllies = false){

		gObj.GetComponent<Unit>().abilityName = name;
		gObj.GetComponent<Unit>().aoeRange = aoeRange;
		gObj.GetComponent<Unit>().abilityRangeUI = 0f;
		gObj.GetComponent<Unit>().abilityReadyToFire = true;

		
		gObj.GetComponent<Unit>().excludedTargets = new List<string>();
		if(!targetPlayers){
			gObj.GetComponent<Unit>().excludedTargets.Add("Player");
		}
		if(!targetEnemies){
			gObj.GetComponent<Unit>().excludedTargets.Add("EnemyAvatar");
		}
		if(!targetAllies){
			gObj.GetComponent<Unit>().excludedTargets.Add("AlliedAvatar");
		}

		gObj.GetComponent<Unit>().abilityHitsSelf = true;

		gObj.GetComponent<Unit>().rangeOfAbility = abilityRange;

		gObj.GetComponent<Unit>().abilityRange(gObj.GetComponent<Avatar>().AvatarIndex);

		gObj.GetComponent<Unit>().launchAbility = abilityMethod;

	}





	//******* Moves Defined ********//

	public void nova(GameObject gObj){
		initJutsu(gObj,"Nova Flare",2f,2,()=>{
			//Debug.Log("POW!");
			GameObject aoeRing = Unit.abilityTarget.gameObject.transform.Find(Unit.abilityTarget.gameObject.name+"_aoe_ring").gameObject;
			int dmgValue = 50;

			foreach(Unit u in aoeRing.GetComponent<ringScript>().unitList){

				if(gObj.tag == "EnemyAvatar"){
					if(u.gameObject.tag == "Player" || u.gameObject.tag == "AlliedAvatar"){
						u.takeHit(u,dmgValue);
					}
				}else{
					if(u.gameObject.tag == "EnemyAvatar"){
						u.takeHit(u,dmgValue);
					}
				}

			}

			Unit.abilityTarget.takeHit(Unit.abilityTarget,dmgValue);
			//Debug.Log(Unit.abilityTarget.gameObject.name);
		});
	}


}
