//////////// Render Teams Screen START ///////////--///////////////////////////////////////////////////
window.teamCharIndex = 0;
window.teamCharCurrentIndex = 0;
window.TeamScreen = React.createClass({

  enterCharacterList: function(teamIndex, currentIndex){
  	if(teamIndex != void(0)){
  		window.teamCharIndex = teamIndex;
  		teamCharCurrentIndex = currentIndex;
  		//h.playerObject.get('team'+teamIndex)[currentIndex]
  	}
  	loadPageContent(renderCharacterListScreen);
  	window.fromTeamList = true;
  },

  selectActiveTeam: function(){
  	h.playerObject.set('activeTeam', 'team'+window.teamCharIndex);

  	h.playerObject.save(null, {
	    success: function(object) {
	        console.log('ready to fight');
	    },
	    error: function(model, error) {
	        alert(error);
	    }
	});
  },

  renderTeam: function(index){
  	var renders = [];
  	var teamCount = 0;
  	//console.log(h.avatarPlayerCollection);
	for (var i = 0; i < h.playerObject.get('team'+index).length; i++) {

		for(var j = 0; j < h.avatarPlayerCollection.length; j++){
			if(h.avatarPlayerCollection[j].id === h.playerObject.get('team'+index)[i]){
				teamCount++;
				renders.push(

				  	<div key={'team_'+index+'_'+i} className="squad-member">
	    				<div  className="pic"></div>
	    				<span  className="name">{h.avatarPlayerCollection[j].get('name')}</span>
	    				<span className="lvl">Level: ##</span>
	    				<span className="hp">HP: ##</span>
	    				<span className="mp">MP: ##</span>
	    				<div className="xp">
	    					<div className="xp-bar"></div>
	    				</div>
	    				<div className="rarity-holder">
	    					<div className="star"></div>
	    				</div>
	    				<button onClick={this.enterCharacterList.bind(this,index,j)} className="swap-btn"></button>
	    			</div>
			    );
			    

			}
		}

	}

	for(var k = teamCount; k < 4; k++){
		renders.push(
		<div key={'add_team_'+index+'_'+k} className="squad-member">
			<button onClick={this.enterCharacterList.bind(this,index,k)} className="swap-btn addNew">Add</button>
		</div>
		);
	}

	if(window.preFightPrep){
		renders.push(
		<div key={'start-btn'} className="squad-member">
			<button onClick={this.selectActiveTeam.bind(this)} className="swap-btn addNew">START</button>
		</div>
		);
	}

	return renders;
  },

  render: function() {
    return (
    	<div className="team-content">

    		
    		{/*Squad Instance*/}
    		<div id="squad-1" className="squad item Owl Image">
    			<h3>Squad 1</h3>
    			{/*Squad member Instance*/}
    			{this.renderTeam(1)}
    		</div>


    		{/*Squad Instance*/}
    		<div id="squad-2" className="squad item Owl Image">
    			<h3>Squad 2</h3>
    			{/*Squad member Instance*/}
    			{this.renderTeam(2)}
    		</div>


    		{/*Squad Instance*/}
    		<div id="squad-3" className="squad item Owl Image">
    			<h3>Squad 3</h3>
    			{/*Squad member Instance*/}
    			{this.renderTeam(3)}
    		</div>


    		{/*Squad Instance*/}
    		<div id="squad-4" className="squad item Owl Image">
    			<h3>Squad 4</h3>
    			{/*Squad member Instance*/}
    			{this.renderTeam(4)}
    		</div>

		</div>
    );
  },
});

window.renderTeamScreen = function(){
	ReactDOM.render(<TeamScreen />, $('#main-container')[0]);
	insertNavBars('Teams',renderHomeScreen);
	console.log('lets see teams...');
	$(".team-content").owlCarousel({
	    items : 4,
	    navigation : true
	});
	if(window.teamCharIndex){
		$(".team-content").trigger('owl.jumpTo', (window.teamCharIndex-1));

	}
	
}
//////////// Render Team Screen END ///////////--///////////////////////////////////////////////////