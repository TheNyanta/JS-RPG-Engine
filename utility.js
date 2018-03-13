// Convert 2dim array coordinates to 1dim array coordinates
function xy2i(x, y, width) {
    var index = y * width + x;
    return index;
}

// Convert 1dim array coordinates to 2dim array coordinates
function i2xy(index, width) {
    var x = index % width;
    var y = Math.floor(index / width);
    return [x, y];
}

// Rectangle collision
function rectangleOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    if ((x1 + w1 < x2) || (x2 + w2 < x1) || (y1 + h1 < y2) || (y2 + h2 < y1)) return false;
    return true;
}

// Rectangle mid
function rectangleMid(x, y, w, h) {
    return [x + w / 2, y + h / 2];
}

// Euclidean distance between to points on a cartesian grid
function distance(xy1, xy2) {
    return Math.sqrt(Math.pow(xy1[0] - xy2[0], 2) + Math.pow(xy1[1] - xy2[1], 2));
}

/**
 * Check if array contains object with the given id
 * If it contains it return it else return undefined
 */
function containsID(data, id) {
    for (var i = 0, l = data.length; i < l; i++)
        if (data[i].id == id) return data[i];
    return undefined;
}

/**
 * Check if an array contains the component with the given id and mapID
 * If it contains it return it else return undefined
 * @param the array (i.e. maps.data)
 * @param the object (i.e. 3)
 */
function containsComponent(data, id, mapID) {
    for (var i = 0, l = data.length; i < l; i++)
        if (data[i].id == id && data[i].mapID == mapID) return data[i];
    return undefined;
}

// Not for nested arrays
function arrayEqual(arr1, arr2) {
    if (arr1.length != arr2.length) return false;
    for (var i = 0, l = arr1.length; i < l; i++) if (arr1[i] !== arr2[i]) return false 
    return true;
}

function teleportComponent(component, map, x, y) {
    // Set new position
    if (x != null) component.x = x;
    if (y != null) component.y = y;
    // Remove component from current map and add to new
    if (game.currentMap != map) {
        for (var i = 0, l = maps.data[game.currentMap].components.data.length; i < l; i++) {
            if (maps.data[game.currentMap].components.data[i] == component)
                maps.data[map].components.data.push(maps.data[game.currentMap].components.data.splice(i, 1)[0]);
        }
    }
}

/**
 * For loading src: Check if the file name already exists
 */
function loadImage(img) {
    var tmp;
    for (var i = 0, l = spritesheets.data.length; i < l; i++) {
        if (spritesheets.data[i].img.src.match(/[\w]+\.[A-Za-z]{3}$/)[0] == img.match(/[\w]+\.[A-Za-z]{3}$/)[0]) {
            console.log("spritesheet already exists: taking existing one");
            tmp = spritesheets.data[i];
        }
    }
    if (tmp == undefined) {
        console.log("created new spritesheet")
        addSprite(img, 60, 32, 8, 8);
        tmp = spritesheets.data[spritesheets.data.length - 1];
    }
    //maps.data[game.currentMap].image.src = img; //maps background image
    maps.data[game.currentMap].tileset = tmp;
    maps.data[game.currentMap].switchTileset();

    setTimeout(function () {
        maps.data[game.currentMap].drawCache();
        maps.data[game.currentMap].drawTileset();
    }, 100);
}

// Harp: audio.data[0-7].play();
var myHarp = (function () {
    var note = 0;
    var melody = [0, 4, 6, 7, 6, 4, 1, 2, 5, 4, 0, 3, 2, 1, 0, 2, 3, 1, 0, 7, 6, 4, 3, 2, 5, 7, 6, 4];
    var melodyIndex = 0;
    var playing = false;

    function change(mode) {
        // Random note
        if (mode == 0) note = Math.round(Math.random() * 7);
        // Melody note
        if (mode == 1) {
            melodyIndex++;
            if (melodyIndex == melody.length) melodyIndex = 0;
            note = melody[melodyIndex];
        }
    }
    return {
        currentNote: function () {
            return note;
        },
        isPlaying: function () {
            return playing;
        },
        startPlaying: function () {
            playing = true;
        },
        stopPlaying: function () {
            playing = false;
        },
        play: function (mode) {
            if (playing) {
                if (audio.data[note].ended) change(mode);
                audio.data[note].play();
            }
        }
    };
})();

// Timer: init() sets the start time to now, value() gets the start time, check(seconds) tells if "seconds" have passed
var Timer = function () {
    var start;

    function initStart() {
        start = new Date();
    }
    return {
        init: function () {
            initStart();
        },
        value: function () {
            return start;
        },
        check: function (seconds) {
            var tmp = new Date();
            if (Math.floor((tmp - start) / 1000 >= seconds)) return true;
            else return false;
        }
    }
};

