// to move the map on the canvas
var relativeX = [0, 0];
var relativeY = [0, 0];

// Character movement change relativeX/Y so take old value for DrawForeground to prevent unsyncron map moving 
var prevRelX = 0;
var prevRelY = 0;

var charTileX = 0;
var charTileY = 0;

var catRX = 0;
var catRXt = 1;
var catRY = 0;
var catRYt = 1;

var allAnimations = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95];

// Layer 1
function DrawBackgroundMap() {
    // Save relativeX/Y
    prevRelX = relativeX[mapID];
    prevRelY = relativeY[mapID];
    
    var mapIndex = 0;        
    for (var h = 0; h < mapHeight[mapID]; h++) {
        for (var w = 0; w < mapWidth[mapID]; w++, mapIndex++) {
            var tile_w = w * tileWidth[mapID] - relativeX[mapID];
            var tile_h = h * tileHeight[mapID] - relativeY[mapID];
            // Don't draw no-tile
            if (map[mapID][0][mapIndex]-1 >= 0) {
                // Layer 1.1
                chipset[mapID].draw(tile_w, tile_h, map[mapID][0][mapIndex]-1);
            }
            if (map[mapID][1][mapIndex]-1 >= 0) {
                // Layer 1.2
                chipset[mapID].draw(tile_w, tile_h, map[mapID][1][mapIndex]-1);
            }
        }
    }
}

// Layer 2

function DrawObjects() {
    // Collison Box of the character
    var char_collision_box = new Rectangle(cameraX[mapID]+4, cameraY[mapID]+16, 16, 16);
    // Draw Collision Box
    char_collision_box.draw('white', false, 'black', true);
    
    // Center of Collision Box
    var ccb_center = new Point (char_collision_box.centerX, char_collision_box.centerY);
    // ccb_center.draw(20, 'black');
    
    
    if (mapID == 0) {
        // Rectangle 1 blue
        var rect1 = new Rectangle(100-relativeX[mapID], 100-relativeY[mapID], 10, 10);
        rect1.draw('blue', true, 'blue',false);
        // Rectangle-Char-Collision
        if (char_collision_box.rectInside(rect1)) {
            rect1.draw('red',true,'red',false);
            DrawDialog("Bananaphone", bananaphone);
            audio2.pause();
            audio1.play();
        }
        else {
            audio1.pause();
            audio2.play();
        }
        /*
        if(Math.round(Math.random(1)) == 1)
            catRXt = 1;
        else catRXt = -1;
        
        if(Math.round(Math.random(1)) == 1)
            catRYt = 1;
        else catRYt = -1;        
        
        catRX+=Math.round(Math.random(2))*catRXt;
        catRY+=Math.round(Math.random(2))*catRYt;*/
        
        var catiBox = new Rectangle(200-relativeX[mapID], 200-relativeY[mapID], cat.spriteWidth, cat.spriteHeight);
        catiBox.draw('white', false, 'black', true);
        cat.draw(200-relativeX[mapID]+catRX, 200-relativeY[mapID]+catRY, allAnimations);
        
        if (char_collision_box.rectInside(catiBox)) {
            DrawDialog("Press Enter");
            if (key.enter) {
                catsound.play();
            }
        }
    }
    
    if (mapID == 1) {
        audio1.pause();
        audio2.pause();
        audio3.play();   
    }
    else {
        audio3.pause();
    }
    
    //var mouseRect = new Rectangle(mouse_x, mouse_y, character.spriteWidth, character.spriteHeight);
    //mouseRect.draw('white', false, 'white',true);
}

// Character can stand on atmost 4 different tiles, only returns true if all 4 are walkable TODO: take two parameter to apply it for any moveable object (not only the character)
function isWalkable() {
    var x1 = Math.floor((cameraX[mapID]+relativeX[mapID]+ 4)/16);
    var y1 = Math.floor((cameraY[mapID]+relativeY[mapID]+16)/16);
    var x2 = x1 + 1;
    var y2 = y1 + 1;
    
    // Check if standing exactly on a tile-axis
    if (x1 - ((cameraX[mapID]+relativeX[mapID]+ 4)/16) == 0)
        x2 = x1;
    if (y1 - ((cameraX[mapID]+relativeX[mapID]+16)/16) == 0)
        y2 = y1;
    
    return (map[mapID][3][xy2i(x1,y1,mapWidth[mapID])] && map[mapID][3][xy2i(x1,y2,mapWidth[mapID])] && map[mapID][3][xy2i(x2,y1,mapWidth[mapID])] && map[mapID][3][xy2i(x2,y2,mapWidth[mapID])]);
}

// Layer 3
function DrawForegroundMap() {
    var mapIndex = 0;        
    for (var h = 0; h < mapHeight[mapID]; h++) {
        for (var w = 0; w < mapWidth[mapID]; w++, mapIndex++) {
            var tile_w = w * tileWidth[mapID] - prevRelX;
            var tile_h = h * tileHeight[mapID] - prevRelY;
            if (map[mapID][2][mapIndex]-1 >= 0)
                chipset[mapID].draw(tile_w, tile_h, map[mapID][2][mapIndex]-1);
        }
    }    
}

