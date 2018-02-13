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
        
        this.frameNo = 0;
        this.gameSequence = false;
        
        this.minWidth = 1600;
        this.minHeight = 900;
        
        //this.canvas.style.cursor = "none"; //hide the original cursor
        this.context = this.canvas.getContext("2d");
        
        // "Cache" Map on an hidden canvas
        this.panorama = document.createElement('canvas');
        this.cgx1 = this.panorama.getContext("2d");
    
        this.background = document.createElement('canvas');
        this.cgx2 = this.background.getContext("2d");
    
        this.foreground = document.createElement('canvas');
        this.cgx3 = this.foreground.getContext("2d");
        
        // Initalize Maps
        for (i=0; i<maps.length; i++) {
            maps[i].init();
            maps[i].loadLayers(layers1[i], layers2[i], layers3[i], layersC[i]);
            this.minWidth = Math.min(this.minWidth, maps[i].mapWidth * maps[i].tileWidth);
            this.minHeight = Math.min(this.minHeight, maps[i].mapHeight * maps[i].tileHeight);
        }
        
        // Smallest map
        this.canvas.width = this.minWidth;
        this.canvas.height = this.minHeight;
        
        // Draw the first or current map onto the cached canvas'
        maps[mapID].drawCache();
        
        // Add buttons
        var myGameButtons =
            '<br>' +
            '<button onclick="enterFullscreen()">Fullscreen</button>' +
            '<button onclick="{character.x = 120; character.y = 150;}">Unstuck</button>' +
            '<button onclick="debug=toggle(debug)", unselectable="on">Debug-Info On/Off</button>' +
            '<button onclick="showExtra=toggle(showExtra)">GUI-Info On/Off</button>' +
            '<br>' +
            '<button onclick="gameCamera.setTarget(character)">Camera on Character</button>' +
            '<button onclick="gameCamera.setTarget(cat)">Camera on Cat</button>' +
            '<button onclick="gameCamera.setTarget(girl)">Camera on Girl</button>' +
            '<br>' +
            '<a>Talk to the girl or the cat by pressing enter in front of them.</a>';
                
        document.getElementById("startGame").insertAdjacentHTML('afterend',myGameButtons);
        
        // Replace Start Button with Canvas
        document.getElementById("startGame").parentElement.replaceChild(this.canvas, document.getElementById("startGame"));
        
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

/**
* Updates the current map with all it's components
*/
function updateComponents() {
    
    // In a myGameArea.gameSequence there will be no movement (i.e. activate myGameArea.gameSequence when opening a menu)
    if (!myGameArea.gameSequence) {
        // Character has to be able to interacted
        if (character.front != undefined)
            for (var i = 0; i < maps_objects[mapID].length; i++) character.updateInteraction(maps_objects[mapID][i]);
        // Update the movement of all components in maps_objects[mapID] (this includes mapCollision resolving)
        if (!myGameArea.transition) for (var i = 0; i < maps_objects[mapID].length; i++) maps_objects[mapID][i].updateMovement();
        // Check each combination pair of components in maps_objects[mapID] for component-component-collision
        for (var i = 0; i < maps_objects[mapID].length; i++)
            for (var j = i + 1; j < maps_objects[mapID].length; j++)
                if (maps_objects[mapID][i].componentCollision != undefined)
                    maps_objects[mapID][i].componentCollision(maps_objects[mapID][j]);
        // Update the position of all "moveable" components in maps_objects[mapID]
        for (var i = 0; i < maps_objects[mapID].length; i++) if (maps_objects[mapID][i].speed != undefined) maps_objects[mapID][i].updatePosition();
        
    }
    
    // Update Events
    //for (var i = 0; i < maps_objects[mapID].length; i++) maps_objects[mapID][i].updateEvent();
    
    
    
    gameCamera.update();
}

/**
* Draws the current map with all it's components
*/
function drawComponents() {
    maps[mapID].drawBackground();
    
    // Sorts the array after it's y value so that components with bigger y are drawn later
    maps_objects[mapID].sort(function(a,b) {return (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0); });
    // Draw Objects of the current map
    for (var i = 0; i < maps_objects[mapID].length; i++) maps_objects[mapID][i].draw(myGameArea.context);
    
    maps[mapID].drawForeground();
    
    // Extras
    if (showExtra) {
        extraGuiRect();
        showTime();
        updateFPS();
        showFPS();
        showPosition(character);
    }
}

/**
* Update Canvas
* This is the core function of the game
*/
function updateGameArea() {
    myGameArea.frameNo += 1;
    // Redraw caches' on map change + map switch transition
    if (mapID != currentMapID) {
        currentMapID = mapID;
        maps[mapID].drawCache();
        setTimeout(function() { myGameArea.transition = false; }, 400);
    }
    
    updateComponents();
    
    // Draw transition
    if (myGameArea.transition) blackTransition();
    else drawComponents();
    
    // Draw dialog
    if (myGameArea.gameSequence && currentDialog != undefined) currentDialog.update();
}