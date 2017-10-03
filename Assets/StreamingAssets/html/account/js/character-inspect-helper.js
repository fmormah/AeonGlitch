//////////// Render Character inspect Screen START ///////////--///////////////////////////////////////////////////
var CharacterInspect = React.createClass({

  statsClick: function(){
  	ReactDOM.render(<StatsInfo />, $('#character-info-holder')[0]);

  	h.characterInpsectLastScreen = 'stats';
  	var loreWidth = $('#main-container').width() - 100;
	$('.char-tooltip').tooltipster({
	   trigger: 'click',
	   contentAsHTML: true,
	   position: 'left',
	   maxWidth: loreWidth

	});
  },

  abilityClick: function(){
  	ReactDOM.render(<AbilityInfo />, $('#character-info-holder')[0]);

  	h.characterInpsectLastScreen = 'abilities';
  	var loreWidth = $('#main-container').width() - 100;
	$('.char-tooltip').tooltipster({
	   trigger: 'click',
	   contentAsHTML: true,
	   position: 'left',
	   maxWidth: loreWidth

	});
  },

  gemClick: function(){
  	ReactDOM.render(<GemsInfo />, $('#character-info-holder')[0]);

  	h.characterInpsectLastScreen = 'gems';
  	var loreWidth = $('#main-container').width() - 100;
	$('.char-tooltip').tooltipster({
	   trigger: 'click',
	   contentAsHTML: true,
	   position: 'left',
	   maxWidth: loreWidth

	});
  },

  render: function() {
    return (
    	<div className="character-inspect-content">

    		

			<div id="squad-1" className="squad item Owl Image">
    			<h3>Name</h3>
    			{/*Squad member Instance*/}
    			<div className="squad-member">
    				<div className="pic"></div>
    				<span className="lvl">Level: ##</span>
    				<span className="hp">HP: ##</span>
    				<span className="mp">MP: ##</span>
    				<div className="xp">
    					<div className="xp-bar"></div>
    				</div>
    				<div className="rarity-holder">
    					<div className="star"></div>
    				</div>

    				<button title="Lore Information" className="lore-btn char-tooltip">!</button>
    				<button onClick={this.statsClick} className="btn-menu stat">STATS</button>
    				<button onClick={this.abilityClick} className="btn-menu ability">ABILITIES</button>
    				<button onClick={this.gemClick} className="btn-menu gems">GEMS</button>

    				<div id="character-info-holder"></div>

    			</div>
    		</div>

    		

		</div>
    );
  },
});


var StatsInfo = React.createClass({

  render: function() {
    return (
    	<div>

    		<h3>STATS</h3>

    		{/*Stats Instance*/}
    		<div className="info-holder">
    			<button className="info-tip char-tooltip" title="some info">!</button>
    			<div className="stat">Stat Name: </div>
    			<div className="value">Value ###</div>
    		</div>

		</div>
    );
  },
});