//convert listmap to a grid
function getGrid(maplayer, width, height) {

    arr = [];
    k = 0;
    for (i = 0; i < height; i++) {
        tmp = [];
        for (j = 0; j < width; j++) {
            tmp[j] = maplayer[k];
            k++;
        }
        arr[i] = tmp;
    }

    return arr;
}

//convert mapCL to a graph
function getGraph() {
    var mapCL = maps.data[game.currentMap].layerC;
    var mapWidth = maps.data[game.currentMap].mapWidth;
    var mapHeight = maps.data[game.currentMap].mapHeight;

    var arr = Array();
    for (var i = 0; i < mapWidth; i++) {
        arr.push(Array());
    }
    for (var i = 0; i < mapWidth * mapHeight; i++) {
        if (mapCL[i])
            arr[i % mapWidth][Math.floor(i / mapWidth)] = 1;
        else
            arr[i % mapWidth][Math.floor(i / mapWidth)] = 0;
    }
    return arr;
}

// Get shortest path using astar algorithm
function astarPath(startX, startY, endX, endY) {
    var graph = new Graph(getGraph());
    // Check if start and end are valid positions (= not outside of the graph grid)
    if (startX < 0 || startX >= graph.grid.length || startY < 0 || startY >= graph.grid[0].length) return undefined;
    if (endX < 0 || endX >= graph.grid.length || endY < 0 || endY >= graph.grid[0].length) return undefined;
    var start = graph.grid[startX][startY];
    var end = graph.grid[endX][endY];
    //console.log("Start = ["+startX+"]["+startY+"]");
    //console.log("End = ["+endX+"]["+endY+"]");
    return astar.search(graph, start, end, {
        closest: true
    });
}

function DisableScrollbar() {
    document.documentElement.style.overflow = 'hidden';
    document.body.scoll = "no";
}

function EnableScrollbar() {
    document.documentElement.style.overflow = 'visible';
    document.body.scroll = "yes";
}

