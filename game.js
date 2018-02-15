function startGame() {
    myGameArea.init();
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    init : function() {
        // Game canvas
        this.canvas.width = 560;
        this.canvas.height = 350;
        this.canvas.id = "game";
        this.context = this.canvas.getContext("2d");
        
        // Pause game if not selected
        document.active = true;
        $(window).focus(function() {document.active = true;});
        $(window).blur(function() {document.active = false;});
        
        this.minWidth = 1600;
        this.minHeight = 900;
        
        this.frameNo = 0;
        this.gameSequence = false;
        
        //this.canvas.style.cursor = "none"; //hide the original cursor
        
        // "Cache" Map on an hidden canvas
        this.panorama = document.createElement('canvas');
        this.cgx1 = this.panorama.getContext("2d");
    
        this.background = document.createElement('canvas');
        this.cgx2 = this.background.getContext("2d");
    
        this.foreground = document.createElement('canvas');
        this.cgx3 = this.foreground.getContext("2d");
        
        // Camera
        this.gameCamera = new function() {
            this.x = 0;
            this.y = 0;
            
            this.setTarget = function(target) {
                this.target = target;
            }
            
            this.update = function() {
                // Follow target
                if (this.target != undefined) {
                    this.x = this.target.x - myGameArea.canvas.width/2;
                    this.y = this.target.y - myGameArea.canvas.height/2;
                }
                
                // Keep camera view inside the map
                if (this.x < 0) this.x = 0;
                if (this.x > maps[mapID].width - myGameArea.canvas.width) this.x = maps[mapID].width - myGameArea.canvas.width;
                if (this.y < 0) this.y = 0;
                if (this.y > maps[mapID].height - myGameArea.canvas.height) this.y = maps[mapID].height - myGameArea.canvas.height;
                
                // Camera (0,0) if map smaller than canvas
                if (maps[mapID].width - myGameArea.canvas.width < 0) this.x = 0;
                if (maps[mapID].height - myGameArea.canvas.height < 0) this.y = 0;              
            }
        }
        // Init Camera Target
        this.gameCamera.setTarget(cameraTarget);
        
        // Initalize Maps
        for (i=0; i<maps.length; i++) {
            maps[i].loadLayers(layers1[i], layers2[i], layers3[i], layersC[i]);
            this.minWidth = Math.min(this.minWidth, maps[i].mapWidth * maps[i].tileset.spriteWidth);
            this.minHeight = Math.min(this.minHeight, maps[i].mapHeight * maps[i].tileset.spriteHeight);
        }
        
        // Smallest map
        this.canvas.width = this.minWidth;
        this.canvas.height = this.minHeight;
        
        // Draw the first or current map onto the cached canvas'
        maps[mapID].drawCache();
        
        // Add buttons
        var myGameButtons =
            '<br>' +
            '<button class="button button2" onclick="enterFullscreen()">Fullscreen</button>' +
            '<button class="button button2" onclick="{character.x = 120; character.y = 150;}">Unstuck</button>' +
            '<button class="button button1" id="debugButton" onclick="debugButton()">Debug Off</button>' +
            '<button class="button button1" id="guiButton" onclick="guiButton()">GUI Off</button>' +
            '<br>' +
            '<button class="button button2" onclick="myGameArea.gameCamera.setTarget(character)">Camera on Character</button>' +
            '<button class="button button2" onclick="myGameArea.gameCamera.setTarget(cat)">Camera on Cat</button>' +
            '<button class="button button2" onclick="myGameArea.gameCamera.setTarget(girl)">Camera on Girl</button>' +
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
        
        // OnCanvas
        this.onCanvas = function(x, y, canvas) {
            if (x >= canvas.getBoundingClientRect().x &&
                x <= canvas.getBoundingClientRect().x + canvas.width &&
                y >= canvas.getBoundingClientRect().y &&
                y <= canvas.getBoundingClientRect().y + canvas.height) return true;
            return false;
        }
        
        // INITIALIZE USER INPUT
        // Keydown
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        // Keyup
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        // Mouse down
        window.addEventListener('mousedown', function (e) {
            myGameArea.mousedown = true;
            if (myGameArea.onCanvas(e.clientX, e.clientY, myGameArea.canvas)) {
                myGameArea.clickdownX = e.clientX - myGameArea.canvas.getBoundingClientRect().x;
                myGameArea.clickdownY = e.clientY - myGameArea.canvas.getBoundingClientRect().y;
                myGameArea.clicked = true;
            }
        })
        // Mouse up
        window.addEventListener('mouseup', function (e) {
            myGameArea.mousedown = false;
            if (myGameArea.onCanvas(e.clientX, e.clientY, myGameArea.canvas)) {
                myGameArea.clickupX = e.clientX - myGameArea.canvas.getBoundingClientRect().x;
                myGameArea.clickupY = e.clientY - myGameArea.canvas.getBoundingClientRect().y;
            }
        })
        // Mouse move
        window.addEventListener('mousemove', function (e) {
            if (myGameArea.onCanvas(e.clientX, e.clientY, myGameArea.canvas)) {
                myGameArea.x = Math.floor(e.clientX - myGameArea.canvas.getBoundingClientRect().x);
                myGameArea.y = Math.floor(e.clientY - myGameArea.canvas.getBoundingClientRect().y);
            }
            else {
                myGameArea.x = undefined;
                myGameArea.y = undefined;
            }
        })
        // Touch start
        window.addEventListener('touchstart', function (e) {
            myGameArea.touchdown = true;
            if (myGameArea.onCanvas(e.clientX, e.clientY, myGameArea.canvas)) {
                myGameArea.clickdownX = e.clientX - myGameArea.canvas.getBoundingClientRect().x;
                myGameArea.clickdownY = e.clientY - myGameArea.canvas.getBoundingClientRect().y;
                myGameArea.clicked = true;
            }
        })
        // Touch end
        window.addEventListener('touchend', function (e) {
            myGameArea.touchdown = false;
            if (myGameArea.onCanvas(e.clientX, e.clientY, myGameArea.canvas)) {
                myGameArea.clickupX = e.clientX - myGameArea.canvas.getBoundingClientRect().x;
                myGameArea.clickupY = e.clientY - myGameArea.canvas.getBoundingClientRect().y;
            }
        })
        // Touch move
        window.addEventListener('touchmove', function (e) {            
            if (myGameArea.onCanvas(e.touches[0].clientX, e.touches[0].clientY, myGameArea.canvas)) {
                myGameArea.x = Math.floor(e.touches[0].clientX - myGameArea.canvas.getBoundingClientRect().x);
                myGameArea.y = Math.floor(e.touches[0].clientY - myGameArea.tileset.getBoundingClientRect().y);
            }
            else {
                myGameArea.x = undefined;
                myGameArea.y = undefined;
            }
        })
    },
    
    start : function() {
        
        function gameLoop() {
            requestAnimationFrame(gameLoop);
            if (document.active)
                updateGameArea();
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
function update() {
    
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
    
    myGameArea.gameCamera.update();
}

/**
* Draws the canvas
* First it draws the background
* Second it draws the objects
* Third it draws the foreground
* Four it draws the gui
*/
function draw() {
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
* Updates the canvas
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
    
    update();
    
    // Draw transition
    if (myGameArea.transition) blackTransition();
    else draw();
    
    // Draw dialog
    if (myGameArea.gameSequence && currentDialog != undefined) currentDialog.update();
}