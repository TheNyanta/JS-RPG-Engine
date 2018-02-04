function startGame() {
    myGameArea.init();
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    defaultWidth : 560,
    defaultHeight : 350,
    init : function() {
        this.canvas.width = 560;
        this.canvas.height = 350;
        
        // Pause game if not selected
        document.active = true;
        $(window).focus(function() {document.active = true;});
        $(window).blur(function() {document.active = false;});
        
        //this.canvas.style.cursor = "none"; //hide the original cursor
        this.context = this.canvas.getContext("2d");
        
        // Add buttons
        var myGameButtons =
            '<br>' +
            '<button onclick="enterFullscreen()" unselectable="on">Fullscreen</button>' +
            '<button onclick="EnableScrollbar()" unselectable="on">Scrollbar On</button>' +
            '<button onclick="DisableScrollbar()" unselectable="on">Scrollbar Off</button>' +
            '<button onclick="audio1.play()">Play Music</button>' +
            '<button onclick="audio1.pause()">Pause Music</button>' +
            '<br>' +
            '<button onclick="gameCamera.setTarget(character)">Camera on Character</button>' +
            '<button onclick="gameCamera.setTarget(cat)">Camera on Cat</button>' +
            '<button onclick="control2.doFollow=true">Cat follow</button>' +
            '<button onclick="control2.doFollow=false">Cat stay</button>';
        document.getElementById("startGame").insertAdjacentHTML('afterend',myGameButtons);
        
        // Replace Start Button with Canvas
        document.getElementById("startGame").parentElement.replaceChild(this.canvas, document.getElementById("startGame"));
        
        this.frameNo = 0;
        
        // Animation Counter
        InitalizeAnimationCounters();
        
        // Initalize Maps
        for (i=0; i<maps.length; i++) maps[i].init();
        
        window.requestAnimationFrame = window.requestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(f){return setTimeout(f, 1000/60)}; // simulate calling code 60 
 
        window.cancelAnimationFrame = window.cancelAnimationFrame
        || window.mozCancelAnimationFrame
        || function(requestID){clearTimeout(requestID)}; //fall back
        
        // INITIALIZE USER INPUT       
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })
        window.addEventListener('mousedown', function (e) {
            myGameArea.mousedown = true;
            myGameArea.clickdownX = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.clickdownY = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
            
            if (myGameArea.clickdownX > 0 && 
                myGameArea.clickdownY > 0 &&
                myGameArea.clickdownX < myGameArea.canvas.width &&
                myGameArea.clickdownY < myGameArea.canvas.height)
                myGameArea.clicked = true;
        })
        window.addEventListener('mouseup', function (e) {
            myGameArea.mousedown = false;
            myGameArea.clickupX = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.clickupY = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('mousemove', function (e) {
            myGameArea.x = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchstart', function (e) {
            myGameArea.touchdown = true;
            myGameArea.clickdownX = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.clickdownY = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchend', function (e) {
            myGameArea.touchdown = false;
            myGameArea.clickupX = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.clickupY = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchmove', function (e) {
            myGameArea.x = e.touches[0].clientX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y = e.touches[0].clientY - myGameArea.canvas.getBoundingClientRect().top;
        })
        
    },
    
    start : function() {
        
        // Old gameLoop
        //this.interval = setInterval(function() { ResetAnimationCounter(); updateGameArea();} , 16);

        // New gameLoop
        function gameLoop() {
            requestAnimationFrame(gameLoop);
            if (document.active) {
                ResetAnimationCounter();
                updateGameArea();
            }
        }
        
        gameLoop();      
    },
    
    stop : function() {
        
    },
        
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

var enterPressed = false;

// Update Canvas
function updateGameArea() {
    myGameArea.frameNo += 1;
    
    if (myGameArea.keys) {
        if (myGameArea.keys[KEY_A]) {
            offset_x--;
        }
        if (myGameArea.keys[KEY_D]) {
            offset_x++;
        }
        if (myGameArea.keys[KEY_W]) {
            offset_y--;
        }
        if (myGameArea.keys[KEY_S]) {
            offset_y++;
        }
    }
    
    maps[mapID].drawBackground();
    
    clickControl.update();
    control2.update();
    
    if (debug) {
        clickControl.drawRoute();
        control2.drawRoute();
    }
    
    
    
    /*
    // Object Object Collison TODO: generalize for all objects on the current map
    if (character.crashWith(cat, character.speedX, character.speedY)) {
        character.isFacing();
        character.speedX = 0;
        character.speedY = 0;
        
    }
    if (cat.crashWith(character, cat.speedX, cat.speedY)) {
        cat.isFacing();
        cat.speedX = 0;
        cat.speedY = 0;
        
    }
    */ 
    
    /*
    if (character.direction == DIR_N) {
        char_front.x = Math.floor((character.x+ 4)/16)*16 - gameCamera.x;
        char_front.y = Math.floor((character.y+16-16)/16)*16 - gameCamera.y;
    }
    if (character.direction == DIR_S) {
        char_front.x = Math.floor((character.x+ 4)/16)*16 - gameCamera.x;
        char_front.y = Math.floor((character.y+16+16)/16)*16 - gameCamera.y;
    }
    if (character.direction == DIR_W) {
        char_front.x = Math.floor((character.x+ 4-16)/16)*16 - gameCamera.x;
        char_front.y = Math.floor((character.y+16)/16)*16 - gameCamera.y;
    }
    if (character.direction == DIR_E) {
        char_front.x = Math.floor((character.x+ 4+15)/16)*16 - gameCamera.x;
        char_front.y = Math.floor((character.y+16)/16)*16 - gameCamera.y;
    }
    */   
    
    cat.update(); 
    character.update();
    
    /*
    // Automatic Order update() after Y-coordinate - smaller y first
    maps_objects.sort(this.y);
    maps_objects.reverse(); // Shows both o.O
    for (var i = 0; i < maps_objects.length; i++)
        maps_objects[i].draw();*/
    
    
    // Objects incl. character
    if (character.y > cat.y) {
        cat.draw(); 
        character.draw();
    }
    else {
        character.draw(); 
        cat.draw(); 
    }
    
    
    maps[mapID].drawForeground();
    
    //control3.drawSwip();
    
    gameCamera.update();
    
    // Enter KEY 
    if (myGameArea.keys)
        if (myGameArea.keys[KEY_ENTER]) {
            if (!enterPressed) {
                //console.log("Enter Pressed");
                testdialog.chatCounter++;
                chatSequence = true;
            }
            enterPressed = true;
        }
    else {
        if (enterPressed) {
            //console.log("Enter Released");
            enterPressed = false;
        }
    }
    
    if (chatSequence)
        testdialog.update();
    

    
    updateFPS();
    showFPS();
    
    showTime();
    showPosition(character);
    
    //offset_x = 0;
    //offset_y = 0;

}