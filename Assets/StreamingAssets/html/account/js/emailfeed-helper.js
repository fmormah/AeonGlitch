//////////// Render Email Feed Screen START ///////////--///////////////////////////////////////////////////
			
var EmailScreen = React.createClass({

	markAsOpened: function(index){

		h.EmailCollection[index].set('opened',true);
		h.EmailCollection[index].save(null, {
	      success: function(object) {
	        console.log('mail marked as open')
	      },
	      error: function(model, error) {
	        alert(error);
	      }
	    });

	    if(h.EmailCollection[index].get('type') != 'story'){
	    	h.EmailCollection[index].destroy({
				  success: function(myObject) {
				    console.log('email index destroyed');
				  },
				  error: function(myObject, error) {
				    // The delete failed.
				    // error is a Parse.Error with an error code and message.
				  }
			});
	    }
	},


	renderEmailFeed: function(){
		var feed = [];

		for(var i = 0; i < h.EmailCollection.length; i++){
			
			var divStyle = {
			  display: 'none'
			};

			if(h.EmailCollection[i].get('opened') === false){
				divStyle = {
				  display: 'block'
				};
			}


			var displayDate = h.EmailCollection[i].get('createdAt').getDate().toString() + ' / '+(h.EmailCollection[i].get('createdAt').getMonth()+1).toString() + ' / '+h.EmailCollection[i].get('createdAt').getFullYear().toString();
			feed.push(
				<div onClick={this.markAsOpened.bind(this,i)} title={'<button onclick="$(\'.email-tooltip\').tooltipster(\'hide\');" class="closeNews">X</button>' +h.EmailCollection[i].get('html')} className="email-item email-tooltip" key={'EmailFeed_'+i}>
					
					<div style={divStyle} className="unread-mark">New</div>

					<div className="hero-img"></div>
					<div className="info">
						<span className="date">
							{displayDate}
						</span>

						<span className="type">
							From: {h.EmailCollection[i].get('sender')}
						</span>

						<p>{h.EmailCollection[i].get('subject')}</p>
					</div>
					<button>Open</button>
				</div>
			);
		}

		return feed;
	},

	render: function() {
		return (
			<div className="email-content">
				{this.renderEmailFeed()}
			</div>
		);
	}
});

window.renderEmailScreen = function(){
	ReactDOM.render(<EmailScreen />, $('#main-container')[0]);
	insertNavBars('Email',renderHomeScreen);

	var loreWidth = $('#main-container').width();
	$('.email-tooltip').tooltipster({
	   trigger: 'click',
	   contentAsHTML: true,
	   autoClose: false,
	   position: 'center',
	   maxWidth: loreWidth,
	   maxHeight: $('#main-container').height()

	});
}
//////////// Render Email Screen END ///////////--///////////////////////////////////////////////////