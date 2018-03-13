var game = {
    //canvas: document.createElement("canvas"),
    canvas: document.getElementById("game"),
    tileset: document.getElementById("tileset"),
    debug: false,
    info: false,
    // Map Editor Variables
    activeCanvas: undefined,
    tiletype: 1,
    tileCollisionType: 0,
    currentLayer: 0,
    drawingOn: false,
    // Game
    currentMap: 0, // The map which is currently used
    nextMap: 0, // The map that will be switched to in the next iteration of the game loop
    currentDialog: null, // The current dialog
    // The data of the game: When creating new spritesheets/maps/components it will be saved as a string
    // If you start the engine again and feed it this data it will be the same game data as before
    data: "",
    // Init
    init: function () {
        // Game canvas
        this.context = this.canvas.getContext("2d");

        // Tileset canvas
        this.tilecontext = this.tileset.getContext("2d");

        // Pause game if not selected
        document.active = true;
        window.addEventListener('focus', function (e) {
            document.active = true;
        });
        window.addEventListener('blur', function (e) {
            document.active = false;
        });

        this.frameNo = 0;
        this.gameSequence = false;

        this.keys = [];

        // To only fire a single event on enter / mousedown / touchdown
        this.eventReady = false;
        this.enter = false;
        this.mousedown = false;
        this.touchdown = false;

        // Draw Tileset
        maps.data[game.currentMap].drawTileset();

        //this.canvas.style.cursor = "none"; //hide the original cursor

        // "Cache" Map on an hidden canvas
        this.panorama = document.createElement('canvas');
        this.cgx1 = this.panorama.getContext("2d");

        this.background = document.createElement('canvas');
        this.cgx2 = this.background.getContext("2d");

        this.foreground = document.createElement('canvas');
        this.cgx3 = this.foreground.getContext("2d");

        // For quick accessing of doms objects
        this.dom = {
            // Layer Selection
            layerSelection: document.getElementById("layerSelection"),
            currentLayer: document.getElementById("currentLayer"),
            layer1: document.getElementById("layer1Button"),
            layer2: document.getElementById("layer2Button"),
            layer3: document.getElementById("layer3Button"),
            collisionLayer: document.getElementById("collisionLayerButton"),
            // Collision Restriction Selection            
            currentRestriction: document.getElementById("currentRestriction"),
            restrictionSelection: document.getElementById("restrictionSelection"),
            restriction1: document.getElementById("restriction1"),
            restriction2: document.getElementById("restriction2"),
            restriction3: document.getElementById("restriction3"),
            restriction4: document.getElementById("restriction4"),
            restriction5: document.getElementById("restriction5"),
            restriction6: document.getElementById("restriction6"),
            restriction7: document.getElementById("restriction7"),
            restriction8: document.getElementById("restriction8"),
            restriction9: document.getElementById("restriction9"),
            restriction10: document.getElementById("restriction10"),
            restriction11: document.getElementById("restriction11"),
            restriction12: document.getElementById("restriction12"),
            restriction13: document.getElementById("restriction13"),
            restriction14: document.getElementById("restriction14"),
        }
        // Editor images
        this.arrows = {
            no: new Image(),
            up: new Image(),
            down: new Image(),
            left: new Image(),
            right: new Image(),
            up_down: new Image(),
            up_left: new Image(),
            up_right: new Image(),
            down_left: new Image(),
            down_right: new Image(),
            left_right: new Image(),
            up_down_left: new Image(),
            up_down_right: new Image(),
            up_left_right: new Image(),
            down_left_right: new Image(),
            up_down_left_right: new Image()
        }

        game.arrows.no.src = "Assets/Image/Restriction Arrows/no.png";
        game.arrows.up.src = "Assets/Image/Restriction Arrows/up.png";
        game.arrows.down.src = "Assets/Image/Restriction Arrows/down.png";
        game.arrows.left.src = "Assets/Image/Restriction Arrows/left.png";
        game.arrows.right.src = "Assets/Image/Restriction Arrows/right.png";
        game.arrows.up_down.src = "Assets/Image/Restriction Arrows/up_down.png";
        game.arrows.up_left.src = "Assets/Image/Restriction Arrows/up_left.png";
        game.arrows.up_right.src = "Assets/Image/Restriction Arrows/up_right.png";
        game.arrows.down_left.src = "Assets/Image/Restriction Arrows/down_left.png";
        game.arrows.down_right.src = "Assets/Image/Restriction Arrows/down_right.png";
        game.arrows.left_right.src = "Assets/Image/Restriction Arrows/left_right.png";
        game.arrows.up_down_left.src = "Assets/Image/Restriction Arrows/up_down_left.png";
        game.arrows.up_down_right.src = "Assets/Image/Restriction Arrows/up_down_right.png";
        game.arrows.up_left_right.src = "Assets/Image/Restriction Arrows/up_left_right.png";
        game.arrows.down_left_right.src = "Assets/Image/Restriction Arrows/down_left_right.png";
        game.arrows.up_down_left_right.src = "Assets/Image/Restriction Arrows/up_down_left_right.png";

        // Camera
        this.camera = new function () {
            this.x = 0;
            this.y = 0;

            this.setTarget = function (target) {
                this.target = target;
            }

            this.update = function () {
                // Move camera with WASD or Arrow Keys if no target is defined
                if (this.target == undefined) {
                    if (game.keys[38] || game.keys[87])
                        this.y--;
                    else if (game.keys[40] || game.keys[83])
                        this.y++;
                    else if (game.keys[37] || game.keys[65])
                        this.x--;
                    else if (game.keys[39] || game.keys[68])
                        this.x++;
                }
                // Camera will follow target
                else {
                    this.x = this.target.x - game.canvas.width / 2;
                    this.y = this.target.y - game.canvas.height / 2;
                }
                // Keep camera view inside the map
                if (this.x < 0) this.x = 0;
                if (this.y < 0) this.y = 0;
                if (this.x > maps.data[game.currentMap].width - game.canvas.width) this.x = maps.data[game.currentMap].width - game.canvas.width;
                if (this.y > maps.data[game.currentMap].height - game.canvas.height) this.y = maps.data[game.currentMap].height - game.canvas.height;
            }
        }

        // Control
        this.control = new function () {
            this.setTarget = function (target) {
                this.target = target;
            }

            this.disableControls = false;
            this.disableMouse = false;

            this.update = function () {
                if (this.target != undefined) {
                    // Check if it key control is allowed
                    if (!this.disableControls && !game.gameSequence) {
                        // Listen to keys: "Else if" to limit movement in only one direction at the same time (no diagonal moving)
                        if (game.keys[38] || game.keys[87])
                            this.target.speedY = -this.target.speed;
                        else if (game.keys[40] || game.keys[83])
                            this.target.speedY = this.target.speed;
                        else if (game.keys[37] || game.keys[65])
                            this.target.speedX = -this.target.speed;
                        else if (game.keys[39] || game.keys[68])
                            this.target.speedX = this.target.speed;
                        else if (!this.disableMouse) {
                            if (game.mousedown || game.touchdown) {
                                // Move direction = Difference between clicked and current mousemove/touch position
                                if (Math.abs(game.x - game.clickdownX) > Math.abs(game.y - game.clickdownY)) {
                                    if (game.x < game.clickdownX - 4)
                                        this.target.speedX -= this.target.speed;
                                    else if (game.x > game.clickdownX + 4)
                                        this.target.speedX += this.target.speed;
                                } else {
                                    if (game.y < game.clickdownY - 4)
                                        this.target.speedY -= this.target.speed;
                                    else if (game.y > game.clickdownY + 4)
                                        this.target.speedY += this.target.speed;
                                }
                            }
                        }
                    }
                }
            }
        }

        // Set first component of the current map (start map) as the target of the camera and control
        this.hero = maps.data[0].components.data[0];
        this.camera.setTarget(game.hero);
        this.control.setTarget(game.hero);

        // Disable Mouse Control in Editor Mode
        if (game.editor) game.camera.disableMouse = true;

        // Initalize Maps
        for (i = 0, l = maps.data.length; i < l; i++) maps.data[i].loadLayers(layers1[i], layers2[i], layers3[i], layersC[i]);

        // Draw the first or current map onto the cached canvas'
        maps.data[game.currentMap].drawCache();

        // Insert tileset canvas after game canvas if editor mode
        if (game.editor) this.canvas.after(this.tileset);

        window.requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (f) {
                return setTimeout(f, 1000 / 60)
            }; // simulate calling code 60 

        window.cancelAnimationFrame = window.cancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            function (requestID) {
                clearTimeout(requestID)
            }; //fall back

        // OnCanvas
        this.onCanvas = function (x, y, canvas) {
            if (x > canvas.getBoundingClientRect().x &&
                x < canvas.getBoundingClientRect().x + canvas.width &&
                y > canvas.getBoundingClientRect().y &&
                y < canvas.getBoundingClientRect().y + canvas.height) return true;
            return false;
        }

        // INITIALIZE USER INPUT
        // Customize context menu on right click if canvas
        window.addEventListener('contextmenu', function (e) {
            if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                //console.log("Default context menu prevent");
                e.preventDefault();
                //toggleMenuOn();
                //positionMenu(e);
            } else {
                //console.log("Default context menu");
                //taskItemInContext = null;
                //toggleMenuOff();
            }
        })
        // Keydown
        window.addEventListener('keydown', function (e) {
            game.keys = (game.keys || []);
            game.keys[e.keyCode] = (e.type == "keydown");
            if (game.printkeyCode) console.log(e.keyCode);
            // Enter key
            if (e.keyCode == 13) game.enter = true;
            // no scrolling on arrow keys
            if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) e.preventDefault();
        })
        // Keyup
        window.addEventListener('keyup', function (e) {
            game.keys[e.keyCode] = (e.type == "keydown");
            if (e.keyCode == 13) game.enter = false;
        })
        // Mouse down
        window.addEventListener('mousedown', function (e) {
            game.mousedown = true;
            if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                e.preventDefault();
                game.clickdownX = Math.floor(e.clientX - game.canvas.getBoundingClientRect().x);
                game.clickdownY = Math.floor(e.clientY - game.canvas.getBoundingClientRect().y);
                maps.data[game.currentMap].clickedTile(game.clickdownX, game.clickdownY);
            } else if (game.onCanvas(e.clientX, e.clientY, game.tileset)) {
                e.preventDefault();
                game.clickdownX = Math.floor(e.clientX - game.tileset.getBoundingClientRect().x);
                game.clickdownY = Math.floor(e.clientY - game.tileset.getBoundingClientRect().y);
                maps.data[game.currentMap].clickedTile(game.clickdownX, game.clickdownY);
            } else {
                game.clickdownX = undefined;
                game.clickdownY = undefined;
            }
        })
        // Mouse up
        window.addEventListener('mouseup', function (e) {
            game.mousedown = false;

            if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                game.clickupX = e.clientX - game.canvas.getBoundingClientRect().x;
                game.clickupY = e.clientY - game.canvas.getBoundingClientRect().y;
            } else if (game.onCanvas(e.clientX, e.clientY, game.tileset)) {
                game.clickupX = e.clientX - game.tileset.getBoundingClientRect().x;
                game.clickupY = e.clientY - game.tileset.getBoundingClientRect().y;
            } else {
                game.activeCanvas = undefined;
                game.clickupX = undefined;
                game.clickupY = undefined;
            }
        })
        // Mouse move
        window.addEventListener('mousemove', function (e) {
            if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                game.activeCanvas = 0;
                game.x = Math.floor(e.clientX - game.canvas.getBoundingClientRect().x);
                game.y = Math.floor(e.clientY - game.canvas.getBoundingClientRect().y);

                document.getElementById("activeCanvas").innerHTML = "Game";
                document.getElementById("canvasXY").innerHTML = "[" + game.x + " | " + game.y + "]";
            } else if (game.onCanvas(e.clientX, e.clientY, game.tileset)) {
                game.activeCanvas = 1;
                game.x = Math.floor(e.clientX - game.tileset.getBoundingClientRect().x);
                game.y = Math.floor(e.clientY - game.tileset.getBoundingClientRect().y);

                document.getElementById("activeCanvas").innerHTML = "Tileset";
                document.getElementById("canvasXY").innerHTML = "[" + game.x + " | " + game.y + "]";
            } else {
                game.activeCanvas = undefined;
                game.x = e.clientX;
                game.y = e.clientY;

                document.getElementById("activeCanvas").innerHTML = "Off Canvas";
                document.getElementById("canvasXY").innerHTML = "[" + e.clientX + " | " + e.clientY + "]";
            }
        })
        // Touch start
        window.addEventListener('touchstart', function (e) {
            game.touchdown = true;
            if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                game.clickdownX = e.clientX - game.canvas.getBoundingClientRect().x;
                game.clickdownY = e.clientY - game.canvas.getBoundingClientRect().y;
            } else if (game.onCanvas(e.clientX, e.clientY, game.tileset)) {
                game.clickdownX = e.clientX - game.tileset.getBoundingClientRect().x;
                game.clickdownY = e.clientY - game.tileset.getBoundingClientRect().y;
            } else {
                activeCanvas = undefined;
                game.clickdownX = undefined;
                game.clickdownY = undefined;
            }
        })
        // Touch end
        window.addEventListener('touchend', function (e) {
            game.touchdown = false;
            if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                game.clickupX = e.clientX - game.canvas.getBoundingClientRect().x;
                game.clickupY = e.clientY - game.canvas.getBoundingClientRect().y;
            } else if (game.onCanvas(e.clientX, e.clientY, game.tileset)) {
                game.clickupX = e.clientX - game.tileset.getBoundingClientRect().x;
                game.clickupY = e.clientY - game.tileset.getBoundingClientRect().y;
            } else {
                activeCanvas = undefined;
                game.clickupX = undefined;
                game.clickupY = undefined;
            }
        })
        // Touch move
        window.addEventListener('touchmove', function (e) {
            if (game.onCanvas(e.touches[0].clientX, e.touches[0].clientY, game.canvas)) {
                activeCanvas = 0;
                game.x = Math.floor(e.touches[0].clientX - game.canvas.getBoundingClientRect().x);
                game.y = Math.floor(e.touches[0].clientY - game.tileset.getBoundingClientRect().y);
            } else {
                game.x = undefined;
                game.y = undefined;
            }
            if (game.onCanvas(e.touches[0].clientX, e.touches[0].clientY, game.tileset)) {
                activeCanvas = 1;
                game.x = Math.floor(e.touches[0].clientX - game.tileset.getBoundingClientRect().x);
                game.y = Math.floor(e.touches[0].clientY - game.tileset.getBoundingClientRect().y);
            } else {
                game.x = undefined;
                game.y = undefined;
            }
        })
    },

    start: function () {
        function gameLoop() {
            requestAnimationFrame(gameLoop);
            if (document.active)
                updateGameArea();
        }
        gameLoop();
    },

    stop: function () {

    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

/**
 * Updates the current map with all it's components
 * TODO: Clean up - structure; for-loop length as var in the loop BUT care it must not change will the loop runs EVENTS that change map / delete objects
 */
function update() {
    // While game.gameSequence == true all components will stop moving (i.e. used for menus, dialogs,...)
    if (!game.gameSequence) {
        // Update the movement of all components on the current map (this also resolves tileCollision)
        if (!game.transition)
            for (var i = 0; i < maps.data[game.currentMap].components.data.length; i++)
                maps.data[game.currentMap].components.data[i].updateMovement();
        // For components that can start an interacted
        for (var i = 0; i < maps.data[game.currentMap].components.data.length; i++)
            // The controlled component can acted with other component
            if (maps.data[game.currentMap].components.data[i] != game.control.target)
                game.control.target.updateInteraction(maps.data[game.currentMap].components.data[i]);
        // Check each combination pair of components on the current map for component-component-collision
        for (var i = 0; i < maps.data[game.currentMap].components.data.length; i++)
            for (var j = 0; j < maps.data[game.currentMap].components.data.length; j++) {
                var c1 = maps.data[game.currentMap].components.data[i];
                var c2 = maps.data[game.currentMap].components.data[j];
                c1.componentCollision(c2);
            }
        // Update the position of all components on the current map
        for (var i = 0, l = maps.data[game.currentMap].components.data.length; i < l; i++) maps.data[game.currentMap].components.data[i].updatePosition();
    }
}

/**
 * Draws the canvas
 * 1) Clear the canvas
 * 2) Draw the background
 * 3) Draw the objects
 * 4) Draw the foreground
 * 4) Draw the gui
 */
function draw() {
    // Draw map
    // Clear the canvas
    game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
    // Draw Background
    maps.data[game.currentMap].drawBackground();
    // Sorts the array after it's y value so that components with bigger y are drawn later
    maps.data[game.currentMap].components.data.sort(function (a, b) {
        return (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0);
    });
    for (var i = 0, l = maps.data[game.currentMap].components.data.length; i < l; i++) maps.data[game.currentMap].components.data[i].draw(game.context);
    // Draw Foreground
    maps.data[game.currentMap].drawForeground();

    // Information for debugging and editing
    if (game.debug) {
        for (var i = 0, l = maps.data[game.currentMap].components.data.length; i < l; i++) {
            var comp = maps.data[game.currentMap].components.data[i];
            // Draw a rectangle for invisiable components
            if (comp.spritesheetID == undefined) {
                game.context.fillStyle = "cyan";
                game.context.globalAlpha = 0.8;
                game.context.fillRect(comp.x + comp.boundingBox.x - game.camera.x, comp.y + comp.boundingBox.y - game.camera.y, comp.boundingBox.width, comp.boundingBox.height);
                game.context.globalAlpha = 1.0;
            }
            // Draw Collision Box
            game.context.strokeStyle = "red";
            game.context.strokeRect(comp.x + comp.boundingBox.x - game.camera.x, comp.y + comp.boundingBox.y - game.camera.y, comp.boundingBox.width, comp.boundingBox.height);
        }
    }
    // Useful information
    if (game.info) {
        game.context.globalAlpha = 0.5;
        game.context.fillStyle = "cyan";
        game.context.fillRect(0, 0, 120, 90);
        game.context.globalAlpha = 1.0;
        showTime();
        updateFPS();
        showFPS();
        if (game.camera.target != undefined) showPosition(game.camera.target);
    }
}

/**
 * Updates the canvas
 * This is the core function of the game
 */
function updateGameArea() {
    game.frameNo += 1;

    // Redraw caches' on map change + map switch transition
    if (game.currentMap != game.nextMap) {
        game.currentMap = game.nextMap;
        maps.data[game.currentMap].drawCache();
        if (game.editor != undefined) maps.data[game.currentMap].drawTileset();
        setTimeout(function () {
            game.transition = false;
        }, 400);
    }

    // Draw map transition
    if (game.transition) blackTransition();
    else {
        // Update camera
        game.camera.update();
        // Update control
        game.control.update();
        // Update game
        update();
        // Draw game
        draw();
    }

    // Draw dialog
    if (game.currentDialog != undefined) {
        game.gameSequence = true;
        game.currentDialog.update();
    } else game.gameSequence = false;
}
