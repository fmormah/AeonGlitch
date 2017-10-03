/////////// Render Maps Screen START ///////////--///////////////////////////////////////////////////
window.MapPage = React.createClass({

    itemClick: function() {

    },

    render: function() {
        return ( < div id = "map"
            className = "map-content" > < /div>
        );
    },
});

window.renderMapPageScreen = function() {

    ReactDOM.render( < MapPage / > , $('#main-container')[0]);
    insertNavBars('map', renderHomeScreen);

    window.initMap = function() {

        window.preFightPrep = void(0);

        // Try HTML5 geolocation.
        window.mapPos = {
            lat: 51.503165,
            lng: -0.112305
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                window.mapPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                //infoWindow.setPosition(pos);
                //infoWindow.setContent('Location found.');

                window.map = new google.maps.Map(document.getElementById('map'), {
                    center: window.mapPos,
                    zoom: 15, //17
                    zoomControl: false,
                    scaleControl: true
                });



                window.infowindow = new google.maps.InfoWindow();

                map.setCenter(window.mapPos);

                var marker = new google.maps.Marker({
                    position: window.mapPos,
                    map: map,
                    icon: 'img/map/blue-orb.png',
                    animation: google.maps.Animation.DROP
                });

                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch({
                    location: window.mapPos,
                    //types: ['store'],
                    radius: 500
                }, window.placesCallback);




            }, function() {
                //handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            alert('Cant Lock Down Position');
            // Browser doesn't support Geolocation
            //handleLocationError(false, infoWindow, map.getCenter());
        }

    };


    window.claimArea = function(placeId, teamIndex) {
        console.log(placeId);
        var hotSpot = Parse.Object.extend("HotSpots");
        var query = new Parse.Query(hotSpot);
        query.equalTo("placeId", placeId);
        query.find({
            success: function(results) {
                console.log(results);
                if (results.length) {
                    results[0].set('claimedBy', h.playerObject.id);
                    results[0].set('squad', teamIndex);
                    results[0].set('name', h.playerObject.get('displayName'));

                    results[0].save(null, {
                        success: function(object) {
                            alert('hotspot edited');
                        },
                        error: function(model, error) {
                            alert(error);
                        }
                    });

                } else {
                    var unitObject = new hotSpot();
                    unitObject.set('claimedBy', h.playerObject.id);
                    unitObject.set('squad', teamIndex);
                    unitObject.set('placeId', placeId);
                    unitObject.set('name', h.playerObject.get('displayName'));

                    unitObject.save(null, {
                        success: function(object) {
                            alert('hotspot added');
                        },
                        error: function(model, error) {
                            alert(error);
                        }
                    });
                }

            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });


    };


    var placesResults;
    window.placesCallback = function(results, status) {
        placesResults = results;
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                // console.log(results[i]);
                window.createMarker(results[i], 'red');
            }
            window.placesCallbackOwned();
            window.placesCallbackTaken();
        }
    }

    window.placesCallbackOwned = function() {

        var hotSpot = Parse.Object.extend("HotSpots");
        var query = new Parse.Query(hotSpot);
        query.equalTo("claimedBy", h.playerObject.id);
        query.find({
            success: function(results) {

                for (var x = 0; x < results.length; x++) {
                    for (var i = 0; i < placesResults.length; i++) {
                        if (results[x].get('placeId') === placesResults[i].place_id) {
                            window.createMarker(placesResults[i], 'green', 'Claimed');
                        }
                    }
                }

            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }

    window.placesCallbackTaken = function() {

        var hotSpot = Parse.Object.extend("HotSpots");
        var query = new Parse.Query(hotSpot);
        query.notEqualTo("claimedBy", h.playerObject.id);
        query.find({
            success: function(results) {

                for (var x = 0; x < results.length; x++) {
                    for (var i = 0; i < placesResults.length; i++) {
                        if (results[x].get('placeId') === placesResults[i].place_id) {
                            window.createMarker(placesResults[i], 'yellow', results[x].get('name'));
                        }
                    }
                }

            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }


    window.createMarker = function(place, color, name) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            icon: 'img/map/' + color + '-orb.png',
            position: place.geometry.location
        });


        if (name === void(0)) {
            name = "Unclaimed";
        }

        // onClick="window.geoIndex=\''+place.place_id+'\'"

        h.engageMapBattle = function(placeId) {

            window.geoIndex = placeId;
            var hotSpot = Parse.Object.extend("HotSpots");
            var query = new Parse.Query(hotSpot);
            query.equalTo("placeId", placeId);
            query.find({
                success: function(results) {
                    console.log(results);
                    if (results.length) {
                        window.enemySquad = results[0].get('squad');
                        window.enemyId = results[0].get('claimedBy');
                    } else {
                        window.enemySquad = 'null';
                        window.enemyId = 'null';
                    }

                    Parse.User.current().set('lastMapIndex', window.geoIndex);
                    Parse.User.current().set('lastEnemySquad', window.enemySquad);
                    Parse.User.current().set('lastEnemyId', window.enemyId);
                    Parse.User.current().save(null, {
                        success: function(object) {
                            window.preFightPrep = true;
                            loadPageContent(renderTeamScreen);

                            console.log(window.geoIndex, ' , ', window.enemySquad, ' , ', window.enemyId);
                        },
                        error: function(model, error) {
                            alert(error);
                        }
                    });


                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });




        };


        var engageHtml = function(place) {
            if (color != 'green') {
                return '<div class="mapTip">' + place.name + '</div><div>' + name + '</div><button onClick="h.engageMapBattle(\'' + place.place_id + '\')">Engange</button>';
            } else {
                return '<div class="mapTip">' + place.name + '</div><div>' + name + '</div>';
            }
        }


        google.maps.event.addListener(marker, 'click', function() {
            window.infowindow.setContent(engageHtml(place));
            window.infowindow.open(map, this);
        });
    }

    if (window.googleAPIcalled === void(0)) {
        window.googleAPIcalled = true;
        $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBsY0YyoaOHG_aD-JQnWrJeKxFVU7SLLRk&signed_in=true&libraries=places&callback=initMap");
    } else {
        initMap();
    }
}

//////////// Render Maps Screen END ///////////--///////////////////////////////////////////////////