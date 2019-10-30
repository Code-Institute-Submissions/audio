//autoOpen:false stops the confirmation dialog from appearing on page load
$("#dialog-confirm").dialog({
    autoOpen: false,
});

//Get the height and width of the container so to set the canvas width and height 
var element = document.getElementById('container');
var positionInfo = element.getBoundingClientRect();
var containerHeight = positionInfo.height;
var containerWidth = positionInfo.width;
console.log("h:" + containerHeight);

/*
//Popovers (doesn't work -conflict between jquery UI js and bootstrap js)
$(function () {
    $('[data-toggle="popover"]').popover()
})
$('.popover-dismiss').popover({
    trigger: 'focus'
})
*/

//Create sketch and attach it to #container div
var myp5 = new p5(sketch, document.getElementById("container"));

var elem = document.getElementById("container");
if (elem.requestFullscreen) {
    elem.requestFullscreen();
}

window.onload = function () {

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    function resizeCanvas() {

        ///////////////???????timeout?

        // We execute the same script as before
        //let vh = window.innerHeight * 0.01;
        //document.documentElement.style.setProperty('--vh', `${vh}px`); 
        var element = document.getElementById('container');
        var positionInfo = element.getBoundingClientRect();
        var containerHeight = positionInfo.height;
        var containerWidth = positionInfo.width;
        console.log("h:" + containerHeight);
        // myp5.resizeCanvas(window.innerWidth, window.innerHeight);
        myp5.windowResized(containerWidth, containerHeight);
        // window.setTimeout(myp5.windowResized(containerWidth, containerHeight), 2*1000);
        //  myp5.windowResized(containerWidth, containerHeight);

        // var myp5 = new p5(sketch, document.getElementById("container"));
    }


    //Set sketch variables according to ui menu settings on load
    myp5.c = $('#lowMidColor').val();
    myp5.highMidColor = $('#highMidColorPicker').val();
    myp5.strokeWidth = $("#stroke-weight-picker").val();


    /////////Action buttons/////////
    //Settings button (Opens settings menu)
    $("#buttonX").on("click", function () {
        $("#toggler").toggle("slide", {}, 100);
    });

    //Make settings menu draggable
    $("#gui").draggable();

    //Camera button
    $("#camera").on("click", function () {
        $(".ui-dialog-titlebar").hide();
        //First have to change the autoOpen setting
        // Getter
        //  var autoOpen = $("#dialog-confirm").dialog("option", "autoOpen");
        // Setter
        // $("#dialog-confirm").dialog("option", "autoOpen", true);
        //Code for setting local storage item from: https://jsfiddle.net/h5q7pe3m/1/
        //Sets local storage item so user won't be asked again to confirm saving an image
        $(".no").on("click", function () {
            localStorage.setItem('hideAlert', true);
        });
        if (!localStorage.hideAlert) {
            $(function () {
                myp5.noLoop();
                //Dialog opens to confirm the user wants to save a picture
                //if yes it calls the myp5 function capture()
                //If no closes dialog box
                $("#dialog-confirm").dialog({
                    //?With autoOpen: false it won't open at all
                    autoOpen: true,
                    resizable: false,
                    height: "auto",
                    width: 300,
                    //why doesn't modal:true freeze sketch
                    modal: true,
                    buttons: {
                        "Save": function () {
                            myp5.capture();
                            $(this).dialog("close");
                            myp5.loop();
                        },
                        Cancel: function () {
                            $(this).dialog("close");
                            myp5.loop();
                        }
                    }
                });
            });
        } else {
            myp5.capture();
        }
    });

    //More information button
    $('#information-modal').on('shown.bs.modal', function () {
        // let vis = record if settings menu was open when more information button was clicked.
        let vis = $("#toggler").is(":visible");
        //Pause sketch while modal is showing.
        myp5.noLoop();
        //If settings menu was open, hide it.
        if (vis) {
            $("#toggler").hide();
        }
        $('#information-modal').on('hidden.bs.modal', function () {
            //if the settings menu was open when more information button was clicked, show it again.
            if (vis) {
                $("#toggler").show();
            }
            //Play sketch when modal is closed.
            myp5.loop();
        });
    });

    //Settings button (Opens settings menu)
    $("#fullScreenButton").on("click", function () {
        //?On Android samsung internet browser launches into fullscreen when opened
        //https://davidwalsh.name/fullscreen
        function launchIntoFullscreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
        let elem = document.getElementById("container");
        launchIntoFullscreen(elem);
    });

    /////////Settings Menu//////////
    //For changing sketch variables 

    $("#close-settings").on("click", function () {
        $("#toggler").toggle("slide", {}, 100);
    });

    //Background Color radio
    $('input[type="radio"]').on('click change', function (e) {
        let bgCol = document.querySelector('input[name="backgroundColorRadio"]:checked').value;
        //?Change .ui-container bg color and icons color?
        /*
        if(bgCol ==="white"){
            $('.ui-container').css('background-color', 'rgba(10, 10, 10, 0.5)');
        }else if(bgCol==="black"){
            $('.ui-container').css('background-color', 'rgba(10, 10, 10, 0.5)');
        }*/
        // console.log(bgCol);
        myp5.changeBackgroundColor(bgCol);

    });

    //Display lines checkbox
    document.getElementById("linesCheckbox").onchange = function () {
        if (this.checked == true) {
            console.log("display lines checked");
            myp5.lines = true;
        } else {
            console.log("display lines unchecked")
            myp5.lines = false;
        }
    }

    //Shape mode checkbox
    document.getElementById("shapeCheckbox").onchange = function () {
        if (this.checked == true) {
            console.log("shape mode checked");
            myp5.shapeMode = true;
        } else {
            console.log("shape mode unchecked")
            myp5.shapeMode = false;
        }
    }

    //To get the sensitivity value from the slider before input
    //  myp5.sensitivity = document.getElementById('sensitivity-slider').value;
    myp5.sensitivity = document.getElementById('sensitivity-slider').value;
    //Sensitivity slider
    let sensitivitySlider = document.getElementById("sensitivity-slider");
    sensitivitySlider.oninput = function () {
        myp5.sensitivity = this.value;
    }

    //To keep the movers moving
    // var intervalID = setInterval(randomizeSensitivity, 5000);
    /* let randomSensitivity = (function (sens_) {
         let min = 1;
         let max = 4;
         let sens = sens_
         let randomNumber = Math.floor(Math.random() * (max - min)) + min;
         let randomSensitivity_ = sens + randomNumber;
         console.log("r" + randomSensitivity_);
         return randomSensitivity_;
     })();
 
     let intervalID = setInterval(randomSensitivity, 5000, myp5.sensitivity);
 */
    let intervalID = setInterval(randomizeSensitivity, 5000);
    function randomizeSensitivity() {
        let min = 1;
        let max = 4;
        let sens_ = myp5.sensitivty;
        let randomNumber = Math.floor(Math.random() * (max - min)) + min;
        let randomSensitivity = sens_ + randomNumber;
        myp5.sensitvity = randomSensitivity;
        console.log("new sensitivity:" + myp5.sensitivity);
    }





    //Stroke Weight slider
    let SWslider = document.getElementById("stroke-weight-picker");
    SWslider.oninput = function () {
        myp5.strokeWidth = this.value;
    }

    //Low mid movers color picker
    let lowMidColor = document.getElementById("lowMidColor");
    lowMidColor.oninput = function () {
        myp5.c = this.value;
    }
    /*
        //High mid movers color picker
        let highMidColorPicker = document.getElementById("highMidColorPicker");
        highMidColorPicker.oninput = function () {
            highMidColor = this.value;
        }*/

}

