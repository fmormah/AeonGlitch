(function() {

    var jsHelpers = {

        ifNetConnection: function(action) {
            var myImage = new Image(1, 1);
            var netConnection;
            myImage.onerror = function() {
                netConnection = false;
                alert('Network connction must be available for this');
            };
            myImage.onload = function() {
                netConnection = true;
                action();
            };
            myImage.src = 'https://ssl.gstatic.com/gb/images/v1_4593b7d7.png';
        },

        getAccountObjects: function() {

            //Get Player
            h.playerObject = Parse.User.current();

            //Get Email
            h.unopenedEmail = 0;

            if(h.EmailCollection == void(0)){
                h.EmailCollection = [];
            }

            var query = new Parse.Query(Parse.Object.extend(Parse.User.current().id+"_EmailCollection"));
            query.equalTo("infotype", "email");
            query.find({
              success: function(results) {
                console.log("Retrieving Email");
                // Do something with the returned Parse.Object values
                h.EmailCollection = results;

                for(var e = 0; e < h.EmailCollection.length; e++){
                    if(h.EmailCollection[e].get('opened') === false){
                        h.unopenedEmail++;
                    }
                }

                if($('.mail-cnt').length){
                    $('.mail-cnt').html(h.unopenedEmail);
                    if(h.unopenedEmail > 0){
                        $('.mail-cnt').css('display','block');
                    }else{
                        $('.mail-cnt').css('display','none');
                    }
                }

              },
              error: function(error) {
                alert("Error: " + error.code + " " + error.message);
              }
            });

            //Player Collection
            h.avatarPlayerCollection = [];
            var query = new Parse.Query(Parse.Object.extend(Parse.User.current().id + "_Collection"));
            query.equalTo("collectionType", "avatar");
            query.find({
                success: function(results) {
                    h.avatarPlayerCollection = results;
                },
                error: function(error) {
                    alert("Player collection retrieval Error: " + error.code + " " + error.message);
                }
            });

            //getAvatars
            h.avatarBaseCollection = Parse.Object.extend("Avatars");

            //getItems
            h.itemCollection = [];
            var query = new Parse.Query(Parse.Object.extend(Parse.User.current().id + "_Items"));
            query.equalTo("type", "item");
            query.find({
              success: function(results) {
                console.log("Retrieving players inventory");
                // Do something with the returned Parse.Object values
                h.itemCollection = results;

              },
              error: function(error) {
                alert("Error: " + error.code + " " + error.message);
              }
            });

            //Get Item Library
            h.itemBaseCollection = [];
            var query = new Parse.Query(Parse.Object.extend("Items"));
            query.equalTo("linkType", "item");
            query.find({
              success: function(results) {
                console.log("Retrieving Items Base");
                // Do something with the returned Parse.Object values
                h.itemBaseCollection = results;

              },
              error: function(error) {
                alert("Error: " + error.code + " " + error.message);
              }
            });


            //Get Moves Library
            h.abilitiesBaseCollection = [];
            var query = new Parse.Query(Parse.Object.extend("MovesList"));
            query.equalTo("type", "ability");
            query.find({
              success: function(results) {
                console.log("Retrieving Abilities Base");
                // Do something with the returned Parse.Object values
                h.abilitiesBaseCollection = results;

              },
              error: function(error) {
                alert("Error: " + error.code + " " + error.message);
              }
            });

            //Get News
            h.NewsCollection = [];
            var query = new Parse.Query(Parse.Object.extend("NewsFeed"));
            query.equalTo("type", "News");
            query.find({
              success: function(results) {
                console.log("Retrieving News");
                // Do something with the returned Parse.Object values
                h.NewsCollection = results;

              },
              error: function(error) {
                alert("Error: " + error.code + " " + error.message);
              }
            });

            

            console.log('Objects Cached');

        },

        loginPage: function() {

            //////////// Toggle between sign up or Log in ///////////
            this.formType = function() {
                if (window.isNewAccount === void(0) || window.isNewAccount === false) {
                    window.isNewAccount = true;
                    $('.sign-up-options').addClass('active');
                    $('.side-cta-btn').html('Existing Account?');
                    $('.cta-btn').html('Sign up');
                } else {
                    window.isNewAccount = false;
                    $('.sign-up-options').removeClass('active');
                    $('.side-cta-btn').html('New account?');
                    $('.cta-btn').html('Log in');
                }
            };

            ////Validation helpers/////
            this.validateEmail = function(email) {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if (re.test(email) === false) {
                    $('#email').parent().addClass('invalid');
                    $('#email').next('.err-msg').html('Invalid Email Address');
                } else {
                    $('#email').parent().removeClass('invalid');
                }
                return re.test(email);
            };


            this.validatePassWord = function(pw) {
                /*
                    To check a password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter
                
                */
                var re = /^[A-Za-z]\w{7,14}$/;
                if (re.test(pw) === false) {
                    $('#password').parent().addClass('invalid');
                    $('#password').next('.err-msg').html('Invalid Pasword (Must be between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter)');
                } else {
                    $('#password').parent().removeClass('invalid');
                }
                return re.test(pw);
            };

            this.validateName = function(name) {
                if (name != '' && name != ' ') {
                    $('#d_name').parent().removeClass('invalid');
                    return true;
                } else {
                    $('#d_name').parent().addClass('invalid');
                    $('#d_name').next('.err-msg').html('Invalid username');
                    return false;
                }
            };

            this.confirmPassWord = function(pw) {
                if (new h.loginPage().validatePassWord($('#password')[0].value) === true) {
                    if (pw === $('#password')[0].value) {
                        $('#c_password').parent().removeClass('invalid');
                        return true;
                    } else {
                        $('#c_password').next('.err-msg').html('password not matched');
                        $('#c_password').parent().addClass('invalid');
                        return false;
                    }
                }

            };

            //ON Log In CTA CLICK
            this.formSubmit = function() {

                var isEmailValid = false;
                var isPassWordValid = false;
                var passwordConfirmed = false;
                var validUserName = false;


                if (window.isNewAccount === void(0) || window.isNewAccount === false) {
                    console.log('logging in...');



                    isEmailValid = new h.loginPage().validateEmail($('#email')[0].value);
                    isPassWordValid = new h.loginPage().validatePassWord($('#password')[0].value);

                    if (isEmailValid === true && isPassWordValid === true) {


                        Parse.User.logIn($('#email')[0].value, $('#password')[0].value, {
                            success: function(user) {
                                // Do stuff after successful login.
                                console.log('logged in');
                                h.getAccountObjects();

                                //STORE DATA
                                var userName_cb = $('#email')[0].value;
                                var password_cb = $('#password')[0].value;
                                localStorage.setItem("username", userName_cb);
                                localStorage.setItem("password", password_cb);
                                window.location.href = "uniwebview://loginwith?user=" + userName_cb + "&pass=" + password_cb;

                                //alert(window.location.href);
                                if(window.getParameterByName("goto") == ""){
                                    window.loadPageContent(window.renderHomeScreen);
                                }else if(window.getParameterByName("goto") == "story"){
                                    window.loadPageContent(window.renderStoryScreen);
                                }
                                
                                sessionStorage.setItem("loggedIn", "true");


                                //h.addEmailToUserAccount('server','Agent Smith','Lorem header','<p>This is some stuff</p>');
                                //new h.addItemToCollection().getIdBasedOnRarity(8);

                                
                               
                            },
                            error: function(user, error) {
                                // The login failed. Check error to see why.
                                alert(error.message);
                            }
                        });

                    } else {
                        console.log('Invalid Log in');
                    }
                } else {
                    console.log('signing up...');

                    isEmailValid = new h.loginPage().validateEmail($('#email')[0].value);
                    isPassWordValid = new h.loginPage().validatePassWord($('#password')[0].value);
                    passwordConfirmed = new h.loginPage().confirmPassWord($('#c_password')[0].value);
                    validUserName = new h.loginPage().validateName($('#d_name')[0].value);

                    if (isEmailValid === true &&
                        isPassWordValid === true &&
                        passwordConfirmed === true &&
                        validUserName === true
                    ) {

                        var user = new Parse.User();
                        user.set("username", $('#email')[0].value);
                        user.set("password", $('#password')[0].value);
                        user.set("pw_check", $('#password')[0].value);
                        user.set("displayName", $('#d_name')[0].value);
                        user.set("email", $('#email')[0].value);
                        user.set("a_type", 0);
                        user.set("progressIndex", -1);
                        user.set("timesFinished", 0);
                        user.set("team1", [null, null, null, null]);
                        user.set("team2", [null, null, null, null]);
                        user.set("team3", [null, null, null, null]);
                        user.set("team4", [null, null, null, null]);

                        new h.addAvatarToCollection().getIdBasedOnRarity(8);


                        user.signUp(null, {
                            success: function(user) {
                                // Hooray! Let them use the app now.
                                console.log('Signed Up!');
                                h.getAccountObjects();

                                //STORE DATA
                                var userName_cb = $('#email')[0].value;
                                var password_cb = $('#password')[0].value;
                                localStorage.setItem("username", userName_cb);
                                localStorage.setItem("password", password_cb);
                                window.location.href = "uniwebview://loginwith?user=" + userName_cb + "&pass=" + password_cb;

                                window.loadPageContent(window.renderHomeScreen);
                                sessionStorage.setItem("loggedIn", "true");

                                h.addEmailToUserAccount('story','PoriSoft','Aoenian Notice Email','<h4>From PoriSoft:</h4><p>Thank You for signing up to the Aeonian Beta test.' 
                                    +'This email is to notify you to complete your registration process by activating your account Please click here to activate your account.</p>'
                                    +'PeriSoft');

                                h.addEmailToUserAccount('story','PoriSoft','Aoenian Notice Email','<h4>From PoriSoft:</h4><p>Account activation confirmed. Enjoy your stay in Aeonian</p> PeriSoft');

                                h.addEmailToUserAccount('story','Joan','u in yet??','<div style="height:100%;width:100%;" id="hyperemail"><h4>From Joan:</h4><p>Hey man, have you been playing!? Cant wait to play.</p> <p>Excited!! :D</p>');

                                h.addEmailToUserAccount('story','Joan','I got in!!','<div style="height:100%;width:100%;" id="hyperemail"> <a id="chat-link">Open Video Message</a></div><script>$( "#chat-link" ).click(function() {$( \'#hyperemail\').append( \'<iframe style="width:100%;height:100%;position:absolute;left:0;top:0" src="https://www.youtube.com/embed/i7VhKHiTfWc?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>\');});</script>');

                            },
                            error: function(user, error) {
                                // Show the error message somewhere and let the user try again.
                                //alert("Error: " + error.code + " " + error.message);
                                alert(error.message);
                            }
                        });


                    } else {
                        console.log('Invalid Log in');
                    }
                }
            };
        },

        addEmailToUserAccount:function(type,sender,subject,html,asap){

            var UnitObject = Parse.Object.extend(Parse.User.current().id+"_EmailCollection");
            var unitObject = new UnitObject();

            unitObject.set("infotype", "email")
            unitObject.set("type", type);//server/story
            unitObject.set("sender", sender);
            unitObject.set("subject", subject);
            unitObject.set("html", html);
            unitObject.set("opened", false);
            unitObject.save(null, {
              success: function(object) {
                console.log('email added to user mailbox');
              },
              error: function(model, error) {
                alert(error);
              }
            });

            if(h.EmailCollection == void(0)){
                h.EmailCollection = [];
            }

            if(asap != void(0)){
                console.log("instant email")
                h.EmailCollection.push(unitObject);
            }
            

        },

        addAvatarToCollection: function() {

            ////////////////
            this.getIdBasedOnRarity = function(rarityIndex) {

                var avatarHolder;
                if (rarityIndex == void(0) || rarityIndex === NaN) {
                    console.log('soemthing went wrong');
                    return
                }

                console.log('Attemtping rarity: ', rarityIndex);

                var Avatars = Parse.Object.extend("Avatars");
                var query = new Parse.Query(Avatars);
                query.lessThanOrEqualTo("rarity", rarityIndex);
                query.find({
                    success: function(results) {
                        //alert("Successfully retrieved " + results.length + " scores.");
                        // Do something with the returned Parse.Object values
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            console.log(object.id + ' - ' + object.get('type'));
                        }

                        if (results.length) {
                            var grabbedIndex = Math.floor((Math.random() * results.length) + 0);
                            avatarID = results[grabbedIndex].id;
                            avatarType = results[grabbedIndex].get('type');
                            abilityArray = results[grabbedIndex].get('abilities');
                            console.log(results[grabbedIndex].get('type'));

                            console.log("AVATAR INDEX: ", avatarID);
                            if (Parse.User.current() !== void(0)) {
                                //
                                console.log('trying to add to collection...', avatarID);



                                //If not in collection
                                var CollectionClass = Parse.Object.extend(Parse.User.current().id + "_Collection");
                                var collectionClass = new CollectionClass();

                                var query = new Parse.Query(CollectionClass);
                                query.equalTo("avatarID", avatarID);
                                query.find({
                                    success: function(results) {
                                        var found = false;
                                        // Do something with the returned Parse.Object values
                                        for (var i = 0; i < results.length; i++) {
                                            found = true;
                                            results[i].set("level", results[i].get('level') + 1);
                                            var usedName = results[i].get('name');
                                            results[i].save(null, {
                                                success: function(object) {
                                                    alert(usedName + ' has increased in Power!');
                                                },
                                                error: function(model, error) {
                                                    //alert(error);
                                                }
                                            });
                                        }

                                        if (found === false) {
                                            collectionClass.set("name", avatarType);
                                            collectionClass.set("avatarID", avatarID);
                                            collectionClass.set("level", 1);
                                            collectionClass.set("exp", 0);

                                            collectionClass.set("Gem1", "Null");
                                            collectionClass.set("Gem2", "Null");
                                            collectionClass.set("Gem3", "Null");
                                            collectionClass.set("Gem4", "Null");

                                            collectionClass.set("Ability1", "Null");
                                            collectionClass.set("Ability2", "Null");
                                            collectionClass.set("Ability3", "Null");
                                            collectionClass.set("Ability4", "Null");

                                            collectionClass.set("abilityArray", abilityArray);

                                            collectionClass.set("collectionType", "avatar");


                                            collectionClass.save(null, {
                                                success: function(object) {
                                                    //alert('New Type added 2');
                                                    alert('You have gained ' + avatarType);
                                                },
                                                error: function(model, error) {
                                                    //alert(error);
                                                }
                                            });
                                        }
                                    },
                                    error: function(error) {
                                        alert("Error: " + error.code + " " + error.message);
                                    }
                                });
                            }
                        }

                    },
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });

            };
        },

        addItemToCollection: function() {

            ////////////////
            this.getIdBasedOnRarity = function(rarityIndex) {

                var itemHolder;
                if (rarityIndex == void(0) || rarityIndex === NaN) {
                    console.log('soemthing went wrong');
                    return
                }

                console.log('Attemtping rarity: ', rarityIndex);

                var Items = Parse.Object.extend("Items");
                var query = new Parse.Query(Items);
                query.lessThanOrEqualTo("rarity", rarityIndex);
                query.find({
                    success: function(results) {
                        //alert("Successfully retrieved " + results.length + " scores.");
                        // Do something with the returned Parse.Object values
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            console.log(object.id + ' - ' + object.get('Name'));
                        }

                        if (results.length) {
                            var grabbedIndex = Math.floor((Math.random() * results.length) + 0);
                            var itemID = results[grabbedIndex].id;
                            var itemName = results[grabbedIndex].get('Name');
                            var itemDesc = results[grabbedIndex].get('Description');
                            var itemType = results[grabbedIndex].get('Type');
                            var itemRarity = results[grabbedIndex].get('rarity');
                            console.log(results[grabbedIndex].get('Name'));
                            var amount = Math.floor((Math.random() * 5) + 1);

                            console.log("Item INDEX: ", itemID);
                            if (Parse.User.current() !== void(0)) {
                                //
                                console.log('trying to add to Inventory...', itemID);



                                //If not in collection
                                var CollectionClass = Parse.Object.extend(Parse.User.current().id + "_Items");
                                var collectionClass = new CollectionClass();

                                var query = new Parse.Query(CollectionClass);
                                query.equalTo("itemID", itemID);
                                query.find({
                                    success: function(results) {
                                        var found = false;
                                        // Do something with the returned Parse.Object values
                                        for (var i = 0; i < results.length; i++) {
                                            found = true;
                                            
                                            results[i].set("qty", results[i].get('qty') + amount);
                                            if(results[i].get('qty') > 99){
                                                results[i].set('qty',99);
                                            }
                                            var usedName = itemName;
                                            results[i].save(null, {
                                                success: function(object) {
                                                    console.log(amount + ' ' +usedName + ' Added');
                                                },
                                                error: function(model, error) {
                                                    alert(error);
                                                }
                                            });
                                        }

                                        if (found === false) {
                                            collectionClass.set("Name", itemName);
                                            collectionClass.set("itemID", itemID);
                                            collectionClass.set("qty", amount);
                                            collectionClass.set("item_type", itemType);
                                            collectionClass.set("type", "item");
                                            collectionClass.set("rarity", itemRarity);
                                            collectionClass.set("Description", itemDesc);


                                            collectionClass.save(null, {
                                                success: function(object) {
                                                    //alert('New Type added 2');
                                                    console.log(amount + ' ' +itemName+ ' Added');
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
                            }
                        }

                    },
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });

            };

        }




    }

    window.h = jsHelpers;
    Parse.initialize("KqlL5WS8by5F2Jb3TTWjrpP3WToMPOcSvJw9OHJr", "BEWwc12nd5BCksbbNLOwkOJMu9ahDa6vmeVmNmYr");

}());