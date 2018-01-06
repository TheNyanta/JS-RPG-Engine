// to move the map on the canvas
var relativeX = [0, 0];
var relativeY = [0, 0];

// Character movement changes relativeX/Y so take old value for DrawForeground to prevent unsyncron map moving 
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
    var char_collision_box = new Rectangle(charX[mapID]-relativeX[mapID]+4, charY[mapID]-relativeY[mapID]+16, 16, 16);
    // Draw Collision Box
    char_collision_box.draw('white', false, 'black', true);
    
    
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

// Character can stand on atmost 4 different tiles, only returns true if all 4 are walkable
// TODO: take two parameter to apply it for any moveable object (not only the character)
function isWalkable(param1, param2) {
    //var x = (cameraX[mapID]+relativeX[mapID]+ 4)/16;
    //var y = (cameraY[mapID]+relativeY[mapID]+16)/16;
    var x = (param1+relativeX[mapID]+ 4)/16;
    var y = (param2+relativeY[mapID]+16)/16;
    var x1 = Math.floor(x);
    var y1 = Math.floor(y);
    var x2 = x1 + 1;
    var y2 = y1 + 1;
    
    // Check if standing exactly on a tile-axis
    if (x1 - x == 0)
        x2 = x1;
    if (y1 - y == 0)
        y2 = y1;
    
    if (x1 < 0 || y1 < 0 || x2 > mapWidth[mapID] - 1 || y2 > mapHeight[mapID] - 1)
        return false;
    
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