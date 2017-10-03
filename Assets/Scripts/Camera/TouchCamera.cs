// Just add this script to your camera. It doesn't need any configuration.

using UnityEngine;

public class TouchCamera : MonoBehaviour {
	Vector2?[] oldTouchPositions = {
		null,
		null
	};
	Vector2 oldTouchVector;
	float oldTouchDistance;
    public float PlayerPosX;
	public float PlayerPosY;
	public float PlayerPosZ;

	public static bool isInAction = false;
	float camRotX = 0;

	bool isTracking = false;

	void Start(){
		PlayerPosX = transform.position.x;
		PlayerPosY = transform.position.y;
	}

	public void cameraLock(GameObject targetObj){
		GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosX = targetObj.transform.position.x;
		GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosY = targetObj.transform.position.y;
		GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosZ = targetObj.transform.position.z;
		transform.position = new Vector3 (PlayerPosX, PlayerPosY, transform.position.z);
	}

	public void cameraTrack(GameObject targetObj, float speed){

		isTracking = true;

		if(GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosX > targetObj.transform.position.x){
			GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosX = GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosX - speed;
		}
		if(GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosX < targetObj.transform.position.x){
			GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosX = GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosX + speed;
		}

		if(GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosY > targetObj.transform.position.y){
			GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosY = GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosY - speed;
		}
		if(GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosY < targetObj.transform.position.y){
			GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosY = GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosY + speed;
		}
		GameObject.Find("Main Camera").GetComponent<TouchCamera>().PlayerPosZ = targetObj.transform.position.z;

		transform.position = new Vector3 (PlayerPosX, PlayerPosY, transform.position.z);

		isTracking = false;
	}

	void actionCamToggle(){

		if(isInAction){
			camRotX = camRotX + 10f;
		}else{
			camRotX = camRotX - 10f;
		}

		if(camRotX >= 60){
			camRotX = 60;
		}

		if(camRotX <= 0){
			camRotX = 0;
		}

		//transform.localRotation = Quaternion.Euler(new Vector3(camRotX, transform.localRotation.y, transform.localRotation.z ));
	}

	void Update() {

		if(!isTracking){
		
			if (Input.touchCount == 0) {
				oldTouchPositions[0] = null;
				oldTouchPositions[1] = null;
			}
			else if (Input.touchCount == 1) {
				if (oldTouchPositions[0] == null || oldTouchPositions[1] != null) {
					//oldTouchPositions[0] = Input.GetTouch(0).position;
					oldTouchPositions[1] = null;
				}
				else {
					Vector2 newTouchPosition = Input.GetTouch(0).position;
					
					transform.position += transform.TransformDirection((Vector3)((oldTouchPositions[0] - newTouchPosition) * GetComponent<Camera>().orthographicSize / GetComponent<Camera>().pixelHeight * 2f));
					
					oldTouchPositions[0] = newTouchPosition;
				}
			}else {
				if (oldTouchPositions[1] == null) {
	                
					oldTouchPositions[0] = Input.GetTouch(0).position;
					oldTouchPositions[1] = Input.GetTouch(1).position;
					oldTouchVector = (Vector2)(oldTouchPositions[0] - oldTouchPositions[1]);
					oldTouchDistance = oldTouchVector.magnitude;
	                 
				}
				else {
					Vector2 screen = new Vector2(GetComponent<Camera>().pixelWidth, GetComponent<Camera>().pixelHeight);
					
					Vector2[] newTouchPositions = {
						Input.GetTouch(0).position,
						Input.GetTouch(1).position
					};
					Vector2 newTouchVector = newTouchPositions[0] - newTouchPositions[1];
					float newTouchDistance = newTouchVector.magnitude;

					transform.position += transform.TransformDirection((Vector3)((oldTouchPositions[0] + oldTouchPositions[1] - screen) * GetComponent<Camera>().orthographicSize / screen.y));
					//transform.localRotation *= Quaternion.Euler(new Vector3(0, 0, Mathf.Asin(Mathf.Clamp((oldTouchVector.y * newTouchVector.x - oldTouchVector.x * newTouchVector.y) / oldTouchDistance / newTouchDistance, -1f, 1f)) / 0.0174532924f));
					GetComponent<Camera>().orthographicSize *= oldTouchDistance / newTouchDistance;
					transform.position -= transform.TransformDirection((newTouchPositions[0] + newTouchPositions[1] - screen) * GetComponent<Camera>().orthographicSize / screen.y);

					oldTouchPositions[0] = newTouchPositions[0];
					oldTouchPositions[1] = newTouchPositions[1];
					oldTouchVector = newTouchVector;
					oldTouchDistance = newTouchDistance;
	                
				}
			}

			//Follow Player
			if(PlayerPosX != null && PlayerPosX != 0){
				transform.position = new Vector3 (PlayerPosX, PlayerPosY, transform.position.z);
			}

		}

		actionCamToggle();
	}
}
