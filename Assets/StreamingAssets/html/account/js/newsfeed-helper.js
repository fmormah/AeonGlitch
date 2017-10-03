//////////// Render News Feed Screen START ///////////--///////////////////////////////////////////////////
			
var NewsScreen = React.createClass({

	
	renderNewsFeed: function(){
		var feed = [];

		for(var i = 0; i < h.NewsCollection.length; i++){
			var divStyle = {
			  backgroundImage: 'url(' + h.NewsCollection[i].get('img') + ')'
			};



			var displayDate = h.NewsCollection[0].get('createdAt').getDate().toString() + ' / '+(h.NewsCollection[0].get('createdAt').getMonth()+1).toString() + ' / '+h.NewsCollection[0].get('createdAt').getFullYear().toString();
			feed.push(
				<div title={'<button onclick="$(\'.news-tooltip\').tooltipster(\'hide\');" class="closeNews">X</button>' +h.NewsCollection[i].get('html')} className="news-item news-tooltip" key={'NewsFeed_'+i}>
					<div className="hero-img" style={divStyle}></div>
					<div className="info">
						<span className="date">
							{displayDate}
						</span>

						<span className="type">
							{h.NewsCollection[i].get('subtype')}
						</span>

						<p>{h.NewsCollection[i].get('header')}</p>
					</div>
					<button>More</button>
				</div>
			);
		}

		return feed;
	},

  render: function() {
    return (
    	<div className="news-content">
    		{this.renderNewsFeed()}
    	</div>
    );
  }
});

window.renderNewsScreen = function(){
	ReactDOM.render(<NewsScreen />, $('#main-container')[0]);
	insertNavBars('News',renderHomeScreen);

	var loreWidth = $('#main-container').width() ;
	$('.news-tooltip').tooltipster({
	   trigger: 'click',
	   contentAsHTML: true,
	   autoClose: false,
	   position: 'center',
	   maxWidth: loreWidth,
	   maxHeight: $('#main-container').height()

	});
}
//////////// Render News Screen END ///////////--///////////////////////////////////////////////////