function startGame() {
    game.editor = false;
    game.init();
    game.start();
}

function startEditor() {
    game.editor = true;
    game.init()
    game.start();
}

var game = {
    canvas: document.createElement("canvas"),
    tileset: document.createElement("canvas"),
    debug: false, // Global Variable for debugging
    showExtra: false,
    // Map Editor Variables
    activeCanvas: undefined,
    tiletype: 1,
    tileCollisionType: 0,
    currentLayer: 0,
    drawingOn: false,
    // The data of the game: When creating new spritesheets/maps/components it will be saved as a string
    // If you start the engine again and feed it this data it will be the same game data as before
    data: "",
    // Init
    init: function () {
        // Game canvas
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.canvas.id = "game";
        this.context = this.canvas.getContext("2d");

        // Tileset canvas
        this.tileset.width = 0;
        this.tileset.height = 0;
        this.tileset.id = "tileset";
        this.tilecontext = this.tileset.getContext("2d");

        // Pause game if not selected
        document.active = true;
        window.addEventListener('focus', function (e) {
            document.active = true;
        });
        window.addEventListener('blur', function (e) {
            document.active = false;
        });

        this.minWidth = 1600;
        this.minHeight = 900;

        this.frameNo = 0;
        this.gameSequence = false;

        this.keys = [];

        // To only fire a single event on enter / mousedown / touchdown
        this.eventReady = false;
        this.enter = false;
        this.mousedown = false;
        this.touchdown = false;

        //this.canvas.style.cursor = "none"; //hide the original cursor

        // "Cache" Map on an hidden canvas
        this.panorama = document.createElement('canvas');
        this.cgx1 = this.panorama.getContext("2d");

        this.background = document.createElement('canvas');
        this.cgx2 = this.background.getContext("2d");

        this.foreground = document.createElement('canvas');
        this.cgx3 = this.foreground.getContext("2d");

        // Camera
        this.camera = new function () {
            this.x = 0;
            this.y = 0;

            this.disableControls = false;
            this.disableMouse = false;

            this.setTarget = function (target) {
                this.target = target;
            }

            this.update = function () {
                // Follow target
                if (this.target != undefined) {
                    this.x = this.target.x - game.canvas.width / 2;
                    this.y = this.target.y - game.canvas.height / 2;
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
                                // Move direction = To current mousemove/touch position
                                /*
                                if (Math.abs(game.x + this.x - this.target.x - this.target.offsetX) >= Math.abs(game.y + this.y - this.target.y - this.target.offsetY)) {
                                    if (this.target.x + this.target.offsetX < game.x + this.x - 4)
                                        this.target.speedX += this.target.speed;
                                    else if (this.target.x + this.target.offsetX > game.x + this.x + 4)
                                        this.target.speedX -= this.target.speed;
                                } else {
                                    if (this.target.y + this.target.offsetY < game.y + this.y - 4)
                                        this.target.speedY += this.target.speed;
                                    else if (this.target.y + this.target.offsetY > game.y + this.y + 4)
                                        this.target.speedY -= this.target.speed;
                                }
                                */
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

                // Keep camera view inside the map
                if (this.x < 0) this.x = 0;
                if (this.x > maps.data[maps.currentMap].width - game.canvas.width) this.x = maps.data[maps.currentMap].width - game.canvas.width;
                if (this.y < 0) this.y = 0;
                if (this.y > maps.data[maps.currentMap].height - game.canvas.height) this.y = maps.data[maps.currentMap].height - game.canvas.height;

                // Camera (0,0) if map smaller than canvas
                if (maps.data[maps.currentMap].width - game.canvas.width < 0) this.x = 0;
                if (maps.data[maps.currentMap].height - game.canvas.height < 0) this.y = 0;
            }
        }

        // Init Camera Target
        this.camera.setTarget(components.data[0]);
        // Disable Mouse Control in Editor Mode
        if (game.editor) game.camera.disableMouse = true;

        // Initalize Maps
        for (i = 0, l = maps.data.length; i < l; i++) {
            maps.data[i].loadLayers(layers1[i], layers2[i], layers3[i], layersC[i]);
            //this.minWidth = Math.min(this.minWidth, maps.data[i].mapWidth * maps.data[i].tileset.spriteWidth);
            //this.minHeight = Math.min(this.minHeight, maps.data[i].mapHeight * maps.data[i].tileset.spriteHeight);
        }

        // Smallest map
        //this.canvas.width = this.minWidth;
        //this.canvas.height = this.minHeight;

        // Draw the first or current map onto the cached canvas'
        maps.data[maps.currentMap].drawCache();
        if (game.editor) {
            // Draw Tileset
            maps.data[maps.currentMap].drawTileset();

            // Collision setup
            game.tileCollisions = [false, false, false, false];

            // Editor Mode Buttons
            var myGameButtons =
                '<div class="w3-container w3-padding-64">' +
                '<button class="w3-button w3-green" id="layer1Button" onclick="layerButton(0)">Layer 1</button>' +
                '<button class="w3-button w3-blue" id="layer2Button" onclick="layerButton(1)">Layer 2</button>' +
                '<button class="w3-button w3-blue" id="layer3Button" onclick="layerButton(2)">Layer 3</button>' +
                '<button class="w3-button w3-blue" id="layerCButton" onclick="layerButton(3)">Collision Layer</button><br>' +
                '<span class="w3-button w3-yellow">Change Tileset</span>' +
                '<input class="w3-button w3-yellow" type="string" id="tilesetFile" onchange="loadImage(value)" value="/Assets/Image/xyz.png"><br>' +
                '<button class="w3-button w3-red" id="drawButton" onclick="drawButton()">Drawing Off</button>' +
                '<button class="w3-button w3-red" id="debugButton" onclick="debugButton()">Debug Off</button>' +
                '<button class="w3-button w3-red" id="guiButton" onclick="guiButton()">GUI Off</button>' +
                '<br>' +
                '<span class="w3-button w3-orange" id="activeCanvas">Off Canvas</span>' +
                '<span class="w3-button w3-orange" id="canvasXY"></span>' +
                '<br>' +
                '<span class="w3-button w3-yellow">Selected Tile</span>' +
                '<span class="w3-button w3-yellow" id="selectedTile"></span>' +
                '<span class="w3-button w3-pink">Clicked Tile</span>' +
                '<span class="w3-button w3-pink" id="clickedXY"></span>' +
                '<br>' +
                '<span class="w3-button w3-orange">Selected Collision</span>' +
                '<span class="w3-button w3-red" id="collisionUpButton" onclick="collisionButton(0)">Up</span>' +
                '<span class="w3-button w3-red" id="collisionDownButton" onclick="collisionButton(1)">Down</span>' +
                '<span class="w3-button w3-red" id="collisionLeftButton" onclick="collisionButton(2)">Left</span>' +
                '<span class="w3-button w3-red" id="collisionRightButton" onclick="collisionButton(3)">Right</span>' +
                '</div>';
        } else {
            // Game Mode Buttons
            var myGameButtons =
                '<div class="w3-container w3-padding-64">' +
                '<button class="w3-button w3-green" onclick="enterFullscreen()">Fullscreen</button>' +
                '<button class="w3-button w3-red" id="debugButton" onclick="debugButton()">Debug Off</button>' +
                '<button class="w3-button w3-red" id="guiButton" onclick="guiButton()">GUI Off</button>' +
                '<br>' +
                '<button class="w3-button w3-blue" onclick="game.camera.setTarget(components.data[0])">Control Boy</button>' +
                '<button class="w3-button w3-blue" onclick="game.camera.setTarget(components.data[1])">Control Girl</button>' +
                '</div>';
        }

        document.getElementById("startEditor").insertAdjacentHTML('afterend', myGameButtons);

        // Replace Start Button with Canvas
        document.getElementById("startGame").parentElement.replaceChild(this.canvas, document.getElementById("startGame"));
        // Delete Start Editor Button
        document.getElementById("startEditor").parentNode.removeChild(document.getElementById("startEditor"));
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
            if (x >= canvas.getBoundingClientRect().x &&
                x <= canvas.getBoundingClientRect().x + canvas.width &&
                y >= canvas.getBoundingClientRect().y &&
                y <= canvas.getBoundingClientRect().y + canvas.height) return true;
            return false;
        }

        // INITIALIZE USER INPUT
        // Customize context menu on right click if canvas
        window.addEventListener('contextmenu', function (e) {
            if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                console.log("Default context menu prevent");
                e.preventDefault();
                //toggleMenuOn();
                //positionMenu(e);
            } else {
                console.log("Default context menu");
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
        if (game.editor) {
            // Mouse down
            window.addEventListener('mousedown', function (e) {
                game.mousedown = true;
                if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                    game.clickdownX = Math.floor(e.clientX - game.canvas.getBoundingClientRect().x);
                    game.clickdownY = Math.floor(e.clientY - game.canvas.getBoundingClientRect().y);
                    e.preventDefault();
                    maps.data[maps.currentMap].clickedTile(game.clickdownX, game.clickdownY);
                } else if (game.onCanvas(e.clientX, e.clientY, game.tileset)) {
                    game.clickdownX = Math.floor(e.clientX - game.tileset.getBoundingClientRect().x);
                    game.clickdownY = Math.floor(e.clientY - game.tileset.getBoundingClientRect().y);
                    e.preventDefault();
                    maps.data[maps.currentMap].clickedTile(game.clickdownX, game.clickdownY);
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
                    document.getElementById("activeCanvas").innerHTML = "Game";
                    game.x = Math.floor(e.clientX - game.canvas.getBoundingClientRect().x);
                    game.y = Math.floor(e.clientY - game.canvas.getBoundingClientRect().y);
                    document.getElementById("canvasXY").innerHTML = "[" + game.x + " | " + game.y + "]";
                } else if (game.onCanvas(e.clientX, e.clientY, game.tileset)) {
                    game.activeCanvas = 1;
                    document.getElementById("activeCanvas").innerHTML = "Tileset";
                    game.x = Math.floor(e.clientX - game.tileset.getBoundingClientRect().x);
                    game.y = Math.floor(e.clientY - game.tileset.getBoundingClientRect().y);
                    document.getElementById("canvasXY").innerHTML = "[" + game.x + " | " + game.y + "]";
                } else {
                    game.activeCanvas = undefined;
                    document.getElementById("activeCanvas").innerHTML = "Off Canvas";
                    document.getElementById("canvasXY").innerHTML = "[" + e.clientX + " | " + e.clientY + "]";
                    game.x = undefined;
                    game.y = undefined;
                }
            })
            // Touch start
            window.addEventListener('touchstart', function (e) {
                game.touchdown = true;

                if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                    game.clickdownX = e.clientX - game.canvas.getBoundingClientRect().x;
                    game.clickdownY = e.clientY - game.canvas.getBoundingClientRect().y;
                    e.preventDefault();
                } else if (game.onCanvas(e.clientX, e.clientY, game.tileset)) {
                    game.clickdownX = e.clientX - game.tileset.getBoundingClientRect().x;
                    game.clickdownY = e.clientY - game.tileset.getBoundingClientRect().y;
                    e.preventDefault();
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
                    game.clickdownX = undefined;
                    game.clickdownY = undefined;
                }
            })
            // Touch move
            window.addEventListener('touchmove', function (e) {
                if (game.onCanvas(e.touches[0].clientX, e.touches[0].clientY, game.canvas)) {
                    activeCanvas = 0;
                    game.x1 = Math.floor(e.touches[0].clientX - game.canvas.getBoundingClientRect().x);
                    game.y1 = Math.floor(e.touches[0].clientY - game.tileset.getBoundingClientRect().y);
                    e.preventDefault();
                } else {
                    game.x1 = undefined;
                    game.y1 = undefined;
                }
                if (game.onCanvas(e.touches[0].clientX, e.touches[0].clientY, game.tileset)) {
                    activeCanvas = 1;
                    game.x2 = Math.floor(e.touches[0].clientX - game.tileset.getBoundingClientRect().x);
                    game.y2 = Math.floor(e.touches[0].clientY - game.tileset.getBoundingClientRect().y);
                    e.preventDefault();
                } else {
                    game.x2 = undefined;
                    game.y2 = undefined;
                }
            })
        } else {
            // Mouse down
            window.addEventListener('mousedown', function (e) {
                game.mousedown = true;
                if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                    game.clickdownX = e.clientX - game.canvas.getBoundingClientRect().x;
                    game.clickdownY = e.clientY - game.canvas.getBoundingClientRect().y;
                    e.preventDefault();
                }
            })
            // Mouse up
            window.addEventListener('mouseup', function (e) {
                game.mousedown = false;
                if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                    game.clickupX = e.clientX - game.canvas.getBoundingClientRect().x;
                    game.clickupY = e.clientY - game.canvas.getBoundingClientRect().y;
                }
            })
            // Mouse move
            window.addEventListener('mousemove', function (e) {
                if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                    game.x = Math.floor(e.clientX - game.canvas.getBoundingClientRect().x);
                    game.y = Math.floor(e.clientY - game.canvas.getBoundingClientRect().y);
                } else {
                    game.x = undefined;
                    game.y = undefined;
                }
            })
            // Touch start
            window.addEventListener('touchstart', function (e) {
                game.touchdown = true;
                if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                    game.clickdownX = e.clientX - game.canvas.getBoundingClientRect().x;
                    game.clickdownY = e.clientY - game.canvas.getBoundingClientRect().y;
                    e.preventDefault();
                }
            })
            // Touch end
            window.addEventListener('touchend', function (e) {
                game.touchdown = false;
                if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                    game.clickupX = e.clientX - game.canvas.getBoundingClientRect().x;
                    game.clickupY = e.clientY - game.canvas.getBoundingClientRect().y;
                }
            })
            // Touch move
            window.addEventListener('touchmove', function (e) {
                if (game.onCanvas(e.touches[0].clientX, e.touches[0].clientY, game.canvas)) {
                    game.x = Math.floor(e.touches[0].clientX - game.canvas.getBoundingClientRect().x);
                    game.y = Math.floor(e.touches[0].clientY - game.tileset.getBoundingClientRect().y);
                    e.preventDefault();
                } else {
                    game.x = undefined;
                    game.y = undefined;
                }
            })
        }
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
        // For components that can start an interacted
        for (var i = 0; i < maps.data[maps.currentMap].components.length; i++)
            // The controlled component can acted with other component
            if (components.data[maps.data[maps.currentMap].components[i]] == game.camera.target)
                for (var j = 0; j < maps.data[maps.currentMap].components.length; j++) {
                    var c1 = components.data[maps.data[maps.currentMap].components[i]];
                    var c2 = components.data[maps.data[maps.currentMap].components[j]];
                    c1.updateInteraction(c2);
                }

        // Update the movement of all components on the current map (this also resolves tileCollision)
        if (!game.transition)
            for (var i = 0; i < maps.data[maps.currentMap].components.length; i++)
                components.data[maps.data[maps.currentMap].components[i]].updateMovement();

        // Check each combination pair of components on the current map for component-component-collision
        for (var i = 0; i < maps.data[maps.currentMap].components.length; i++)
            for (var j = i + 1; j < maps.data[maps.currentMap].components.length; j++) {
                var c1 = components.data[maps.data[maps.currentMap].components[i]];
                var c2 = components.data[maps.data[maps.currentMap].components[j]];
                c1.componentCollision(c2);
            }

        // Update the position of all components on the current map
        for (var i = 0, l = maps.data[maps.currentMap].components.length; i < l; i++) components.data[maps.data[maps.currentMap].components[i]].updatePosition();
    }
}

