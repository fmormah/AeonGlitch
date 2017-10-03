(function() {
    
    var simpleCS = {

        segmentObj: function(BGMsrc, VoiceSrc, BGImgSrc, ActorSrc, Copy, actorName, callBack) {
            this.BGMsrc = BGMsrc;
            this.VoiceSrc = VoiceSrc;
            this.BGImgSrc = BGImgSrc;
            this.ActorSrc = ActorSrc;
            this.Copy = Copy;
            this.actorName = actorName;
            this.callBack = callBack;
        },

        addSegment: function(segmentObj){
            s.segmentObjArray.push(segmentObj);
        },

        showSegment: function(segmentObjInstance) {

            if (segmentObjInstance.BGMsrc != null) {
               window.location.replace('uniwebview://bgm?name='+segmentObjInstance.BGMsrc);
            }

            //Function to help the scene switch between scene segments

            var $actors = $('.actors');
            var $subTitleHolder = $('.sub-titles-holder');
            var $bgDiv = $('.bg-div');

            //this.actorXposition = window.innerWidth / 2 - (parseInt($actors.css('width')) / 2);
            simpleCS.inTransition = true;

            //Remove previous Segment
             if (segmentObjInstance.ActorSrc != void(0) || segmentObjInstance.ActorSrc != null) {
                $actors.css('opacity', 0);
                if (simpleCS.nextFlip === true) {
                    $actors.css('right', '100%');
                } else {
                    $actors.css('right', 0);
                }

                setTimeout(function() {
                    if (simpleCS.nextFlip === true) {
                        $actors.css('right', 0);
                    } else {
                        $actors.css('right', '100%');
                    }
                }, 1000);
            }

            

            $subTitleHolder.css('opacity', 0);
            $subTitleHolder.css('bottom', '-100%');

            if (segmentObjInstance.BGImgSrc != void(0)) {
                $bgDiv.css('opacity', 0);
            }

            setTimeout(function() {

                //Add new segment elements

                if (segmentObjInstance.VoiceSrc != null) {
                    window.location.replace('uniwebview://voice?name='+segmentObjInstance.VoiceSrc);
                }

                
                if (segmentObjInstance.ActorSrc != void(0) || segmentObjInstance.ActorSrc != null) {
                    $actors[0].src = segmentObjInstance.ActorSrc;
                    $actors.css('opacity', 1);
                    console.log(this.actorXposition);
                    //$actors.css('right', this.actorXposition);
                    $actors.css('right',0);
                }

                if (segmentObjInstance.Copy != void(0)) {

                    var actorName = '';
                    if (segmentObjInstance.actorName != void(0)) {
                        actorName = '<div class="name-slot">' + segmentObjInstance.actorName + '</div>';
                    }

                    $subTitleHolder.html(actorName + segmentObjInstance.Copy)
                    $subTitleHolder.css('opacity', 0.8);
                    $subTitleHolder.css('bottom', 0);
                }

                if (segmentObjInstance.BGImgSrc != void(0)) {
                    $bgDiv.css('background-image', 'url(' + segmentObjInstance.BGImgSrc + ')');
                    $bgDiv.css('opacity', 1);
                }

                if(segmentObjInstance.callBack != void(0)){
                    segmentObjInstance.callBack();
                }

                setTimeout(function() {
                    simpleCS.inTransition = false;
                }, 500);

            }.bind(this), 1500);

        },


        Init: function(initAction, callBack, endSceneCallBack) {
            simpleCS.inTransition = false;
            simpleCS.segmentObjArray = [];
            simpleCS.pageIndex = -1;
            simpleCS.endSceneCallBack = endSceneCallBack;

            if (callBack != null || callBack != void(0)) {
                callBack();
            }

            if (initAction != void(0)) {
                initAction();
            }


           simpleCS.next = function() {
                console.log('going next');
                simpleCS.nextFlip = true;
                if (simpleCS.segmentObjArray[simpleCS.pageIndex + 1] != void(0)) {
                    simpleCS.pageIndex++;
                    simpleCS.showSegment(simpleCS.segmentObjArray[simpleCS.pageIndex]);
                } else {
                    //Go to Quest menu
                    if (simpleCS.endSceneCallBack != null || simpleCS.endSceneCallBack != void(0)) {
                        simpleCS.endSceneCallBack();
                    } else {
                        window.location.replace('uniwebview://home');
                    }
                }
            }

            simpleCS.previous = function() {
                simpleCS.nextFlip = false;
                console.log('going previous');
                if (simpleCS.segmentObjArray[simpleCS.pageIndex - 1] != void(0)) {
                    simpleCS.pageIndex--;
                    simpleCS.showSegment(simpleCS.segmentObjArray[simpleCS.pageIndex]);
                }
            }
            simpleCS.next();



            /*********************** Set Up Swiper ************/
            var draggable = document.getElementById('draggable-element');
            draggable.addEventListener('touchmove', function(event) {
                var touch = event.targetTouches[0];

                // Place element where the finger is
                draggable.style.left = touch.pageX - (window.innerWidth / 2) + 'px';
                //draggable.style.top = touch.pageY-25 + 'px';
                event.preventDefault();
            }, false);

            draggable.addEventListener('touchend', function(event) {
                if (parseInt(draggable.style.left) < -100) {
                    simpleCS.next();
                } else if (parseInt(draggable.style.left) > 100) {
                    simpleCS.previous();
                }
                draggable.style.left = 0;
                event.preventDefault();
            }, false);
        }

    }

    window.s = simpleCS;

}())