//Code from: https://stackoverflow.com/questions/9943220/how-to-delete-a-localstorage-item-when-the-browser-window-tab-is-closed#targetText=Using%20vanilla%20JavaScript%20you%20could,the%20close%20window%2Ftab%20action.
//when browser closed - remove local storage item from image save dialog confirmation
$(window).on("unload", function (e) {
    localStorage.removeItem('hideAlert');
});
/*
function unloadHandler()
{
    if (_scriptSettings.browser.isIE) {
        // Run some unload code for Internet Explorer
        //...
    }
}*/

window.addEventListener('onbeforeunload', function (e) {
    // the absence of a returnValue property on the event will guarantee the browser unload happens
  //  alert("on before unload");
    //delete e['returnValue'];
   // e.returnValue = '';
  });

//https://stackoverflow.com/questions/3239834/window-onbeforeunload-not-working-on-the-ipad
  var isOnIOS = navigator.userAgent.match(/iPad/i)|| navigator.userAgent.match(/iPhone/i);
var eventName = isOnIOS ? "pagehide" : "beforeunload";
window.addEventListener(eventName, function (event) { 
   // window.event.cancelBubble = true; // Don't know if this works on iOS but it might!
   //event.returnValue = '';
   //https://stackoverflow.com/questions/8788802/prevent-safari-loading-from-cache-when-back-button-is-clicked
   document.body.opacity = 0; 
} );

//https://stackoverflow.com/questions/8788802/prevent-safari-loading-from-cache-when-back-button-is-clicked
$(window).bind("pageshow", function(event) {
    if (event.originalEvent.persisted) {
        window.location.reload() 
    }
});
///////////Reference////
//https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
//window.onresize = function() {
//document.body.height = window.innerHeight;
//}
//window.onresize(); // called to initially set the height.