var AbilityInfo = React.createClass({


  abilityClick: function(moveName,isLocked,lvl,event) {
  	  //console.log(event); // => nullified object.
	  //console.log(event.type); // => "click"
	  //console.log(event.target.getAttribute('title'));
	  //console.log(event.target.parentNode);

	  var object;

	  if(isLocked === true){
	  	return true;
	  };

	  for (var i = 0; i < h.avatarPlayerCollection.length; i++) {
	  	if( h.avatarPlayerCollection[i].id == h.inspectedCharacter){
	  		object = h.avatarPlayerCollection[i];
	  	}
	  };

	  if(object.get('level') < lvl){
	  	alert('Level Requirements not met');
	  	return;
	  };

	  if(!$(event.target.parentNode).hasClass('active')){
	  	var moveCount=0;
	  	 for (var x = 1; x < 5; x++) {
		  	if (object.get('Ability'+x) !== 'Null'){
		  		moveCount++;
		  	}
		 }
		 if(moveCount === 4){
		 	alert('You can only pick 4 moves');
		 	return;
		 }

		 for (var x = 1; x < 5; x++) {
		  	if (object.get('Ability'+x) === 'Null'){
		  		$(event.target.parentNode).addClass('active');
		  		object.set('Ability'+x, moveName);
		  		object.save(null, {
			      success: function(object) {
			        console.log('move added');
			      },
			      error: function(model, error) {
			        alert(error);
			      }
			    });
		  		return;
		   }
		 }


	  }else{
	  	for (var x = 1; x < 5; x++) {
		  	if (object.get('Ability'+x) === moveName){
		  		$(event.target.parentNode).removeClass('active');
		  		object.set('Ability'+x, 'Null');
		  		object.save(null, {
			      success: function(object) {
			        console.log('move removed');
			      },
			      error: function(model, error) {
			        alert(error);
			      }
			    });
		  		return;
		  	}
		}
	  }


  },

  render: function() {
    var object;
    var abilities = [];
    var showItemKeys;


    window.stockOnUnlock = function(avatarId, moveId){
    	var avatar;
    	var moveObj;
    	for(var i = 0; i <  h.avatarPlayerCollection.length ; i++){
	  		if(h.avatarPlayerCollection[i].id === avatarId){
	  			avatar = h.avatarPlayerCollection[i];
	  		}
	  	}

	  	for(var j = 0; j < avatar.get('abilityArray').length; j++){
	  		 console.log(avatar.get('abilityArray')[j][1]);
	  		 if(avatar.get('abilityArray')[j][1] === moveId){
	  		 	var newArray = avatar.get('abilityArray');

	  		 	newArray[j][0] = 'unlocked';

	  		 	avatar.set('abilityArray',newArray);

	  		 	avatar.save(null, {
			      success: function(object) {
			        console.log('Move Unlocked');
			      },
			      error: function(model, error) {
			        alert(error);
			      }
			    });

	  		 }
	  	}

	  	for(var k = 0; k < h.abilitiesBaseCollection.length; k++){
	  		if(moveId === h.abilitiesBaseCollection[k].id){
	  			moveObj =  h.abilitiesBaseCollection[k];
	  		}
	  	}

	  	for(var l = 0; l < h.itemCollection.length; l++){
	  		if(h.itemCollection[l].get('Name') === moveObj.get('itemKeys')[0][0]){
	  			var newQty = h.itemCollection[l].get('qty') - parseInt(moveObj.get('itemKeys')[0][1]);
	  			h.itemCollection[l].set('qty',newQty);
	  			h.itemCollection[l].save(null, {
			      success: function(object) {
			        console.log(object.get('Name'), ' Updated');
			      },
			      error: function(model, error) {
			        alert(error);
			      }
			    });
	  		}
	  		if(h.itemCollection[l].get('Name') === moveObj.get('itemKeys')[1][0]){
	  			var newQty = h.itemCollection[l].get('qty') - parseInt(moveObj.get('itemKeys')[1][1]);
	  			h.itemCollection[l].set('qty',newQty);
	  			h.itemCollection[l].save(null, {
			      success: function(object) {
			        console.log(object.get('Name'), ' Updated');
			      },
			      error: function(model, error) {
			        alert(error);
			      }
			    });
	  		}
	  		if(h.itemCollection[l].get('Name') === moveObj.get('itemKeys')[2][0]){
	  			var newQty = h.itemCollection[l].get('qty') - parseInt(moveObj.get('itemKeys')[2][1]);
	  			h.itemCollection[l].set('qty',newQty);
	  			h.itemCollection[l].save(null, {
			      success: function(object) {
			        console.log(object.get('Name'), ' Updated');
			      },
			      error: function(model, error) {
			        alert(error);
			      }
			    });
	  		}
	  		if(h.itemCollection[l].get('Name') === moveObj.get('itemKeys')[3][0]){
	  			var newQty = h.itemCollection[l].get('qty') - parseInt(moveObj.get('itemKeys')[3][1]);
	  			h.itemCollection[l].set('qty',newQty);
	  			h.itemCollection[l].save(null, {
			      success: function(object) {
			        console.log(object.get('Name'), ' Updated');
			      },
			      error: function(model, error) {
			        alert(error);
			      }
			    });
	  		}	
	  	}
	  	loadPageContent(renderCharacterInspectScreen);
    };

    
  	for(var i = 0; i <  h.avatarPlayerCollection.length ; i++){
  		if(h.avatarPlayerCollection[i].id === h.inspectedCharacter){
  			object = h.avatarPlayerCollection[i];
  		}
  	}

  	for(var j = 0; j < object.get('abilityArray').length; j++){

  		var itemKey;
  		var qty;
  		var abilityId;
  		var invQty = ' / <span class="out-of-stock">0</span>';
  		var keyCountForItemsPossessed = 0;

  		for(var k = 0; k < h.abilitiesBaseCollection.length; k++){

  			if(h.abilitiesBaseCollection[k].id === object.get('abilityArray')[j][1]){
  				var levelValidation = 'inactive';

  				showItemKeys = '';// h.abilitiesBaseCollection[k].get('itemKeys');
  				for(var x = 0; x < h.abilitiesBaseCollection[k].get('itemKeys').length; x++){
  					itemKey = h.abilitiesBaseCollection[k].get('itemKeys')[x][0];
  					qty = parseInt(h.abilitiesBaseCollection[k].get('itemKeys')[x][1]);

  					for(var l = 0; l < h.itemCollection.length; l++){
  						if(h.itemCollection[l].get('Name') === itemKey){
  							if(parseInt( h.itemCollection[l].get('qty')) >= parseInt(qty)){
  								invQty = ' / <span class="in-stock">'+ h.itemCollection[l].get('qty')+'</span>';
  								keyCountForItemsPossessed++;
  							}else{
  								invQty = ' / <span class="out-of-stock">'+ h.itemCollection[l].get('qty')+'</span>';
  							}
  							
  						}
  					}

  					showItemKeys = showItemKeys + '<div class="item-key-holder"> <div class="name">'+itemKey+'</div>  <div class="qty">'+qty+invQty+'</div></div>';
  				}
  				if(keyCountForItemsPossessed === 4){
  					showItemKeys = showItemKeys + '<button onClick="stockOnUnlock(\''+object.id+'\',\''+h.abilitiesBaseCollection[k].id+'\')">Unlock</button>';
  				}
  				

  				if(object.get('level') >= parseInt(object.get('abilityArray')[j][2])){
  					levelValidation = 'active';
  				}

  				var locked = true;
  				var toolTipClass = 'char-tooltip';
  				if(object.get('abilityArray')[j][0] !== "locked"){
  					locked = false;
  					toolTipClass = '';
  					showItemKeys = '';
  				}
	  			abilities.push(
		  			<div key={'ability-'+j} className={'ability '+locked} data-level="0">
		    				<div className={"move-icon "+toolTipClass} onClick={this.abilityClick.bind(this,h.abilitiesBaseCollection[k].get('name'),locked,parseInt(object.get('abilityArray')[j][2]))} title={showItemKeys}></div>
		    				<button className="info-tip char-tooltip" title={h.abilitiesBaseCollection[k].get('Description')}>!</button>
		    				<div className="move-name">
		    					{h.abilitiesBaseCollection[k].get('name')}
		    				</div>
		    				<div className={"move-lvl "+levelValidation}>{object.get('abilityArray')[j][2]}</div>
		    		</div>
		  		);
	  		}
  		}

  	}

    return (
    	<div>

    		<h3>ABILITIES</h3>

    		<div className="info-holder">

    			{/*Ability Instance*/}
    			{abilities}

    		</div>

		</div>
    );


  },
});