//Static grid for testing
function DrawGrid() {
    var seg1 = new Segment(0, 16, canvasWidth, 0);
    var seg2 = new Segment(0, 32, canvasWidth, 0);
    var seg3 = new Segment(0, 48, canvasWidth, 0);
    var seg4 = new Segment(0, 64, canvasWidth, 0);
    var seg5 = new Segment(0, 80, canvasWidth, 0);
    var seg6 = new Segment(0, 96, canvasWidth, 0);
    var seg7 = new Segment(0, 112, canvasWidth, 0);
    var seg8 = new Segment(0, 128, canvasWidth, 0);
    var seg9 = new Segment(0, 144, canvasWidth, 0);
    var seg10 = new Segment(0, 160, canvasWidth, 0);
    var seg11 = new Segment(0, 176, canvasWidth, 0);
    var seg12 = new Segment(0, 192, canvasWidth, 0);
    var seg13 = new Segment(0, 208, canvasWidth, 0);
    var seg14 = new Segment(0, 224, canvasWidth, 0);
    var seg15 = new Segment(0, 240, canvasWidth, 0);
    var seg16 = new Segment(0, 256, canvasWidth, 0);
    var seg17 = new Segment(0, 272, canvasWidth, 0);
    var seg18 = new Segment(0, 288, canvasWidth, 0);
    var seg19 = new Segment(0, 304, canvasWidth, 0);
    var seg20 = new Segment(0, 320, canvasWidth, 0);
    var seg21 = new Segment(0, 336, canvasWidth, 0);
    
    seg1.draw(); seg2.draw(); seg3.draw(); seg4.draw(); seg5.draw(); seg6.draw(); seg7.draw();
    seg8.draw(); seg9.draw(); seg10.draw(); seg11.draw(); seg12.draw(); seg13.draw(); seg14.draw();
    seg15.draw(); seg16.draw(); seg17.draw(); seg18.draw(); seg19.draw(); seg20.draw(); seg21.draw();
    
    var seg22 = new Segment(16, 0, 0, canvasHeight);
    var seg23 = new Segment(32, 0, 0, canvasHeight);
    var seg24 = new Segment(48, 0, 0, canvasHeight);
    var seg25 = new Segment(64, 0, 0, canvasHeight);
    var seg26 = new Segment(80, 0, 0, canvasHeight);
    var seg27 = new Segment(96, 0, 0, canvasHeight);
    var seg28 = new Segment(112, 0, 0, canvasHeight);
    var seg29 = new Segment(128, 0, 0, canvasHeight);
    var seg30 = new Segment(144, 0, 0, canvasHeight);
    var seg31 = new Segment(160, 0, 0, canvasHeight);
    var seg32 = new Segment(176, 0, 0, canvasHeight);
    var seg33 = new Segment(192, 0, 0, canvasHeight);
    var seg34 = new Segment(208, 0, 0, canvasHeight);
    var seg35 = new Segment(224, 0, 0, canvasHeight);
    var seg36 = new Segment(240, 0, 0, canvasHeight);
    var seg37 = new Segment(256, 0, 0, canvasHeight);
    var seg38 = new Segment(272, 0, 0, canvasHeight);
    var seg39 = new Segment(288, 0, 0, canvasHeight);
    var seg40 = new Segment(304, 0, 0, canvasHeight);
    var seg41 = new Segment(320, 0, 0, canvasHeight);
    var seg42 = new Segment(336, 0, 0, canvasHeight);
    var seg43 = new Segment(352, 0, 0, canvasHeight);
    var seg44 = new Segment(368, 0, 0, canvasHeight);
    var seg45 = new Segment(384, 0, 0, canvasHeight);
    var seg46 = new Segment(400, 0, 0, canvasHeight);
    var seg47 = new Segment(416, 0, 0, canvasHeight);
    var seg48 = new Segment(432, 0, 0, canvasHeight);
    var seg49 = new Segment(448, 0, 0, canvasHeight);
    var seg50 = new Segment(464, 0, 0, canvasHeight);
    
    seg22.draw();
    seg23.draw(); seg24.draw(); seg25.draw(); seg26.draw(); seg27.draw(); seg28.draw(); seg29.draw();
    seg30.draw(); seg31.draw(); seg32.draw(); seg33.draw(); seg34.draw(); seg35.draw(); seg36.draw();
    seg37.draw(); seg38.draw(); seg39.draw(); seg40.draw(); seg41.draw(); seg42.draw(); seg43.draw();
    seg44.draw(); seg45.draw(); seg46.draw(); seg47.draw(); seg48.draw(); seg49.draw(); seg50.draw();
}