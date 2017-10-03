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

public class interfaceScript : MonoBehaviour
{
	#if UNITY_IOS || UNITY_ANDROID || UNITY_WP8


	public static string dbUserName;
	public static string dbUserId;
	public static string dbPassWord;
	public static string renderScreen = "";

    void Start()
    {
		if(Avatar.avatarList != null){
			Avatar.avatarList.Clear();
		}
        Input.location.Start();
		LoadHTML("/html/account/index.html?username="+dbUserName+"&password="+dbPassWord+"&goto="+renderScreen);
		DontDestroyOnLoad(this);

    }


	public void LoadHTML(string fileName) {

		var webView = CreateWebView();

		#if UNITY_EDITOR
		webView.url = Application.streamingAssetsPath + fileName;
		#elif UNITY_IOS
		webView.url = Application.streamingAssetsPath + fileName;
		#elif UNITY_ANDROID
		webView.url = "file:///android_asset" + fileName;
		#elif UNITY_WP8
		webView.url = "Data/StreamingAssets" + fileName;
		#endif

        webView.OnReceivedMessage += OnReceivedMessage;
        webView.OnEvalJavaScriptFinished += OnEvalJavaScriptFinished;

		webView.Load();
		webView.Show();
		renderScreen = "";
	}

	void updateProcessIndex(string uname, string index){

		int indexTo = Int32.Parse(index);

		var query = ParseUser.Query.WhereEqualTo("username", dbUserName).FindAsync().ContinueWith(t =>{
			IEnumerable<ParseUser> results = t.Result;
			foreach(ParseObject obj in results){
				obj["progressIndex"] = indexTo;
				obj.SaveAsync().ContinueWith(x => {
					if (t.IsFaulted || t.IsCanceled) {
					// Errors from Parse Cloud and network interactions
						using (IEnumerator<System.Exception> enumerator = t.Exception.InnerExceptions.GetEnumerator()) {
							if (enumerator.MoveNext()) {
							ParseException error = (ParseException) enumerator.Current;
							Debug.Log (error.Message);
							// error.Message will contain an error message
							// error.Code will return "OtherCause"
							}
						}
					}else{
						Debug.Log ("saved server");
					}
				});

			}
		});

		LoadHTML("/html/account/index.html?username="+dbUserName+"&password="+dbPassWord);

	}


    void OnReceivedMessage(UniWebView webView, UniWebViewMessage message)
    {
		switch (message.path){
			case "loginwith":
				dbUserName = message.args["user"].ToString();
				dbPassWord =  message.args["pass"].ToString();
				//logIn(message.args["user"].ToString(), message.args["pass"].ToString(), webView);
			break;
			case "progressIndex":
				
				updateProcessIndex(dbUserName,"0");
				
			break;
			case "initcs":
				LoadHTML("/html/cutscenes/"+message.args["index"].ToString()+".html");
			break;
			case "initscene":
				//SceneManager.LoadScene(message.args["scene"].ToString());
				Application.LoadLevel(message.args["scene"].ToString());
			break;
			case "home":
				LoadHTML("/html/account/index.html?username="+dbUserName+"&password="+dbPassWord+"&goto="+renderScreen);
			break;
		}
    }


	void logIn(string username, string password, UniWebView webView){

		//runJS("alert('username: "+username+", password: "+password+")", webView);
		Debug.Log("username: "+username+" , pass: "+password);
		ParseUser.LogInAsync(username, password).ContinueWith(t =>
		{
			if (t.IsFaulted || t.IsCanceled)
			{
				//runJS("alert('cant log in')", webView);
				Debug.Log("failed");
			}
			else
			{
				//runJS("alert('check this out:  " + ParseUser.CurrentUser.ObjectId + "')", webView);
				Debug.Log("success");
			}
		});// ex: "Cannot sign up user with an empty name."

	}

    static void runJS(string evalScript, UniWebView webView)
    {
        webView.AddJavaScript(evalScript);
        webView.EvaluatingJavaScript(evalScript);
    }
	

	UniWebView CreateWebView() {
		var webViewGameObject = GameObject.Find("WebView");
		if (webViewGameObject == null) {
			webViewGameObject = new GameObject("WebView");
		}

		var webView = webViewGameObject.AddComponent<UniWebView>();

		webView.toolBarShow = true;
		return webView;
	}


    void OnEvalJavaScriptFinished(UniWebView webView, string r)
    {
        //evalScript = r;
    }

	#else //End of #if UNITY_IOS || UNITY_ANDROID || UNITY_WP8
	void Start() {
		Debug.LogWarning("UniWebView only works on iOS/Android/WP8. Please switch to these platforms in Build Settings.");
	}
	#endif
}
