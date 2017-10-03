//////////// Render Home Screen START ///////////--///////////////////////////////////////////////////
window.fromTeamList = false;
var HomeScreen = React.createClass({

	goToTeams: function(){
		loadPageContent(renderTeamScreen);
	},

	goToCharacters: function(){
	  	loadPageContent(renderCharacterListScreen);
			window.fromTeamList = false;
	  	console.log('enter Character List');
	},

	goToItems: function(){
		window.itemFilter = void(0);
	  	loadPageContent(renderItemListScreen);
	  	console.log('enter Item List');
	},

	goToNewsFeed: function(){
		loadPageContent(renderNewsScreen);
	  	console.log('enter News Feed');
	},

	goToEmailFeed: function(){
		loadPageContent(renderEmailScreen);
	  	console.log('enter Email Feed');
	},

	componentDidMount: function(){
		
	},

  	render: function() {
	  	window.preFightPrep = void(0);
	  	h.getAccountObjects();
	    return (
	    	<div className="home-content">

	    		<div className="sub-btn-holder">
	    			<button onClick={this.goToNewsFeed} className ="sub-btn info-bt btn-tooltip">
			      		!
			      	</button>
	    			<button onClick={this.goToEmailFeed}  className ="sub-btn mail-bt btn-tooltip">
			      		M
			      		<span className="mail-cnt"></span>
			      	</button>
	    		</div>

	    		<div className="btn-holder">
			      	<button onClick={this.goToTeams} className ="home-btn">
			      		<span>
			    			Teams
			    		</span>
			      	</button>
			      	
			      	<button onClick={this.goToItems}  className ="home-btn">
			      		<span>
			    			Items
			    		</span>
			      	</button>
			      	<button onClick={this.goToCharacters} className ="home-btn">
			      		<span>
			    			Characters
			    		</span>
			      	</button>
			      	
			      	{/*
			      	<button className ="home-btn">
			      		<span>
			    			Challenges
			    		</span>
			      	</button>

			      	<button className ="home-btn">
			      		<span>
			    			Medals
			    		</span>
			      	</button>
					*/}
		      	</div>
			</div>
	    );
	  },
	});

window.renderHomeScreen = function(){
	ReactDOM.render(<HomeScreen />, $('#main-container')[0]);
	insertNavBars('Home',null);
}
//////////// Render Home Screen END ///////////--///////////////////////////////////////////////////