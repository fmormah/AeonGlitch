using UnityEngine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Collections;

public class ringScript : MonoBehaviour {

	public List<Unit> unitList;

	// Use this for initialization
	void Start () {
		unitList = new List<Unit>();
	}

	// Update is called once per frame
	void Update () {

	}

	void OnCollisionEnter2D(Collision2D coll) {
		Debug.Log(coll.gameObject.name);
	}


	void OnTriggerEnter2D(Collider2D other) {
		if(other.GetComponent<Unit>() != null){
			unitList.Add(other.GetComponent<Unit>());
		}
	}

		
}
