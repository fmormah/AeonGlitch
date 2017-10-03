//////////// Render Item List Screen START ///////////--///////////////////////////////////////////////////
var ItemList = React.createClass({

itemClick: function(itemId){
	if(window.itemFilter === "gem"){
  	loadPageContent(renderCharacterInspectScreen);

  	//update inventory server side

	var query = new Parse.Query(Parse.Object.extend(Parse.User.current().id + "_Items"));
	query.equalTo("objectId", itemId);
	query.find({
	  success: function(results) {
	    for (var i = 0; i < results.length; i++) {
	      var object = results[i];
	      
	      object.set('qty', object.get('qty') - 1);

	      for(var i = 0; i < h.avatarPlayerCollection.length ; i++){
	  		if(h.avatarPlayerCollection[i].id === h.inspectedCharacter){
	  			h.avatarPlayerCollection[i].set('Gem'+h.gemSlotInspected,object.get('Name'));
	  			h.avatarPlayerCollection[i].save(null, {
			      success: function(object) {
			       console.log('Gem slot updated');
			      },
			      error: function(model, error) {
			        alert(error);
			      }
			  });
		  	}
	  	  }

	  	  object.save(null, {
		      success: function(object) {
		       console.log('altering ', object.id + ' - ' + object.get('Name'));
		      },
		      error: function(model, error) {
		        alert(error);
		      }
		  });

		  


	      if(object.get('qty') <= 0){
	      	object.destroy({
				  success: function(myObject) {
				    console.log('item index destroyed');
				  },
				  error: function(myObject, error) {
				    // The delete failed.
				    // error is a Parse.Error with an error code and message.
				  }
			});
	      }
	    }
	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}
},

renderItems: function(index){
	var renders = [];
	if(window.itemFilter){
		for(var i = 0; i < h.itemCollection.length; i++){
  	  	var object = h.itemCollection[i];
  	  	if(h.itemCollection[i].get('item_type').toLowerCase() === window.itemFilter.toLowerCase() && h.itemCollection[i].get('qty') > 0){
	  	  renders.push(
			<div className="info-holder" key={"item-index-"+i}>
    			<button className="info-tip char-tooltip" title={object.get('Description')}>!</button>
    			<div  onClick= {this.itemClick.bind(this,object.id)} className="item">{object.get('Name')}</div>
    			<div className="qty">{object.get('qty')}</div>
    		</div>
		  );
	  	}
  	}
	}else{
	for(var i = 0; i < h.itemCollection.length; i++){
  	  	var object = h.itemCollection[i];
  	  	if(h.itemCollection[i].get('qty') > 0){
	  	  renders.push(
			<div className="info-holder" key={"item-index-"+i}>
    			<button className="info-tip char-tooltip" title={object.get('Description')}>!</button>
    			<div  onClick= {this.itemClick.bind(this,object.id)} className="item">{object.get('Name')}</div>
    			<div className="qty">{object.get('qty')}</div>
    		</div>
		  );
	  	}
  	}
	}
	  


return renders;
},

render: function() {
return (
	<div className="item-list-content">

		{/*Stats Instance*/}
		{this.renderItems()}

	</div>
);
},
});

window.itemFilter;
window.renderItemListScreen = function(){

	var backFunc;
	if(window.itemFilter == void(0)){
		backFunc = renderHomeScreen;
	}else if(window.itemFilter === "gem"){
	backFunc = renderCharacterInspectScreen;
	}

ReactDOM.render(<ItemList />, $('#main-container')[0]);
insertNavBars('items',backFunc);


var loreWidth = $('#main-container').width() - 100;
$('.char-tooltip').tooltipster({
   trigger: 'click',
   contentAsHTML: true,
   position: 'left',
   maxWidth: loreWidth

});

}
//////////// Render Item List Screen END ///////////--///////////////////////////////////////////////////