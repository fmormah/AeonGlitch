//////////// Render SignIn START /////////// --///////////////////////////////////////////////////

window.getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

var SignIn = React.createClass({

  formCtaClick: function(){
	  new h.loginPage().formSubmit();
     //loadPageContent(renderHomeScreen);
  },

  render: function() {
    return (
    	<div className="login-content">
	      	<h1 className="section-title">Aeon Glitch</h1>

				<div className="fieldArea">
					<input type="text" id="email" name="email" placeholder="Email Address"/>
					<span className="err-msg"></span>
				</div>

				<div className="fieldArea sign-up-options">
					<input type="text" id="d_name" placeholder="Display Name"/>
					<span className="err-msg"></span>
				</div>

				<div className="fieldArea">
					<input type="password" id="password" placeholder="Password"/>
					<span className="err-msg"></span>
				</div>

				<div className="fieldArea sign-up-options">
					<input type="password" id="c_password" placeholder="Confirm Password"/>
					<span className="err-msg"></span>
				</div>
				
				<div className="fieldArea">
					<a onClick={this.formCtaClick} className="cta-btn" href="#">Log in</a>
					<a onClick={new h.loginPage().formType} className="form-type side-cta-btn" href="#">New account?</a>
				</div>
		</div>
    );
  },
});

window.renderSignIn = function(){
	ReactDOM.render(<SignIn />, $('#main-container')[0]);

	if(getParameterByName("username") != "" && getParameterByName("password") != ""){
		$('.login-content').css('opacity',0);
		$('#email')[0].value = getParameterByName("username");
		$('#password')[0].value = getParameterByName("password");
		new h.loginPage().formSubmit();

	}
}
//////////// Render SignIn END ///////////--///////////////////////////////////////////////////