var GemsInfo = React.createClass({


  seeGems: function(event) {
  	  //console.log(event); // => nullified object.
	  //console.log(event.type); // => "click"
	  loadPageContent(renderItemListScreen);
	  console.log(event.target.getAttribute('title'));
	  window.itemFilter = "gem";
	  h.gemSlotInspected = event.target.getAttribute('title');
  },

  showGemSlot: function(gemSlotIndex){
  	var gemObj;
  	for(var i = 0; i < h.avatarPlayerCollection.length ; i++){
  		if(h.avatarPlayerCollection[i].id === h.inspectedCharacter){
  			for(var j =0; j < h.itemBaseCollection.length; j++){

  				if(h.itemBaseCollection[j].get('Name') === h.avatarPlayerCollection[i].get('Gem'+gemSlotIndex)){
  					gemObj = h.itemBaseCollection[j];
  				}
		  	}

	  	}
  	}
  	if(gemObj == void(0)){
  		return (
	  		<div className={'ability '+gemSlotIndex} key={'ability'+gemSlotIndex}>
				<div className="move-icon" onClick={this.seeGems} title={gemSlotIndex}></div>
				<button className="info-tip char-tooltip" title="Empty Gem Slot">!</button>
				<div className="move-name">
					None
				</div>
			</div>
	  	);
  	}else{
  		return (
	  		<div className={'ability '+gemSlotIndex} key={'ability'+gemSlotIndex}>
				<div className="move-icon" onClick={this.seeGems} title={gemSlotIndex}></div>
				<button className="info-tip char-tooltip" title={gemObj.get('Description')}>!</button>
				<div className="move-name">
					{gemObj.get('Name')}
				</div>
			</div>
	  	);
  	}
  },

  render: function() {
    return (
    	<div>

    		<h3>GEMS</h3>

    		<div className="info-holder">

    			{/*GEM Instance*/}
    			{this.showGemSlot(1)}

    			{this.showGemSlot(2)}

    			{this.showGemSlot(3)}

    			{this.showGemSlot(4)}

    		</div>

		</div>
    );
  },
});


window.renderCharacterInspectScreen = function(){
	ReactDOM.render(<CharacterInspect />, $('#main-container')[0]);

	switch(h.characterInpsectLastScreen) {
	    case void(0):
	        ReactDOM.render(<StatsInfo />, $('#character-info-holder')[0]);
	    break;
	    case 'stats':
	        ReactDOM.render(<StatsInfo />, $('#character-info-holder')[0]);
	    break;
	    case 'gems':
	        ReactDOM.render(<GemsInfo />, $('#character-info-holder')[0]);
	    break;
	    case 'abilities':
	        ReactDOM.render(<AbilityInfo />, $('#character-info-holder')[0]);
	    break;
	}

	insertNavBars('',renderCharacterListScreen);

	var loreWidth = $('#main-container').width() - 100;
	$('.char-tooltip').tooltipster({
	   trigger: 'click',
	   contentAsHTML: true,
	   position: 'left',
	   maxWidth: loreWidth

	});
	
}
//////////// Render Character inspect Screen END ///////////--///////////////////////////////////////////////////