/**
 * Draws the canvas
 * Zero it clears the canvas
 * First it draws the background
 * Second it draws the objects
 * Third it draws the foreground
 * Four it draws the gui
 */
function draw() {
    // Draw map transition
    if (game.transition) blackTransition();
    // Draw map
    else {
        // Clear the canvas
        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
        // Draw Background
        maps.data[maps.currentMap].drawBackground();
        // Sorts the array after it's y value so that components with bigger y are drawn later
        maps.data[maps.currentMap].components.sort(function (a, b) {
            return (components.data[a].y > components.data[b].y) ? 1 : ((components.data[b].y > components.data[a].y) ? -1 : 0);
        });
        // Draw Objects of the current map
        for (var i = 0, l = maps.data[maps.currentMap].components.length; i < l; i++) components.data[maps.data[maps.currentMap].components[i]].draw(game.context);
        // Draw Foreground
        maps.data[maps.currentMap].drawForeground();
    }
    // Draw extras
    if (game.showExtra) {
        extraGuiRect();
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
    if (maps.currentMap != maps.nextMap) {
        maps.currentMap = maps.nextMap;
        maps.data[maps.currentMap].drawCache();
        if (game.editor != undefined) maps.data[maps.currentMap].drawTileset();
        setTimeout(function () {
            game.transition = false;
        }, 400);
    }

    // Update camera
    game.camera.update();
    // Update game
    update();
    // Draw game
    draw();

    // Draw dialog
    if (dialogs.currentDialog != undefined) {
        game.gameSequence = true;
        dialogs.currentDialog.update();
    } else game.gameSequence = false;

    // Simple hardcoded sound player for jukebox
    myHarp.play(Math.round(Math.random()));
}
