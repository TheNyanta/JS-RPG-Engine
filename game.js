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
            '<button onclick="debug=toggle(debug)", unselectable="on">Debug On/Off</button>' +
            '<br>' +
            '<button onclick="gameCamera.setTarget(character)">Camera on Character</button>' +
            '<button onclick="gameCamera.setTarget(cat)">Camera on Cat</button>' +
            '<button onclick="gameCamera.setTarget(char2)">Camera on Girl</button>' +
            '<br>' +
            '<a>Talk to the girl or the cat by pressing enter in front of them.</a>';
                
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

var enterPressed = false; // For dialog

// Update Canvas
function updateGameArea() {
    myGameArea.frameNo += 1;
    
    maps[mapID].drawBackground();
    
    // Update maps_objects: Control update
    for (i = 0; i < maps_objects[mapID].length; i++) maps_objects[mapID][i].updateControl();
    
    // Check for component-component-collision
    for (i = 0; i < maps_objects[mapID].length; i++)
        for (j = i + 1; j < maps_objects[mapID].length; j++)
            maps_objects[mapID][i].componentCollision(maps_objects[mapID][j]);
    
    // Update maps_objects: Control position
    for (i = 0; i < maps_objects[mapID].length; i++) maps_objects[mapID][i].updatePosition();
    
    /*
    if ((character.speedX != 0 || character.speedY != 0) && (char2.speedX != 0 || char2.speedY != 0)) {
        
    }
    else 
    {
        if (character.speedX != 0 || character.speedY != 0) {
            if (character.collisionOverlap(char2)) {
                char2.speedX = character.speedX;
                char2.speedY = character.speedY;
            }
        }
        if (char2.speedX != 0 || char2.speedY != 0) {
            if (char2.collisionOverlap(character)) {
                character.speedX = char2.speedX;
                character.speedY = char2.speedY;
            }
        }
    }*/
    
    // TODO: Draw bigger y values later!
    // Draw Objects of the current map
    //for (var i = 0; i < maps_objects[mapID].length; i++) maps_objects[mapID][i].draw();
    if (mapID == 0) {
    if (cat.y < char2.y) {
        if(char2.y < character.y) {
            // cat < char2 < character
            cat.draw();
            char2.draw();
            character.draw();
        }
        else if (cat.y < character.y) {
            // cat < character < char2
            cat.draw();
            character.draw();
            char2.draw();
        }
        else {
            // character < cat < char2
            character.draw();
            cat.draw();
            char2.draw();
        }
    }
    else {
        if(char2.y > character.y) {
            // character < char2 < cat
            character.draw();
            char2.draw();
            cat.draw();           
        }
        else if (cat.y < character.y) {
            // char2 < cat < character
            char2.draw();
            cat.draw();
            character.draw();
        }
        else {
            // char2 < character < cat
            char2.draw();
            character.draw();
            cat.draw();
        }
    }
    }
    else {
        jukebox.draw();
        if (char2.y < character.y) {
            char2.draw();
            character.draw();
        }
        else {
            character.draw();
            char2.draw();
        }        
    }
    
    maps[mapID].drawForeground();
    
    gameCamera.update();
    
    // ### START HARDCODED DIALOG EVENT ###
    
    // Enter KEY
    if (character.front.collisionOverlap(char2)) {
        currentDialog = testdialog;
        if (myGameArea.keys)
            if (myGameArea.keys[KEY_ENTER]) {
                if (!enterPressed) {
                    //console.log("Enter Pressed");
                    currentDialog.chatCounter++;
                    chatSequence = true;
                    character.interacting = true;
                    character.disableControls = true;
                    char2.disableControls = true;
                    // Turn char2 to face character
                    if (character.direction == DIR_N) char2.direction = DIR_S;
                    if (character.direction == DIR_S) char2.direction = DIR_N;
                    if (character.direction == DIR_E) char2.direction = DIR_W;
                    if (character.direction == DIR_W) char2.direction = DIR_E;
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
            currentDialog.update();
        else {
            character.disableControls = false;
            char2.disableControls = false;
            character.interacting = false;
        }
    }
    else if (character.front.collisionOverlap(jukebox)) {
        currentDialog = musicdialog;
        if (myGameArea.keys)
            if (myGameArea.keys[KEY_ENTER]) {
                if (!enterPressed) {
                    //console.log("Enter Pressed");
                    currentDialog.chatCounter++;
                    chatSequence = true;
                    character.interacting = true;
                    character.disableControls = true;
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
            currentDialog.update();
        else {
            character.disableControls = false;
            character.interacting = false;
        }
    }
    else if (character.front.collisionOverlap(cat)) {
        currentDialog = catdialog;
        if (myGameArea.keys)
            if (myGameArea.keys[KEY_ENTER]) {
                if (!enterPressed) {
                    //console.log("Enter Pressed");
                    currentDialog.chatCounter++;
                    chatSequence = true;
                    character.interacting = true;
                    character.disableControls = true;
                    cat.disableControls = true;
                    // Turn cat to face character
                    if (character.direction == DIR_N) cat.direction = DIR_S;
                    if (character.direction == DIR_S) cat.direction = DIR_N;
                    if (character.direction == DIR_E) cat.direction = DIR_W;
                    if (character.direction == DIR_W) cat.direction = DIR_E;
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
            currentDialog.update();
        else {
            character.disableControls = false;
            cat.disableControls = false;
            character.interacting = false;
        }
    }
    else {
        character.disableControls = false;
        char2.disableControls = false;
        cat.disableControls = false;
        chatSequence = false;
        character.interacting = false;
        if (currentDialog != undefined)
            currentDialog.chatCounter =-1;
    }
    
    updateFPS();
    showFPS();
    
    showTime();
    showPosition(character);
    
    if (mapID==0) {
        testdialog.setDialog(["Hello!","Do you want to visit the snow map?", "#choice", "#entered"], null, ["Yes", "No"]);
        testdialog.event = function(choice) {
            if (choice == 0)
                mapID = 1;
        }       
    }
    if (mapID==1) {
        testdialog.setDialog(["Hi Again!","Do you want to visit the grass map?", "#choice", "#entered"], null, ["Yes", "No"]);
        testdialog.event = function(choice) {
            if (choice == 0)
                mapID = 0;
        }
    }
    
    // ### END ###

}