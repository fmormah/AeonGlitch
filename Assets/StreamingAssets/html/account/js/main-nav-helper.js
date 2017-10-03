window.loadPageContent = function(action){
    clearPageContent();
    setTimeout(function(){
        action();
        $('#main-container').css('opacity',1);
    },600);
};

window.clearPageContent = function(){
    $('#main-container').css('opacity',0);
    setTimeout(function(){
        ReactDOM.unmountComponentAtNode($('#main-container')[0]);
    },600);
};

window.insertNavBars = function(title,goBackFun){
    if(goBackFun == void(0)){
        goBackFun = null;
    }
    insertMainNavTop(title,goBackFun);
    insertMainNavBottom();

    $('body')[0].className = title.toLowerCase();
};

//////////// Insert Main Nav START ///////////--///////////////////////////////////////////////////
//Top Nav
var MainNavTop = React.createClass({

  backClick: function(){
    loadPageContent(this.props.goBack);
  },

  render: function() {
    return (
        <div className="main-nav-btn-container">
            <a onClick={this.backClick} className="back-btn" href="#">Back</a>
            <h1 id="header-title">{this.props.title}</h1>
        </div>
    );
  },
});
var insertMainNavTop = function(pageTitle,goBackFun){
    if(!$("#top-Nav").length){

        $( "body" ).prepend('<div id="top-Nav" class="nav-container"></div>');

        ReactDOM.render(
            <MainNavTop goBack={goBackFun} title={pageTitle}/>, 
            $('#top-Nav')[0]
        );

        setTimeout(function(){
            $('#top-Nav').addClass('active');
        },10);
    }else{
        ReactDOM.render(
            <MainNavTop goBack={goBackFun} title={pageTitle}/>, 
            $('#top-Nav')[0]
        );
    }
}

//Bottom Nav
var MainNavBottom = React.createClass({
    goHome: function(){
        loadPageContent(renderHomeScreen);
    },

    goMap: function(){
        loadPageContent(renderMapPageScreen);
    },

    goStoryMap: function(){
        loadPageContent(renderStoryScreen);
    },

  render: function() {
    return (
        <div  className="main-nav-btn-container">
            <button onClick={this.goHome} className="nav-btn home">
                <span>
                    Home
                </span>
            </button>


            <button onClick={this.goMap} className="nav-btn map">
                <span>
                    Map
                </span>
            </button>

            <button onClick={this.goStoryMap} className="nav-btn quest">
                <span>
                    Story
                </span>
            </button>

            {/*
            <button className="nav-btn quest">
                <span>
                    Quest
                </span>
            </button>
            

            <button className="nav-btn map">
                <span>
                    Map
                </span>
            </button>
            
            <button className="nav-btn shop">
                <span>
                    Shop
                </span>
            </button>
            
            <button className="nav-btn setting">
                <span>
                    Setting
                </span>
            </button>

            */}
        </div>
    );
  },
});
var insertMainNavBottom = function(){
    if(!$("#bottom-Nav").length){
        $( "body" ).append('<div id="bottom-Nav" class="nav-container"></div>');
        ReactDOM.render(<MainNavBottom />, $('#bottom-Nav')[0]);
        setTimeout(function(){
            $('#bottom-Nav').addClass('active');
        },10);
    }
}
//////////// Insert Main Nav END ///////////--///////////////////////////////////////////////////


