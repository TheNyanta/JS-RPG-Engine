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
        
        // "Cache" Map on an hidden canvas
        this.panorama = document.createElement('canvas');
        this.cgx1 = this.panorama.getContext("2d");
    
        this.background = document.createElement('canvas');
        this.cgx2 = this.background.getContext("2d");
    
        this.foreground = document.createElement('canvas');
        this.cgx3 = this.foreground.getContext("2d");
        
        this.panorama.width = myGameArea.canvas.width;
        this.panorama.height = myGameArea.canvas.height;
        
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
        for (i=0; i<maps.length; i++) {
            maps[i].init();
            maps[i].loadLayers(layers1[i], layers2[i], layers3[i], layersC[i]);         
        }
        // Draw the first or current map onto the cached canvas'
        maps[mapID].drawCache();
        
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
            if (e.keyCode == KEY_ENTER) enter_down = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
            if (e.keyCode == KEY_ENTER) enter_down = false;
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

var enter_down = false; // For dialog
var turn = false; // For cat turn

// Update Canvas
function updateGameArea() {
    myGameArea.frameNo += 1;
    
    maps[mapID].drawBackground();
    
    // ## Cat walk HARDCODE ##
    if (!chatSequence) {
        if (turn) cat.speedY = -cat.speed;
        else cat.speedY = cat.speed;
        
        if (cat.y > 188) turn = true;
        if (cat.y < 100) turn = false;
    }
    // #############
    
    // # Reminder: Add x/y collision => while x-collision allow movement in y direction and vice versa
    if (!chatSequence/*maybe change it to gameSequence, hm?*/) {
        // Update the movement of all components in maps_objects[mapID] (incl. mapCollsion resolving)
        for (var i = 0; i < maps_objects[mapID].length; i++) maps_objects[mapID][i].updateControl();
        // Check each combination of components in maps_objects[mapID] for component-component-collision
        for (var i = 0; i < maps_objects[mapID].length; i++)
            for (var j = i + 1; j < maps_objects[mapID].length; j++)
                maps_objects[mapID][i].componentCollision(maps_objects[mapID][j]);
        // Update the position of all components in maps_objects[mapID]
        for (var i = 0; i < maps_objects[mapID].length; i++) maps_objects[mapID][i].updatePosition();
    }
    
    // Interacting character: select choice in dialog
    character.keyEvent();
    
    // Sorts the array after it's y value so that components with bigger y are drawn later
    maps_objects[mapID].sort(function(a,b) {return (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0); });
    // Draw Objects of the current map
    for (var i = 0; i < maps_objects[mapID].length; i++) maps_objects[mapID][i].draw(myGameArea.context);
    
    maps[mapID].drawForeground();
    
    gameCamera.update();
    
    
    // ### HARDCODED DIALOG EVENT ### same pattern for each obj
    
    // Enter KEY
    if (character.front.collisionOverlap(char2)) {
        currentDialog = testdialog;
        if (enter_down) {
            if (!currentDialog.next) {
                currentDialog.chatCounter++;
                chatSequence = true;
                character.interacting = true;
                // Turn char2 to face character
                if (character.direction == DIR_N) char2.direction = DIR_S;
                if (character.direction == DIR_S) char2.direction = DIR_N;
                if (character.direction == DIR_E) char2.direction = DIR_W;
                if (character.direction == DIR_W) char2.direction = DIR_E;
                char2.updateAnimation();
                // Stop running animation if Enter is pressed while moving
                character.updateAnimation();
            }
            currentDialog.next = true;
        }
        else {
            if (currentDialog.next)
            currentDialog.next = false;
        }        
        if (chatSequence)
            currentDialog.update();
        else
            character.interacting = false;
    }    
    else if (character.front.collisionOverlap(cat) && mapID==0) {
        currentDialog = catdialog;
        if (enter_down) {
            if (!currentDialog.next) {
                currentDialog.chatCounter++;
                chatSequence = true;
                character.interacting = true;
                // Turn cat to face character
                if (character.direction == DIR_N) cat.direction = DIR_S;
                if (character.direction == DIR_S) cat.direction = DIR_N;
                if (character.direction == DIR_E) cat.direction = DIR_W;
                if (character.direction == DIR_W) cat.direction = DIR_E;
                cat.updateAnimation();
                // Stop running animation if Enter is pressed while moving
                character.updateAnimation();
            }
            currentDialog.next = true;
        }
        else {
            if (currentDialog.next)
            currentDialog.next = false;
        }        
        if (chatSequence)
            currentDialog.update();
        else
            character.interacting = false;
    }
    else if (character.front.collisionOverlap(jukebox) && mapID==1) {
        currentDialog = musicdialog;
        if (enter_down) {
            if (!currentDialog.next) {
                currentDialog.chatCounter++;
                chatSequence = true;
                character.interacting = true;
                // Stop running animation if Enter is pressed while moving
                character.updateAnimation();
            }
            currentDialog.next = true;
        }
        else {
            if (currentDialog.next)
            currentDialog.next = false;
        }        
        if (chatSequence)
            currentDialog.update();
        else
            character.interacting = false;
    }
    
    // Changing dialog text based on mapID
    
    if (mapID==0) {
        testdialog.setDialog(["Hello!","Do you want to visit the snow map?", "#choice", "#entered"], null, ["Yes", "No"]);
        testdialog.event = function(choice) {
            if (choice == 0) {
                mapID = 1;
                // Redraw Cache on map switch!
                maps[mapID].drawCache();
            }
        }       
    }
    if (mapID==1) {
        testdialog.setDialog(["Hi Again!","Do you want to visit the grass map?", "#choice", "#entered"], null, ["Yes", "No"]);
        testdialog.event = function(choice) {
            if (choice == 0) {
                mapID = 0;
                // Redraw Cache on map switch!s
                maps[mapID].drawCache();
            }
        }
    }
    
    // ### HARDCODE END ###
    
    updateFPS();
    showFPS();
    
    showTime();
    showPosition(character);

}