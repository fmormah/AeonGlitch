
//////////// Render Story Map START ///////////--///////////////////////////////////////////////////
var hyperIntroductionIndex = 0;

var StoryMapScreen = React.createClass({

     goToTestMap: function(){
        window.location.href = "uniwebview://initscene?scene=testmap";
    },

    goToCrystalBrook: function(){
        if(h.playerObject.get('progressIndex') < hyperIntroductionIndex){
            window.location.href = "uniwebview://initcs?index=cs"+h.playerObject.get('progressIndex');
        }else{
            window.location.href = "uniwebview://initscene?scene=crystalbrook";
        }
    },

    goToFeatherMeadow: function(){
        /*if(h.playerObject.get('progressIndex') < hyperIntroductionIndex){
            window.location.href = "uniwebview://initcs?index=cs"+h.playerObject.get('progressIndex');
        }else{
            window.location.href = "uniwebview://initscene?scene=crystalbrook0";
        }*/
        window.location.href = "uniwebview://initscene?scene=feathermeadow";
    },

    render: function() {
        window.preFightPrep = void(0);
        h.getAccountObjects();
        return (
            <div className="story-content">
                <button onClick={this.goToTestMap}>Test Stage</button>
                <button onClick={this.goToCrystalBrook}>Crystal Brook</button>
                <button onClick={this.goToFeatherMeadow}>Feather Meadow</button> 
            </div>
        );
      },
});

window.renderStoryScreen = function(){
    ReactDOM.render(<StoryMapScreen />, $('#main-container')[0]);
    insertNavBars('Story',window.renderHomeScreen);
}
//////////// Render Story Map END ///////////--///////////////////////////////////////////////////