function enterFullscreen() {
    element = game.canvas;
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

/**
 * Use localStorage to save game state
 * TODO: Change to save all the game state values
 */
function saveGameState(address, value) {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        // Store
        localStorage.setItem(address, value);
        console.log("Stored: " + value);
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

/**
 * Use localStorage to load game state
 * TODO: Change to load all the game state values & apply them
 */
function loadGameState(address) {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        var value = localStorage.getItem(address);
        // Retrieve
        console.log("Retrieved: " + value);
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function toggle(boolean) {
    if (boolean) return false;
    return true;
}

function blackTransition() {
    ctx = game.context;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
}

function showTime() {
    ctx = game.context;
    ctx.font = "bold 20px Serif";
    ctx.fillStyle = "black";
    ctx.fillText("Timer : " + Math.floor(time / 1000), 5, 20);
}

// Init FPS and time
var start, before, now, time, fps;
start = Date.now();
before = Date.now();
fps = 0;

function everyinterval(n) {
    if ((game.frameNo / n) % 1 == 0) return true;
    return false;
}

function updateFPS() {
    now = Date.now();
    time = now - start;
    if (everyinterval(30)) fps = Math.floor(1000 / (now - before));
    before = now;
}

function showFPS() {
    ctx = game.context;
    ctx.font = "bold 20px Serif";
    ctx.fillStyle = "black";
    ctx.fillText("FPS : " + fps, 5, 40);
}

function showPosition(target) {
    ctx = game.context;
    ctx.fillStyle = "black";
    ctx.fillText("x:" + (target.boundingBox.x) + ", y:" + (target.boundingBox.y), 5, 60);
    ctx.fillText("Tile[" + Math.floor(target.boundingBox.x / spritesheets.data[maps.data[game.currentMap].spritesheetID].spriteWidth) + ", " + Math.floor(target.boundingBox.y / spritesheets.data[maps.data[game.currentMap].spritesheetID].spriteHeight) + "]", 5, 80);
}

function showDistance() {
    /*
    ctx = game.context;
    ctx.beginPath();
    ctx.lineWidth = 2; //2px
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = black;
    ctx.stroke();
    */
}

// Button functions

function debugButton() {
    game.debug = toggle(game.debug);
    maps.data[game.currentMap].drawCache();
    if (game.debug) document.getElementById("debugButton").setAttribute("class", "w3-button w3-green");
    else document.getElementById("debugButton").setAttribute("class", "w3-button w3-red");
}

function guiButton() {
    game.info = toggle(game.info);
    if (game.info) document.getElementById("guiButton").setAttribute("class", "w3-button w3-green");
    else document.getElementById("guiButton").setAttribute("class", "w3-button w3-red");
}

// ##########
// Map Editor
// ##########

// Layer Selection
function openlayerButton() {
    if (game.dom.layerSelection.className.indexOf("w3-show") == -1) game.dom.layerSelection.className += " w3-show";
    else game.dom.layerSelection.className = game.dom.layerSelection.className.replace(" w3-show", "");
}

function layerButton(i) {
    game.currentLayer = i;
    game.dom.layer1.setAttribute("class", "w3-bar-item w3-button w3-blue");
    game.dom.layer2.setAttribute("class", "w3-bar-item w3-button w3-blue");
    game.dom.layer3.setAttribute("class", "w3-bar-item w3-button w3-blue");
    game.dom.layerSelection.className = game.dom.layerSelection.className.replace(" w3-show", "");
    game.dom.collisionLayer.setAttribute("class", "w3-bar-item w3-button w3-blue");
    if (i == 0) {
        game.dom.layer1.setAttribute("class", "w3-bar-item w3-button w3-green");
        game.dom.currentLayer.innerHTML = "Layer 1";
    }
    if (i == 1) {
        game.dom.layer2.setAttribute("class", "w3-bar-item w3-button w3-green");
        game.dom.currentLayer.innerHTML = "Layer 2";
    }
    if (i == 2) {
        game.dom.layer3.setAttribute("class", "w3-bar-item w3-button w3-green");
        game.dom.currentLayer.innerHTML = "Layer 3";
    }
    if (i == 3) {
        game.dom.collisionLayer.setAttribute("class", "w3-bar-item w3-button w3-green");
        game.dom.currentLayer.innerHTML = "Collision";
        // Enable debug to see collision restriction
        if (!game.debug) debugButton();
        // Show restricition selection
        game.dom.currentRestriction.className = game.dom.currentRestriction.className.replace("w3-hide", "");

    }
    // Hide restriction selection
    else if (game.dom.currentRestriction.className.indexOf("w3-hide") == -1) game.dom.currentRestriction.className += " w3-hide";
    // Enable draw
    if (!game.drawingOn) drawButton();
}


// Collision Restriction Selection
function openCollisionButton() {
    if (game.dom.restrictionSelection.className.indexOf("w3-show") == -1) game.dom.restrictionSelection.className += " w3-show";
    else game.dom.restrictionSelection.className = game.dom.restrictionSelection.className.replace(" w3-show", "");
}

function restrictionButton(i, src) {
    game.dom.restrictionSelection.className = game.dom.restrictionSelection.className.replace(" w3-show", "");
    game.dom.currentRestriction.src = src;
    if (i == 0) game.tileCollisionType = 1; // Full Restriction
    if (i == 1) game.tileCollisionType = [1, 2, 3]; // Down, Left, Right Restriction
    if (i == 2) game.tileCollisionType = [0, 2, 3]; // Up, Left, Right Restriction
    if (i == 3) game.tileCollisionType = [0, 1, 3]; // Up, Down, Right Restriction
    if (i == 4) game.tileCollisionType = [0, 1, 2]; // Up, Down, Left Restriction
    if (i == 5) game.tileCollisionType = [2, 3]; // Left, Right Restriction
    if (i == 6) game.tileCollisionType = [1, 3]; // Down, Right Restriction
    if (i == 7) game.tileCollisionType = [1, 2]; // Down, Left Restriction
    if (i == 8) game.tileCollisionType = [0, 3]; // Up, Right Restriction
    if (i == 9) game.tileCollisionType = [0, 2]; // Up, Left Restriction
    if (i == 10) game.tileCollisionType = [0, 1]; // Up, Down Restriction
    if (i == 11) game.tileCollisionType = [3]; // Right Restriction
    if (i == 12) game.tileCollisionType = [2]; // Left Restriction
    if (i == 13) game.tileCollisionType = [1]; // Down Restriction
    if (i == 14) game.tileCollisionType = [0]; // Up Restriction
    if (i == 15) game.tileCollisionType = 0; // No restriction
}

// Enable draw button
function drawButton() {
    game.drawingOn = toggle(game.drawingOn);
    if (game.drawingOn) {
        game.control.disableMouse = true;
        document.getElementById("drawButton").setAttribute("class", "w3-button w3-green");
    } else {
        game.control.disableMouse = false;
        document.getElementById("drawButton").setAttribute("class", "w3-button w3-red");
    }
}

// Game/Engine Start Button
function startButton() {
    document.getElementById("startButton").parentNode.removeChild(document.getElementById("startButton"));
    document.getElementById("editorButtons").className += document.getElementById("editorButtons").className.replace(" w3-hide", "");
    game.init();
    setTimeout(game.start, 200);
}
