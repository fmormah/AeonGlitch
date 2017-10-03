//////////// Render CharacterList Screen START ///////////--///////////////////////////////////////////////////
var CharacterList = React.createClass({

  characterClick: function(avatarId){
  	console.log(window.teamCharIndex+' , '+teamCharCurrentIndex);
  	if(window.fromTeamList === true){
  		console.log('choose this character for team');
  		loadPageContent(renderTeamScreen);
  		var teamArray = h.playerObject.get('team'+window.teamCharIndex);
  		teamArray[teamCharCurrentIndex] = avatarId;
  		h.playerObject.set('team'+window.teamCharIndex, teamArray);
  		h.playerObject.save(null, {
	      success: function(object) {
	        console.log('team saved')
	      },
	      error: function(model, error) {
	        alert(error);
	      }
	    });
  	}else{
  		console.log('inspect character');
  		h.inspectedCharacter = avatarId;
  		loadPageContent(renderCharacterInspectScreen);
  	}
  	console.log('enter lists');
  },

  alreadyPicked: function(){
  	alert('This Avatar is already on your Team');
  },

  renderCollected: function(index){
  	var renders = [];
  	var alreadyOnTeam = false;

	for(var j = 0; j < h.avatarPlayerCollection.length; j++){

		if(window.fromTeamList === true){
			for(var x = 0; x < h.playerObject.get('team'+window.teamCharIndex).length; x++){
				if(h.avatarPlayerCollection[j].id === h.playerObject.get('team'+window.teamCharIndex)[x]){
					alreadyOnTeam = true;
				}
			}
		}

		if(alreadyOnTeam === true){
			renders.push(

			  	<div key={"collection-"+j} onClick={this.alreadyPicked} className="member inactive">
    				<div className="pic"></div>
    				<span className="name">{h.avatarPlayerCollection[j].get('name')}</span>
    				<span className="lvl">{h.avatarPlayerCollection[j].get('level')}</span>

    				<div className="rarity-holder">
    					<div className="star"></div>
    				</div>
    			</div>
		  	);
		}else{
			renders.push(

			  	<div key={"collection-"+j} onClick={this.characterClick.bind(this,h.avatarPlayerCollection[j].id)} className="member">
    				<div className="pic"></div>
    				<span className="name">{h.avatarPlayerCollection[j].get('name')}</span>
    				<span className="lvl">{h.avatarPlayerCollection[j].get('level')}</span>

    				<div className="rarity-holder">
    					<div className="star"></div>
    				</div>
    			</div>
		  	);
		}
		
		
	}

	

	return renders;
  },

  render: function() {
    return (
    	<div className="character-list-content">

    		<div className="squad">

    			{/*Character Instance*/}
    			{this.renderCollected()}
    			{/*
    			<div onClick={this.characterClick} className="member">
    				<div className="pic"></div>
    				<span className="name">name</span>
    				<span className="lvl">##</span>

    				<div className="rarity-holder">
    					<div className="star"></div>
    				</div>
    			</div>
    			*/}

    		</div>

		</div>
    );
  },
});

window.renderCharacterListScreen = function(){
	ReactDOM.render(<CharacterList />, $('#main-container')[0]);
	if(window.fromTeamList === true){
		insertNavBars('Characters',renderTeamScreen);
	}else{
		insertNavBars('Characters',renderHomeScreen);
	}
	
}
//////////// Render CharacterList Screen END ///////////--///////////////////////////////////////////////////